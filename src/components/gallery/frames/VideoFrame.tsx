"use client";

import type { FrameBase, FrameCellProps } from "./base";
import ScrollVideo from "../ScrollVideo";
import { TileLabel } from "./shared";

export type VideoFrameData = FrameBase & {
  type: "video";
  src: string;
};

// Autoplays muted on scroll (see ScrollVideo); click opens it full-size with
// sound in the lightbox. A load error hides the whole tile (see `onFail` on
// FrameCellProps) rather than showing a broken-video placeholder.
export function VideoFrameCell({ frame, onOpenLightbox, onFail }: FrameCellProps<VideoFrameData>) {
  return (
    <button
      type="button"
      className="absolute inset-0 h-full w-full cursor-zoom-in"
      onClick={() =>
        onOpenLightbox({
          kind: "video",
          src: frame.src,
          title: frame.title,
          credit: frame.credit,
        })
      }
    >
      <ScrollVideo
        src={frame.src}
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => onFail(`video failed to load: ${frame.src}`)}
      />
      <TileLabel title={frame.title} source={frame.source} />
    </button>
  );
}
