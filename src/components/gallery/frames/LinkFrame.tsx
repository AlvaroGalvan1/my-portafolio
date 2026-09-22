"use client";

import type { FrameBase, FrameCellProps } from "./base";
import { TileImage } from "./shared";
import { Z } from "@/lib/layers";

export type LinkFrameData = FrameBase & {
  type: "link";
  href: string;
  thumbnailSrc?: string;
  linkLabel?: string;
};

// Click opens `href` in a new tab instead of anything in-page.
export function LinkFrameCell({ frame }: FrameCellProps<LinkFrameData>) {
  return (
    <a
      href={frame.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`absolute inset-0 flex h-full w-full flex-col justify-end ${
        frame.thumbnailSrc ? "bg-neutral-950" : "bg-brand-cream"
      }`}
    >
      {frame.thumbnailSrc && (
        <TileImage src={frame.thumbnailSrc} alt={frame.title} />
      )}
      <div style={{ zIndex: Z.CARD_CONTENT }} className="relative p-4">
        <p
          className={
            frame.thumbnailSrc
              ? "text-base font-semibold text-white"
              : "font-[family-name:var(--font-display)] text-2xl leading-tight text-brand-maroon"
          }
        >
          {frame.title}
        </p>
        <p className={`text-xs ${frame.thumbnailSrc ? "text-white/50" : "text-brand-red"}`}>
          {frame.linkLabel ?? "Visit ↗"}
        </p>
      </div>
    </a>
  );
}
