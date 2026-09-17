"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { profile } from "@/content/profile";
import { socials, CONTACT_EMAIL } from "@/content/socials";

// The card that opens as you scroll. See the `.hero-card` block in
// globals.css for the half of this that animates — everything here is
// measurement, written out as two custom properties:
//
//   --p         0 → 1, how far through the scroll track we are
//   --extra-h   the natural height of the content being revealed
//   --closed-w  the width the card holds before any of that starts
//
// Nothing in this component re-renders on scroll. Writing to a custom
// property on one element is a style mutation, not a React update, so the
// whole effect costs one rAF-throttled read of getBoundingClientRect.
export default function HeroCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const extraRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  // The revealed content's height, measured rather than guessed. A fixed
  // max-height would either clip the bio on a narrow screen (where it wraps
  // to more lines) or, if set generously, finish the reveal early and leave
  // the last stretch of scrolling doing nothing.
  //
  // It has to be measured at the width the card ENDS at, not the one it
  // starts at. Measuring it closed gave 706px, because at 320px wide the
  // bio wraps to twice the lines it needs; the content is 307px once the
  // card is open. Clipping to 706 meant the reveal was complete at 44% and
  // the rest of the scroll moved nothing — the exact failure this measuring
  // was meant to avoid. So: force the card open, read, put it back. No
  // paint happens in between, and this runs on mount and resize rather than
  // per frame.
  useEffect(() => {
    const card = cardRef.current;
    const extra = extraRef.current;
    if (!card || !extra) return;

    const measure = () => {
      const held = card.style.getPropertyValue("--p");
      card.style.setProperty("--p", "1");
      extra.style.maxHeight = "none";

      const height = extra.scrollHeight;

      // And the width the card holds closed, which is the name's width plus
      // the card's own padding — for the same reason the height is measured
      // rather than fixed. The name is set in vw and doesn't wrap above
      // `sm`, so it outgrows any constant: 20rem fits it at 640px and leaves
      // roughly 100px of it hanging off the plate by 1440px.
      //
      // The h1 can't be read as it sits. A block stretches to its container,
      // so `getBoundingClientRect` on it returns the card's width, not the
      // letters' — and here the card has just been forced open, so that
      // would be the full column. `max-content` asks for the width the
      // widest line actually wants, which is the number this needs.
      // Only once the display face is in. Measured against the fallback
      // metric this comes out a different width, and writing it would give
      // the card a visible resize on load — the CSS estimate below is
      // already right for Bungee, so leaving it alone until the real face
      // lands means the card is only ever sized once.
      const name = document.fonts?.status === "loaded" ? nameRef.current : null;
      let closed = 0;
      if (name) {
        name.style.width = "max-content";
        closed = name.getBoundingClientRect().width;
        name.style.width = "";
        const pad = getComputedStyle(card);
        closed += parseFloat(pad.paddingLeft) + parseFloat(pad.paddingRight);
      }

      extra.style.maxHeight = "";
      if (held) card.style.setProperty("--p", held);
      else card.style.removeProperty("--p");
      card.style.setProperty("--extra-h", `${height}px`);
      if (closed > 0) card.style.setProperty("--closed-w", `${Math.ceil(closed)}px`);
    };

    measure();
    // The display face loads after first paint and it sets the name's own
    // size, so the first pass is taken against a fallback metric — which is
    // why the width above waits for this second one.
    document.fonts?.ready.then(measure).catch(() => {});

    // Deliberately window resize and not a ResizeObserver on the card: the
    // card's own size is driven by --p, so observing it would re-enter this
    // every frame of the scroll.
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const track = card.closest<HTMLElement>("[data-hero-track]");
    if (!track) return;

    // The same query as the fallback block in globals.css, which un-sticks
    // the stage and leaves the card open: a phone, where the open card is
    // taller than the screen, or a stated preference for less motion. When
    // it matches there is no effect to drive, so the scroll handler comes
    // off entirely rather than computing a value the CSS then overrides.
    const fallback = window.matchMedia("(max-width: 639px), (prefers-reduced-motion: reduce)");

    let frame = 0;
    const update = () => {
      frame = 0;
      // How far the track has travelled past the top of the viewport, over
      // the distance it can travel before its last screen is in view.
      //
      // Measured off the track's own rect rather than window.scrollY: the
      // nav is `sticky top-0` and still takes its ~68px of flow above this
      // section, so scroll position and track progress are offset by the
      // height of the bar.
      const range = track.offsetHeight - window.innerHeight;
      const p = range <= 0 ? 1 : Math.min(1, Math.max(0, -track.getBoundingClientRect().top / range));
      card.style.setProperty("--p", p.toFixed(4));
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    const attach = () => {
      if (fallback.matches) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (frame !== 0) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
        card.style.setProperty("--p", "1");
        return;
      }
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    };

    attach();
    fallback.addEventListener("change", attach);
    return () => {
      fallback.removeEventListener("change", attach);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  const [lede] = profile.bio;

  return (
    // Bottom-aligned inside the sticky screen, with the page's own gutters.
    // `100%` in the card's width calc resolves against this box, so the
    // card opens to the text column and never to the bleeding edge.
    <div className="hero-card-slot pointer-events-none px-6 pb-6 sm:px-16 sm:pb-16">
      <div
        ref={cardRef}
        className="hero-card pointer-events-auto bg-brand-yellow p-6 sm:p-10"
      >
        {/* Maroon, not the white this was over the video: white on yellow is
            1.54:1, which is no text at all. Maroon is 6.98:1. The offset
            shadow stays — it's the one piece of the sign-painted treatment
            worth keeping in here — but flips to cream, since a maroon
            shadow under maroon letters is just a smudge. */}
        <h1
          ref={nameRef}
          className="text-signpainted font-[family-name:var(--font-display)] text-[clamp(2rem,10.5vw,2.75rem)] leading-[0.95] text-brand-maroon sm:text-[clamp(1rem,5.2vw,5.5rem)]"
          style={{ ["--shadow-color" as string]: "var(--color-brand-cream)" }}
        >
          {profile.nameLines.map((line) => (
            <span key={line} className="block sm:whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>

        <div ref={extraRef} className="hero-card-extra">
          {/* Everything below the name. Laid out at full size always — the
              clip above is what hides it — so the measured height is
              correct before the first scroll. */}
          <p className="mt-6 inline-flex items-center gap-3 font-sans text-sm font-semibold uppercase tracking-[0.3em] text-brand-maroon">
            <span className="location-dot" aria-hidden />
            {profile.location.label}
          </p>

          {/* `items-stretch`, so the print ends exactly where the buttons
              do. Top-aligned, the frame ran ~25px short of the text column
              and read as almost-aligned, which is worse than either edge
              being deliberate. */}
          {/* Paper only. On screen this is the Contact button and the
              footer's three marks, both of which are things you click; a
              printed page has to spell them out or it is a CV nobody can
              answer. */}
          <p className="mt-3 hidden font-sans text-sm text-brand-maroon print:block">
            {CONTACT_EMAIL}
            {socials.map((social) => (
              <span key={social.name}> · {social.href.replace(/^https?:\/\//, "")}</span>
            ))}
          </p>

          <div className="hero-columns mt-8 flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
            <div className="flex-1">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand-maroon">
                About
              </h2>
              <div aria-hidden className="mt-4 h-1 w-24 bg-brand-red" />
              {lede && (
                <p className="mt-6 max-w-[38ch] font-sans text-lg leading-snug text-brand-maroon sm:text-xl">
                  {lede}
                </p>
              )}

              {/* Stacked full-width on a phone: side by side, the two labels
                  are different lengths and wrap at 375px, which left them
                  ragged. */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                {/* Both buttons here now start something; neither hands
                    over a file. A download is the end of a visit — the
                    reader leaves with a PDF and reads it somewhere else, if
                    at all — and putting it in the first screenful spends
                    the most valuable click on the page on an exit.

                    So the CV moved to About, where someone actually goes
                    looking for a CV, in both forms (the printed page and
                    the PDF). What's left here is the two ways to begin: the
                    loud one goes to Work with me, where the booking link
                    and the brief form are; the quiet one opens the contact
                    form on the spot, for anyone not ready to book a call
                    with a stranger. */}
                <a
                  href="#work"
                  className="border-2 border-brand-maroon bg-brand-maroon px-6 py-3 text-center font-sans font-semibold text-brand-cream hover:bg-transparent hover:text-brand-maroon sm:w-auto"
                >
                  Let&apos;s work together
                </a>
                <ContactTrigger className="border-2 border-brand-maroon bg-white px-6 py-3 text-center font-sans font-semibold text-brand-maroon hover:bg-transparent hover:border-brand-maroon sm:w-auto">
                  Contact me
                </ContactTrigger>
              </div>
            </div>

            {/* The photo, in a white mount with a red edge — a print on the
                card rather than an image bleeding to its corner.

                3:4 is the file's own ratio (960×1280), so `object-cover`
                crops nothing; it's the shape of the frame that changed to
                match the photo rather than the other way round. The mount
                is `relative` because `fill` measures against it, and the
                aspect box is what gives that element a height.

                It grows at `lg` rather than at `md`: between 768 and 1023px
                the card is only as wide as the screen allows, and a 16rem
                print there squeezes the bio into a 264px column.

                `sizes` is the width this actually renders at, not a guess.
                Get it wrong and Next serves a 1280px-wide source for a
                256px frame. */}
            <div className="hero-portrait shrink-0 md:w-[13rem] lg:w-[16rem]">
              <div className="h-full border-4 border-brand-red bg-white p-2.5">
                {/* The photo's own 3:4 on a phone, where it's the last thing
                    on the card and nothing is beside it to agree with. From
                    `md` up the row is what sets the height and the frame
                    fills it; the crop that costs is a few percent, because
                    the column lands near 3:4 on its own.

                    Brightened: it's an indoor shot at an exposure that read
                    as a grey rectangle against this much yellow. */}
                <div className="relative aspect-[3/4] w-full md:aspect-auto md:h-full">
                  <Image
                    src={profile.photo.src}
                    alt={profile.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 16rem, (min-width: 768px) 13rem, 100vw"
                    className="object-cover brightness-[1.16] saturate-[1.06]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
