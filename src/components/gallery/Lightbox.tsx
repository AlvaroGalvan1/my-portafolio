"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Z } from "@/lib/layers";

export type LightboxContent =
  | { kind: "image"; src: string; alt: string; caption?: string; credit?: string }
  | { kind: "video"; src: string; title: string; credit?: string }
  | { kind: "youtube"; videoId: string; title: string; credit?: string };

export default function Lightbox({
  content,
  onClose,
}: {
  content: LightboxContent | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!content) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [content, onClose]);

  if (!content) return null;

  const caption = content.kind === "image" ? content.caption : undefined;
  const credit = content.credit;

  return (
    <div
      style={{ zIndex: Z.MODAL }}
      className="fixed inset-0 flex items-center justify-center bg-black/85 px-4 py-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 text-3xl font-bold text-white"
      >
        &times;
      </button>

      <div
        className="flex max-h-full w-full max-w-4xl flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {content.kind === "image" && (
          <LightboxImage
            key={content.src}
            src={content.src}
            alt={content.alt}
          />
        )}

        {content.kind === "video" && (
          <video
            src={content.src}
            controls
            autoPlay
            playsInline
            className="max-h-[80vh] w-full rounded-lg"
          >
            <track kind="captions" />
          </video>
        )}

        {/* The player is only mounted once the tile is clicked — the Wall's
            thumbnails are static images until then (see YouTubeFrame).
            `-nocookie` is YouTube's no-tracking-until-play host, and `rel=0`
            keeps the end screen's suggestions to this channel. */}
        {content.kind === "youtube" && (
          <div className="aspect-video max-h-[80vh] w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${content.videoId}?autoplay=1&rel=0`}
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full rounded-lg border-0"
            />
          </div>
        )}

        {(caption || credit) && (
          <div className="w-full text-center text-sm text-white/80">
            {caption && <p>{caption}</p>}
            {credit && <p className="mt-1 text-white/50">{credit}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center rounded-lg bg-neutral-950 text-white/40">
        {alt}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={1200}
      sizes="90vw"
      className="max-h-[80vh] w-full rounded-lg object-contain"
      onError={() => setFailed(true)}
    />
  );
}
