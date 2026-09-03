"use client";

import type { PlaceGroup } from "@/content/places";

export type LegendRow = {
  id: PlaceGroup;
  label: string;
  color: string;
  count: number;
};

// A toolbar attached above the map — not a floating overlay — so it never
// sits on top of map content. Same reasoning the base-map picker used
// before it was removed; the difference is this one has a job, because
// there are now several pin groups and no other way to tell them apart.
//
// Rows are only passed in for groups that actually have pins, so an empty
// layer never offers a toggle that does nothing.
export default function MapLegend({
  rows,
  hidden,
  onToggle,
}: {
  rows: LegendRow[];
  hidden: Record<PlaceGroup, boolean>;
  onToggle: (id: PlaceGroup) => void;
}) {
  if (rows.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b-4 border-brand-maroon bg-brand-maroon px-3 py-2">
      <span className="pr-1 text-[11px] font-bold uppercase tracking-wide text-brand-cream/60">
        Layers
      </span>
      {rows.map((row) => {
        const on = !hidden[row.id];
        return (
          <button
            key={row.id}
            type="button"
            onClick={() => onToggle(row.id)}
            aria-pressed={on}
            className={`flex items-center gap-2 border-2 px-3 py-1 text-sm font-medium transition-colors ${
              on
                ? "border-brand-cream text-brand-cream"
                : "border-transparent text-brand-cream/45 hover:border-brand-cream/40 hover:text-brand-cream/80"
            }`}
          >
            {/* The swatch is the key: it's the same colour as the pin, so
                the legend reads without a caption explaining it. Hollow
                when the layer is off, matching the pins that vanished. */}
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-full border-2"
              style={{
                borderColor: row.color,
                backgroundColor: on ? row.color : "transparent",
              }}
            />
            {row.label}
            <span className="text-brand-cream/45">{row.count}</span>
          </button>
        );
      })}
    </div>
  );
}
