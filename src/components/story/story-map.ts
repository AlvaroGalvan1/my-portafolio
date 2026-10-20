import { animate, createTimeline } from "animejs";
import { FEEDERS, TRANSMISSION } from "./lines";

// The story map, drawn and driven imperatively: one SVG, one scroll-scrubbed
// timeline, a rAF loop for the cameras. Ported from the v6.1 prototype.
//
// Close-up units: 400 = 5 miles (the NAIP image). The wide view is 5× that
// (Sentinel-2), used when the story zooms out to track the fire.

const C = { cream: "#fff4de", yellow: "#ffc93c", orange: "#f5821f", red: "#d92b1c", maroon: "#7a1710", ink: "#3b130f" };

const P: [number, number] = [314, 184.5]; // the fault, on a feeder in the forest
const SENSORS: [number, number][] = [[180, 203], [265, 196], P, [355, 190], [206, 101], [176, 268], [240, 245]];
const deg = (r: number) => (r * 180) / Math.PI;
const CAMS = [
  { x: 170, y: 80, dir: 1 },
  { x: 372, y: 318, dir: -1 },
].map((c) => ({ ...c, bearing: deg(Math.atan2(P[1] - c.y, P[0] - c.x)), dist: Math.hypot(P[0] - c.x, P[1] - c.y) }));

const WIND = -Math.PI / 4; // spreading north-east, away from town
const E = 0.68;
const reach = (a: number, s: number) => ((s * (1 - E * E)) / (1 - E * Math.cos(a - WIND))) * (1 + 0.06 * Math.sin(3 * a + 1));
const perim = (s: number) =>
  "M" +
  Array.from({ length: 72 }, (_, k) => {
    const a = (k / 72) * Math.PI * 2;
    const r = reach(a, s);
    return `${(P[0] + r * Math.cos(a)).toFixed(1)} ${(P[1] + r * Math.sin(a)).toFixed(1)}`;
  }).join("L") +
  "Z";
const viewshed = (c: (typeof CAMS)[number], i: number) =>
  "M" +
  Array.from({ length: 90 }, (_, k) => {
    const a = (k / 90) * Math.PI * 2;
    let r = 165 + 22 * Math.sin(3 * a + i * 2) + 14 * Math.sin(7 * a + i) + 9 * Math.sin(13 * a);
    if (Math.abs(((deg(a) - c.bearing + 540) % 360) - 180) < 18) r = Math.max(r, c.dist + 18);
    return `${(c.x + r * Math.cos(a)).toFixed(1)} ${(c.y + r * Math.sin(a)).toFixed(1)}`;
  }).join("L") +
  "Z";
const RINGS = [24, 48, 72, 96];
const S_END = 310;

// Satellite fire pixels (VIIRS-sized, 375 m) over the area it will burn.
const PIX: { x: number; y: number; a: number; d: number; h: number }[] = [];
for (let y = -420; y < 620; y += 22)
  for (let x = -300; x < 820; x += 22) {
    const dx = x + 9 - P[0];
    const dy = y + 9 - P[1];
    const a = Math.atan2(dy, dx);
    const d = Math.hypot(dx, dy);
    const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    if (d < reach(a, S_END)) PIX.push({ x, y, a, d, h: h - Math.floor(h) });
  }

