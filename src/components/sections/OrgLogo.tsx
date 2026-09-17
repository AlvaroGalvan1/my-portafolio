"use client";

import { useEffect, useRef, useState } from "react";

// Company mark. Renders nothing until the file exists — same "never show
// what isn't there" rule the gallery follows, so a missing logo costs
// nothing visually.
//
// `fallback` is for the one place where nothing is the wrong answer: the
// "Worked with" banner, where the organisation has to be named whether or
// not its mark has been dropped in. Callers that only ever wanted a mark
// (the Experience rows, which print the org name in their heading anyway)
// leave it off and get the old behaviour.
export default function OrgLogo({
  src,
  alt,
  fallback,
  className = "h-6 w-auto max-w-[7rem] object-contain",
}: {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  /** Sized by the caller, because a mark in a 16px row and a mark on a
   *  64px plate are the same component at very different scales. */
  className?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // A server-rendered <img> usually finishes (or 404s) before React
    // hydrates, so the JSX onError prop never fires — a loaded-but-zero-width
    // image is the tell that it already failed. Check that first, then
    // listen natively for anything still in flight.
    if (img.complete && img.naturalWidth === 0) {
      setFailed(true);
      return;
    }
    const onError = () => setFailed(true);
    img.addEventListener("error", onError);
    return () => img.removeEventListener("error", onError);
  }, [src]);

  if (failed) return <>{fallback ?? null}</>;

  // Plain <img>: these are small brand marks of unknown intrinsic size, and
  // next/image wants explicit dimensions or a fill container for each.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
    />
  );
}
