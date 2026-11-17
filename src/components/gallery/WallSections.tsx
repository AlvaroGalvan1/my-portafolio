"use client";

import { useState } from "react";
import HorizontalGallery from "./HorizontalGallery";
import type { FrameData } from "./frames/registry";
import type { WallSection } from "./frames/base";
import type { Locale } from "@/content/i18n";
import type { UiStrings } from "@/content/ui";

// One row on screen at a time, not three stacked. Featured projects opens
// by default — that's the point of the page — and Books/Posts I've seen
// are a click away rather than a scroll away. Switching tabs swaps which
// slice of the Wall is mounted; it doesn't just hide the other two, which
// matters here: HorizontalGallery measures its own scrollWidth on mount to
// set up the loop, and a `display:none` row measures zero. Keeping all
// three mounted and toggling visibility would start the hidden ones at a
// scroll position computed against zero width, broken the moment they
// were shown. Rendering only the active one sidesteps that entirely, and
// `key={active}` forces a clean remount on every switch rather than React
// trying to reconcile one gallery's DOM into another's.
export default function WallSections({
  order,
  groups,
  rowStrings,
  locale,
  strings,
}: {
  order: WallSection[];
  groups: Record<WallSection, FrameData[]>;
  rowStrings: Record<WallSection, { heading: string; note: string }>;
  locale: Locale;
  strings: UiStrings["wall"];
}) {
  const [active, setActive] = useState<WallSection>(order[0]);

  return (
    <div className="flex flex-col">
      {/* One line on a phone, swiped sideways if it runs out of room, so
          the tabs don't wrap into two rows and push the Wall down. */}
      <div role="tablist" aria-label={strings.heading} className="no-scrollbar flex gap-2 overflow-x-auto px-6 py-1 sm:flex-wrap sm:gap-3 sm:px-16">
        {order.map((section) => {
          const on = section === active;
          return (
            <button
              key={section}
              type="button"
              role="tab"
              id={`wall-tab-${section}`}
              aria-selected={on}
              aria-controls="wall-panel"
              onClick={() => setActive(section)}
              className={`min-h-11 flex-none whitespace-nowrap border-2 px-3 py-2 font-sans text-sm font-semibold transition-colors sm:px-4 ${
                on
                  ? "border-brand-yellow bg-brand-yellow text-brand-maroon"
                  : "border-white/30 text-white/80 hover:border-white hover:text-white"
              }`}
            >
              {rowStrings[section].heading}
            </button>
          );
        })}
      </div>

      <div id="wall-panel" role="tabpanel" aria-labelledby={`wall-tab-${active}`}>
        <p className="mt-4 px-6 font-sans text-sm text-white/70 sm:px-16">
          {rowStrings[active].note}
        </p>
        <HorizontalGallery key={active} items={groups[active]} locale={locale} strings={strings} />
      </div>
    </div>
  );
}
