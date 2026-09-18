import { distanceKm } from "@/components/geo/stats";

// The journey, played rather than drawn.
//
// The section is called My Journey and for a long time it was not one. It
// was nine campuses coloured by institution and a dashed line through
// thirteen ports: a map of WHERE, with no WHEN anywhere in it. A reader
// could not tell from looking whether Berlin came before Buenos Aires, or
// where the ship fits, or that the whole thing starts in Oaxaca and ends
// in the city the hero says he lives in.
//
// A journey is an order. `step` in places.ts is that order, and this file
// is what walks it.
//
// ── Why the camera never moves ────────────────────────────────────────
// The obvious build is a camera that flies from stop to stop. It was not
// built that way on purpose: `flyTo` is one to two seconds per leg, ~25
// legs is a minute of somebody else's holiday slideshow, and a reader who
// looks away for four seconds comes back with no idea where they are.
// Worse, it takes the map away from anyone who only wanted to look at it.
//
// So the view is fitted once, to everything, and what animates is a marker
// travelling the route with the line drawing in behind it. The whole story
// stays legible at any moment, including to someone who missed the start.

/** How long the whole journey takes to play, in milliseconds.
 *
 *  Ten seconds, and the control says so. The point of the player is that
 *  the whole story — home, three schools, a ship, six cities — can be told
 *  in the time a reader gives a map they did not come for. */
export const JOURNEY_DURATION_MS = 10_000;

export type LatLon = { lat: number; lon: number };

export type JourneyPath = {
  points: LatLon[];
  /** Cumulative *weighted* distance to each stop, starting at 0. */
  cumulative: number[];
  total: number;
};

/**
 * Pre-compute the route's pacing once.
 *
 * ── The one interesting decision in this file ──
 * Two obvious pacings, and both are wrong:
 *
 *   - Equal time per leg. The ship crawls from Piraeus to Haifa (250 km)
 *     and teleports from Taipei to Hyderabad (4,700 km), so the animation
 *     claims the two were the same journey. They were not.
 *   - Time proportional to distance. The six Minerva hops are most of the
 *     route's total length, so they eat the clock and the thirteen ports —
 *     the densest and most interesting part of the whole story — flash
 *     past in under a second.
 *
 * So: the square root of distance. It keeps the ordering (a long leg still
 * takes longer than a short one) while compressing the extremes, which is
 * what lets one animation hold both a 250 km port call and a transpacific
 * flight. A 4,700 km leg takes about 4.3x the time of a 250 km one rather
 * than 19x.
 */
export function buildJourneyPath(points: LatLon[]): JourneyPath {
  const cumulative: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const leg = distanceKm(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon,
    );
    cumulative.push(cumulative[i - 1] + Math.sqrt(leg));
  }
  return { points, cumulative, total: cumulative[cumulative.length - 1] ?? 0 };
}

export type JourneyFrame = {
  /** Every stop reached so far, plus the current position — the polyline
   *  to draw. */
  trail: [number, number][];
  /** Where the marker is right now. */
  position: [number, number];
  /** Index of the stop the label should name. */
  stopIndex: number;
  /** True while the marker is within a whisker of a stop, which is when
   *  its name is worth showing. */
  atStop: boolean;
};

/** Within this fraction of a leg either side of a stop, call it "at" that
 *  stop. Small: it is a label trigger, not a pause. */
const STOP_SNAP = 0.08;

/**
 * Where the journey is at progress `t`, from 0 to 1.
 *
 * Linear interpolation between consecutive stops rather than a great
 * circle. The route is *drawn* as straight segments between stops, so
 * interpolating along anything else would put the marker beside its own
 * trail — the one thing an animation like this cannot do.
 */
export function journeyFrame(path: JourneyPath, t: number): JourneyFrame {
  const { points, cumulative, total } = path;
  const clamped = Math.min(1, Math.max(0, t));
  const travelled = clamped * total;

  let i = 0;
  while (i < cumulative.length - 2 && cumulative[i + 1] <= travelled) i++;

  const legStart = cumulative[i];
  const legLength = cumulative[i + 1] - legStart;
  const along = legLength === 0 ? 0 : (travelled - legStart) / legLength;

  const from = points[i];
  const to = points[i + 1] ?? points[i];
  const position: [number, number] = [
    from.lat + (to.lat - from.lat) * along,
    from.lon + (to.lon - from.lon) * along,
  ];

  const trail: [number, number][] = points
    .slice(0, i + 1)
    .map((p) => [p.lat, p.lon] as [number, number]);
  trail.push(position);

  const atStart = along <= STOP_SNAP;
  const atEnd = along >= 1 - STOP_SNAP;

  return {
    trail,
    position,
    stopIndex: atEnd ? i + 1 : i,
    atStop: atStart || atEnd,
  };
}