const NS = 'vector-effect="non-scaling-stroke"';
const worldSvg = () => `
  <image href="/maps/grass-valley-wide-s2-2016.webp" x="-800" y="-800" width="2000" height="2000"/>
  <g class="pix">${PIX.map((p) => `<rect x="${p.x}" y="${p.y}" width="18" height="18" opacity="0"/>`).join("")}</g>
  <path class="wide-perim" fill="${C.maroon}" fill-opacity=".12" stroke="${C.yellow}" stroke-width="1" stroke-opacity=".8" ${NS} opacity="0"/>
  <image class="near" href="/maps/grass-valley-naip.webp" width="400" height="400"/>
  <g class="grid" fill="none" stroke-linejoin="round" stroke-linecap="round">
    <path d="${TRANSMISSION}" stroke="${C.ink}" stroke-width="3.6" stroke-opacity=".55" ${NS}/><path d="${TRANSMISSION}" stroke="${C.yellow}" stroke-width="1.7" ${NS}/>
    <path d="${FEEDERS}" stroke="${C.ink}" stroke-width="2.8" stroke-opacity=".5" ${NS}/><path d="${FEEDERS}" stroke="${C.yellow}" stroke-width="1.1" ${NS}/>
  </g>
  <g class="views" opacity="0">${CAMS.map((c, i) => `<path d="${viewshed(c, i)}" fill="#fff" fill-opacity=".12"/>`).join("")}</g>
  <g class="rings" fill="none">${RINGS.map((s, i) => `<path d="${perim(s)}" pathLength="1" stroke="${[C.yellow, C.orange, C.red, C.maroon][i]}" stroke-width="1.8" stroke-dasharray="1 1" stroke-dashoffset="1" fill="${C.red}" fill-opacity="0"/>`).join("")}</g>
  <g class="bearings">${CAMS.map((c) => `<line x1="${c.x}" y1="${c.y}" x2="${P[0]}" y2="${P[1]}" pathLength="1" stroke="#fff" stroke-width="1.3" stroke-dasharray="1 1" stroke-dashoffset="1"/>`).join("")}</g>
  <g class="kit">
    ${CAMS.map((c) => `<line class="sweep" x1="${c.x}" y1="${c.y}" x2="${c.x + 46}" y2="${c.y}" stroke="#fff" stroke-width="1.6"/>`).join("")}
    ${SENSORS.map(([x, y], i) => `<circle class="sensor${i === 2 ? " hit" : ""}" cx="${x}" cy="${y}" r="2.8" fill="${C.cream}" stroke="${C.ink}" stroke-width="1.3"/>`).join("")}
    <circle class="ping" cx="${P[0]}" cy="${P[1]}" r="3" fill="none" stroke="${C.red}" stroke-width="1.6" opacity="0"/>
    ${CAMS.map((c) => `<g transform="translate(${c.x} ${c.y})"><circle r="6.5" fill="#fff" stroke="${C.ink}" stroke-width="1.6"/><circle r="2.4" fill="${C.ink}"/></g>`).join("")}
  </g>
  <g class="smoke" opacity="0">${[0, 1, 2].map((k) => `<circle cx="${P[0] + 3 + k * 4}" cy="${P[1] - 6 - k * 6}" r="${4 + k * 2.4}" fill="#f3efe8" fill-opacity="${0.85 - k * 0.2}"/>`).join("")}</g>
  <g class="labels" font-family="var(--font-geist-mono), monospace" font-size="9" fill="${C.cream}">${RINGS.map((s, i) => {
    const r = s * (1 + E) + 6;
    return `<text x="${(P[0] + r * Math.cos(WIND)).toFixed(1)}" y="${(P[1] + r * Math.sin(WIND)).toFixed(1)}" opacity="0" paint-order="stroke" stroke="${C.ink}" stroke-width="2.5">+${i + 1}h</text>`;
  }).join("")}</g>`;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Draws the map into `world` and drives it from the scroll position of
 *  `section`. Beats are elements with `data-beat` (0–3) and `data-close`;
 *  the current one gets `data-on`. Returns a cleanup function. */
