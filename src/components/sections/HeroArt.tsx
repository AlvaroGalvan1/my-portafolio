"use client";

import { useEffect, useState, type ReactNode } from "react";
import HeroBackdrop from "./HeroBackdrop";
import AboutYouPanel from "@/components/geo/AboutYouPanel";
import type { Locale } from "@/content/i18n";
import type { UiStrings } from "@/content/ui";
import { BCP47 } from "@/content/i18n";
import { Z } from "@/lib/layers";

// The right half of the hero: the Coral loop, and the one thing on this
// site that is about the visitor instead of about me.
//
// ── The plate is alive before it is pressed ──────────────────────────
// It carries the reader's own clock, ticking. That needs no permission, no
// request and no consent, because the browser already knows what time it
// is where you are. A reader who sees their own seconds counting
// understands what kind of page this is before they have agreed to
// anything — which is exactly the argument the panel behind it then makes
// at length.
//
// The plate is one control, not a control on top of a backdrop with a
// second control beside it. The whole thing is the button.
export default function HeroArt({
  src,
  credit,
  locale,
  strings,
}: {
  src: string;
  credit: string | null;
  locale: Locale;
  strings: { hero: UiStrings["hero"]; aboutYou: UiStrings["aboutYou"] };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="hero-art relative min-h-0 border-t-4 border-brand-maroon bg-brand-orange lg:border-l-4 lg:border-t-0">
      <HeroBackdrop src={src} />

      {/* The plate. Inset from the corner rather than flush to it, so the
          artwork reads as a panel with something resting on it rather than
          as a background with UI stuck to the edge. */}
      <div
        style={{ zIndex: Z.CARD_CONTENT }}
        className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[26rem] lg:bottom-10 lg:left-10"
      >
        <Plate
          label={strings.hero.aboutYou}
          clock={<LocalClock locale={locale} />}
          hook={strings.hero.aboutYouHook}
          cta={strings.hero.aboutYouOpen}
          onOpen={() => setOpen(true)}
        />
      </div>

      {/* The backdrop isn't mine, so it gets a name on it. */}
      {credit && (
        <p
          className="eyebrow pointer-events-none absolute right-4 top-4 text-white/90 [text-shadow:0_1px_3px_rgb(122_23_16_/_0.9)] print:hidden sm:right-6 sm:top-6"
          style={{ zIndex: Z.CARD_CONTENT }}
        >
          {strings.hero.backdrop} — {credit}
        </p>
      )}

      <AboutYouPanel
        open={open}
        onClose={() => setOpen(false)}
        locale={locale}
        strings={strings.aboutYou}
      />
    </div>
  );
}

// The reader's own clock, to the second.
//
// Rendered as an empty box on the server and on the first client render,
// and filled in an effect. That is not caution: `new Date()` on the server
// is the build machine's clock in the build machine's timezone, and
// hydrating it against the browser's would be a mismatch React tears the
// tree down over. The box is sized in advance with `tabular-nums` and a
// fixed `ch` width so nothing shifts when the digits arrive.
//
// One second, not one minute. A minute clock is indistinguishable from a
// screenshot for fifty-nine seconds out of sixty, and the entire job of
// this element is to be visibly not a screenshot.
function LocalClock({ locale }: { locale: Locale }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString(BCP47[locale], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [locale]);

  return (
    <span className="min-w-[8ch] text-right font-mono text-sm tabular-nums text-brand-maroon/70">
      {now}
    </span>
  );
}

// The plate itself. The whole thing is the button.
function Plate({
  label,
  clock,
  hook,
  cta,
  onOpen,
}: {
  label: string;
  clock: ReactNode;
  hook: string;
  cta: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group w-full border-2 border-brand-cream bg-brand-cream px-5 py-4 text-left shadow-[0_3px_16px_rgb(122_23_16_/_0.45)] transition-colors hover:bg-brand-yellow sm:px-6 sm:py-5`}
    >
      <span className="flex items-baseline justify-between gap-4">
        <span className="eyebrow text-brand-red">{label}</span>
        {clock}
      </span>
      <span className="mt-1.5 block font-[family-name:var(--font-display)] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight text-brand-maroon">
        {hook}
      </span>
      <span className="mt-1.5 block font-sans text-sm font-semibold text-brand-maroon underline decoration-brand-red decoration-2 underline-offset-4 group-hover:text-brand-red">
        {cta} →
      </span>
    </button>
  );
}
