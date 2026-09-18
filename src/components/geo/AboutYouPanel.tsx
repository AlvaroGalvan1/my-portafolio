"use client";

import WhereYouAre from "./WhereYouAre";
import type { Locale } from "@/content/i18n";
import type { UiStrings } from "@/content/ui";
import HeroSheet from "@/components/sections/HeroSheet";

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
  // The shell — portal, header, close, focus handling — is HeroSheet.
  return (
    <HeroSheet
      open={open}
      onClose={onClose}
      id="about-you"
      title={strings.title}
      subtitle={strings.subtitle}
      closeLabel={strings.close}
    >
      <WhereYouAre locale={locale} strings={strings} />
    </HeroSheet>
  );
}
