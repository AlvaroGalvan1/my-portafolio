"use client";

import { useEffect, useRef, useState } from "react";

// Company mark next to a job title. Renders nothing until the file exists —
// same "never show what isn't there" rule the gallery follows, so a missing
// logo costs nothing visually.
export default function OrgLogo({ src, alt }: { src: string; alt: string }) {
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

  if (failed) return null;

  // Plain <img>: these are small brand marks of unknown intrinsic size, and
  // next/image wants explicit dimensions or a fill container for each.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className="h-6 w-auto max-w-[7rem] object-contain"
    />
  );
}
