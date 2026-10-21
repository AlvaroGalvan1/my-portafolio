"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { fuegoLogo } from "./fuego-logo";
import { mountStory } from "./story-map";

// One fire, told on one real map, one beat per company: what I did there.
// The map is a card that peeks up into the hero; scrolling into it starts
// the story, and the card stays pinned while the beats play.
type Strings = {
  beats: { title: string; line: string }[];
  close: string;
  cta: string;
};

const LOGOS = [
  { src: "/logos/gridware.svg", alt: "Gridware" },
  { src: "/logos/pano-ai.svg", alt: "Pano AI" },
  { svg: fuegoLogo() },
  { src: "/logos/hyticos.png", alt: "Hyticos" },
];

export default function Story({ strings, ctaHref }: { strings: Strings; ctaHref: string }) {
  const section = useRef<HTMLElement>(null);
  const world = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!section.current || !world.current) return;
    return mountStory(section.current, world.current);
  }, []);

  const caption =
    "absolute inset-x-3 bottom-3 rounded-xl bg-brand-cream p-4 text-brand-maroon shadow-[0_12px_30px_-12px_rgba(59,19,15,.6)] transition-[opacity,translate] duration-300 sm:right-auto sm:left-4 sm:bottom-4 sm:w-[min(24rem,calc(100%-2rem))] sm:p-5 " +
    "pointer-events-none translate-y-2 opacity-0 data-on:pointer-events-auto data-on:translate-y-0 data-on:opacity-100";

  return (
    <section ref={section} className="relative z-10 -mt-[26svh] h-[520svh]">
      <div className="sticky top-0 flex h-svh justify-center px-4 pt-[6svh]">
        <div className="relative aspect-square h-fit w-[min(640px,86svh,100%)] overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(59,19,15,.7)]">
          <svg viewBox="0 0 400 400" className="block size-full bg-[#2b2a1f]" role="img" aria-label="A map: a sensor on a power line flags a fault, cameras confirm the smoke, a forecast shows the spread, and satellites track the fire from above">
            <g ref={world} />
          </svg>

          {strings.beats.map((b, i) => {
            const logo = LOGOS[i];
            return (
              <div key={b.title} data-beat={i} className={caption}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] tracking-widest text-brand-maroon/60">{i + 1} / 4</span>
                  <span className="block h-7 w-20">
                    {"svg" in logo ? (
                      <span className="block size-full [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: logo.svg ?? "" }} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo.src} alt={logo.alt} className="size-full object-contain" />
                    )}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{b.title}</h3>
                <p className="mt-1 text-[0.95rem] leading-snug text-brand-maroon/80">{b.line}</p>
              </div>
            );
          })}

          <div data-close className={caption}>
            <p className="text-lg font-semibold">{strings.close}</p>
            <Button href={ctaHref} className="mt-3">
              {strings.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
