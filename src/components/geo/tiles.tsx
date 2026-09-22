import type { ReactNode } from "react";

// The readout's visual vocabulary: one tile shape and a handful of small
// gauges. The layout borrows from a phone weather app, a grid of modules
// that each answer one question with one number and one picture, and
// redraws it in this site's terms: square frames instead of glass, the
// display face for the figures, and the page's own yellow-to-maroon ramp
// wherever a scale runs from mild to severe.

const MAROON = "var(--color-brand-maroon)";
const RED = "var(--color-brand-red)";
const YELLOW = "var(--color-brand-yellow)";
const ORANGE = "var(--color-brand-orange)";

/** Mild to severe, in the page's own colours. */
export const RAMP = `linear-gradient(90deg, ${YELLOW}, ${ORANGE}, ${RED}, ${MAROON})`;

export function Tile({
  label,
  icon,
  children,
  className = "",
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex min-w-0 flex-col border-2 border-brand-maroon/15 bg-white/70 p-4 ${className}`}>
      <h4 className="eyebrow flex items-center gap-1.5 text-brand-red">
        <span aria-hidden className="h-3.5 w-3.5 shrink-0">
          {icon}
        </span>
        {label}
      </h4>
      <div className="mt-3 flex flex-1 flex-col">{children}</div>
    </section>
  );
}

/** The figure a tile is about, in the display face. */
export function Figure({ value, unit }: { value: string; unit?: string }) {
  return (
    <p className="font-[family-name:var(--font-display)] text-3xl leading-none text-brand-maroon">
      {value}
      {unit && <span className="ml-1 text-base text-brand-maroon/60">{unit}</span>}
    </p>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-2 font-sans text-sm leading-snug text-neutral-700">{children}</p>;
}

/** A scale bar with a marker, for UV and air quality. */
export function RampBar({ fraction }: { fraction: number }) {
  const f = Math.min(1, Math.max(0, fraction));
  return (
    <div className="relative mt-auto pt-4">
      <div className="h-1.5 w-full" style={{ background: RAMP }} />
      <span
        aria-hidden
        className="absolute top-[calc(1rem-3px)] h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-brand-maroon shadow"
        style={{ left: `${f * 100}%` }}
      />
    </div>
  );
}

/** A ring that fills to a percentage, for humidity and cloud cover. */
export function Ring({ percent, children }: { percent: number; children?: ReactNode }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent)) / 100;
  return (
    <div className="relative mx-auto mt-1 h-[68px] w-[68px]">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" stroke={MAROON} strokeOpacity="0.12" strokeWidth="7" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={RED}
          strokeWidth="7"
          strokeDasharray={`${c * p} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/** A compass with the wind's arrow, pointing where the wind is going. */
export function Compass({ from, cardinal }: { from: number; cardinal: [string, string, string, string] }) {
  const to = (from + 180) % 360;
  return (
    <svg viewBox="-6 -6 112 112" className="mx-auto h-[96px] w-[96px]" aria-hidden>
      <circle cx="50" cy="50" r="40" fill="none" stroke={MAROON} strokeOpacity="0.15" strokeWidth="2" />
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i * 10 * Math.PI) / 180;
        const long = i % 9 === 0;
        const r1 = long ? 33 : 36;
        return (
          <line
            key={i}
            x1={50 + Math.sin(a) * r1}
            y1={50 - Math.cos(a) * r1}
            x2={50 + Math.sin(a) * 40}
            y2={50 - Math.cos(a) * 40}
            stroke={MAROON}
            strokeOpacity={long ? 0.6 : 0.2}
            strokeWidth={long ? 2 : 1}
          />
        );
      })}
      {cardinal.map((letter, i) => {
        const a = (i * 90 * Math.PI) / 180;
        return (
          <text
            key={letter + i}
            x={50 + Math.sin(a) * 49}
            y={50 - Math.cos(a) * 49 + 3.5}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={MAROON}
            fillOpacity="0.55"
            fontFamily="var(--font-geist-sans)"
          >
            {letter}
          </text>
        );
      })}
      <g transform={`rotate(${to} 50 50)`}>
        <line x1="50" y1="80" x2="50" y2="24" stroke={RED} strokeWidth="3" strokeLinecap="round" />
        <path d="M50 14 L57 27 L43 27 Z" fill={RED} />
        <circle cx="50" cy="80" r="3.5" fill="white" stroke={RED} strokeWidth="2" />
      </g>
    </svg>
  );
}

