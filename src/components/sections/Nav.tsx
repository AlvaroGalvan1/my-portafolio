"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALES, LOCALE_META, type Locale } from "@/content/i18n";
import type { UiStrings } from "@/content/ui";
import { Z } from "@/lib/layers";

// In page order, deliberately — the highlight below picks the first match
// in *this* array, so an order that disagrees with the page makes it jog
// backwards and then forwards again as you scroll. Re-order this list with
// the page, every time, rather than letting it drift.
//
// Three labels, and the bar is shorter than it was on purpose. `#about`
// went when the hero stopped hiding the bio behind a scroll: the top of the
// page IS the about now, so "Home" and "About" were two labels pointing at
// one screen. `#skills` is the back half of About rather than a destination
// of its own.
const LINKS = [
  { id: "home", key: "home" },
  { id: "background", key: "background" },
  { id: "wall", key: "wall" },
] as const;

export default function Nav({
  lang,
  strings,
}: {
  lang: Locale;
  strings: UiStrings["nav"];
}) {
  const [active, setActive] = useState<string>("home");
  const pathname = usePathname();

  // Which section the bar should be pointing at. The band is the slice of
  // viewport between 15% and 45% down — high enough to be under the nav
  // rather than at the very top of the window, low enough that a section
  // becomes "current" as it arrives rather than once it has taken the whole
  // screen. Percentages rather than the nav's pixel height so this doesn't
  // become a second place that has to know how tall the bar is.
  //
  // Several sections can be in the band at once (the Wall is short enough
  // to share it with About), so the first in page order wins — which is the
  // one whose heading the visitor has most recently passed.
  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        const next = LINKS.find((link) => inBand.has(link.id));
        if (next) setActive(next.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      style={{ zIndex: Z.NAV }}
      className="sticky top-0 flex items-center justify-between gap-2 bg-brand-maroon px-3 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-wide text-brand-cream sm:gap-0 sm:px-16 sm:text-sm sm:tracking-widest"
    >
      {/* `whitespace-nowrap` on the links and `min-w-0` on the row: "My
          Wall" was breaking onto two lines at 390px, which made the bar
          two rows tall and pushed the page down by 20px. */}
      <div className="flex min-w-0 gap-3 sm:gap-8">
        {LINKS.map((link) => {
          const isActive = active === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              // "location", not "page": every one of these is an anchor
              // within this document, not a link to a different page.
              aria-current={isActive ? "location" : undefined}
              className={`relative whitespace-nowrap hover:text-brand-yellow ${
                isActive ? "text-brand-yellow" : ""
              }`}
            >
              {strings[link.key]}
              {/* A painted rule under the current label rather than colour
                  alone — colour alone is the same signal the bar already
                  spends on hover, so the two would be indistinguishable.
                  Always in the DOM and faded, so nothing reflows when the
                  active section changes. */}
              <span
                aria-hidden
                className={`absolute -bottom-1.5 left-0 h-[2px] w-full bg-brand-yellow transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </a>
          );
        })}
      </div>

      {/* The corner is the language control and nothing else.

          "Let's work together" stood here, in yellow, on every screen of
          the page. It came out because the bar was carrying a call to
          action AND a language switch AND three section links on a 390px
          phone, and the one that has to survive that squeeze is the one
          the reader cannot get anywhere else — you can reach the contact
          panel from the hero and from the Work with me section, but there
          is exactly one place to change the language. */}
      <LanguageToggle current={lang} pathname={pathname} label={strings.language} />
    </nav>
  );
}

// A two-position toggle at the end of the bar, in the page's yellow.
//
// Two real links, not a state switch: /en and /es are two pages that both
// exist, so this has to be middle-clickable, openable in a new tab and
// visible in the status bar. `prefetch` does the rest — the other language
// is already in the browser by the time it is clicked.
//
// It *looks* like a toggle because that is what it is: one filled half and
// one hollow half inside a single yellow rule, which reads as one control
// with two positions. It was two words separated by a slash, which reads
// as two links that happen to be next to each other — and a reader has to
// work out that they are alternatives rather than a menu.
//
// Yellow now that the button beside it is gone. That colour was reserved
// for the page's one call to action and this would have competed with it;
// with the corner to itself, yellow is just the bar's accent, and this is
// the only thing in the bar worth accenting.
//
// It keeps the rest of the path, which matters less today (there is one
// page) than it will the first time there is a second one.
function LanguageToggle({
  current,
  pathname,
  label,
}: {
  current: Locale;
  pathname: string;
  label: string;
}) {
  const rest = LOCALES.reduce(
    (path, locale) =>
      path === `/${locale}` || path.startsWith(`/${locale}/`)
        ? path.slice(locale.length + 1)
        : path,
    pathname,
  );

  return (
    // `role="group"` and not a bare div: an aria-label on an element with
    // no role is ignored by most screen readers, so the pair of links
    // would announce as two loose letters with nothing saying what they
    // are for.
    <div
      role="group"
      aria-label={label}
      className="flex shrink-0 overflow-hidden border-2 border-brand-yellow"
    >
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${rest}`}
          hrefLang={locale}
          prefetch
          aria-current={locale === current ? "true" : undefined}
          title={LOCALE_META[locale].switchTo}
          className={`px-2.5 py-1 transition-colors sm:px-3.5 sm:py-1.5 ${
            locale === current
              ? "bg-brand-yellow text-brand-maroon"
              : "text-brand-yellow hover:bg-brand-yellow/20"
          }`}
        >
          {LOCALE_META[locale].code}
          <span className="sr-only"> — {LOCALE_META[locale].native}</span>
        </Link>
      ))}
    </div>
  );
}
