"use client";

import { useState } from "react";
import Image from "next/image";

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
// sets `group` so this can key off `group-hover`. An optional `@handle`
// byline sits alongside it, linking to whoever the work belongs to.
export function TileLabel({
  title,
  source,
}: {
  title: string;
  source?: { handle: string; href: string };
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent p-3 text-left text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
      <span>{title}</span>
      {source && (
        <a
          href={source.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto shrink-0 text-xs font-medium text-white/60 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
        >
          @{source.handle}
        </a>
      )}
    </div>
  );
}
