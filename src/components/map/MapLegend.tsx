"use client";

import type { PlaceGroup } from "@/content/places";

export type LegendRow = {
  id: PlaceGroup;
  label: string;
  color: string;
  logo: string;
  count: number;
};

// A toolbar attached above the map, not a floating overlay, so it never
// sits on top of map content. Same reasoning the base-map picker used
// before it was removed; the difference is this one has a job, because
// there are now several pin groups and no other way to tell them apart.
//
// Each row carries the institution's own mark rather than a colour swatch,
// so the legend and the pins are the same object at two sizes. Rows are
// only passed in for groups that have pins, so an empty layer never offers
// a toggle that does nothing.
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
            className={`flex items-center gap-2 border-2 py-1 pl-1 pr-3 text-sm font-medium transition-colors ${
              on
                ? "border-brand-cream text-brand-cream"
                : "border-transparent text-brand-cream/45 hover:border-brand-cream/40 hover:text-brand-cream/80"
            }`}
          >
            <span
              aria-hidden
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-brand-cream transition-opacity"
              style={{ borderColor: row.color, opacity: on ? 1 : 0.4 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={row.logo} alt="" className="h-4 w-4 object-contain" />
            </span>
            {row.label}
            <span className="text-brand-cream/45">{row.count}</span>
          </button>
        );
      })}
    </div>
  );
}
