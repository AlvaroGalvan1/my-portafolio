import Image from "next/image";
import type { CSSProperties } from "react";
import { hand } from "../handFont";
import { APPS_STRINGS } from "./apps.content";
import { say, type Locale } from "@/content/i18n";

// D · Websites & Apps. Quick English Academy, the site for Mom's English
// school: D1 on a desktop, D2 on a phone, and Note D under the phone.
//
// Everything is sized in one unit, --u, about a hundredth of the section's
// height (or a little over half a hundredth of its width, when the quadrant
// is narrow), so the arrangement keeps its proportions in the quadrant and
// when the stage zooms into it. The screenshots are full pages: hovering a
// screen scrolls it slowly to the bottom of the page.

// The full-page screenshots in public/wall/apps/ (pixel sizes), and the
// windows they are seen through (width / height).
const DESKTOP = { src: "/wall/apps/qea-desktop.webp", width: 1920, height: 2318, window: 16 / 10 };
const PHONE = { src: "/wall/apps/qea-phone.webp", width: 780, height: 4626, window: 390 / 844 };

// How far the image moves up so its bottom meets the window's bottom, as a
// share of the image's own height (what translateY's % refers to).
function scrollBy(shot: { width: number; height: number; window: number }): CSSProperties {
  const visible = shot.width / shot.window / shot.height;
  return { "--scroll": `-${((1 - visible) * 100).toFixed(1)}%` } as CSSProperties;
}

const INK = "#0f1f3d";

export default function AppsSection({ locale }: { locale: Locale }) {
  return (
    <div className="h-52 [container-type:size] sm:h-full">
      <div className="flex h-full items-center justify-center gap-[calc(var(--u)*7)] [--u:min(1cqh,0.54cqw)]">
        <BrowserWindow alt={say(APPS_STRINGS.desktopAlt, locale)} />
        <div className="relative flex flex-col items-center">
          <Phone alt={say(APPS_STRINGS.phoneAlt, locale)} />
          <Note text={say(APPS_STRINGS.note, locale)} />
        </div>
      </div>
    </div>
  );
}

// D1: a plain browser window in the section's own blue and white.
function BrowserWindow({ alt }: { alt: string }) {
  return (
    <figure className="group w-[calc(var(--u)*118)] shrink-0 overflow-hidden rounded-[calc(var(--u)*2)] bg-[#1b3363] shadow-[0_1.5em_3em_-1.5em_rgba(0,0,0,.75)] ring-1 ring-white/25">
      <div className="flex h-[calc(var(--u)*7.5)] items-center gap-[calc(var(--u)*1.2)] px-[calc(var(--u)*2.4)]">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-[calc(var(--u)*1.7)] rounded-full bg-white/45" />
        ))}
        <span className="mx-auto flex h-[calc(var(--u)*4.4)] w-[58%] items-center justify-center gap-[calc(var(--u)*1)] rounded-full bg-[#0f1f3d] text-[calc(var(--u)*2.3)] leading-none tracking-wide text-white/80">
          <svg viewBox="0 0 10 12" aria-hidden className="h-[1em] w-auto fill-none stroke-[#87ceeb] stroke-[1.4]">
            <rect x="1.2" y="5.2" width="7.6" height="5.8" rx="1.2" />
            <path d="M3 5.2V3.6a2 2 0 0 1 4 0v1.6" />
          </svg>
          {APPS_STRINGS.url}
        </span>
        {/* Balances the dots, so the address bar sits in the middle. */}
        <span className="w-[calc(var(--u)*7.5)]" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-white">
        <Image
          src={DESKTOP.src}
          alt={alt}
          width={DESKTOP.width}
          height={DESKTOP.height}
          sizes="62vw"
          loading="eager"
          style={scrollBy(DESKTOP)}
          className="block h-auto w-full transition-transform duration-[6s] ease-in-out group-hover:translate-y-(--scroll) motion-reduce:transition-none"
        />
      </div>
    </figure>
  );
}

// D2: a phone with a dynamic island, in the same blue as the browser.
function Phone({ alt }: { alt: string }) {
  return (
    <figure className="group relative w-[calc(var(--u)*31)] rounded-[calc(var(--u)*5.5)] bg-[#1b3363] p-[calc(var(--u)*1.5)] shadow-[0_1.5em_3em_-1.5em_rgba(0,0,0,.75)] ring-1 ring-white/25">
      <div className="overflow-hidden rounded-[calc(var(--u)*4.2)] bg-white">
        {/* The status bar, so the island does not sit on the page. */}
        <div className="flex h-[calc(var(--u)*5)] items-center justify-center">
          <span className="h-[calc(var(--u)*2.6)] w-[36%] rounded-full bg-[#0b1630]" />
        </div>
        <div className="aspect-[390/844] overflow-hidden">
          <Image
            src={PHONE.src}
            alt={alt}
            width={PHONE.width}
            height={PHONE.height}
            sizes="18vw"
            loading="eager"
            style={scrollBy(PHONE)}
            className="block h-auto w-full transition-transform duration-[8s] ease-in-out group-hover:translate-y-(--scroll) motion-reduce:transition-none"
          />
        </div>
      </div>
      {/* Side buttons. */}
      <span className="absolute -left-[calc(var(--u)*0.5)] top-[22%] h-[9%] w-[calc(var(--u)*0.5)] rounded-l-sm bg-[#1b3363] ring-1 ring-white/25" />
      <span className="absolute -right-[calc(var(--u)*0.5)] top-[28%] h-[13%] w-[calc(var(--u)*0.5)] rounded-r-sm bg-[#1b3363] ring-1 ring-white/25" />
    </figure>
  );
}

// Note D: a scrap of paper taped under the phone, in handwriting, with a
// doodled heart that stays on the line of the note's last word.
function Note({ text }: { text: string }) {
  const cut = text.lastIndexOf(" ") + 1;
  return (
    <p
      className={`${hand.className} relative -mt-[calc(var(--u)*5)] w-[calc(var(--u)*44)] -rotate-[4deg] rounded-[2px] bg-[#fdfcf7] px-[calc(var(--u)*2.5)] pb-[calc(var(--u)*2.2)] pt-[calc(var(--u)*2.8)] whitespace-pre-line text-center text-[calc(var(--u)*4.3)] font-bold leading-[1.1] shadow-[0_0.6em_1.2em_-0.6em_rgba(0,0,0,.7)]`}
      style={{ color: INK }}
    >
      {/* A strip of sky-blue tape holding it on. */}
      <span
        aria-hidden
        className="absolute -top-[calc(var(--u)*1.6)] left-1/2 h-[calc(var(--u)*3.4)] w-[calc(var(--u)*13)] -translate-x-1/2 rotate-[3deg] bg-[#87ceeb]/70"
      />
      {text.slice(0, cut)}
      <span className="whitespace-nowrap">
        {text.slice(cut)}
        <svg
          viewBox="0 0 32 28"
          aria-hidden
          className="ml-[0.25em] inline-block h-[0.9em] w-auto rotate-[10deg] align-[-0.1em]"
        >
          <path
            d="M16 25.5C9.5 20.6 3 15.8 3.4 9.4 3.7 5.4 7 3 10.4 3.4c2.6.3 4.4 2.2 5.5 4.6 1.2-2.6 3.4-4.8 6.3-4.9 3.6-.1 6.5 2.7 6.4 6.6-.2 6.3-6.6 11.1-12.6 15.8Z"
            fill="#f08aa0"
            stroke={INK}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </p>
  );
}
