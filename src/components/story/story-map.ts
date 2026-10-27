import { geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import { FEEDERS, TRANSMISSION } from "./lines";

// The story map, drawn and driven imperatively: one SVG, one scroll-driven
// clock, one render function that puts the whole map at time `t`. Ported
// from prototypes/story-v7: the four steps, then a satellite pass over the
// same fire and a zoom out to the Earth.
//
// Close-up units: 400 = 5 miles (the NAIP image). The wide view is 5× that
// (Sentinel-2), used when the story zooms out to track the fire.

const C = { cream: "#fff4de", yellow: "#ffc93c", orange: "#f5821f", red: "#d92b1c", maroon: "#7a1710", ink: "#3b130f" };
const INK = C.ink;

const P: [number, number] = [314, 184.5]; // the fault, on a feeder in the forest
const SENSORS: [number, number][] = [[180, 203], [265, 196], P, [355, 190], [206, 101], [176, 268], [240, 245]];
const deg = (r: number) => (r * 180) / Math.PI;
const CAMS = [
  { x: 150, y: 108, dir: 1 },
  { x: 372, y: 292, dir: -1 },
].map((c) => ({ ...c, bearing: deg(Math.atan2(P[1] - c.y, P[0] - c.x)) }));
const FOV = 22;
const RANGE = 220;
const wedge = (c: (typeof CAMS)[number]) =>
  `M${c.x} ${c.y}L${c.x + RANGE * Math.cos((-FOV * Math.PI) / 180)} ${c.y + RANGE * Math.sin((-FOV * Math.PI) / 180)}A${RANGE} ${RANGE} 0 0 1 ${c.x + RANGE * Math.cos((FOV * Math.PI) / 180)} ${c.y + RANGE * Math.sin((FOV * Math.PI) / 180)}Z`;

// ---- The fire: a cell-based spread, the way Cell2Fire-style models run ----
// Each cell gets an arrival time from wind (an ellipse leaning north-east)
// times a patchy fuel field.
const WIND = -Math.PI / 4;
const E = 0.68;
const reach1 = (a: number) => ((1 - E * E) / (1 - E * Math.cos(a - WIND))) * (1 + 0.06 * Math.sin(3 * a + 1));
const hash = (i: number, j: number) => {
  const h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return h - Math.floor(h);
};
const sm = (x: number) => x * x * (3 - 2 * x);
function noise(x: number, y: number) {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = sm(x - i);
  const fy = sm(y - j);
  const a = hash(i, j);
  const b = hash(i + 1, j);
  const c = hash(i, j + 1);
  const d = hash(i + 1, j + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}
const fuel = (x: number, y: number) => 0.7 + 0.6 * noise(x / 38, y / 38) + 0.25 * (noise(x / 9 + 50, y / 9) - 0.5);
const arrival = (x: number, y: number) => {
  const dx = x - P[0];
  const dy = y - P[1];
  return (Math.hypot(dx, dy) / reach1(Math.atan2(dy, dx))) * fuel(x, y);
};

const S_CLOSE = 72; // 72 = 4 hours
const S_END = 230;
const PER_HOUR = 18;
// The model grid: 2-unit cells (about 25 m), drawn into a small canvas.
const GX = P[0] - 220;
const GY = P[1] - 260;
const GW = 640;
const GH = 460;
const CELL = 2;
const NX = GW / CELL;
const NY = GH / CELL;

// Burned ground, banded by the hour the fire reached it: an arrival-time map.
const rgb = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const BANDS: [number, number[]][] = [
  [1, "#5e110c"], [2, "#86180f"], [3, "#b02116"], [4, "#d92b1c"], [6, "#e6481e"], [9, "#ef6522"], [99, "#f5821f"],
].map(([h, c]) => [h as number, rgb(c as string)]);
const band = (a: number) => BANDS.find(([h]) => a / PER_HOUR < h)![1];
const FRONT = rgb("#ffb23a");

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const ramp = (t: number, start: number, dur: number) => ease(clamp((t - start) / dur));

// The camera: [time, zoom, centre x, centre y]. 1000 per step.
const CAM = [
  [0, 1.9, 300, 190], [800, 1.9, 305, 188],
  [1150, 1, 200, 198], [2000, 1, 200, 198],
  [2250, 1.05, 315, 160], [3000, 1.05, 315, 160],
  [3400, 0.3, 330, 150], [6000, 0.3, 330, 150],
];
function camera(t: number) {
  const i = CAM.findIndex((k) => k[0] > t);
  if (i === -1) return CAM[CAM.length - 1].slice(1);
  if (i === 0) return CAM[0].slice(1);
  const a = CAM[i - 1];
  const b = CAM[i];
  const f = ease((t - a[0]) / (b[0] - a[0]));
  return [1, 2, 3].map((j) => a[j] + (b[j] - a[j]) * f);
}

// How far the fire has run, in arrival units: 0 to 4 h in the simulation
// step, then on to the next morning as the view pulls back.
const T_GROW = 3300;
const simS = (t: number) =>
  t < 2150 ? -1 : t < 2950 ? S_CLOSE * clamp((t - 2150) / 800) : t < T_GROW ? S_CLOSE : S_CLOSE + (S_END - S_CLOSE) * clamp((t - T_GROW) / 650);

// Satellite detections: 375 m pixels (about 19 units here) on a fixed grid,
// lit where the pass sees fire still burning.
const PX = 19;
const PIXELS: { x: number; y: number; a: number }[] = [];
for (let y = P[1] - 260; y < P[1] + 200; y += PX)
  for (let x = P[0] - 220; x < P[0] + 420; x += PX) {
    const a = arrival(x + PX / 2, y + PX / 2);
    if (a <= S_END) PIXELS.push({ x, y, a });
  }

// ---- The close: keep pulling back until the fire is a dot on the Earth ----
// The globe is centred on the story's place (Grass Valley, California) and
// starts at the same scale as the satellite view, so the zoom never cuts.
const HERE: [number, number] = [-121.06, 39.22];
const T_EARTH = 4000;
const EARTH_DUR = 800;
const T_PASS = 3350;
const PASS_DUR = 600;
// The satellite pass sweeps west to east across the fire.
const passX = (t: number) => P[0] - 520 + 1000 * clamp((t - T_PASS) / PASS_DUR);

/** In-map labels, one set per language. */
export type MapLabels = {
  powerLine: string;
  lineSensor: string;
  fault: string;
  camera: string;
  smoke: string;
  ignition: string;
  fireFront: string;
  satellitePass: string;
  fireDetections: string;
  day: string;
};

export const DURATION = 6000;

/** Draws the map into `world` and plays it as the section scrolls. `root`
 *  holds the elements it drives: `[data-beat]`, `[data-tick]`, `[data-clock]`.
 *  Returns the cleanup. Under reduced motion nothing eases or idles: the map
 *  simply shows the moment the scroll position names. */
export function mountStory(root: HTMLElement, world: SVGGElement, labels: MapLabels): () => void {
  const NS = 'vector-effect="non-scaling-stroke"';
  world.innerHTML = `
    <image href="/maps/grass-valley-wide-s2-2016.webp" x="-800" y="-800" width="2000" height="2000" filter="url(#mute)"/>
    <rect x="-800" y="-800" width="2000" height="2000" fill="#f6f3ee" opacity=".74"/>
    <g class="near" mask="url(#feather)"><image href="/maps/grass-valley-naip.webp" width="400" height="400" filter="url(#mute)"/><rect width="400" height="400" fill="#f6f3ee" opacity=".66"/></g>
    <g class="grid" fill="none" stroke-linejoin="round" stroke-linecap="round">
      <path d="${TRANSMISSION}" stroke="${INK}" stroke-width="1.8" stroke-opacity=".6" ${NS}/>
      <path d="${FEEDERS}" stroke="${INK}" stroke-width="1" stroke-opacity=".45" ${NS}/>
      <path class="faulted" d="M310 204L318 165" stroke="${C.red}" stroke-width="3" opacity="0" ${NS}/>
    </g>
    <image class="sim" x="${GX}" y="${GY}" width="${GW}" height="${GH}" preserveAspectRatio="none"/>
    <g class="swath" opacity="0">
      <rect x="-130" y="-1400" width="260" height="2800" fill="${C.maroon}" fill-opacity=".05"/>
      <line x1="-130" y1="-1400" x2="-130" y2="1400" stroke="${C.maroon}" stroke-opacity=".45" stroke-width="1" stroke-dasharray="6 5" ${NS}/>
      <line x1="130" y1="-1400" x2="130" y2="1400" stroke="${C.maroon}" stroke-opacity=".45" stroke-width="1" stroke-dasharray="6 5" ${NS}/>
    </g>
    <g class="pixels" fill="none" stroke="${C.maroon}" stroke-width="1.1" ${NS}>${PIXELS.map((p) => `<rect x="${p.x + 1}" y="${p.y + 1}" width="${PX - 2}" height="${PX - 2}" opacity="0" ${NS}/>`).join("")}</g>
    <g class="views" opacity="0">${CAMS.map((c) => `<path class="fov" d="${wedge(c)}" fill="${C.maroon}" fill-opacity=".07" stroke="${C.maroon}" stroke-opacity=".35" stroke-width="1" ${NS}/>`).join("")}</g>
    <g class="bearings">${CAMS.map((c) => `<line x1="${c.x}" y1="${c.y}" x2="${P[0]}" y2="${P[1]}" pathLength="1" stroke="${C.maroon}" stroke-width="1.2" stroke-dasharray="1 1" stroke-dashoffset="1"/>`).join("")}</g>
    <g class="kit">
      ${SENSORS.map(([x, y], i) => `<circle class="sensor${i === 2 ? " hit" : ""}" cx="${x}" cy="${y}" r="1.7" fill="#fff" stroke="${INK}" stroke-width="1.2" ${NS}/>`).join("")}
      <circle class="ping" cx="${P[0]}" cy="${P[1]}" r="3" fill="none" stroke="${C.red}" stroke-width="2" ${NS}/>
      <circle class="ping" cx="${P[0]}" cy="${P[1]}" r="3" fill="none" stroke="${C.red}" stroke-width="2" ${NS}/>
      ${CAMS.map((c) => `<g transform="translate(${c.x} ${c.y})"><circle r="5.5" fill="${INK}"/><circle r="2" fill="#fff"/></g>`).join("")}
    </g>
    <g class="smoke" opacity="0">${[0, 1, 2, 3].map((k) => `<circle cx="${P[0] + 3 + k * 5}" cy="${P[1] - 6 - k * 7}" r="${4 + k * 2.8}" fill="#8f8780" fill-opacity="${0.55 - k * 0.11}"/>`).join("")}</g>
    <g class="notes" font-family="var(--font-geist-mono), monospace" fill="${INK}" stroke="#f6f3ee" stroke-linejoin="round" paint-order="stroke" letter-spacing=".04em">
      <text opacity="0" data-on="0" x="186" y="216">${labels.powerLine}</text>
      <text opacity="0" data-on="0" x="258" y="190" text-anchor="end">${labels.lineSensor}</text>
      <text opacity="0" data-on="0" x="322" y="182" fill="${C.red}">${labels.fault}</text>
      <text opacity="0" data-on="1" x="141" y="104" text-anchor="end">${labels.camera}</text>
      <text opacity="0" data-on="1" x="363" y="304" text-anchor="end">${labels.camera}</text>
      <text opacity="0" data-on="1" x="332" y="152">${labels.smoke}</text>
      <text opacity="0" data-on="2" x="296" y="214" text-anchor="end">${labels.ignition}</text>
      <text opacity="0" data-on="2" class="front-note" fill="${C.red}">${labels.fireFront}</text>
      <text opacity="0" data-on="3" class="pass-note">${labels.satellitePass}</text>
      <text opacity="0" data-on="3" x="${P[0] - 50}" y="${P[1] + 100}" text-anchor="end">${labels.fireDetections}</text>
    </g>`;

  const $ = (s: string) => world.querySelector(s) as SVGElement;
  const $$ = (s: string) => [...world.querySelectorAll(s)] as SVGElement[];
  const near = $(".near");
  const grid = $(".grid");
  const kit = $(".kit");
  const views = $(".views");
  const smoke = $(".smoke");
  const hit = $(".sensor.hit");
  const faulted = $(".faulted");
  const pings = $$(".ping");
  const sweeps = $$(".fov");
  const bearings = $$(".bearings line");
  const bearingsG = $(".bearings");
  const sim = $(".sim");
  const notes = $$(".notes text");
  const notesG = $(".notes");
  const frontNote = $(".front-note");
  const passNote = $(".pass-note");
  const swath = $(".swath");
  const pixEls = $$(".pixels rect");
  const smokeCircles = $$(".smoke circle");
  const beats = [...root.querySelectorAll<HTMLElement>("[data-beat]")];
  const ticks = [...root.querySelectorAll<HTMLElement>("[data-tick]")];
  const clockEl = root.querySelector<HTMLElement>("[data-clock]")!;
  const illusEl = root.querySelector<HTMLElement>("[data-illus]")!;
  const clockText = clockEl.querySelector("span")!;
  const svgEl = world.ownerSVGElement!;
  const globeEl = root.querySelector<SVGSVGElement>("[data-globe]")!;
  const sphereEl = globeEl.querySelector(".sphere")!;
  const gratEl = globeEl.querySelector(".grat")!;
  const landEl = globeEl.querySelector(".land")!;
  const hereEl = globeEl.querySelector(".here")!;
  const ringEl = globeEl.querySelector(".here-ring")!;
  const proj = geoOrthographic().rotate([-HERE[0], -HERE[1]]).precision(0.3);
  const gpath = geoPath(proj);
  const grat = geoGraticule10();
  // The land outline is only needed at the very end, so it loads on its own.
  let land: ReturnType<typeof feature> | null = null;
  let alive = true;
  import("world-atlas/land-110m.json").then((m) => {
    const topo = m.default as unknown as Topology<{ land: GeometryCollection }>;
    if (alive) land = feature(topo, topo.objects.land);
  });

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // The fire's cells, computed once and painted into a canvas as it grows.
  const ARR = new Float32Array(NX * NY);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) ARR[j * NX + i] = arrival(GX + (i + 0.5) * CELL, GY + (j + 0.5) * CELL);
  const cvs = Object.assign(document.createElement("canvas"), { width: NX, height: NY });
  const ctx = cvs.getContext("2d")!;
  const img = ctx.createImageData(NX, NY);

  const clock = (t: number, s: number) => {
    let mins = 14 * 60 + 2;
    if (t >= 1000) mins += 6;
    if (s > 0) mins += (s / PER_HOUR) * 60;
    const day = 1 + Math.floor(mins / 1440);
    const m = Math.round(mins % 1440);
    return `${labels.day} ${day}  ${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  };

  let shown = -1;
  let lastS: number | null = null;
  let lastPass: number | null = null;
  function render(t: number, now: number) {
    const S = { fault: ramp(t, 200, 300), cams: ramp(t, 1150, 450), bear: ramp(t, 1550, 300), smoke: ramp(t, 1800, 250), spread: clamp((t - 2150) / 800), zoom: ramp(t, 2980, 420) };
    const [z0, cx, cy] = camera(t);
    // Past the satellite view, both layers zoom out at the same rate: the map
    // shrinks away while the globe arrives at the scale it is leaving.
    const g = ease(clamp((t - T_EARTH) / EARTH_DUR));
    const W = svgEl.clientWidth;
    const H = svgEl.clientHeight;
    const mPerPx = (5 * 1609) / ((Math.max(W, H) / 400) * 0.3) / 400; // metres per pixel at z = .3
    const k0 = 6371000 / mPerPx;
    const k1 = 0.36 * Math.min(W, H);
    const k = k0 * Math.pow(k1 / k0, g);
    const z = (z0 * k) / k0;
    world.setAttribute("transform", `translate(200 200) scale(${z}) translate(${-cx} ${-cy})`);
    // Labels stay 13px on screen whatever the zoom, with a pale halo so they
    // read on the grey imagery.
    const unit = (Math.max(svgEl.clientWidth, svgEl.clientHeight) / 400) * z;
    notesG.setAttribute("font-size", String(13 / unit));
    notesG.setAttribute("stroke-width", String(3.5 / unit));
    const beat = Math.min(4, Math.floor(t / 1000));
    notes.forEach((n) => n.setAttribute("opacity", String(+n.dataset.on! === beat && t % 1000 > 200 && t % 1000 < 920 ? 1 : 0)));

    // 1. Grid sensing
    hit.setAttribute("fill", S.fault > 0.5 ? C.red : "#fff");
    hit.setAttribute("r", String(1.7 + 1.3 * S.fault));
    faulted.setAttribute("opacity", String(S.fault * (1 - S.spread)));
    pings.forEach((p, i) => {
      const ph = (now / 1400 + i / 2) % 1;
      p.setAttribute("r", String(3 + 22 * ph));
      p.setAttribute("opacity", String(S.fault * (1 - ph) * (1 - S.cams)));
    });

    // 2. Smoke detection
    CAMS.forEach((c, i) => {
      const amb = (c.bearing + 120 + c.dir * now * 0.04) % 360;
      const diff = ((c.bearing - amb + 540) % 360) - 180;
      sweeps[i].setAttribute("transform", `rotate(${amb + diff * S.cams} ${c.x} ${c.y})`);
      bearings[i].setAttribute("stroke-dashoffset", String(1 - S.bear));
    });
    views.setAttribute("opacity", String(Math.min(1, 0.25 + S.cams) * clamp((t - 900) / 250) * (1 - S.spread)));
    bearingsG.setAttribute("opacity", String(1 - clamp(S.spread * 3)));
    smoke.setAttribute("opacity", String(S.smoke * (1 - clamp(S.spread * 2))));
    smokeCircles.forEach((c, k) => c.setAttribute("transform", `translate(0 ${-4 * Math.sin(now / 900 + k)})`));

    // 3. Fire simulation: cells ignite in arrival order; the front burns
    // bright, then settles into its hour colour.
    const s = simS(t);
    if (s !== lastS) {
      lastS = s;
      const w = 3 + 0.05 * Math.max(0, s);
      const d = img.data;
      for (let k = 0; k < ARR.length; k++) {
        const a = ARR[k];
        const o = k * 4;
        if (s < 0 || a > s) {
          d[o + 3] = 0;
          continue;
        }
        const c = s - a < w ? FRONT : band(a);
        d[o] = c[0];
        d[o + 1] = c[1];
        d[o + 2] = c[2];
        d[o + 3] = s - a < w ? 255 : 190;
      }
      ctx.putImageData(img, 0, 0);
      sim.setAttribute("href", cvs.toDataURL());
      // Park the "Fire front" label just ahead of the head of the fire.
      const r = Math.max(10, s) * reach1(WIND) * 1.05 + 8;
      frontNote.setAttribute("x", (P[0] + r * Math.cos(WIND)).toFixed(1));
      frontNote.setAttribute("y", (P[1] + r * Math.sin(WIND)).toFixed(1));
    }

    // 4. Remote sensing: a pass crosses the same fire and lights the pixels
    // that are still burning when it goes over.
    const px = passX(t);
    swath.setAttribute("opacity", String(clamp((t - T_PASS + 100) / 120) * (1 - clamp((t - T_PASS - PASS_DUR) / 120))));
    swath.setAttribute("transform", `translate(${px} 0)`);
    passNote.setAttribute("x", String(px + 136));
    passNote.setAttribute("y", String(P[1] - 230));
    if (px !== lastPass) {
      lastPass = px;
      pixEls.forEach((el, i) => {
        const p = PIXELS[i];
        const cxp = p.x + PX / 2;
        let on = false;
        if (t >= T_PASS && cxp <= px) {
          // when the pass was over this pixel, was it burning?
          const tp = T_PASS + PASS_DUR * clamp((cxp - (P[0] - 520)) / 1000);
          const sp = simS(tp);
          on = p.a <= sp && sp - p.a < 28;
        }
        el.setAttribute("opacity", on ? ".85" : "0");
      });
    }

    near.setAttribute("opacity", String(1 - clamp((S.zoom - 0.3) / 0.5)));
    kit.setAttribute("opacity", String(1 - clamp(S.zoom / 0.4)));
    grid.setAttribute("opacity", String(1 - 0.6 * clamp(S.zoom / 0.7)));

    svgEl.style.opacity = String(1 - clamp((g - 0.08) / 0.22));
    globeEl.style.opacity = String(clamp((g - 0.02) / 0.2));
    if (t > T_EARTH - 50) {
      const end = [Math.max(W / 2, Math.min(W * 0.66, W - k1 - 32)), H * 0.42];
      proj.scale(k).translate([W / 2 + (end[0] - W / 2) * g, H / 2 + (end[1] - H / 2) * g]);
      sphereEl.setAttribute("d", gpath({ type: "Sphere" }) ?? "");
      gratEl.setAttribute("d", gpath(grat) ?? "");
      if (land) landEl.setAttribute("d", gpath(land) ?? "");
      const [hx, hy] = proj(HERE) ?? [0, 0];
      const ph = (now / 1600) % 1;
      hereEl.setAttribute("cx", String(hx));
      hereEl.setAttribute("cy", String(hy));
      ringEl.setAttribute("cx", String(hx));
      ringEl.setAttribute("cy", String(hy));
      ringEl.setAttribute("r", String(5 + 22 * ph));
      ringEl.setAttribute("opacity", String((1 - ph) * g));
    }
    if (t > 150 && t < T_EARTH + 200) clockEl.setAttribute("data-on", "");
    else clockEl.removeAttribute("data-on");
    clockText.textContent = clock(t, s);

    if (beat !== shown) {
      shown = beat;
      beats.forEach((b, i) => (i === beat ? b.setAttribute("data-on", "") : b.removeAttribute("data-on")));
      ticks.forEach((k, i) => (i === beat ? k.setAttribute("data-on", "") : k.removeAttribute("data-on")));
      // The spreading fire is a simulation: beats 2 and 3 (the pass shows the same fire).
      if (beat === 2 || beat === 3) illusEl.setAttribute("data-on", "");
      else illusEl.removeAttribute("data-on");
    }
  }

  const progress = () => {
    // The pinned stage is the first child; the section scrolls past it.
    const r = root.getBoundingClientRect();
    const stageH = (root.firstElementChild as HTMLElement).clientHeight;
    const navH = innerHeight - stageH;
    return clamp((navH - r.top) / (r.height - stageH));
  };
  let t = 0;
  let raf = 0;
  const tick = (now: number) => {
    const target = progress() * DURATION;
    t = reduced.matches || Math.abs(target - t) < 0.5 ? target : t + (target - t) * 0.12;
    // Idle motion (pings, sweeping cameras, drifting smoke) stands still under reduced motion.
    render(t, reduced.matches ? 0 : now);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    alive = false;
    cancelAnimationFrame(raf);
  };
}
