"use client";

import { useEffect, useRef } from "react";
import type { FrameBase, FrameCellProps } from "./base";
import { TileLabel } from "./shared";

// Four automata, one frame kind.
//
// This file used to be Conway's Life with the rules inlined, and a comment
// promising that another automaton could be added "without touching
// anything outside this file". That turned out to be true and this is the
// cash-in: everything that makes an automaton itself — how many states it
// has, how a cell decides its next one, what it looks like — is a record in
// AUTOMATA below, and the canvas loop underneath knows none of it.
//
// To add a fifth: add an entry, add its key to the `rule` union, add a tile
// to data.ts. Nothing else, and no new file.
export type AutomatonRule = "life" | "brain" | "cyclic" | "elementary";

export type CellularAutomataFrameData = FrameBase & {
  type: "cellularAutomata";
  /** Which automaton. Defaults to Life, which is what the only tile using
   *  this frame ran before the others existed. */
  rule?: AutomatonRule;
  /** Elementary rule number, 0–255. Only read when `rule` is "elementary".
   *  30 is the chaotic one, 110 the one that turned out to be Turing
   *  complete. Defaults to 30. */
  elementaryRule?: number;
  /** Overrides the automaton's own live colour. Kept for the Life tile,
   *  which had it before this file knew about palettes. */
  cellColor?: string;
};

type Automaton = {
  cols: number;
  rows: number;
  tickMs: number;
  /** Colour per state. Index 0 is the dead/background state and is never
   *  drawn — the canvas is already that colour. */
  colors: string[];
  seed: (cols: number, rows: number) => Uint8Array;
  step: (grid: Uint8Array, cols: number, rows: number) => Uint8Array;
};

const BACKGROUND = "#0a0a0a";

// Moore neighbourhood count of cells in a given state, wrapping at the
// edges. Every 2D rule here is toroidal: a pattern that runs off the right
// comes back on the left, so nothing dies just because it reached a wall.
function countNeighbors(
  grid: Uint8Array,
  cols: number,
  rows: number,
  x: number,
  y: number,
  state: number,
) {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + cols) % cols;
      const ny = (y + dy + rows) % rows;
      if (grid[ny * cols + nx] === state) n++;
    }
  }
  return n;
}

function randomBinary(density: number) {
  return (cols: number, rows: number) => {
    const grid = new Uint8Array(cols * rows);
    for (let i = 0; i < grid.length; i++) grid[i] = Math.random() < density ? 1 : 0;
    return grid;
  };
}

// A warm ramp for the cyclic automaton, generated rather than listed: it
// needs a dozen steps and hand-picking twelve hex values that sit evenly
// between red and yellow is a worse way to get them. Hue runs 8°→46°,
// which is the palette's own span (brand red is ~5°, brand yellow ~45°).
const CYCLIC_STATES = 12;
const cyclicColors = Array.from({ length: CYCLIC_STATES }, (_, i) => {
  const t = i / CYCLIC_STATES;
  return `hsl(${8 + t * 38} 85% ${38 + t * 22}%)`;
});

