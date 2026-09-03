"use client";

import { useState } from "react";
import type { FrameBase, FrameCellProps } from "./base";
import { TileImage, TileLabel } from "./shared";

export type YouTubeFrameData = FrameBase & {
  type: "youtube";
  /** The 11-character id from the URL — youtu.be/<id> or watch?v=<id>. */
  videoId: string;
};

// YouTube's thumbnail sizes, best first. `maxresdefault` is the real 1280×720
// frame but only exists for videos uploaded above 720p, and YouTube 404s it
// rather than substituting — so a video without one would trip the guardrail
// and vanish from the Wall even though it plays fine. `hqdefault` always
// exists: it's 480×360 with letterbox bars, which `object-cover` crops back
// off in a 16:9 tile. Only if both fail is the tile genuinely broken.
const thumbnails = (videoId: string) => [
  `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
];

// A thumbnail facade, not a live <iframe>. Three reasons it's worth the extra
// component over the generic `embed` frame:
//   - Guardrails. A blocked or dead embed fails silently with nothing the
//     page can detect (see EmbedFrame's note); a thumbnail 404s observably,
//     so a video that's been deleted or made private takes its tile off the
//     Wall the way every other frame kind does.
//   - Weight. YouTube's player pulls ~1MB of script per embed. The Wall
//     renders every tile three times over for the infinite loop, so a live
//     embed here is three players loading before anyone clicks anything.
//   - It reads as a poster like the rest of the wall, instead of as YouTube
//     chrome bolted into a frame.
// The player itself opens in the lightbox, matching how local video tiles
// already behave.
export function YouTubeFrameCell({
  frame,
  onOpenLightbox,
  onFail,
}: FrameCellProps<YouTubeFrameData>) {
  const candidates = thumbnails(frame.videoId);
  const [attempt, setAttempt] = useState(0);
  const src = candidates[attempt];

  return (
    <button
      type="button"
      className="group/play absolute inset-0 h-full w-full cursor-zoom-in"
      onClick={() =>
        onOpenLightbox({
          kind: "youtube",
          videoId: frame.videoId,
          title: frame.title,
          credit: frame.credit,
        })
      }
    >
      <TileImage
        key={src}
        src={src}
        alt={frame.title}
        onLoadError={() => {
          if (attempt < candidates.length - 1) setAttempt(attempt + 1);
          else onFail(`YouTube thumbnail unavailable for video ${frame.videoId}`);
        }}
      />

      {/* Play affordance. Square, not the rounded YouTube pill — the Wall has
          no rounded corners anywhere. */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-white/70 bg-black/50 transition-colors group-hover/play:border-white group-hover/play:bg-brand-red"
      >
        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      <TileLabel title={frame.title} source={frame.source} />
    </button>
  );
}
