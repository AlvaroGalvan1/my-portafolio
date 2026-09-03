"use client";

import { useEffect, useRef } from "react";
import type { FrameBase, FrameCellProps } from "./base";
import { TileLabel } from "./shared";

export type CellularAutomataFrameData = FrameBase & {
  type: "cellularAutomata";
  // Cosmetic only — the simulation logic below is fixed Conway's Game of
  // Life. Swap the tick function for something Lenia-like later without
  // touching anything outside this file.
  cellColor?: string;
};

const COLS = 64;
const ROWS = 40;
const TICK_MS = 120;
const ALIVE_PROBABILITY = 0.25;

function randomGrid(): Uint8Array {
  const grid = new Uint8Array(COLS * ROWS);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = Math.random() < ALIVE_PROBABILITY ? 1 : 0;
  }
  return grid;
}

function step(grid: Uint8Array): Uint8Array {
  const next = new Uint8Array(grid.length);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + COLS) % COLS;
          const ny = (y + dy + ROWS) % ROWS;
          neighbors += grid[ny * COLS + nx];
        }
      }
      const alive = grid[y * COLS + x] === 1;
      next[y * COLS + x] = alive
        ? neighbors === 2 || neighbors === 3
          ? 1
          : 0
        : neighbors === 3
          ? 1
          : 0;
    }
  }
  return next;
}

// A small toroidal Game of Life running continuously on canvas — pauses
// when scrolled out of view, click reseeds it. This is the reference
// implementation for a "live simulation" frame kind: nothing outside this
// file needs to change to add another one (Lenia, boids, etc).
export function CellularAutomataFrameCell({ frame }: FrameCellProps<CellularAutomataFrameData>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Uint8Array>(randomGrid());
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
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = frame.cellColor ?? "#f5821f";
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (grid[y * COLS + x]) {
            ctx.fillRect(
              Math.floor(x * cellW),
              Math.floor(y * cellH),
              Math.ceil(cellW),
              Math.ceil(cellH),
            );
          }
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
  }, [frame.cellColor]);

  return (
    <div
      className="absolute inset-0 h-full w-full cursor-pointer"
      onClick={() => {
        gridRef.current = randomGrid();
        drawRef.current();
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <TileLabel title={frame.title} source={frame.source} />
    </div>
  );
}
