"use client";

import type { FrameBase, FrameCellProps } from "./base";
import { TileImage, TileLabel } from "./shared";

export type PostFrameData = FrameBase & {
  type: "post";
  /** The image the Wall shows. */
  src: string;
  alt: string;
  /** The whole set, for pieces that are more than one sheet — a pair of
   *  maps, a series. The lightbox flips between these; the Wall still shows
   *  only `src`, so a series is one framed piece rather than one tile per
   *  sheet. Defaults to just `src` when left out. */
  images?: { src: string; alt: string }[];
  /** Paragraphs, in order. Rendered as prose in the lightbox. */
  body: string[];
  /** BCP-47 tag for `body` — set it when the post isn't in the page's
   *  language, so screen readers switch voice instead of reading Spanish
   *  with English phonetics. */
  bodyLang?: string;
  /** Where the post actually lives, when it lives somewhere. Optional: a
   *  piece can carry the words it was published with without the original
   *  URL being to hand. */
  href?: string;
  linkLabel?: string;
};

// A written post with a photo. The tile is the photo; the words are in the
// lightbox, because a paragraph rendered at tile size is unreadable and a
// tile that opens straight to an external site loses them entirely. So:
// click to read it here, with a link out to the original underneath.
export function PostFrameCell({ frame, onOpenLightbox, onFail }: FrameCellProps<PostFrameData>) {
  return (
    <button
      type="button"
      className="absolute inset-0 h-full w-full"
      onClick={() =>
        onOpenLightbox({
          kind: "post",
          images: frame.images ?? [{ src: frame.src, alt: frame.alt }],
          title: frame.title,
          body: frame.body,
          bodyLang: frame.bodyLang,
          href: frame.href,
          linkLabel: frame.linkLabel,
          credit: frame.credit,
        })
      }
    >
      <TileImage
        src={frame.src}
        alt={frame.alt}
        onLoadError={() => onFail(`post image failed to load: ${frame.src}`)}
      />
      <TileLabel title={frame.title} />
    </button>
  );
}
