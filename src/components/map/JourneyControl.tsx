"use client";

import type { Mode } from "./journey";
import { PLANE_PATH, SHIP_PATH } from "./travelIcons";

export type JourneyControlProps = {
  playing: boolean;
  /** A stop's name, or "Flight · A → B" while moving. Null before play. */
  caption: string | null;
  /** How the traveller is moving right now; null while it sits at a stop. */
  captionMode: Mode | null;
  playLabel: string;
  stopLabel: string;
  legend: Record<Mode, string>;
  onToggle: () => void;
};

function ModeIcon({ mode, className }: { mode: Mode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d={mode === "air" ? PLANE_PATH : SHIP_PATH} fill="currentColor" />
    </svg>
  );
}

// The player, on the map itself, top right: the zoom buttons hold the top
// left, and the attribution runs across the whole foot of the map on a
// phone. The button, then the key to the two kinds of line, then what is
// happening right now.
export default function JourneyControl({
  playing,
  caption,
  captionMode,
  playLabel,
  stopLabel,
  legend,
  onToggle,
}: JourneyControlProps) {
  return (
    <div className="pointer-events-none absolute right-3 top-3 flex max-w-[calc(100%-4.5rem)] flex-col items-end gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={playing}
        className="pointer-events-auto flex items-center gap-2 border-2 border-brand-maroon bg-brand-yellow px-3 py-1.5 font-sans text-sm font-semibold text-brand-maroon shadow-[3px_3px_0_var(--color-brand-maroon)] transition-colors hover:bg-brand-cream"
      >
        <span aria-hidden className="text-[10px] leading-none">
          {playing ? "■" : "▶"}
        </span>
        {playing ? stopLabel : playLabel}
      </button>

      {/* The key: a solid line flew, a dashed one sailed. */}
      <div className="hidden items-center gap-3 bg-brand-cream/95 px-2 py-1 font-sans text-[11px] sm:flex font-semibold text-brand-maroon">
        {(["air", "sea"] as const).map((mode) => (
          <span key={mode} className="flex items-center gap-1.5">
            <ModeIcon mode={mode} className="h-3.5 w-3.5 text-brand-red" />
            <span
              aria-hidden
              className={`w-4 border-t-2 border-brand-maroon ${mode === "sea" ? "border-dashed" : ""}`}
            />
            {legend[mode]}
          </span>
        ))}
      </div>

      {/* `aria-live="polite"`: the animation is the only thing saying
          where the traveller is, and a reader who cannot see it hears each
          leg and each stop as it comes, at the same pace. */}
      <span
        aria-live="polite"
        className={`flex items-center gap-1.5 bg-brand-maroon px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-brand-cream ${
          caption ? "" : "invisible"
        }`}
      >
        {captionMode && <ModeIcon mode={captionMode} className="h-3.5 w-3.5 shrink-0 text-brand-yellow" />}
        <span className="truncate">{caption ?? ""}</span>
      </span>
    </div>
  );
}
