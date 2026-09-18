"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { SATELLITE_LAYER } from "./baseLayers";
import { GROUPS, journey, places, type Place, type PlaceGroup } from "@/content/places";
import { say, type Locale } from "@/content/i18n";
import { Z } from "@/lib/layers";
import JourneyControl from "./JourneyControl";
import JourneyStory, { chaptersOf } from "./JourneyStory";
import { JOURNEY_DURATION_MS, buildJourneyPath, journeyFrame } from "./journey";

declare module "leaflet" {
  interface MapOptions {
    gestureHandling?: boolean;
  }
}

let gestureHandlingRegistered = false;

// Web Mercator is only defined up to ~85.05°N/S — this is the exact square
// the world projects to, so bounding to it (instead of the poles) means the
// "does the world fill the box" math below stays correct.
const WORLD_LAT = 85.0511;

function worldBounds(L: typeof import("leaflet")) {
  return L.latLngBounds([-WORLD_LAT, -180], [WORLD_LAT, 180]);
}

// The zoom level at which one copy of the world (a 256 * 2^zoom square)
// covers the container in both dimensions — the floor for how far out you
// can zoom. Below this, panning would either wrap into a second copy of
// the map or expose gray space past the edge; capping here rules out both.
function minZoomForContainer(el: HTMLElement) {
  const size = Math.max(el.clientWidth, el.clientHeight, 1);
  // The computed value is the real constraint — it's the zoom at which one
  // copy of the world already covers the container, so nothing below it can
  // repeat or expose void. The extra floor is 1 rather than 2 because on a
  // phone the two differ: zoom 1 (a 512px world) still covers a ~376px
  // container, and holding out for 2 cost a whole zoom level of context on
  // exactly the screens with the least of it.
  return Math.max(1, Math.ceil(Math.log2(size / 256)));
}

// Built as DOM rather than an HTML string. The content is ours, so this
// isn't about untrusted input. It's that `textContent` cannot produce a
// broken popup when an address contains an ampersand or a quote.
//
// The card is laid out like a CV entry: institution and logo across the
// top, then city, then the credential and dates, then one line of
// substance. Same shape for every pin, so nine popups read as one section
// rather than nine unrelated notes.
// The popup is built as DOM rather than JSX because Leaflet takes an
// element, not a React tree. That means the locale has to be threaded in
// by hand — there is no component here to read it from a prop.
function popupContent(place: Place, locale: Locale, itineraryLabel: string) {
  const group = GROUPS[place.group];

  const el = (tag: string, className: string, text?: string) => {
    const n = document.createElement(tag);
    n.className = className;
    if (text) n.textContent = text;
    return n;
  };

  const root = el("div", "map-popup");

  const head = el("div", "map-popup__head");
  if (group.logo) {
    const img = document.createElement("img");
    img.src = group.logo;
    img.alt = "";
    img.className = "map-popup__logo";
    head.append(img);
  }
  head.append(el("p", "map-popup__inst", say(group.label, locale)));
  root.append(head);

  root.append(el("p", "map-popup__city", place.name));
  root.append(
    el(
      "p",
      "map-popup__detail",
      `${say(place.detail, locale)}, ${say(place.country, locale)}`,
    ),
  );

  if (place.credential || place.dates) {
    const meta = el("p", "map-popup__meta");
    if (place.credential)
      meta.append(el("span", "map-popup__cred", say(place.credential, locale)));
    if (place.dates)
      meta.append(el("span", "map-popup__dates", say(place.dates, locale)));
    root.append(meta);
  }

  // Only what is true of THIS pin. `group.about` used to render here too,
  // and it is the same paragraph on every pin in its group — six identical
  // three-sentence blurbs across the six Minerva cities, two across the two
  // UWC campuses. Opening a second pin and reading the same text again
  // teaches the reader that the popups are not worth opening, which costs
  // more than the paragraph was ever worth.
  //
  // It is not deleted, it is moved: Background renders each institution's
  // line once, under its mark, where saying it once is the whole point.
  if (place.note) root.append(el("p", "map-popup__note", say(place.note, locale)));

  // Where the group is unfamiliar enough that a reader would want to look
  // it up — the voyage, whose itinerary is published — the popup ends with
  // the way to do that.
  if (group.href) {
    const link = document.createElement("a");
    link.className = "map-popup__link";
    link.href = group.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = itineraryLabel;
    root.append(link);
  }

  return root;
}

