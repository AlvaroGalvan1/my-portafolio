"use client";

import { useState } from "react";
import HeroBackdrop from "./HeroBackdrop";
import WhereYouAre from "@/components/geo/WhereYouAre";
import { Z } from "@/lib/layers";

// The right half of the hero: the Coral loop, and the one thing on this
// site that is about the visitor instead of about me.
//
// The split is the point, and it is why this sits here rather than beside
// the bio. Left half: who I am, standing, always readable. Right half: who
// you are, offered, and only if you press it. Mixing the two put a button
// about the reader in the middle of a paragraph about the author, and
// neither one read as anything.
//
// The card that opens is the same object as the panels in Background: cream
// on a maroon rule, the page's one card shape. It covers the artwork rather
// than pushing it, because the artwork is a backdrop and a backdrop is the
// correct thing to lose when there is something to read.
export default function HeroArt({
  src,
  credit,
}: {
  src: string;
  credit: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`hero-art relative border-brand-maroon bg-brand-orange lg:min-h-0 lg:border-l-4 ${
        // Taller while the card is open, but only where the panel is a band
        // under the words rather than a column beside them. At `lg` the
        // panel is already a full screen tall and the card fits inside it.
        open ? "min-h-[88svh]" : "min-h-[45svh]"
      }`}
    >
      <HeroBackdrop src={src} />

      {open ? (
        <div
          className="absolute inset-4 flex flex-col border-4 border-brand-maroon bg-brand-cream sm:inset-6 lg:inset-8"
          style={{ zIndex: Z.CARD_CONTENT }}
        >
          <div className="flex items-start justify-between gap-4 border-b-2 border-brand-red/30 px-5 py-4 sm:px-8 sm:py-5">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-brand-maroon sm:text-3xl">
                About you
              </h2>
              <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-brand-red">
                The ground under whoever is reading
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="shrink-0 border-2 border-brand-maroon px-3 py-1.5 font-sans text-sm font-semibold text-brand-maroon transition-colors hover:bg-brand-maroon hover:text-brand-cream"
            >
              Close
            </button>
          </div>

          {/* The readout runs to four groups of figures, which is taller
              than the panel on most screens. Scrolling inside the card
              keeps the page behind it still. */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            <WhereYouAre />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ zIndex: Z.CARD_CONTENT }}
          className="absolute bottom-6 left-6 border-2 border-brand-cream bg-brand-cream px-6 py-3 font-sans font-semibold text-brand-maroon shadow-[0_2px_10px_rgb(122_23_16_/_0.35)] transition-colors hover:bg-transparent hover:text-brand-cream sm:bottom-8 sm:left-8"
        >
          About you
        </button>
      )}

      {/* The backdrop isn't mine, so it gets a name on it. Hidden while the
          card is up, where it would sit under an opaque panel anyway. */}
      {credit && !open && (
        <p
          className="pointer-events-none absolute bottom-4 right-4 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-white/90 [text-shadow:0_1px_3px_rgb(122_23_16_/_0.9)] print:hidden sm:right-6"
          style={{ zIndex: Z.CARD_CONTENT }}
        >
          Backdrop — {credit}
        </p>
      )}
    </div>
  );
}
