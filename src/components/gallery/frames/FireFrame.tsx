"use client";

import { useEffect, useRef } from "react";
import type { FrameBase, FrameCellProps } from "./base";
import { TileLabel } from "./shared";
import { Z } from "@/lib/layers";

export type FireFrameData = FrameBase & {
  type: "fire";
  /** Opened when the tile is clicked. */
  href: string;
  linkLabel?: string;
};

const COLS = 110;
const ROWS = 68;
const TICK_MS = 80;

// Cell states. Burning cells carry an age so the flame can cool through a
// colour ramp instead of flicking on and off in one tone.
const ASH = 0;
const FUEL = 1;
const BURNING = 2; // BURNING .. BURNING + BURN_STEPS - 1
const BURN_STEPS = 4;

// Tuned for a standing equilibrium rather than a single burn: fuel has to
// regrow fast enough to outpace the fire, or within a few seconds the whole
// tile is ash and it reads as dead. Regrowth is deliberately ~100× the
// ignition rate — that ratio is what keeps a patchy, always-moving front.
const SPREAD = 0.19; // chance a burning neighbour ignites this cell
const WIND = 0.1; // extra chance from the upwind (left) side — fire drifts right
const REGROW = 0.045; // ash returning to fuel
const LIGHTNING = 0.00002; // spontaneous ignition, so it restarts if it burns out

// Flame ramp, hottest first: brand yellow → orange → red, then ash.
const FLAME = ["#fff1b8", "#ffc93c", "#f5821f", "#d92b1c"];
const FUEL_COLOR = "#1d3b2a";
const ASH_COLOR = "#120f0d";

function seedGrid(): Uint8Array {
  const grid = new Uint8Array(COLS * ROWS);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < 0.92 ? FUEL : ASH;
  }
  // A couple of starting ignitions so there's something happening on arrival.
  for (let n = 0; n < 3; n++) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    grid[y * COLS + x] = BURNING;
  }
  return grid;
}

function step(grid: Uint8Array): Uint8Array {
  const next = new Uint8Array(grid.length);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = y * COLS + x;
      const cell = grid[i];

      if (cell >= BURNING) {
        // Burn down through the colour ramp, then leave ash.
        next[i] = cell - BURNING + 1 < BURN_STEPS ? cell + 1 : ASH;
        continue;
      }

      if (cell === ASH) {
        next[i] = Math.random() < REGROW ? FUEL : ASH;
        continue;
      }

      // FUEL: ignite from burning neighbours, more readily from upwind.
      let chance = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + COLS) % COLS;
          const ny = (y + dy + ROWS) % ROWS;
          if (grid[ny * COLS + nx] >= BURNING) {
            chance += dx === -1 ? SPREAD + WIND : SPREAD;
          }
        }
      }
      next[i] =
        Math.random() < chance || Math.random() < LIGHTNING ? BURNING : FUEL;
    }
  }
  return next;
}

// A wildfire-spread cellular automaton: fuel ignites from burning
// neighbours (biased downwind), flames cool through a colour ramp to ash,
// and ash slowly regrows — so it sustains itself rather than burning out.
//
// Dragging across it ignites cells under the pointer, which is the point:
// you can start your own fire and watch where it runs. Clicking opens the
// linked article. The gallery's drag-to-pan already suppresses the click
// that follows a drag, so painting fire doesn't also navigate away.
export function FireFrameCell({ frame }: FrameCellProps<FireFrameData>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Uint8Array>(seedGrid());
  const runningRef = useRef(true);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      drawRef.current();
    };

    const draw = () => {
      const grid = gridRef.current;
      const cellW = canvas.width / COLS;
      const cellH = canvas.height / ROWS;
      ctx.fillStyle = ASH_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const cell = grid[y * COLS + x];
          if (cell === ASH) continue;
          ctx.fillStyle =
            cell === FUEL ? FUEL_COLOR : FLAME[Math.min(cell - BURNING, FLAME.length - 1)];
          ctx.fillRect(
            Math.floor(x * cellW),
            Math.floor(y * cellH),
            Math.ceil(cellW),
            Math.ceil(cellH),
          );
        }
      }
    };
    drawRef.current = draw;

    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        runningRef.current = entry.isIntersecting;
      },
      { threshold: 0.2 },
    );
    observer.observe(canvas);

    const interval = window.setInterval(() => {
      if (!runningRef.current) return;
      gridRef.current = step(gridRef.current);
      draw();
    }, TICK_MS);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, []);

  // Ignite a small blob under the pointer, so a quick pass leaves a
  // visible front rather than a single-cell speck.
  const igniteAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = Math.floor(((clientX - rect.left) / rect.width) * COLS);
    const cy = Math.floor(((clientY - rect.top) / rect.height) * ROWS);
    const grid = gridRef.current;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
        grid[y * COLS + x] = BURNING;
      }
    }
    drawRef.current();
  };

  return (
    <a
      href={frame.href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={(e) => igniteAt(e.clientX, e.clientY)}
      className="absolute inset-0 block h-full w-full cursor-crosshair"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* No `source` here: TileLabel renders the @handle as a link, and an
          <a> inside this wrapping <a> is invalid HTML — the parser splits
          it and hydration fails. The corner badge below carries the credit
          instead, and the whole tile already links to the same place. */}
      <TileLabel title={frame.title} />
      <span
        style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
        className="pointer-events-none absolute right-2 top-2 border-2 border-white/40 bg-black/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80"
      >
        {frame.linkLabel ?? "Open ↗"}
      </span>
    </a>
  );
}
