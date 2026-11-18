"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { QuadrantId } from "./wall.content";

type Quadrant = { id: QuadrantId; letter: string; title: string; zoomLabel: string; panel: ReactNode };

// Each quadrant's corner of the stage. Zooming scales the whole 2×2 by two
// from that corner, so the chosen quadrant fills the stage: a camera move,
// not a new layout.
const ORIGIN: Record<QuadrantId, string> = {
  a: "0% 0%",
  b: "100% 0%",
  c: "0% 100%",
  d: "100% 100%",
};

// The cross that splits the stage, drawn as each quadrant's inner edges.
const EDGES: Record<QuadrantId, string> = {
  a: "border-r border-b",
  b: "border-b",
  c: "border-r",
  d: "",
};

export default function WallStage({ quadrants, backLabel }: { quadrants: Quadrant[]; backLabel: string }) {
  const [zoomed, setZoomed] = useState<QuadrantId | null>(null);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  return (
    <div className="relative h-[calc(100svh-var(--nav-h))] min-h-[32rem] overflow-hidden bg-brand-brick">
      <div
        className="grid h-full grid-cols-2 grid-rows-2 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
        style={{
          transform: zoomed ? "scale(2)" : "none",
          transformOrigin: zoomed ? ORIGIN[zoomed] : "50% 50%",
        }}
      >
        {quadrants.map((q) => (
          <section
            key={q.id}
            id={`wall-${q.id}`}
            aria-labelledby={`wall-${q.id}-title`}
            inert={zoomed !== null && zoomed !== q.id}
            className={`relative flex min-h-0 flex-col border-brand-cream/40 ${EDGES[q.id]}`}
          >
            <h2 id={`wall-${q.id}-title`} className="absolute left-4 top-3 z-10">
              <button
                type="button"
                onClick={() => setZoomed(zoomed === q.id ? null : q.id)}
                aria-label={zoomed === q.id ? backLabel : q.zoomLabel}
                aria-expanded={zoomed === q.id}
                className="group flex items-baseline gap-2 rounded px-1 text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
              >
                <span className="font-[family-name:var(--font-display)] text-xl text-brand-yellow">{q.letter}</span>
                <span className="font-[family-name:var(--font-display)] text-sm tracking-wide underline-offset-4 group-hover:underline sm:text-base">
                  {q.title}
                </span>
              </button>
            </h2>
            <div className="min-h-0 flex-1 pt-10">{q.panel}</div>
          </section>
        ))}
      </div>

      {zoomed && (
        <button
          type="button"
          onClick={() => setZoomed(null)}
          className="absolute right-4 top-3 z-20 rounded-full bg-brand-cream px-3 py-1.5 text-sm font-semibold text-brand-maroon shadow"
        >
          ← {backLabel}
        </button>
      )}
    </div>
  );
}
