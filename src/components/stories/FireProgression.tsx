"use client";

import { useEffect, useRef, useState } from "react";

// Fuego.Earth's story picture: a fire's perimeter hour by hour, on a real
// map. The imagery is real (USGS, public domain, Santa Barbara foothills);
// the fire is an illustration, shaped the way a wind-driven fire grows —
// a long head downwind, little backing, ragged where terrain slows it.
// The same picture runs on fuego.earth (src/components/FireProgression.js
// there); keep the two in step.
//
// It sits inside a closed <details> until the reader expands the entry, so
// "comes into view" and "the reader opened it" are the same moment, and the
// perimeters draw then, one hour after another, in about a second and a half.

const IMAGE = "/stories/sim-basemap-santa-barbara.jpg";
const VIEW = [1600, 1000] as const;
const ORIGIN = [720, 250] as const;
const WIND = Math.atan2(1, 0.45); // towards the south-south-east, downhill to town
const HOURS = 6;
const RING_MS = 240;
const LABELLED = [1, 3, 6]; // all six would crowd at this size

// a fire ellipse with the ignition at its rear focus
const E = 0.8;
const shape = (a: number) => (1 - E * E) / (1 - E * Math.cos(a - WIND));
const rough = (a: number) => 1 + 0.12 * Math.sin(3 * a + 1) + 0.08 * Math.sin(7 * a + 2) + 0.05 * Math.sin(13 * a + 0.4);

function perimeter(h: number): [number, number][] {
  const scale = 50 * h ** 1.02;
  return Array.from({ length: 120 }, (_, k) => {
    const a = (k / 120) * Math.PI * 2;
    const r = scale * shape(a) * rough(a) + 10 * h;
    return [ORIGIN[0] + r * Math.cos(a), ORIGIN[1] + r * Math.sin(a)];
  });
}

const RINGS = Array.from({ length: HOURS }, (_, k) => {
  const h = k + 1;
  const pts = perimeter(h);
  const head = pts.reduce((best, p) => (p[1] > best[1] ? p : best), pts[0]);
  return { h, d: `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`, head };
});

// first hour to sixth: deep red to yellow
const COLORS = ["#8a1f0c", "#b4400f", "#d4561a", "#f5821f", "#ffa53a", "#ffc93c"];

export default function FireProgression({ alt, caption }: { alt: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShown(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const label = "font-mono text-[38px] font-medium";

  return (
    <figure>
      <div ref={ref} className="relative aspect-[16/10] overflow-hidden border-2 border-brand-maroon bg-brand-maroon shadow-[4px_4px_0_var(--color-brand-red)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMAGE} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <svg
          viewBox={`0 0 ${VIEW[0]} ${VIEW[1]}`}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={alt}
          className="absolute inset-0 h-full w-full"
        >
          {[...RINGS].reverse().map(({ h, d }) => (
            <path
              key={h}
              d={d}
              pathLength={1}
              fill={COLORS[h - 1]}
              fillOpacity={shown ? 0.16 : 0}
              stroke={COLORS[h - 1]}
              strokeWidth={2.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={1}
              strokeDashoffset={shown ? 0 : 1}
              className="transition-[stroke-dashoffset,fill-opacity] duration-500 ease-out motion-reduce:transition-none"
              style={{ transitionDelay: `${(h - 1) * RING_MS}ms` }}
            />
          ))}
          {RINGS.filter(({ h }) => LABELLED.includes(h)).map(({ h, head }) => (
            <text
              key={h}
              x={head[0] + 14}
              y={head[1] + 34}
              fill="#fff4de"
              stroke="#7a1710"
              strokeWidth={7}
              paintOrder="stroke"
              className={`${label} transition-opacity duration-300 motion-reduce:transition-none`}
              style={{ opacity: shown ? 1 : 0, transitionDelay: `${(h - 1) * RING_MS + 200}ms` }}
            >
              {h} h
            </text>
          ))}
          <rect
            x={ORIGIN[0] - 9}
            y={ORIGIN[1] - 9}
            width={18}
            height={18}
            transform={`rotate(45 ${ORIGIN[0]} ${ORIGIN[1]})`}
            fill="#ffc93c"
            stroke="#7a1710"
            strokeWidth={3}
          />
        </svg>
      </div>
      <figcaption className="mt-2 font-sans text-[0.7rem] leading-snug text-neutral-600">{caption}</figcaption>
    </figure>
  );
}
