import { geoGraticule, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import countries50 from "world-atlas/countries-50m.json";

// The geometry behind C5, worked out once on the server (the section is a
// Server Component), so the page ships a few SVG path strings and no atlas.
//
// Everything is drawn in a fixed 400×300 box. Mexico is fitted into it;
// that framing is the END of the motion (zoomed out). The START is the
// same drawing seen through a camera pushed in on Oaxaca: `camera` is the
// translate + scale that puts Oaxaca's centre in the middle of the box.

export const VIEW = { w: 400, h: 300 } as const;
const PAD = 26;
const ZOOM = 3.4;

const MEXICO_ID = "484";

// PLACEHOLDER, not data. There is no Mexican-states dataset in this repo,
// so this is a hand-placed blob roughly where Oaxaca sits (southern Mexico,
// around 17°N 96.7°W) for the motion study only. Replace it with the real
// state boundary when C5 gets its content. [longitude, latitude] pairs.
const OAXACA_PLACEHOLDER: [number, number][] = [
  [-98.45, 16.55],
  [-98.25, 17.45],
  [-97.75, 18.2],
  [-96.95, 18.55],
  [-96.05, 18.3],
  [-95.35, 17.75],
  [-94.55, 17.35],
  [-94.05, 16.6],
  [-94.6, 16.3],
  [-95.4, 16.1],
  [-96.35, 15.9],
  [-97.35, 16.1],
];

type Countries = Topology<{ countries: GeometryCollection }>;

function build() {
  const topo = countries50 as unknown as Countries;
  const world = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name?: string }>;
  const mexico = world.features.find((f) => String(f.id) === MEXICO_ID) as Feature<Geometry>;

  // Clip a little beyond the box: the frame may be a touch wider or taller
  // than 4:3 and the SVG fills it with `slice`.
  const projection = geoMercator()
    .fitExtent(
      [
        [PAD, PAD],
        [VIEW.w - PAD, VIEW.h - PAD],
      ],
      mexico,
    )
    .clipExtent([
      [-80, -80],
      [VIEW.w + 80, VIEW.h + 80],
    ]);
  const path = geoPath(projection).digits(1);

  const neighbours = world.features
    .filter((f) => f !== mexico)
    .map((f) => path(f) ?? "")
    .join("");

  const graticule = path(geoGraticule().step([4, 4])()) ?? "";

  const ring = OAXACA_PLACEHOLDER.map((p) => projection(p) as [number, number]);
  const oaxaca = smoothClosed(ring);

  // Oaxaca's centre: the middle of the placeholder ring's bounds.
  const xs = ring.map((p) => p[0]);
  const ys = ring.map((p) => p[1]);
  const centre = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];

  return {
    mexico: path(mexico) ?? "",
    neighbours,
    graticule,
    oaxaca,
    // Where the camera starts: Oaxaca's centre in the middle, ZOOM× closer.
    camera: {
      k: ZOOM,
      tx: round(VIEW.w / 2 - centre[0] * ZOOM),
      ty: round(VIEW.h / 2 - centre[1] * ZOOM),
    },
  };
}

// A closed Catmull-Rom curve through the points, written as cubic Béziers,
// so the placeholder reads as a soft blob rather than a polygon.
function smoothClosed(points: [number, number][]): string {
  const n = points.length;
  const at = (i: number) => points[(i + n) % n];
  let d = `M${round(points[0][0])},${round(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${round(c1[0])},${round(c1[1])},${round(c2[0])},${round(c2[1])},${round(p2[0])},${round(p2[1])}`;
  }
  return `${d}Z`;
}

function round(v: number) {
  return Math.round(v * 10) / 10;
}

export const MOTION_MAP = build();
