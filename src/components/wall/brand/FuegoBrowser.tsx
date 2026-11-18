"use client";

import { useState } from "react";
import Image from "next/image";
import { FUEGO_CREAM, FUEGO_ORANGE, LETTERS } from "./fuegoMark";

// B2 · the Fuego platform in a minimal browser window. A still preview by
// default, so the Wall looks finished before anything loads and no visitor
// pays for a map they didn't ask for; "Try it live" swaps in the real page.
//
// The live page is laid out at twice the frame's size and scaled down by
// half. At quadrant size that gives the page its desktop layout rather than
// its phone one, and when the stage zooms in (scale 2) it lands at exactly
// 1:1, sharp and full-size.

const INK = "#13291f"; // the platform's own ink (its tailwind brand-ink)

export type FuegoBrowserText = {
  title: string;
  address: string;
  url: string;
  screenshot: string | null;
  screenshotAlt: string;
  tryLive: string;
  live: string;
  backToPreview: string;
  openInTab: string;
  products: string[];
  previewPending: string;
};

export default function FuegoBrowser({ text }: { text: FuegoBrowserText }) {
  const [live, setLive] = useState(false);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[10px] bg-[#f6f3ec] shadow-[0_2px_4px_rgba(90,20,0,.2),0_18px_40px_-14px_rgba(90,20,0,.55)] ring-1 ring-black/15">
      {/* The window's chrome: lights, address, and the way out. */}
      <div className="flex h-[22px] shrink-0 items-center gap-2 border-b border-black/10 bg-[#ece7dc] px-2.5">
        <span aria-hidden className="flex gap-[4px]">
          <i className="block size-[7px] rounded-full bg-[#ff5f57]" />
          <i className="block size-[7px] rounded-full bg-[#febc2e]" />
          <i className="block size-[7px] rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex h-[14px] min-w-0 max-w-[62%] flex-1 items-center justify-center gap-1 rounded-[4px] bg-white/80 px-2 text-[8.5px] leading-none text-neutral-600">
          <svg viewBox="0 0 10 12" aria-hidden className="size-[7px] shrink-0 fill-neutral-500">
            <path d="M2 5V3.5a3 3 0 0 1 6 0V5h.5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.4 0h3.2V3.5a1.6 1.6 0 0 0-3.2 0Z" />
          </svg>
          <span className="truncate">{text.address}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {live && (
            <button
              type="button"
              onClick={() => setLive(false)}
              aria-label={text.backToPreview}
              title={text.backToPreview}
              className="flex h-[13px] items-center gap-1 rounded-full bg-[#13291f] px-1.5 text-[7.5px] font-semibold uppercase leading-none tracking-wider text-white"
            >
              <i aria-hidden className="block size-[5px] animate-pulse rounded-full bg-[#ff5b14]" />
              {text.live}
              <span aria-hidden className="text-white/70">×</span>
            </button>
          )}
          <a
            href={text.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={text.openInTab}
            title={text.openInTab}
            className="grid size-[14px] place-items-center rounded-[3px] text-neutral-600 hover:bg-black/10 hover:text-neutral-900"
          >
            <svg viewBox="0 0 12 12" aria-hidden className="size-[8px] fill-none stroke-current stroke-[1.4]">
              <path d="M5 2H2.5v7.5H10V7M7 2h3v3M10 2 5.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {live ? (
          <>
            <p className="absolute inset-0 grid place-items-center text-[10px] text-neutral-500">fuego.earth…</p>
            <iframe
              src={text.url}
              title={text.title}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              allow="fullscreen; geolocation"
              className="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
            />
          </>
        ) : (
          <button
            type="button"
            data-brand-live
            onClick={() => setLive(true)}
            aria-label={`${text.tryLive}: ${text.title}`}
            className="group absolute inset-0 block h-full w-full cursor-pointer text-left outline-none"
          >
            {text.screenshot ? (
              <Image
                src={text.screenshot}
                alt={text.screenshotAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top"
              />
            ) : (
              <Placeholder products={text.products} pending={text.previewPending} />
            )}
            <span className="absolute inset-0 bg-[#13291f]/0 transition-colors duration-300 group-hover:bg-[#13291f]/10" />
            <span
              className="absolute bottom-[7%] right-[4%] flex items-center gap-1.5 rounded-full px-3 py-[5px] text-[10.5px] font-semibold leading-none text-white shadow-[0_4px_12px_-3px_rgba(0,0,0,.45)] transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-white"
              style={{ backgroundColor: INK }}
            >
              <svg viewBox="0 0 10 10" aria-hidden className="size-[7px]" fill={FUEGO_ORANGE}>
                <path d="M2 1.2v7.6a.6.6 0 0 0 .9.5l6.2-3.8a.6.6 0 0 0 0-1L2.9.7a.6.6 0 0 0-.9.5Z" />
              </svg>
              {text.tryLive}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// Shown until a real screenshot is set (FUEGO_PAGE.screenshot): the
// platform's own cream and ink, a topographic map with a fire's spread
// drawn on it as rings, the FUEGO mark and the two products it serves.
// Clearly a placeholder, and labelled as one.
function Placeholder({ products, pending }: { products: string[]; pending: string }) {
  return (
    <span className="absolute inset-0 block bg-[#f1ece0]">
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 h-full w-full">
        <g fill="none" stroke={INK} strokeOpacity=".11" strokeWidth="1">
          <path d="M-20 60c60-28 110 10 170-6s90-50 150-36 80 30 120 20" />
          <path d="M-20 92c70-24 120 14 180 0s96-46 156-30 70 32 104 26" />
          <path d="M-20 214c60 10 96-30 150-24s84 38 140 30 92-34 150-20" />
          <path d="M-20 240c64 6 104-24 156-16s86 30 142 24 86-26 142-16" />
          <path d="M40 150c0-26 30-40 56-34s34 30 22 44-34 18-52 12-26-10-26-22Z" />
          <path d="M22 152c-2-40 40-58 76-50s48 42 30 62-48 26-72 18-32-14-34-30Z" />
          <path d="M318 168c4-20 28-30 46-22s22 28 8 38-38 6-48 2-8-10-6-18Z" />
        </g>
        {/* A fire's spread, hour by hour, from an ignition point. */}
        <g fill={FUEGO_ORANGE} transform="translate(292 74)">
          <path fillOpacity=".08" d="M-46 6c-6-30 18-52 50-50s58 18 56 44-20 50-52 50-48-18-54-44Z" />
          <path fillOpacity=".14" d="M-30 6c-4-20 12-34 34-32s38 12 36 30-14 32-34 32-32-12-36-30Z" />
          <path fillOpacity=".3" d="M-16 4c-2-10 8-18 18-16s20 6 18 16-8 16-18 16-16-6-18-16Z" />
          <circle r="3" fill="#d92b1c" />
        </g>
      </svg>

      <span className="absolute inset-0 flex flex-col items-start justify-center gap-[7%] px-[7%] pb-[8%]">
        <svg viewBox="0 0 234 128" aria-hidden className="h-[18%] w-auto drop-shadow-[0_2px_3px_rgba(0,0,0,.12)]">
          <rect width="234" height="128" rx="24" fill={FUEGO_ORANGE} />
          <g fill={FUEGO_CREAM} transform="translate(0 14)">
            {LETTERS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
        <span className="flex flex-col gap-1">
          {products.map((p) => (
            <span
              key={p}
              className="w-fit rounded-full border border-[#13291f]/20 bg-white/70 px-2 py-[3px] text-[9px] font-medium leading-none"
              style={{ color: INK }}
            >
              {p}
            </span>
          ))}
        </span>
      </span>

      <span className="absolute left-[4%] top-[6%] rounded-[3px] border border-dashed border-[#13291f]/35 px-1.5 py-[2px] text-[7.5px] uppercase leading-none tracking-wider text-[#13291f]/60">
        {pending}
      </span>
    </span>
  );
}
