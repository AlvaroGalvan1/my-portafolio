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

// Faster than it was shot. The loop is a twenty-two second capture of a
// textile piece and at 1x it drifts, which behind a name reads as a video
// someone forgot to pause. At 2x the movement registers as the surface
// being alive without ever becoming the thing you are watching.
//
// Set on the element rather than baked into the file: it is one number to
// change, it costs no bytes, and the source stays the artist's own cut.
const PLAYBACK_RATE = 2;

export default function HeroBackdrop({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Applied on every load as well as on mount: several browsers reset
    // playbackRate to 1 when the source is (re)loaded, so setting it once
    // at mount silently stops working the moment that happens.
    const applyRate = () => {
      video.playbackRate = PLAYBACK_RATE;
    };
    applyRate();
    video.addEventListener("loadedmetadata", applyRate);

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
    return () => {
      query.removeEventListener("change", apply);
      video.removeEventListener("loadedmetadata", applyRate);
    };
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
