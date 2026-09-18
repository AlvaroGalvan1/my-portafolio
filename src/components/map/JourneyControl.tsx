"use client";

export type JourneyControlProps = {
  playing: boolean;
  /** The stop under the marker right now, or null between two of them. */
  atStop: string | null;
  playLabel: string;
  stopLabel: string;
  onToggle: () => void;
};

// The player, on the map itself. Top right: the zoom buttons hold the top left, and
// the attribution runs to three lines across the whole foot of the map on
// a phone.
export default function JourneyControl({
  playing,
  atStop,
  playLabel,
  stopLabel,
  onToggle,
}: JourneyControlProps) {
  return (
    <div className="pointer-events-none absolute right-3 top-3 flex flex-row-reverse items-center gap-2">
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
      {/* The port name under the marker. `aria-live="polite"`: the
          animation is the only thing saying where the ship is, and a
          reader who cannot see it gets every stop read out as it is
          reached, which is the same information at the same pace. Hidden
          while empty, so there is no bare maroon tab between stops. */}
      <span
        aria-live="polite"
        className={`bg-brand-maroon px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-brand-cream ${
          atStop ? "" : "invisible"
        }`}
      >
        {atStop ?? ""}
      </span>
    </div>
  );
}
