"use client";

import { useEffect, useRef } from "react";

// The loop behind the hero's name.
//
// Deliberately not the Wall's ScrollVideo: that starts and stops a tile on
// an IntersectionObserver, and this sits at the very top of the page, on
// screen the moment anyone arrives. There is nothing to observe.
//
// What does need code is `prefers-reduced-motion`. A full-bleed 22-second
// loop is by far the largest motion surface on this site, and the site
// already honours that setting for smooth scrolling and the Wall's hint
// arrow — ignoring it for the one unavoidable, above-the-fold animation
// would be the wrong place to start. Hence no `autoPlay` attribute: the
// effect decides. Starting it in markup and pausing on hydration would
// show a reduced-motion visitor the exact flash of movement they asked
// not to see. The still first frame loses nothing — the piece is a print.
export default function HeroBackdrop({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (query.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        // Rejects when the browser blocks autoplay outright; the poster
        // frame is a perfectly good fallback, so there's nothing to do.
        video.play().catch(() => {});
      }
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      // Above the fold, so it's worth fetching properly rather than the
      // `metadata` the Wall's tiles use — those are further down the page.
      preload="auto"
      // Decoration. It carries no information the name and the heading
      // don't already give, so it should not appear in the a11y tree at
      // all; the visible credit line beside it is the part that matters.
      aria-hidden
      tabIndex={-1}
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  );
}
