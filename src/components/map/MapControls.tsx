"use client";

import { BASE_LAYERS, type BaseLayerId } from "./baseLayers";

// A toolbar attached above the map — not a floating overlay — so it never
// sits on top of map content. Built to grow: more layer toggles (pins,
// "places lived", etc.) can slot in as their own group next to the base
// map picker once added.
export default function MapControls({
  activeLayer,
  onSelectLayer,
}: {
  activeLayer: BaseLayerId;
  onSelectLayer: (id: BaseLayerId) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b-4 border-brand-maroon bg-brand-maroon px-3 py-2">
      <span className="pr-2 text-[11px] font-bold uppercase tracking-wide text-brand-cream/60">
        Base map
      </span>
      <div className="flex flex-wrap gap-1">
        {BASE_LAYERS.map((layer) => {
          const active = layer.id === activeLayer;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => onSelectLayer(layer.id)}
              aria-pressed={active}
              className={`border-2 px-3 py-1 text-sm font-medium uppercase tracking-wide transition-colors ${
                active
                  ? "border-brand-cream bg-brand-red text-brand-cream"
                  : "border-transparent text-brand-cream/70 hover:border-brand-cream/40 hover:text-brand-cream"
              }`}
            >
              {layer.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
