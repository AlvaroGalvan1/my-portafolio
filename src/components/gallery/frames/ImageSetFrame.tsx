"use client";

import { useState } from "react";
import type { FrameBase, FrameCellProps } from "./base";
import { TileImage, TileLabel } from "./shared";

export type ImageSetFrameData = FrameBase & {
  type: "imageSet";
  images: { src: string; alt: string; caption?: string }[];
};

// Click advances to the next image in the set, in place — no modal. Use for
// things like a map series or a slide deck where the point is flipping
// through the set rather than enlarging any single frame.
export function ImageSetFrameCell({ frame, onFail }: FrameCellProps<ImageSetFrameData>) {
  const [index, setIndex] = useState(0);
  const current = frame.images[index];

  return (
    <button
      type="button"
      className="absolute inset-0 h-full w-full cursor-pointer"
      onClick={() => setIndex((i) => (i + 1) % frame.images.length)}
    >
      <TileImage
        src={current.src}
        alt={current.alt}
        onLoadError={() => onFail(`image ${index + 1}/${frame.images.length} failed to load: ${current.src}`)}
      />
      <TileLabel title={frame.title} source={frame.source} />
      <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white/80">
        {index + 1} / {frame.images.length}
      </div>
    </button>
  );
}