export function mountStory(section: HTMLElement, world: SVGGElement): () => void {
  world.innerHTML = worldSvg();
  const $ = <T extends Element>(s: string) => world.querySelector(s) as T;
  const $$ = <T extends Element>(s: string) => [...world.querySelectorAll(s)] as T[];
  const near = $<SVGImageElement>(".near"), grid = $<SVGGElement>(".grid"), kit = $<SVGGElement>(".kit");
  const views = $<SVGGElement>(".views"), smoke = $<SVGGElement>(".smoke"), ping = $<SVGCircleElement>(".ping");
  const hit = $<SVGCircleElement>(".sensor.hit"), ringsG = $<SVGGElement>(".rings"), widePerim = $<SVGPathElement>(".wide-perim");
  const sweeps = $$<SVGLineElement>(".sweep"), bearings = $$<SVGLineElement>(".bearings line");
  const rings = $$<SVGPathElement>(".rings path"), labels = $$<SVGTextElement>(".labels text"), pixEls = $$<SVGRectElement>(".pix rect");
  const beats = [...section.querySelectorAll<HTMLElement>("[data-beat]")];
  const close = section.querySelector<HTMLElement>("[data-close]");

  // Small loops that run regardless of scroll.
  const loops = [
    animate(ping, { r: [3, 18], duration: 1100, loop: true, ease: "outQuad" }),
    animate(world.querySelectorAll(".smoke circle"), { translateY: [0, -6], duration: 2200, alternate: true, loop: true, ease: "inOutSine" }),
  ];

  // 1000 per beat: 0 fault, 1 cameras, 2 spread, 3 zoom out and track,
  // 4 the close.
  const S = { fault: 0, cams: 0, bear: 0, smoke: 0, spread: 0, zoom: 0, track: 0 };
  const tl = createTimeline({ autoplay: false, defaults: { duration: 500, ease: "inOutSine" } })
    .add(S, { fault: 1, duration: 350 }, 250)
    .add(S, { cams: 1, duration: 500 }, 1100)
    .add(S, { bear: 1, duration: 350 }, 1550)
    .add(S, { smoke: 1, duration: 250 }, 1850)
    .add(S, { spread: 1, duration: 800, ease: "linear" }, 2100)
    .add(S, { zoom: 1, duration: 600, ease: "inOutCubic" }, 3100)
    .add(S, { track: 1, duration: 750, ease: "linear" }, 3650)
    .add(S, { track: 1, duration: 1 }, 4799);

  let shown = -1;
  let lastTrack = -1;
  function render(time: number, now: number) {
    const ch = Math.min(4, Math.floor(time / 1000));
    hit.setAttribute("fill", S.fault > 0.5 ? C.red : C.cream);
    ping.style.visibility = S.fault > 0.5 && S.cams < 1 ? "visible" : "hidden";
    ping.setAttribute("opacity", String(clamp(1 - (+(ping.getAttribute("r") ?? 3) - 3) / 15)));
    CAMS.forEach((c, i) => {
      const amb = (c.bearing + 120 + c.dir * now * 0.04) % 360;
      const diff = ((c.bearing - amb + 540) % 360) - 180;
      sweeps[i].setAttribute("transform", `rotate(${amb + diff * S.cams} ${c.x} ${c.y})`);
      bearings[i].setAttribute("stroke-dashoffset", String(1 - S.bear));
    });
    views.setAttribute("opacity", String(S.cams * (1 - S.spread)));
    smoke.setAttribute("opacity", String(S.smoke * (1 - S.spread * 0.7)));
    rings.forEach((r, k) => {
      const v = clamp(S.spread * 4 - k);
      r.setAttribute("stroke-dashoffset", String(1 - v));
      r.setAttribute("fill-opacity", String(k === 0 ? 0.2 * v : 0));
    });
    labels.forEach((l, k) => l.setAttribute("opacity", String(clamp(S.spread * 4 - k - 0.6) * (1 - S.zoom * 2))));
    // Zoom out to 25 × 25 miles, where the satellites take over.
    const z = Math.pow(0.2, S.zoom);
    world.setAttribute("transform", `translate(200 200) scale(${z}) translate(-200 -200)`);
    near.setAttribute("opacity", String(1 - clamp((S.zoom - 0.3) / 0.5)));
    kit.setAttribute("opacity", String(1 - clamp(S.zoom / 0.5)));
    grid.setAttribute("opacity", String(1 - 0.6 * clamp(S.zoom / 0.7)));
    ringsG.setAttribute("opacity", String(1 - clamp((S.zoom - 0.6) / 0.4)));
    widePerim.setAttribute("opacity", String(clamp((S.zoom - 0.7) / 0.3)));
    if (Math.abs(S.track - lastTrack) > 0.004 || (S.track === 0) !== (lastTrack === 0)) {
      lastTrack = S.track;
      const s = 96 + (S_END - 96) * S.track;
      widePerim.setAttribute("d", perim(s));
      PIX.forEach((p, i) => {
        const r = p.d / reach(p.a, s);
        const el = pixEls[i];
        const front = r > 0.82;
        // detections are scattered: most of the front, a few spots behind it
        if (S.track === 0 || r > 1 || p.h < (front ? 0.3 : 0.78)) return el.setAttribute("opacity", "0");
        el.setAttribute("fill", front ? (r > 0.92 ? C.yellow : C.orange) : C.red);
        el.setAttribute("opacity", front ? "0.95" : "0.45");
      });
    }
    if (ch !== shown) {
      shown = ch;
      beats.forEach((b, i) => b.toggleAttribute("data-on", i === ch));
      close?.toggleAttribute("data-on", ch === 4);
    }
  }

  const progress = () => {
    const r = section.getBoundingClientRect();
    return clamp(-r.top / (r.height - window.innerHeight));
  };
  let t = 0;
  let raf = 0;
  const tick = (now: number) => {
    const target = progress() * tl.duration;
    t += (target - t) * 0.14;
    if (Math.abs(target - t) < 0.5) t = target;
    tl.seek(t);
    render(t, now);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    loops.forEach((l) => l.pause());
    tl.pause();
    world.innerHTML = "";
  };
}