/** A 240° dial with a needle, for pressure. */
export function Dial({ fraction }: { fraction: number }) {
  const f = Math.min(1, Math.max(0, fraction));
  const start = -120;
  const sweep = 240;
  const polar = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [50 + Math.sin(a) * r, 54 - Math.cos(a) * r];
  };
  const arc = (from: number, to: number, r: number) => {
    const [x1, y1] = polar(from, r);
    const [x2, y2] = polar(to, r);
    return `M${x1} ${y1} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const needle = start + sweep * f;
  const [nx, ny] = polar(needle, 30);
  return (
    <svg viewBox="0 0 100 90" className="mx-auto h-[82px] w-[92px]" aria-hidden>
      <path d={arc(start, start + sweep, 38)} fill="none" stroke={MAROON} strokeOpacity="0.12" strokeWidth="7" />
      <path d={arc(start, needle, 38)} fill="none" stroke={ORANGE} strokeWidth="7" />
      <line x1="50" y1="54" x2={nx} y2={ny} stroke={MAROON} strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="54" r="4.5" fill={MAROON} />
    </svg>
  );
}

/** The day as an arc from sunrise to sunset, with the sun where it is now. */
export function SunArc({ progress, up }: { progress: number; up: boolean }) {
  const p = Math.min(1, Math.max(0, progress));
  const w = 240;
  const h = 90;
  const base = 70;
  const at = (t: number) => {
    const x = 14 + (w - 28) * t;
    const y = base - Math.sin(Math.PI * t) * 56;
    return [x, y];
  };
  const pts = Array.from({ length: 41 }, (_, i) => at(i / 40));
  const path = (upTo: number) =>
    pts
      .filter((_, i) => i / 40 <= upTo)
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ");
  const [sx, sy] = up ? at(p) : at(p >= 1 ? 1 : 0);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
      <path d={path(1)} fill="none" stroke={MAROON} strokeOpacity="0.2" strokeWidth="2" strokeDasharray="4 5" />
      {up && <path d={path(p)} fill="none" stroke={ORANGE} strokeWidth="3" />}
      <line x1="4" y1={base} x2={w - 4} y2={base} stroke={MAROON} strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx={sx} cy={sy} r="9" fill={up ? YELLOW : MAROON} stroke={up ? RED : "white"} strokeWidth="2.5" />
    </svg>
  );
}

/** A small globe with the reader's latitude drawn on it. */
export function Globe({ lat }: { lat: number }) {
  const y = 40 - Math.sin((lat * Math.PI) / 180) * 30;
  const half = Math.cos((lat * Math.PI) / 180) * 30;
  return (
    <svg viewBox="0 0 80 80" className="h-[76px] w-[76px] shrink-0" aria-hidden>
      <circle cx="40" cy="40" r="30" fill={YELLOW} fillOpacity="0.25" stroke={MAROON} strokeOpacity="0.5" strokeWidth="2" />
      <ellipse cx="40" cy="40" rx="12" ry="30" fill="none" stroke={MAROON} strokeOpacity="0.2" />
      <line x1="10" y1="40" x2="70" y2="40" stroke={MAROON} strokeOpacity="0.25" strokeDasharray="3 3" />
      <line x1={40 - half} y1={y} x2={40 + half} y2={y} stroke={RED} strokeWidth="2.5" />
      <circle cx="40" cy={y} r="4" fill={RED} stroke="white" strokeWidth="1.5" />
      <path d={`M${40 + half - 2} ${y - 4} L${40 + half + 5} ${y} L${40 + half - 2} ${y + 4}`} fill="none" stroke={RED} strokeWidth="2" />
    </svg>
  );
}

/** The ground around the reader as a small elevation map: low to high in
 *  the page's ramp, relative to this patch alone, with the reader at the
 *  centre and north up. */
export function TerrainMap({ grid }: { grid: number[][] }) {
  const flat = grid.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const stops = [
    [255, 244, 222],
    [255, 201, 60],
    [245, 130, 31],
    [217, 43, 28],
    [122, 23, 16],
  ];
  const colour = (z: number) => {
    const t = max - min < 1 ? 0 : (z - min) / (max - min);
    const x = t * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(x));
    const f = x - i;
    const [a, b] = [stops[i], stops[i + 1]];
    return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(",")})`;
  };
  const n = grid.length;
  const c = (n - 1) / 2;
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="aspect-square w-full max-w-[150px] shrink-0 border-2 border-brand-maroon/20" shapeRendering="crispEdges" aria-hidden>
      {grid.map((row, i) =>
        row.map((z, j) => <rect key={`${i}-${j}`} x={j} y={i} width="1.02" height="1.02" fill={colour(z)} />),
      )}
      <circle cx={c + 0.5} cy={c + 0.5} r="0.42" fill="white" stroke={MAROON} strokeWidth="0.16" shapeRendering="geometricPrecision" />
      <text x="0.45" y="1.1" fontSize="0.85" fontWeight="700" fill={MAROON} fontFamily="var(--font-geist-sans)">N</text>
    </svg>
  );
}

