"use client";

import { useState } from "react";
import Image from "next/image";
import { creditLine, type Credit } from "../credit";
import { Z } from "@/lib/layers";

// Renders nothing on a 404/load error instead of a broken-image icon or a
// placeholder box — callers that need the whole tile to disappear when this
// is their only content should pass `onLoadError` and call the frame's
// `onFail` from it (see ImageFrame/ImageSetFrame). Callers where the image
// is optional decoration (LinkFrame's thumbnail) can leave it out — it just
// quietly falls back to no image.
export function TileImage({
  src,
  alt,
  onLoadError,
}: {
  src: string;
  alt: string;
  onLoadError?: () => void;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="40vw"
      className="object-cover"
      onError={() => {
        setFailed(true);
        onLoadError?.();
      }}
    />
  );
}

// Title label revealed on hover — the frame wrapper in HorizontalGallery
// sets `group` so this can key off `group-hover`. Hover-only is fine for a
// title (it repeats what the image already shows); it was never fine for a
// credit, which is why attribution moved to TileCredit below.
export function TileLabel({ title }: { title: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent p-3 text-left text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
      <span>{title}</span>
    </div>
  );
}

// The byline, always on — not hover-revealed. Hover-only attribution is
// simply absent on a phone, which is where most of this gets read, so the
// credit sits permanently in the tile's top-left corner. Small and quiet,
// but present.
//
// Top-left rather than bottom: TileLabel's hover bar owns the bottom edge,
// and ImageSetFrame's counter owns the bottom-right.
//
// Rendered by FrameCell for every frame kind, so an individual frame can't
// omit it. That also keeps this <a> from landing inside frames that wrap
// themselves in a <button>.
//
// CARD_OVERLAY_CONTROL, not CARD_CONTENT: this is pinned over a tile's
// media, and on the LANDFIRE tile that media is a Leaflet map whose own
// panes reach ~700. At any lower layer the map draws straight over the
// credit and it vanishes — which is the whole failure this is meant to fix.
export function TileCredit({ credit }: { credit?: Credit }) {
  if (!credit) return null;
  const line = creditLine(credit);
  // `mine` states authorship in the data without putting a byline on my
  // own work. On a device with hover the credit waits for the pointer or
  // focus, so the Wall reads as pictures first; on touch it stays up,
  // since there is no hover to reveal it.
  if (!line) return null;

  const base =
    "pointer-events-none absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded bg-black/55 px-1.5 py-0.5 text-[11px] font-medium leading-tight text-white/85 backdrop-blur-[2px] transition-opacity duration-200 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100";
  const layer = { zIndex: Z.CARD_OVERLAY_CONTROL };

  if (!credit.href) return <span style={layer} className={base}>{line}</span>;

  return (
    <a
      href={credit.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={layer}
      className={`${base} pointer-events-auto underline decoration-white/30 underline-offset-2 transition-colors hover:bg-black/75 hover:text-white hover:decoration-white`}
    >
      {line}
    </a>
  );
}
