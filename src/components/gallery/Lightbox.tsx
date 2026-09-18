"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Z } from "@/lib/layers";
import { useDialog } from "@/lib/useDialog";
import { creditLine, type Credit } from "./credit";
import type { Locale } from "@/content/i18n";

export type LightboxContent =
  | { kind: "image"; src: string; alt: string; caption?: string; credit?: Credit }
  | { kind: "video"; src: string; title: string; credit?: Credit }
  | { kind: "youtube"; videoId: string; title: string; credit?: Credit }
  | {
      kind: "post";
      /** One or more images. A written post usually has one photo; a map
       *  series has several sheets that belong to the same piece of writing,
       *  so the pane flips between them rather than the Wall carrying a tile
       *  per sheet. */
      images: { src: string; alt: string }[];
      title: string;
      body: string[];
      bodyLang?: string;
      /** Where the post lives, if it's somewhere public. Optional: a piece
       *  can carry its own words here without there being an original to
       *  link out to. */
      href?: string;
      linkLabel?: string;
      credit?: Credit;
    };

export default function Lightbox({
  content,
  onClose,
  locale,
  readOriginal,
}: {
  content: LightboxContent | null;
  onClose: () => void;
  locale: Locale;
  /** The fallback label on the "out to the original" link, for pieces that
   *  don't carry one of their own. */
  readOriginal: string;
}) {
  // Escape, focus in and back out, Tab containment and the scroll lock all
  // come from here — see lib/useDialog.ts. Called before the early return
  // below, as every hook has to be.
  const dialogRef = useDialog(Boolean(content), onClose);

  if (!content) return null;

  const caption = content.kind === "image" ? content.caption : undefined;
  const credit = content.credit;

  // Portalled to <body>, so no transform or stacking context on the Wall
  // can ever pin a fixed overlay to the section instead of the screen.
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel(content)}
      tabIndex={-1}
      style={{ zIndex: Z.MODAL }}
      // The dialog and the backdrop are the same element here: the close
      // button sits outside the content column, in the overlay's own corner,
      // so a dialog wrapped tightly around the content would leave the one
      // control that dismisses it outside the dialog.
      //
      // `overlay-dark` is the hook globals.css uses to flip the focus ring
      // to yellow: this sits on near-black, where the page's default maroon
      // ring is invisible. The lightbox is portalled to the document root
      // rather than rendered inside a section, so it can't inherit that
      // from one.
      className="overlay-dark fixed inset-0 flex items-center justify-center bg-black/85 px-4 py-10 focus:outline-none"
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
            className="max-h-[80svh] w-full rounded-lg"
          >
            <track kind="captions" />
          </video>
        )}

        {/* The player is only mounted once the tile is clicked — the Wall's
            thumbnails are static images until then (see YouTubeFrame).
            `-nocookie` is YouTube's no-tracking-until-play host, and `rel=0`
            keeps the end screen's suggestions to this channel. */}
        {content.kind === "youtube" && (
          <div className="aspect-video max-h-[80svh] w-full">
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
          <div className="flex max-h-[85svh] w-full flex-col overflow-hidden rounded-lg bg-neutral-950 md:flex-row">
            <PostImages images={content.images} />
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
              {content.href && (
                <a
                  href={content.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 self-start border-2 border-white/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-neutral-950"
                >
                  {content.linkLabel ?? readOriginal}
                </a>
              )}
            </div>
          </div>
        )}

        {(caption || (credit && creditLine(credit, locale))) && (
          <div className="w-full text-center text-sm text-white/80">
            {caption && <p>{caption}</p>}
            {credit && <LightboxCredit credit={credit} locale={locale} />}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

// What a screen reader announces when the overlay opens. Each kind already
// carries the words for it — an image its alt text, everything else its
// title — so there is nothing to write per piece in data.ts.
function dialogLabel(content: LightboxContent) {
  return content.kind === "image" ? content.alt : content.title;
}

// The photo half of a post. One image is the common case and renders as it
// always did; several turn the pane into a set you flip through, with the
// thumbnails under the image rather than arrows over it — a map series is
// read by comparing sheets, which needs them all visible at once.
function PostImages({ images }: { images: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  const current = images[Math.min(index, images.length - 1)];

  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-3 bg-black p-2 md:w-1/2">
      <Image
        key={current.src}
        src={current.src}
        alt={current.alt}
        width={1600}
        height={1200}
        sizes="(min-width: 768px) 45vw, 90vw"
        className="max-h-[38svh] w-full object-contain md:max-h-[75svh]"
      />
      {images.length > 1 && (
        <div className="flex w-full flex-wrap items-center justify-center gap-2 pb-1">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={image.alt}
              aria-current={i === index}
              className={`relative h-12 w-16 overflow-hidden border-2 transition-colors ${
                i === index ? "border-white" : "border-white/25 hover:border-white/60"
              }`}
            >
              <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// The full version of the tile byline: the same line, plus where it
// appeared, and linked if there's anywhere to link to.
function LightboxCredit({ credit, locale }: { credit: Credit; locale: Locale }) {
  const line = creditLine(credit, locale);
  if (!line) return null;

  return (
    <p className="mt-1 text-white/50">
      {credit.href ? (
        <a
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-white/25 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
        >
          {line}
        </a>
      ) : (
        line
      )}
      {credit.context && <span className="text-white/35"> — {credit.context}</span>}
    </p>
  );
}

function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-[50svh] w-full items-center justify-center rounded-lg bg-neutral-950 text-white/40">
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
      className="max-h-[80svh] w-full rounded-lg object-contain"
      onError={() => setFailed(true)}
    />
  );
}
