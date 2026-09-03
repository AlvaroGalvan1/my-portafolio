"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Z } from "@/lib/layers";

export type LightboxContent =
  | { kind: "image"; src: string; alt: string; caption?: string; credit?: string }
  | { kind: "video"; src: string; title: string; credit?: string }
  | { kind: "youtube"; videoId: string; title: string; credit?: string }
  | {
      kind: "post";
      src: string;
      alt: string;
      title: string;
      body: string[];
      bodyLang?: string;
      href: string;
      linkLabel?: string;
      credit?: string;
    };

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
        className={`flex max-h-full w-full flex-col items-center gap-3 ${
          content.kind === "post" ? "max-w-5xl" : "max-w-4xl"
        }`}
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

        {/* Photo and words side by side on a desktop, stacked on a phone.
            The text column scrolls on its own rather than the whole
            overlay, so the photo stays put while you read past it. */}
        {content.kind === "post" && (
          <div className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-lg bg-neutral-950 md:flex-row">
            <div className="flex shrink-0 items-center justify-center bg-black md:w-1/2">
              <Image
                src={content.src}
                alt={content.alt}
                width={1600}
                height={1200}
                sizes="(min-width: 768px) 45vw, 90vw"
                className="max-h-[38vh] w-full object-contain md:max-h-[85vh]"
              />
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto p-6 sm:p-8 md:w-1/2">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-white">
                {content.title}
              </h3>
              {/* `lang` on the prose, not the tile: the title is set in the
                  page's language, the body isn't. */}
              <div lang={content.bodyLang} className="flex flex-col gap-3">
                {content.body.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-white/75">
                    {paragraph}
                  </p>
                ))}
              </div>
              <a
                href={content.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 self-start border-2 border-white/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950"
              >
                {content.linkLabel ?? "Read the original ↗"}
              </a>
            </div>
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
