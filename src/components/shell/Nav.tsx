"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/content/i18n";
import { Z } from "@/lib/layers";
import { shellContent } from "./shell.content";

// The Home hero carries this id; the bar watches it to know when the big
// name has scrolled away.
const HERO_ID = "hero";

export default function Nav({ lang }: { lang: Locale }) {
  const t = shellContent[lang].nav;
  const pathname = usePathname();
  const onHome = pathname === `/${lang}` || pathname === `/${lang}/`;

  // True while the hero is on screen. Starts true so the first paint on
  // Home has no name in the bar, rather than a name that then disappears.
  const [heroInView, setHeroInView] = useState(true);

  // The observer's callback fires once straight away with the current
  // state, so coming back to Home (the bar lives in the layout and is never
  // remounted) resets the flag without a separate setState in the effect.
  useEffect(() => {
    const hero = onHome ? document.getElementById(HERO_ID) : null;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { rootMargin: "-60px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [onHome]);

  const nameShown = !onHome || !heroInView;

  const links = [
    { href: `/${lang}/wall`, label: t.wall },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/work-with-me`, label: t.work },
  ];

  return (
    <nav
      aria-label={t.label}
      style={{ zIndex: Z.NAV }}
      className="sticky top-0 flex items-center justify-between gap-2 bg-brand-maroon px-3 py-2 font-sans text-sm font-semibold text-brand-cream print:hidden sm:px-16"
    >
      {/* Hidden, not removed: the links stay put when the name fades in.
          `inert` takes it out of the tab order and the accessibility tree
          while it can't be seen. */}
      <Link
        href={`/${lang}`}
        aria-label={t.home}
        inert={!nameShown}
        className={`inline-flex min-h-11 items-center whitespace-nowrap font-[family-name:var(--font-display)] text-xs tracking-wide transition-opacity duration-300 motion-reduce:transition-none sm:text-lg ${
          nameShown ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        Álvaro Galván
      </Link>

      <ul className="flex items-center sm:gap-4">
        {links.map((link) => {
          const current = pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-11 items-center whitespace-nowrap px-1.5 hover:text-brand-yellow sm:px-3 ${
                  current ? "text-brand-yellow underline decoration-2 underline-offset-8" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
