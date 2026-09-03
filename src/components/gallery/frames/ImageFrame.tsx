"use client";

import type { FrameBase, FrameCellProps } from "./base";
import { TileImage, TileLabel } from "./shared";

export type ImageFrameData = FrameBase & {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
};

// Click enlarges in the lightbox.
export function ImageFrameCell({ frame, onOpenLightbox, onFail }: FrameCellProps<ImageFrameData>) {
  return (
    <button
      type="button"
      className="absolute inset-0 h-full w-full cursor-zoom-in"
      onClick={() =>
        onOpenLightbox({
          kind: "image",
          src: frame.src,
          alt: frame.alt,
          caption: frame.caption,
          credit: frame.credit,
        })
      }
    >
      <TileImage
        src={frame.src}
        alt={frame.alt}
        onLoadError={() => onFail(`image failed to load: ${frame.src}`)}
      />
      <TileLabel title={frame.title} />
    </button>
  );
}
