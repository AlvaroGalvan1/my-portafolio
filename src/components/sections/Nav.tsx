"use client";

import { useEffect, useState } from "react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { Z } from "@/lib/layers";

// In page order, deliberately — the highlight below picks the first match
// in *this* array, so an order that disagrees with the page makes it jog
// backwards and then forwards again as you scroll. Re-order this list with
// the page, every time, rather than letting it drift.
//
// Four labels for five sections, because the bar has to fit a phone.
// `#skills` is the one left out: it's the back half of About rather than a
// destination of its own, and a five-item bar wraps at 390px.
//
// `#work` isn't in this list either, but for the opposite reason — it's the
// yellow button at the other end of the bar, which is a louder thing than a
// label in a row of labels, and deliberately so.
const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "background", label: "Background" },
  { id: "wall", label: "My Wall" },
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
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Yellow, where everything else in this bar is white on maroon.
            It's the only element on the page allowed to interrupt that, and
            it earns it by being the one thing the bar is actually for: the
            visitor who has decided to hire me and doesn't want to scroll
            five sections to find out how.

            An anchor, not a button — it goes to a place on this page, so it
            has to behave like a link (middle-click, open in new tab, and a
            visible target in the status bar). */}
        <a
          href="#work"
          className="border-2 border-brand-yellow bg-brand-yellow px-3 py-1 text-brand-maroon hover:bg-transparent hover:text-brand-yellow sm:px-4 sm:py-1.5"
        >
          Work with me
        </a>
        {/* Room for both only above `sm`. On a phone the yellow button wins:
            the Work section it lands on has "Send a brief", which opens this
            same contact form, so nothing is lost but a tap. */}
        <ContactTrigger className="hidden shrink-0 border-2 border-white bg-white px-3 py-1 text-brand-maroon hover:bg-transparent hover:text-white sm:inline-block sm:px-4 sm:py-1.5">
          Contact
        </ContactTrigger>
      </div>
    </nav>
  );
}