/** The moon's lit shape for a phase fraction (0 new, 0.5 full), as seen
 *  from the northern hemisphere. */
export function Moon({ fraction }: { fraction: number }) {
  const r = 26;
  const rx = Math.abs(Math.cos(2 * Math.PI * fraction)) * r;
  const waxing = fraction < 0.5;
  const crescent = fraction < 0.25 || fraction > 0.75;
  const edge = waxing ? 1 : 0;
  const term = waxing ? (crescent ? 0 : 1) : crescent ? 1 : 0;
  const d = `M0 ${-r} A${r} ${r} 0 0 ${edge} 0 ${r} A${rx} ${r} 0 0 ${term} 0 ${-r} Z`;
  return (
    <svg viewBox="-32 -32 64 64" className="mx-auto h-[76px] w-[76px]" aria-hidden>
      <circle r={r} fill={MAROON} />
      <path d={d} fill={YELLOW} />
      <circle r={r} fill="none" stroke={MAROON} strokeWidth="2" />
    </svg>
  );
}

/** How much of something has gone by, as a filled bar. */
export function Progress({ fraction }: { fraction: number }) {
  const f = Math.min(1, Math.max(0, fraction));
  return (
    <div className="mt-auto pt-4">
      <div className="h-2 w-full bg-brand-maroon/10">
        <div className="h-full bg-brand-orange" style={{ width: `${f * 100}%` }} />
      </div>
    </div>
  );
}

// Tile icons, 16×16, drawn in currentColor.
const icon = (d: ReactNode) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
    {d}
  </svg>
);
export const Icons = {
  sun: icon(<><circle cx="8" cy="8" r="3" /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" /></>),
  uv: icon(<><path d="M2 12h12" /><path d="M4.5 12a3.5 3.5 0 0 1 7 0" /><path d="M8 3v2M3.5 5l1.2 1.2M12.5 5l-1.2 1.2" /></>),
  wind: icon(<path d="M2 6h8a2 2 0 1 0-2-2M2 10h10a2 2 0 1 1-2 2" />),
  air: icon(<><circle cx="5" cy="6" r="1.2" /><circle cx="10.5" cy="4.5" r="1" /><circle cx="11" cy="10" r="1.4" /><circle cx="5.5" cy="11" r="0.9" /></>),
  drop: icon(<path d="M8 2s4.5 5 4.5 8a4.5 4.5 0 0 1-9 0C3.5 7 8 2 8 2Z" />),
  gauge: icon(<><path d="M2.5 11a5.5 5.5 0 1 1 11 0" /><path d="M8 11l2.5-3" /></>),
  cloud: icon(<path d="M4.5 12.5h7a2.8 2.8 0 0 0 .3-5.6A4 4 0 0 0 4 7.5a2.5 2.5 0 0 0 .5 5Z" />),
  pin: icon(<><path d="M8 14.5s5-4.5 5-8.5a5 5 0 0 0-10 0c0 4 5 8.5 5 8.5Z" /><circle cx="8" cy="6" r="1.8" /></>),
  globe: icon(<><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" /></>),
  mountain: icon(<path d="M1.5 13.5 6 5l3 5 1.5-2.5 4 6Z" />),
  rock: icon(<><path d="M2 12.5 4 6l4-2.5L13 6l1 6.5Z" /><path d="M4 6l4 2 5-2M8 8v4.5" /></>),
  clock: icon(<><circle cx="8" cy="8" r="6" /><path d="M8 4.5V8l2.5 1.5" /></>),
  moon: icon(<path d="M11.5 10.5A5 5 0 0 1 5.5 4.5a5 5 0 1 0 6 6Z" />),
  book: icon(<><path d="M2.5 3h4a1.5 1.5 0 0 1 1.5 1.5V13a1.5 1.5 0 0 0-1.5-1.5h-4Z" /><path d="M13.5 3h-4A1.5 1.5 0 0 0 8 4.5V13a1.5 1.5 0 0 1 1.5-1.5h4Z" /></>),
  calendar: icon(<><rect x="2.5" y="3.5" width="11" height="10" /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" /></>),
  thermo: icon(<><path d="M6.5 9.5V3a1.5 1.5 0 0 1 3 0v6.5a3 3 0 1 1-3 0Z" /><path d="M8 11V6" /></>),
};
