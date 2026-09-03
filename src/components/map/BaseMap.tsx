"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { SATELLITE_LAYER } from "./baseLayers";
import { GROUPS, places, type Place, type PlaceGroup } from "@/content/places";
import MapLegend, { type LegendRow } from "./MapLegend";

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
// isn't about untrusted input — it's that `textContent` can't produce a
// broken popup when an address contains an ampersand or a quote.
function popupContent(place: Place) {
  const root = document.createElement("div");
  root.className = "map-popup";

  const name = document.createElement("p");
  name.className = "map-popup__name";
  name.textContent = place.name;
  root.append(name);

  const detail = document.createElement("p");
  detail.className = "map-popup__detail";
  detail.textContent = place.detail;
  root.append(detail);

  if (place.blurb) {
    const blurb = document.createElement("p");
    blurb.className = "map-popup__blurb";
    blurb.textContent = place.blurb;
    root.append(blurb);
  }

  return root;
}

export default function BaseMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  // One Leaflet layer group per pin group, so toggling a legend row is an
  // add/remove of a single layer rather than a rebuild of every marker.
  const layersRef = useRef<Partial<Record<PlaceGroup, import("leaflet").LayerGroup>>>({});
  const [hidden, setHidden] = useState<Record<PlaceGroup, boolean>>({
    education: false,
    minerva: false,
    friends: false,
  });

  // Only groups that actually have pins get a legend row — an empty layer
  // shouldn't offer a toggle that does nothing.
  const rows = useMemo<LegendRow[]>(
    () =>
      (Object.keys(GROUPS) as PlaceGroup[])
        .map((id) => ({
          id,
          label: GROUPS[id].label,
          color: GROUPS[id].color,
          count: places.filter((p) => p.group === id).length,
        }))
        .filter((row) => row.count > 0),
    [],
  );

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

      // A divIcon rather than an image marker: the pin is a CSS dot, so its
      // colour comes from the group without shipping one PNG per group, and
      // it inherits the same pulse the hero's location dot uses.
      for (const group of Object.keys(GROUPS) as PlaceGroup[]) {
        const inGroup = places.filter((p) => p.group === group);
        if (inGroup.length === 0) continue;

        const layer = L.layerGroup(
          inGroup.map((place) =>
            L.marker([place.lat, place.lon], {
              title: place.name,
              alt: place.name,
              icon: L.divIcon({
                className: "map-pin-wrap",
                html: `<span class="map-pin" style="--pin:${GROUPS[group].color}"></span>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                popupAnchor: [0, -8],
              }),
            }).bindPopup(popupContent(place), { maxWidth: 300, minWidth: 200 }),
          ),
        );

        layer.addTo(map);
        layersRef.current[group] = layer;
      }

      mapRef.current = map;

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
      observer?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      layersRef.current = {};
    };
  }, []);

  // Legend toggles. Runs after the map exists and on every change; a group
  // whose layer hasn't been built yet is simply skipped, so this is safe
  // during the async init above.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const [group, layer] of Object.entries(layersRef.current)) {
      if (!layer) continue;
      const isHidden = hidden[group as PlaceGroup];
      if (isHidden && map.hasLayer(layer)) map.removeLayer(layer);
      if (!isHidden && !map.hasLayer(layer)) layer.addTo(map);
    }
  }, [hidden]);

  return (
    <div className="flex h-full w-full flex-col">
      <MapLegend
        rows={rows}
        hidden={hidden}
        onToggle={(id) => setHidden((h) => ({ ...h, [id]: !h[id] }))}
      />
      <div ref={containerRef} className="w-full flex-1" />
    </div>
  );
}
