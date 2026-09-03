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
      className="absolute inset-0 flex h-full w-full flex-col justify-end bg-neutral-950"
    >
      {frame.thumbnailSrc && (
        <TileImage src={frame.thumbnailSrc} alt={frame.title} />
      )}
      <div style={{ zIndex: Z.CARD_CONTENT }} className="relative p-4">
        <p className="text-base font-semibold text-white">{frame.title}</p>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs text-white/50">{frame.linkLabel ?? "Visit ↗"}</p>
          {frame.source && (
            <span className="shrink-0 text-xs text-white/40">@{frame.source.handle}</span>
          )}
        </div>
      </div>
    </a>
  );
}
