"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/content/i18n";
import { fuegoLogo } from "./fuego-logo";
import { storyContent } from "./story.content";
import { mountStory } from "./story-map";

// One fire, told on one real map, one step per company. The orange page
// stays as a frame and the map is a card inside it, pinned while the steps
// play as you scroll. The card has a chosen shape (3:4 on a phone, 16:10
// from `sm`) that it keeps at every width: it is as large as that shape
// allows in the screen, never stretched to the leftover space.
const LOGOS = [
  { src: "/logos/gridware.svg", alt: "Gridware" },
  { src: "/logos/pano-ai.svg", alt: "Pano AI" },
  { svg: fuegoLogo() },
  { src: "/logos/hyticos.png", alt: "Hyticos" },
];

const INSET = "left-[clamp(1.25rem,5vw,5rem)]";

export default function Story({ lang }: { lang: Locale }) {
  const section = useRef<HTMLElement>(null);
  const world = useRef<SVGGElement>(null);
  const copy = storyContent[lang];

  useEffect(() => {
    if (!section.current || !world.current) return;
    return mountStory(section.current, world.current, copy.map);
  }, [copy]);

  return (
    <section ref={section} className="relative h-[540svh]">
      <div className="sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] items-center justify-center px-3 sm:px-6">
        <div className="relative aspect-(--r) w-[min(100%,calc((100svh-var(--nav-h)-3rem)*var(--r)))] overflow-hidden rounded-3xl bg-[#f6f3ee] shadow-[0_30px_70px_-30px_rgba(59,19,15,.55)] [--r:.75] sm:[--r:1.6]">
          <svg
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 block size-full"
            role="img"
            aria-label={copy.label}
          >
            <defs>
              <filter id="mute"><feColorMatrix type="saturate" values="0" /></filter>
              <filter id="soft"><feGaussianBlur stdDeviation="14" /></filter>
              <mask id="feather" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
                <rect x="18" y="18" width="364" height="364" fill="#fff" filter="url(#soft)" />
              </mask>
            </defs>
            <g ref={world} />
          </svg>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#f6f3ee]/95 via-[#f6f3ee]/70 to-transparent" />

          {/* One clock for the whole story: it is one fire, start to finish. */}
          <div
            data-clock
            className={`absolute ${INSET} top-5 flex items-center gap-2.5 font-[family-name:var(--font-geist-mono)] text-[13px] font-medium tracking-wider text-[#3b130f] opacity-0 transition-opacity duration-300 data-on:opacity-100`}
          >
            <i className="size-[7px] rounded-full bg-brand-red" />
            <span />
          </div>

          {copy.steps.map((title, i) => {
            const logo = LOGOS[i];
            return (
              <div
                key={title}
                data-beat={i}
                className={`pointer-events-none absolute ${INSET} bottom-[clamp(1.5rem,8svh,5.5rem)] translate-y-3.5 text-brand-maroon opacity-0 transition-[opacity,translate] duration-500 data-on:translate-y-0 data-on:opacity-100`}
              >
                <span className="block h-[30px] w-[140px]">
                  {"svg" in logo ? (
                    <span className="block size-full [&>svg]:size-full [&>svg]:object-left" dangerouslySetInnerHTML={{ __html: logo.svg ?? "" }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo.src} alt={logo.alt} className="size-full object-contain object-left" />
                  )}
                </span>
                <h2 className="mt-3.5 text-[clamp(1.9rem,4.4vw,4rem)] font-semibold leading-none tracking-tight">{title}</h2>
              </div>
            );
          })}

          <div className="absolute right-[clamp(.75rem,2.4vw,2.25rem)] top-1/2 grid -translate-y-1/2 gap-2.5">
            {copy.steps.map((title, i) => (
              <i key={title} data-tick={i} className="block h-[26px] w-[3px] rounded-sm bg-brand-maroon/20 transition-colors duration-300 data-on:bg-brand-maroon" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
