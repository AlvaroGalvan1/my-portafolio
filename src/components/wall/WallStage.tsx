"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { QuadrantId, QuadrantTheme } from "./wall.content";

type Quadrant = {
  id: QuadrantId;
  letter: string;
  title: string;
  zoomLabel: string;
  theme: QuadrantTheme;
  panel: ReactNode;
};

// Each quadrant's corner of the stage. Zooming scales the whole 2×2 by two
// from that corner, so the chosen quadrant fills the stage: a camera move,
// not a new layout.
const ORIGIN: Record<QuadrantId, string> = {
  a: "0% 0%",
  b: "100% 0%",
  c: "0% 100%",
  d: "100% 100%",
};

// Below `sm` the quadrants stack, each already the full width, so there is
// nothing to zoom into: the titles do nothing there.
const ZOOMS = "(min-width: 640px)";

export default function WallStage({ quadrants, backLabel }: { quadrants: Quadrant[]; backLabel: string }) {
  const [zoomed, setZoomed] = useState<QuadrantId | null>(null);
  const toggle = (id: QuadrantId) => {
    if (!window.matchMedia(ZOOMS).matches) return;
    setZoomed(zoomed === id ? null : id);
  };

  // Turning a tablet or narrowing the window while zoomed: drop the zoom,
  // or the stacked sections would stay inert behind a zoom nobody sees.
  useEffect(() => {
    const query = window.matchMedia(ZOOMS);
    const onChange = () => {
      if (!query.matches) setZoomed(null);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  return (
    <div className="relative bg-brand-brick sm:h-[calc(100svh-var(--nav-h))] sm:min-h-[32rem] sm:overflow-hidden">
      <div
        className="grid grid-cols-1 transition-transform sm:h-full sm:grid-cols-2 sm:grid-rows-2 duration-700 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
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
            className={`relative flex min-h-0 flex-col ${q.theme.panel}`}
          >
            <h2 id={`wall-${q.id}-title`} className="absolute left-4 top-3 z-10">
              <button
                type="button"
                onClick={() => toggle(q.id)}
                aria-label={zoomed === q.id ? backLabel : q.zoomLabel}
                aria-expanded={zoomed === q.id}
                className="group flex items-baseline gap-2 rounded px-1 outline-none focus-visible:ring-2 focus-visible:ring-current"
              >
                <span className={`font-[family-name:var(--font-display)] text-xl ${q.theme.accent}`}>{q.letter}</span>
                <span className="font-[family-name:var(--font-display)] text-sm tracking-wide underline-offset-4 group-hover:underline sm:text-base">
                  {q.title}
                </span>
              </button>
            </h2>
            <div className="pb-6 pt-12 sm:min-h-0 sm:flex-1 sm:pb-0 sm:pt-10">{q.panel}</div>
          </section>
        ))}
      </div>

      {zoomed && (
        <button
          type="button"
          onClick={() => setZoomed(null)}
          className="absolute right-4 top-3 z-20 hidden sm:block rounded-full bg-brand-cream px-3 py-1.5 text-sm font-semibold text-brand-maroon shadow ring-1 ring-black/10"
        >
          ← {backLabel}
        </button>
      )}
    </div>
  );
}