const AUTOMATA: Record<AutomatonRule, Automaton> = {
  // Conway, 1970. B3/S23 — a cell is born with exactly three live
  // neighbours and survives with two or three.
  life: {
    cols: 64,
    rows: 40,
    tickMs: 120,
    colors: [BACKGROUND, "#f5821f"],
    seed: randomBinary(0.25),
    step: (grid, cols, rows) => {
      const next = new Uint8Array(grid.length);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n = countNeighbors(grid, cols, rows, x, y, 1);
          const alive = grid[y * cols + x] === 1;
          next[y * cols + x] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
        }
      }
      return next;
    },
  },

  // Brian Silverman's Brain. Three states and no survival rule at all: a
  // firing cell always dies back, so nothing can sit still. Everything on
  // screen is a travelling signal, which is why it looks like neurons and
  // Life looks like pond life.
  brain: {
    cols: 72,
    rows: 46,
    tickMs: 110,
    // 1 = firing (yellow, the leading edge), 2 = dying (red, the wake).
    colors: [BACKGROUND, "#ffc93c", "#d92b1c"],
    seed: randomBinary(0.12),
    step: (grid, cols, rows) => {
      const next = new Uint8Array(grid.length);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const state = grid[i];
          if (state === 1) next[i] = 2;
          else if (state === 2) next[i] = 0;
          else next[i] = countNeighbors(grid, cols, rows, x, y, 1) === 2 ? 1 : 0;
        }
      }
      return next;
    },
  },

  // David Griffeath's cyclic automaton. Every cell has a successor state,
  // and it advances the moment any neighbour is already there. From noise
  // it eats itself into spirals — the same self-organising step you see in
  // a slime mould or a fire front meeting itself.
  cyclic: {
    cols: 90,
    rows: 58,
    tickMs: 90,
    colors: cyclicColors,
    seed: (cols, rows) => {
      const grid = new Uint8Array(cols * rows);
      for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.floor(Math.random() * CYCLIC_STATES);
      }
      return grid;
    },
    step: (grid, cols, rows) => {
      const next = new Uint8Array(grid.length);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const successor = (grid[i] + 1) % CYCLIC_STATES;
          next[i] = countNeighbors(grid, cols, rows, x, y, successor) > 0
            ? successor
            : grid[i];
        }
      }
      return next;
    },
  },

  // Wolfram's elementary automata: one dimension, three inputs, eight
  // outputs, one byte of rule. The grid here is its own history — each tick
  // computes one new line from the last and scrolls the rest up, so the
  // tile shows the last `rows` generations rather than one live row. The
  // rule number itself is set per tile and patched in below.
  elementary: {
    cols: 101,
    rows: 64,
    tickMs: 70,
    colors: [BACKGROUND, "#fff4de"],
    seed: (cols, rows) => {
      const grid = new Uint8Array(cols * rows);
      // One cell, dead centre, on the bottom row. A single seed is what
      // makes these legible: from noise, rule 30 is grey static, and from
      // one cell it's the pattern it's famous for.
      grid[(rows - 1) * cols + Math.floor(cols / 2)] = 1;
      return grid;
    },
    // Replaced per tile in the component below, which is the one place the
    // rule number is known. Left as identity so a missed patch shows as a
    // still image rather than a crash.
    step: (grid) => grid,
  },
};

function elementaryStep(ruleNumber: number) {
  return (grid: Uint8Array, cols: number, rows: number) => {
    const next = new Uint8Array(grid.length);
    // Scroll: every row moves up one, dropping the oldest.
    next.set(grid.subarray(cols), 0);

    const last = (rows - 1) * cols;
    for (let x = 0; x < cols; x++) {
      const left = grid[last + ((x - 1 + cols) % cols)];
      const self = grid[last + x];
      const right = grid[last + ((x + 1) % cols)];
      // The three cells above read as a 3-bit number, and the rule byte's
      // bit at that position is the answer. That's the whole definition.
      const pattern = (left << 2) | (self << 1) | right;
      next[last + x] = (ruleNumber >> pattern) & 1;
    }
    return next;
  };
}

// A small automaton running on canvas — paused when scrolled out of view,
// click reseeds it.
export function CellularAutomataFrameCell({ frame }: FrameCellProps<CellularAutomataFrameData>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Uint8Array | null>(null);
  const runningRef = useRef(true);
  const drawRef = useRef<() => void>(() => {});

  const ruleKey = frame.rule ?? "life";
  const elementaryRule = frame.elementaryRule ?? 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const base = AUTOMATA[ruleKey];
    const automaton: Automaton =
      ruleKey === "elementary"
        ? { ...base, step: elementaryStep(elementaryRule) }
        : base;
    const { cols, rows } = automaton;

    // The live colour override only makes sense for a two-state automaton,
    // where there is exactly one colour to override. Anything with a wake
    // or a ramp keeps its own.
    const colors =
      frame.cellColor && automaton.colors.length === 2
        ? [BACKGROUND, frame.cellColor]
        : automaton.colors;

    gridRef.current = automaton.seed(cols, rows);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      drawRef.current();
    };

    const draw = () => {
      const grid = gridRef.current;
      if (!grid) return;
      const cellW = canvas.width / cols;
      const cellH = canvas.height / rows;
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const state = grid[y * cols + x];
          if (state === 0) continue;
          ctx.fillStyle = colors[state] ?? colors[colors.length - 1];
          ctx.fillRect(
            Math.floor(x * cellW),
            Math.floor(y * cellH),
            Math.ceil(cellW),
            Math.ceil(cellH),
          );
        }
      }
    };
    drawRef.current = () => {
      draw();
    };

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
      const grid = gridRef.current;
      if (!grid) return;
      gridRef.current = automaton.step(grid, cols, rows);
      draw();
    }, automaton.tickMs);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, [ruleKey, elementaryRule, frame.cellColor]);

  return (
    <div
      className="absolute inset-0 h-full w-full cursor-pointer"
      onClick={() => {
        const automaton = AUTOMATA[ruleKey];
        gridRef.current = automaton.seed(automaton.cols, automaton.rows);
        drawRef.current();
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <TileLabel title={frame.title} />
    </div>
  );
}
