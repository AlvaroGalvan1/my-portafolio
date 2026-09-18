"use client";

import WhereYouAre from "./WhereYouAre";
import type { Locale } from "@/content/i18n";
import type { UiStrings } from "@/content/ui";
import { Z } from "@/lib/layers";
import { useDialog } from "@/lib/useDialog";

// "About you", full screen.
//
// It used to be a card pinned inside the hero's artwork panel — `inset-8`
// on a half-width column — and it had outgrown that a long time before this
// pass. Four groups of figures in a 400px-wide box is a scrollbar inside a
// scrollbar, two columns of `min-w-0` values breaking mid-word, and a
// readout that could never show more than a third of itself at once.
//
// Now it covers the page, which is also the honest description of what it
// is: for as long as it is open, the subject of this site is the reader
// rather than me. That's the same reason the hero gave it half the screen
// in the first place — this just stops pretending a panel that size was
// ever enough.
//
// The extra room is what makes the next figures possible: the grid inside
// runs to four columns at `lg`, so "what city has your weather" or "what
// this date was like here in 1960" land as more rows rather than as a
// redesign. See TODO.md for the list of what's queued.
export default function AboutYouPanel({
  open,
  onClose,
  locale,
  strings,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  strings: UiStrings["aboutYou"];
}) {
  // Escape, focus in and back out, Tab containment and the scroll lock all
  // come from here — see lib/useDialog.ts. Called before the early return
  // below, as every hook has to be.
  const dialogRef = useDialog(open, onClose);

  if (!open) return null;

  return (
    <div
      style={{ zIndex: Z.MODAL }}
      className="fixed inset-0 bg-brand-maroon/85 px-0 py-0 sm:px-6 sm:py-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-you-heading"
        tabIndex={-1}
        className="mx-auto flex h-full max-w-5xl flex-col border-brand-maroon bg-brand-cream focus:outline-none sm:border-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The header stays put while the figures scroll under it: the
            close button on a full-screen overlay has to be reachable from
            anywhere in a readout this long, and "scroll back to the top to
            get out" is how a panel becomes a trap on a phone. */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b-2 border-brand-red/30 bg-brand-cream px-5 py-4 sm:px-8 sm:py-5">
          <div>
            <h2
              id="about-you-heading"
              className="font-[family-name:var(--font-display)] text-2xl text-brand-maroon sm:text-3xl"
            >
              {strings.title}
            </h2>
            <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-brand-red">
              {strings.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 border-2 border-brand-maroon px-3 py-1.5 font-sans text-sm font-semibold text-brand-maroon transition-colors hover:bg-brand-maroon hover:text-brand-cream"
          >
            {strings.close}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <WhereYouAre locale={locale} strings={strings} />
        </div>
      </div>
    </div>
  );
}
