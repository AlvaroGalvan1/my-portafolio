"use client";

import type { FrameBase, FrameCellProps } from "./base";

export type PlaceholderFrameData = FrameBase & {
  type: "placeholder";
  /** Where the real asset should eventually be dropped. */
  slot: string;
  /** Which SHAPE this slot is holding — shown so you can match a piece to it. */
  shapeName?: string;
};

// A deliberately-visible empty slot, so the Wall's final shape is legible
// while pieces are still being gathered. Unlike a *broken* tile (which
// hides itself), this one is meant to be seen — it's a reserved spot, not
// a failure. Swap its `data.ts` entry for a real frame once the file lands.
export function PlaceholderFrameCell({ frame }: FrameCellProps<PlaceholderFrameData>) {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-white/15 bg-neutral-900/60 p-4 text-center">
      <p className="font-[family-name:var(--font-display)] text-2xl text-white/25">
        {frame.title}
      </p>
      {frame.shapeName && (
        <p className="font-sans text-[11px] uppercase tracking-widest text-white/30">
          {frame.shapeName}
        </p>
      )}
      <p className="font-sans text-[10px] uppercase tracking-widest text-white/20">
        {frame.slot}
      </p>
    </div>
  );
}
