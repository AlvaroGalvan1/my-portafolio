"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale } from "@/content/i18n";
import { fuegoLogo } from "./fuego-logo";
import { storyContent } from "./story.content";
import { mountStory } from "./story-map";

// One fire, told on one real map, one step per company. The orange page
// stays as a frame and the map is a card inside it, pinned while the steps
// play as you scroll: four steps, a satellite pass over the same fire, then a
// zoom out to the Earth and one closing line. The card has a chosen shape (3:4 on a phone, 16:10
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
    <section ref={section} className="relative h-[760svh]">
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
          {/* The Earth, drawn over the map as it pulls away. */}
          <svg data-globe aria-hidden className="pointer-events-none absolute inset-0 block size-full opacity-0">
            <defs>
              <radialGradient id="ocean" cx="38%" cy="32%" r="80%">
                <stop offset="0" stopColor="#5fa3d8" />
                <stop offset=".55" stopColor="#2f72b3" />
                <stop offset="1" stopColor="#1a4373" />
              </radialGradient>
            </defs>
            <path className="sphere" fill="url(#ocean)" stroke="#1a4373" strokeOpacity=".5" />
            <path className="grat" fill="none" stroke="#fff" strokeOpacity=".14" />
            <path className="land" fill="#7fa564" stroke="#3f6a3a" strokeOpacity=".7" strokeWidth=".6" />
            <circle className="here-ring" fill="none" stroke="#d92b1c" strokeWidth="1.5" />
            <circle className="here" r="5" fill="#d92b1c" />
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

          {/* The fire is drawn, not measured: say so while it is on the card. */}
          <span
            data-illus
            className="pointer-events-none absolute right-[clamp(1.25rem,5vw,5rem)] top-5 font-[family-name:var(--font-geist-mono)] text-[13px] font-medium uppercase tracking-wider text-[#3b130f] opacity-0 transition-opacity duration-300 data-on:opacity-100"
          >
            {copy.illustration}
          </span>

          {copy.steps.map((title, i) => {
            const logo = LOGOS[i];
            return (
              <div
                key={title}
                data-beat={i}
                className={`group pointer-events-none absolute ${INSET} bottom-[clamp(1.5rem,8svh,5.5rem)] translate-y-3.5 text-brand-maroon opacity-0 transition-[opacity,translate] duration-500 data-on:translate-y-0 data-on:opacity-100`}
              >
                {/* The logo is the link to the real work on the Wall. It is hidden, so
                    also out of the tab order, until its step is the one showing. */}
                <Link href={`/${lang}/wall`} className="pointer-events-auto invisible block h-[30px] w-[140px] transition-[visibility] duration-500 group-data-on:visible">
                  {"svg" in logo ? (
                    <span className="block size-full [&>svg]:size-full [&>svg]:object-left" dangerouslySetInnerHTML={{ __html: logo.svg ?? "" }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo.src} alt={logo.alt} className="size-full object-contain object-left" />
                  )}
                </Link>
                <h2 className="mt-3.5 text-[clamp(1.9rem,4.4vw,4rem)] font-semibold leading-none tracking-tight">{title}</h2>
                <p className="mt-2 max-w-[30ch] text-[clamp(.9rem,1.4vw,1.1rem)] font-medium leading-snug">
                  <b className="font-bold">{copy.proof[i].value}</b> {copy.proof[i].label}
                </p>
              </div>
            );
          })}

          <div
            data-beat={4}
            className={`pointer-events-none absolute ${INSET} bottom-[clamp(1.5rem,8svh,5.5rem)] translate-y-3.5 text-brand-maroon opacity-0 transition-[opacity,translate] duration-500 data-on:translate-y-0 data-on:opacity-100`}
          >
            <h2 className="max-w-[14ch] text-balance text-[clamp(1.9rem,4.4vw,4rem)] font-semibold leading-none tracking-tight">{copy.close}</h2>
          </div>

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
