import { distanceKm } from "@/components/geo/stats";
import type { JourneyStop } from "@/content/places";

// The journey, played rather than drawn.
//
// A journey is an order. `step` in places.ts is that order, and this file
// is what walks it: leg by leg, each one flown or sailed, with a beat at
// every stop.
//
// ── Why the camera never moves ────────────────────────────────────────
// `flyTo` is one to two seconds per leg, ~25 legs is a minute of somebody
// else's holiday slideshow, and a reader who looks away comes back with no
// idea where they are. So the view is fitted once, to everything, and what
// animates is the traveller and the line drawing in behind it.

/** How long the whole journey takes to play, in milliseconds. */
export const JOURNEY_DURATION_MS = 14_000;

export type Mode = "air" | "sea";

/** Port to port on Semester at Sea is the ship; everything else flew. */
export function legMode(from: JourneyStop, to: JourneyStop): Mode {
  return from.group === "voyage" && to.group === "voyage" ? "sea" : "air";
}

type LatLng = [number, number];

export type Leg = {
  mode: Mode;
  from: number;
  to: number;
  /** Point on the leg at u in [0, 1]. */
  at: (u: number) => LatLng;
  /** The leg sampled end to end, for drawing it whole. */
  samples: LatLng[];
  /** Share of the clock, in the units of `total`. */
  weight: number;
};

export type JourneyPath = { legs: Leg[]; starts: number[]; total: number };

// A beat at each stop, in the same units as a leg's travel weight
// (sqrt-km). About the time it takes to read a city name.
const DWELL = 9;
const AIR_SAMPLES = 40;

/**
 * Pace: each leg's travel time is the square root of its distance. Equal
 * time per leg claims a 250 km port call and a transpacific flight were
 * the same trip; time proportional to distance lets the six Minerva
 * flights eat the clock and flashes the thirteen ports past in a second.
 * The square root keeps the order and compresses the extremes.
 *
 * Flights are drawn as arcs, bowed toward the pole the way a great circle
 * looks on this projection; the ship's legs stay straight, port to port,
 * like the published itinerary.
 */
export function buildJourneyPath(stops: JourneyStop[]): JourneyPath {
  const legs: Leg[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    const mode = legMode(a, b);
    const km = distanceKm(a.lat, a.lon, b.lat, b.lon);
    const p0: LatLng = [a.lat, a.lon];
    const p2: LatLng = [b.lat, b.lon];

    let at: (u: number) => LatLng;
    if (mode === "sea") {
      at = (u) => [p0[0] + (p2[0] - p0[0]) * u, p0[1] + (p2[1] - p0[1]) * u];
    } else {
      // Control point: the midpoint, pushed sideways by a fifth of the
      // leg's length, on whichever side is poleward.
      const dLat = p2[0] - p0[0];
      const dLon = p2[1] - p0[1];
      const len = Math.hypot(dLat, dLon) || 1;
      let nLat = -dLon / len;
      let nLon = dLat / len;
      const mid: LatLng = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2];
      const poleward = mid[0] >= 0 ? 1 : -1;
      if (nLat * poleward < 0) {
        nLat = -nLat;
        nLon = -nLon;
      }
      const bow = len * 0.2;
      const p1: LatLng = [
        Math.max(-80, Math.min(80, mid[0] + nLat * bow)),
        mid[1] + nLon * bow,
      ];
      at = (u) => {
        const v = 1 - u;
        return [
          v * v * p0[0] + 2 * v * u * p1[0] + u * u * p2[0],
          v * v * p0[1] + 2 * v * u * p1[1] + u * u * p2[1],
        ];
      };
    }

    const n = mode === "air" ? AIR_SAMPLES : 1;
    const samples = Array.from({ length: n + 1 }, (_, k) => at(k / n));
    legs.push({ mode, from: i, to: i + 1, at, samples, weight: DWELL + Math.sqrt(km) });
  }

  const starts: number[] = [];
  let total = 0;
  for (const leg of legs) {
    starts.push(total);
    total += leg.weight;
  }
  // A final beat on the last stop, so the story ends on a place rather
  // than on the arrival.
  total += DWELL;
  return { legs, starts, total };
}

/** Slow out of the stop, cruise, slow into the next one. */
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

export type JourneyFrame = {
  /** The leg in progress, or the last one once everything has arrived. */
  legIndex: number;
  /** True while the traveller sits at a stop. */
  dwelling: boolean;
  /** How far along the current leg's travel, 0 to 1, eased. */
  along: number;
  position: LatLng;
  /** A point a little further on, for the heading. */
  ahead: LatLng;
  /** The furthest stop reached. */
  stopIndex: number;
};

export function journeyFrame(path: JourneyPath, t: number): JourneyFrame {
  const { legs, starts, total } = path;
  const clock = Math.min(1, Math.max(0, t)) * total;

  let i = 0;
  while (i < legs.length - 1 && starts[i + 1] <= clock) i++;
  const leg = legs[i];
  const into = clock - starts[i];

  // Past the end of the last leg: sitting on the final stop.
  if (into >= leg.weight) {
    const end = leg.at(1);
    return { legIndex: i, dwelling: true, along: 1, position: end, ahead: leg.at(1), stopIndex: leg.to };
  }
  if (into < DWELL) {
    return { legIndex: i, dwelling: true, along: 0, position: leg.at(0), ahead: leg.at(0.02), stopIndex: leg.from };
  }

  const along = ease((into - DWELL) / (leg.weight - DWELL));
  return {
    legIndex: i,
    dwelling: false,
    along,
    position: leg.at(along),
    ahead: leg.at(Math.min(1, along + 0.02)),
    stopIndex: along > 0.97 ? leg.to : leg.from,
  };
}

/** The part of a leg already travelled, for the line behind the traveller. */
export function travelled(leg: Leg, along: number): LatLng[] {
  const n = leg.samples.length - 1;
  const done = leg.samples.filter((_, k) => k / n < along);
  done.push(leg.at(along));
  return done;
}
