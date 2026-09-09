"use client";

import { useEffect, useRef, useState } from "react";
import type { FrameBase, FrameCellProps } from "./base";
import { TileImage, TileLabel } from "./shared";
import { Z } from "@/lib/layers";

export type ImageSetFrameData = FrameBase & {
  type: "imageSet";
  images: { src: string; alt: string; caption?: string }[];
};

// A deck you flip through in place — a slide series, a set of sheets — as
// opposed to `image`, which enlarges one picture in the lightbox. Use it
// when the point is moving through the set rather than seeing any one frame
// bigger.
//
// Three affordances, because a tile that silently holds six slides looks
// exactly like a tile that holds one:
//   - the ‹ › chevrons, always visible rather than hover-revealed, so a
//     phone (which has no hover) can see there are pages at all;
//   - a click anywhere else on the tile advances, which is the faster
//     gesture once you know it's a deck;
//   - the page counter, bottom-right.
export function ImageSetFrameCell({ frame, onFail }: FrameCellProps<ImageSetFrameData>) {
  const [index, setIndex] = useState(0);
  const [missing, setMissing] = useState<string[]>([]);

  // `onFail` is passed as an inline closure by HorizontalGallery, so it's a
  // new function on every render. Held in a ref, it can be called from the
  // probe effect below without being a dependency of it — as a dependency
  // it would re-run the effect every render, and the setState inside would
  // make that a loop.
  const onFailRef = useRef(onFail);
  useEffect(() => {
    onFailRef.current = onFail;
  });

  // A deck arrives one drop at a time — five of six slides is the normal
  // state of things for a while. Each slide is probed once on mount and the
  // ones that aren't there yet are dropped from the set, so the deck shows
  // what exists instead of the whole tile vanishing the moment a flip lands
  // on a 404. The tile only removes itself when *nothing* loaded.
  //
  // `check:assets` already reports which files are missing at build time,
  // so a partial deck stays quiet here rather than logging per slide.
  useEffect(() => {
    let cancelled = false;
    const sources = frame.images.map((image) => image.src);

    Promise.all(
      sources.map(
        (src) =>
          new Promise<string | null>((resolve) => {
            const probe = new window.Image();
            probe.onload = () => resolve(null);
            probe.onerror = () => resolve(src);
            probe.src = src;
          }),
      ),
    ).then((results) => {
      if (cancelled) return;
      const gone = results.filter((src): src is string => src !== null);
      if (gone.length === sources.length) {
        onFailRef.current(`none of the ${sources.length} images in the set loaded`);
        return;
      }
      if (gone.length > 0) setMissing(gone);
    });

    return () => {
      cancelled = true;
    };
  }, [frame.images]);

  const images = frame.images.filter((image) => !missing.includes(image.src));

  // The other route to an empty deck: the probe above found the files, but
  // every one of them failed when actually rendered. Rarer than a missing
  // drop, and it has to be reported the same way — an empty bordered box on
  // the Wall is the one outcome the guardrails exist to prevent.
  useEffect(() => {
    if (frame.images.length > 0 && images.length === 0) {
      onFailRef.current("every image in the set failed to render");
    }
  }, [frame.images.length, images.length]);

  if (images.length === 0) return null;

  // Dropping a missing slide can leave `index` past the end of the set.
  const page = index % images.length;
  const current = images[page];
  const step = (delta: number) =>
    setIndex((i) => ((i % images.length) + images.length + delta) % images.length);
  const multi = images.length > 1;

  return (
    <div className="absolute inset-0 h-full w-full">
      <TileImage
        src={current.src}
        alt={current.alt}
        onLoadError={() => setMissing((prev) => [...prev, current.src])}
      />
      <TileLabel title={frame.title} />

      {multi && (
        <>
          {/* The whole tile is the "next" control, under the chevrons. A
              <button> rather than a click handler on the wrapper so it's
              reachable by keyboard; the chevrons are siblings, not children,
              because a button inside a button is invalid HTML. */}
          <button
            type="button"
            aria-label={`${frame.title} — next page`}
            onClick={() => step(1)}
            className="absolute inset-0 h-full w-full cursor-pointer"
          />
          <PageChevron side="left" title={frame.title} onClick={() => step(-1)} />
          <PageChevron side="right" title={frame.title} onClick={() => step(1)} />
          <div
            style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
            className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white/80"
          >
            {page + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

// One page-turn control. Quiet at rest and solid on hover — present enough
// to say "there are pages here" without turning every deck on the Wall into
// a carousel with visible machinery.
function PageChevron({
  side,
  title,
  onClick,
}: {
  side: "left" | "right";
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title} — ${side === "left" ? "previous" : "next"} page`}
      style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
      className={`absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 pb-0.5 text-2xl leading-none text-white/85 backdrop-blur-[2px] transition-all hover:bg-black/85 hover:text-white focus-visible:bg-black/85 focus-visible:text-white ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