export default function BaseMap({
  locale,
  itineraryLabel,
  journeyStrings,
}: {
  locale: Locale;
  itineraryLabel: string;
  journeyStrings: { play: string; stop: string; ports: string; cities: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  // One Leaflet layer group per pin group, so toggling a legend row is an
  // add/remove of a single layer rather than a rebuild of every marker.
  const layersRef = useRef<Partial<Record<PlaceGroup, import("leaflet").LayerGroup>>>({});
  const staticRouteRef = useRef<import("leaflet").LayerGroup | null>(null);
  /** Everything the player draws, so stopping is one `remove()`. */
  const playbackRef = useRef<import("leaflet").LayerGroup | null>(null);
  const frameRef = useRef<number | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);

  const [playing, setPlaying] = useState(false);
  /** The stop under the marker right now, for the toolbar readout. Null
   *  while the marker is between two of them. */
  const [atStop, setAtStop] = useState<string | null>(null);
  /** Hidden until the map has actually built a route to play. */
  const [canPlay, setCanPlay] = useState(false);
  /** The furthest stop the marker has reached, while playing or after;
   *  null before the first play. Drives which chapter of the story line
   *  under the map is lit. */
  const [reached, setReached] = useState<number | null>(null);
  const chapters = useMemo(() => chaptersOf(journey), []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    let observer: ResizeObserver | null = null;

    (async () => {
      const L = await import("leaflet");
      // The plugin's UMD build reads the global `L` at module-evaluation
      // time (it's written for a <script> include, not a bundler), so it
      // has to be on window before we import it.
      (window as unknown as { L: typeof L }).L = L;
      const { GestureHandling } = await import("leaflet-gesture-handling");

      if (cancelled || !containerRef.current || mapRef.current) return;

      if (!gestureHandlingRegistered) {
        L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        gestureHandlingRegistered = true;
      }

      const bounds = worldBounds(L);
      const minZoom = minZoomForContainer(containerRef.current);

      const map = L.map(containerRef.current, {
        minZoom,
        maxBounds: bounds,
        maxBoundsViscosity: 1,
        // Scroll to zoom only while Ctrl/Cmd is held (or two-finger drag
        // on touch) so hovering the map doesn't hijack the page's normal
        // scroll — a short on-map hint explains the gesture on first try.
        gestureHandling: true,
      }).setView([20, 0], minZoom);

      L.tileLayer(SATELLITE_LAYER.url, {
        attribution: SATELLITE_LAYER.attribution,
        maxZoom: SATELLITE_LAYER.maxZoom,
        noWrap: true,
        bounds,
      }).addTo(map);

      // The pin is the institution's own mark on a cream chip, not a
      // coloured dot. At world zoom the map has to answer "where did he
      // study" before anything is clicked, and three logos do that where
      // three dots need a legend first. The ring keeps the grouping legible
      // when two chips from different institutions sit close together, as
      // Pune and Hyderabad do.
      for (const group of Object.keys(GROUPS) as PlaceGroup[]) {
        const inGroup = places.filter((p) => p.group === group);
        if (inGroup.length === 0) continue;

        const def = GROUPS[group];
        const layer = L.layerGroup(
          inGroup.map((place) => {
            const label = `${say(def.label, locale)}, ${place.name}`;
            return L.marker([place.lat, place.lon], {
              title: label,
              alt: label,
              riseOnHover: true,
              // A route group gets the small dot, not the logo chip, even
              // though it has a mark. Thirteen 30px chips along the
              // Mediterranean touch each other, cover the line drawn
              // between them, and turn a voyage into a smudge — the thing
              // the route was added to show. The dots let the line through,
              // and the group is identified by that line, by the legend and
              // by the mark in every popup. Chips stay for the campuses,
              // where there are few enough to read and no line to hide.
              icon: L.divIcon({
                className: "map-pin-wrap",
                html:
                  def.logo && !def.route
                    ? `<span class="map-pin" style="--pin:${def.color}"><img src="${def.logo}" alt="" /></span>`
                    : `<span class="map-pin map-pin--plain" style="--pin:${def.color}"></span>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -18],
              }),
            }).bindPopup(popupContent(place, locale, itineraryLabel), {
              maxWidth: 320,
              minWidth: 240,
            });
          }),
        );

        // A group whose sequence is the fact gets a line through it. Into
        // the same layerGroup as the pins, so one legend toggle takes the
        // route and its ports together rather than leaving a line hanging
        // over a map with nothing on it.
        //
        // Dashed and behind the chips: it's the connective tissue between
        // pins, not a border or a boundary, and a solid line at this weight
        // reads as one.
        if (def.route && inGroup.length > 1) {
          const path = inGroup.map(
            (place) => [place.lat, place.lon] as [number, number],
          );

          // Two lines, not one: a dark casing with a light dashed line on
          // top of it. A single stroke in the group's own colour is what
          // this was first, and it vanished — the basemap is satellite
          // imagery, so a maroon line crosses navy ocean, brown Iberia and
          // white cloud in the space of one voyage and loses contrast
          // against at least one of them. The casing makes the pale line
          // readable over all three, which is why every road on every
          // imagery map is drawn this way.
          // Into their own LayerGroup inside the group's layer, so the
          // player can take the finished route off the map and put it back
          // without touching the thirteen pins sitting on it.
          const staticRoute = L.layerGroup();
          L.polyline(path, {
            color: def.color,
            weight: 5,
            opacity: 0.55,
            interactive: false,
          }).addTo(staticRoute);

          L.polyline(path, {
            color: "#fff4de",
            weight: 2,
            opacity: 0.95,
            dashArray: "6 7",
            interactive: false,
          }).addTo(staticRoute);
          staticRoute.addTo(layer);
          staticRouteRef.current = staticRoute;
        }

        layer.addTo(map);
        layersRef.current[group] = layer;
      }

      mapRef.current = map;
      leafletRef.current = L;
      setCanPlay(journey.length > 1);

      // The initial fit waits for the first resize callback rather than
      // running here. The container is `flex-1` under the legend bar, so at
      // map-creation time Leaflet has cached a size it's about to stop
      // having — fitting against that stale size put every pin thousands of
      // pixels outside the viewport.
      let fitted = false;

      const resize = () => {
        const m = mapRef.current;
        const el = containerRef.current;
        if (!m || !el) return;

        // Leaflet caches container dimensions and has no way to know the
        // flex layout changed underneath it.
        m.invalidateSize();

        const z = minZoomForContainer(el);
        m.setMinZoom(z);
        if (m.getZoom() < z) m.setZoom(z);

        // Open on the journey, not on the prime meridian. Centred at
        // [20, 0] the pins ran off both edges — San Francisco past the
        // left, Seoul and Taipei past the right — so the section called
        // "My Journey" opened on an empty Atlantic. minZoom still caps how
        // far out this can go, so on a narrow viewport it centres the set
        // rather than fitting all of it.
        if (!fitted && places.length > 0) {
          m.fitBounds(
            L.latLngBounds(places.map((p) => [p.lat, p.lon] as [number, number])),
            { padding: [48, 48], animate: false },
          );
          fitted = true;
        }
      };

      observer = new ResizeObserver(resize);
      observer.observe(containerRef.current);
    })();

    return () => {
      cancelled = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      observer?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      layersRef.current = {};
    };
    // Rebuilt when the language changes, and it has to be. Every popup on
    // this map is a DOM tree built once, at init, and handed to Leaflet —
    // there is no re-render that would reach inside one. Switching to /es
    // is a client-side navigation that reconciles this component in place
    // rather than remounting it, so without `locale` here the map would
    // keep thirteen English popups on a Spanish page.
    //
    // Safe because the cleanup above is complete: `map.remove()` takes the
    // container back to empty. It costs one teardown per language switch,
    // which is a thing that happens approximately never.
  }, [locale, itineraryLabel]);

  // ── Playing the journey ───────────────────────────────────────────
  // See journey.ts for the pacing and for why the camera stays still. This
  // is the Leaflet half: one layer group holding a trail polyline and a
  // marker, redrawn each frame by setting coordinates on objects that
  // already exist rather than rebuilding them — Leaflet re-projects on
  // `setLatLngs`, which is cheap, where creating a polyline every frame
  // for fourteen seconds is ~800 layers for the map to garbage collect.
  const stopJourney = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    playbackRef.current?.remove();
    playbackRef.current = null;
    // The voyage's own dashed route goes back, so stopping leaves the map
    // as it was rather than blank where a line used to be.
    const map = mapRef.current;
    if (map && staticRouteRef.current && !map.hasLayer(staticRouteRef.current)) {
      staticRouteRef.current.addTo(map);
    }
    setPlaying(false);
    setAtStop(null);
    setReached(null);
  }, []);

  const playJourney = useCallback(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || journey.length < 2) return;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    playbackRef.current?.remove();

    const path = buildJourneyPath(journey);

    // Fit everything first, so the whole story is in frame before it
    // starts. `animate: false` because two motions at once — a zoom and a
    // traveller — is one motion too many to follow.
    map.fitBounds(
      L.latLngBounds(journey.map((s) => [s.lat, s.lon] as [number, number])),
      { padding: [56, 56], animate: false },
    );

    // The voyage's dashed line comes off while the animated one draws, or
    // the trail is invisible against an identical line already there.
    staticRouteRef.current?.remove();

    const group = L.layerGroup().addTo(map);
    playbackRef.current = group;

    // Two strokes, same as the static route: a dark casing under a pale
    // line. A single stroke crosses navy ocean, brown Iberia and white
    // cloud in the space of one leg and loses contrast against at least
    // one of them.
    const casing = L.polyline([], {
      color: "#7a1710",
      weight: 6,
      opacity: 0.75,
      interactive: false,
    }).addTo(group);
    const trail = L.polyline([], {
      color: "#fff4de",
      weight: 2.5,
      opacity: 1,
      interactive: false,
    }).addTo(group);
    const traveller = L.circleMarker([journey[0].lat, journey[0].lon], {
      radius: 6,
      color: "#fff4de",
      weight: 3,
      fillColor: "#d92b1c",
      fillOpacity: 1,
      interactive: false,
    }).addTo(group);

    setPlaying(true);
    setAtStop(journey[0].name);
    setReached(0);

    // A visitor who has asked their OS for less motion gets the answer
    // rather than the animation: the whole route drawn at once, and the
    // last stop named. The control still does something, and what it does
    // is still the fact it was there to deliver.
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const whole = journey.map((s) => [s.lat, s.lon] as [number, number]);
      casing.setLatLngs(whole);
      trail.setLatLngs(whole);
      traveller.setLatLng(whole[whole.length - 1]);
      setPlaying(false);
      setAtStop(journey[journey.length - 1].name);
      setReached(journey.length - 1);
      return;
    }

    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / JOURNEY_DURATION_MS);
      const frame = journeyFrame(path, t);

      casing.setLatLngs(frame.trail);
      trail.setLatLngs(frame.trail);
      traveller.setLatLng(frame.position);
      setAtStop(frame.atStop ? journey[frame.stopIndex]?.name ?? null : null);
      setReached(frame.stopIndex);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }
      // Arrived. The trail stays on the map rather than snapping back to
      // the dashed version — the reader just watched it being drawn, and
      // replacing it the instant it finishes throws that away. Pressing
      // the control again resets and replays.
      frameRef.current = null;
      setPlaying(false);
      setAtStop(journey[journey.length - 1].name);
      setReached(journey.length - 1);
    };
    frameRef.current = requestAnimationFrame(step);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* The schools first, the map under them. A reader scanning a CV
          looks for the names before the geography, and the marks now carry
          the full names (see `nameMark` in places.ts), so the strip reads
          as the Education section's list and the map as its illustration.
          It is still the map's progress bar while the route plays. */}
      <JourneyStory
        chapters={chapters}
        reached={reached}
        locale={locale}
        strings={{ ports: journeyStrings.ports, cities: journeyStrings.cities }}
      />
      {/* Landscape, and short. The no-repeat zoom floor is derived from
          the container's larger side, so a wide box is what keeps every pin
          in the opening view — and a tall one made the map the loudest
          thing in the section, which it isn't meant to be. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border-brand-maroon sm:aspect-[2/1] lg:aspect-[16/10]">
        <div ref={containerRef} className="h-full w-full" />
        {/* Absent until the map has a route worth playing — a control that
            plays nothing should not be on the map. Above Leaflet's panes,
            which run to ~700 inside the container. */}
        {canPlay && (
          <div style={{ zIndex: Z.CARD_OVERLAY_CONTROL }} className="pointer-events-none absolute inset-0">
            <JourneyControl
              playing={playing}
              atStop={atStop}
              playLabel={journeyStrings.play}
              stopLabel={journeyStrings.stop}
              onToggle={() => (playing ? stopJourney() : playJourney())}
            />
          </div>
        )}
      </div>
    </div>
  );
}
