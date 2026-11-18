"use client";

import { useEffect, useRef, useState } from "react";

/** A live page, shrunk into a tile: four times the tile's size, drawn at a
 *  quarter, because the app lays out as desktop. It cannot be clicked, so the
 *  whole tile stays one link.
 *
 *  Each preview is a whole web app (a map, its tiles, its scripts), so it is
 *  only started once most of its tile is actually on screen. `loading="lazy"`
 *  starts much earlier than that: on a phone, where these tiles sit in a
 *  sideways row, it loaded both apps as soon as the row came near, even
 *  though only the first tile was visible, and the page stuttered while they
 *  started. Until then the tile shows a quiet "Live" placeholder. */
export default function LivePreview({ src, title, label }: { src: string; title: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute inset-0">
      <span className="absolute inset-0 grid place-items-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-maroon/40">
        {label}
      </span>
      {on && (
        <iframe
          src={src}
          title={title}
          tabIndex={-1}
          sandbox="allow-scripts allow-same-origin"
          className="pointer-events-none absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-25 border-0"
        />
      )}
    </div>
  );
}
