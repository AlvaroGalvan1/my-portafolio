"use client";

import { useEffect, useState } from "react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { Z } from "@/lib/layers";

// In page order, deliberately — the highlight below picks the first match
// in *this* array, so an order that disagrees with the page makes it jog
// backwards and then forwards again as you scroll. About moved ahead of My
// Wall here because the bio moved above the Wall on the page (see
// Intro.tsx); this list has to be re-ordered with it, not just left to
// drift.
//
// The skills panel below the Wall (`#skills`) is deliberately absent: it's
// the back half of About rather than a destination of its own, and adding
// it would put two About-ish labels in a four-item bar.
const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "wall", label: "My Wall" },
  { id: "journey", label: "My Journey" },
] as const;

export default function Nav() {
  const [active, setActive] = useState<string>("home");

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
      className="sticky top-0 flex items-center justify-between gap-3 bg-brand-maroon px-4 py-4 font-sans text-xs font-semibold uppercase tracking-wide text-brand-cream sm:gap-0 sm:px-16 sm:text-sm sm:tracking-widest"
    >
      <div className="flex gap-3 sm:gap-8">
        {LINKS.map((link) => {
          const isActive = active === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              // "location", not "page": every one of these is an anchor
              // within this document, not a link to a different page.
              aria-current={isActive ? "location" : undefined}
              className={`relative hover:text-brand-yellow ${
                isActive ? "text-brand-yellow" : ""
              }`}
            >
              {link.label}
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
      <ContactTrigger className="shrink-0 border-2 border-white bg-white px-3 py-1 text-brand-maroon hover:bg-transparent hover:text-white sm:px-4 sm:py-1.5">
        Contact
      </ContactTrigger>
    </nav>
  );
}
