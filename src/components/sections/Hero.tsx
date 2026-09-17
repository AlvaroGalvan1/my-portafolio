import Image from "next/image";
import HeroBackdrop from "./HeroBackdrop";
import { creditLine } from "@/components/gallery/credit";
import { profile } from "@/content/profile";
import { socials, CONTACT_EMAIL } from "@/content/socials";
import { Z } from "@/lib/layers";

// An editorial split: the words on the left half, the moving artwork on the
// right, and the portrait straddling the seam between them.
//
// This replaced a card that opened as you scrolled — two screens of pinned
// track, a scroll-progress custom property, and a measuring pass that read
// the name's width and the revealed content's height on mount, on resize
// and again once the display face had loaded. It looked good and it cost
// most of a component to say one sentence. Worse, it withheld that sentence
// until someone scrolled: the bio, the only line that explains who this is,
// was clipped to nothing at the top of the page, which is the one moment
// the page has everyone's attention. The split says it all at once.
//
// What went with it: `.hero-track`, `.hero-stage`, `.hero-card`, `--p`,
// `--closed-w`, `--extra-h`, the reduced-motion fallback that un-pinned the
// whole thing on phones, and the print overrides that flattened it back
// again. The layout below is a two-column grid; there is nothing to
// measure and nothing to un-pin.
export default function Hero() {
  // Null for `relation: "mine"` — work that shouldn't carry a byline. The
  // plate hides entirely in that case rather than rendering "Backdrop —"
  // with nothing after it.
  const backdropCredit = creditLine(profile.heroBackdrop.credit);
  const [lede] = profile.bio;
  const { availability } = profile;

  return (
    <section
      id="home"
      className="hero-split grid lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-2"
    >
      {/* ── The words ───────────────────────────────────────────────────
          Cream: the page's own paper stock, and the warm neutral this half
          needs. Every other field on the site is saturated — orange, brick,
          yellow — and type at this size wants the quiet one. Maroon on
          cream is 6.13:1, so the bio underneath the name is comfortable
          rather than merely legal. */}
      <div className="hero-words flex flex-col justify-center gap-6 bg-brand-cream px-6 py-16 sm:px-16 lg:py-24">
        {/* The status pill. First thing in the column and the smallest — a
            line of live information above a name reads as a dateline, which
            is exactly the register an editorial layout wants. */}
        <p className="flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-brand-maroon">
          <span
            className={availability.open ? "location-dot" : "location-dot location-dot--static location-dot--closed"}
            aria-hidden
          />
          {availability.open ? availability.label : availability.closedLabel}
          <span className="font-normal text-brand-maroon/60">
            · {availability.detail}
          </span>
        </p>

        {/* Maroon letters with the red offset shadow — the sign-painted
            treatment in its original colours. Over the yellow card this had
            to flip to a cream shadow, because maroon under maroon is a
            smudge; on cream the red comes back. */}
        <h1 className="text-signpainted font-[family-name:var(--font-display)] text-[clamp(2.75rem,12vw,3.5rem)] leading-[0.92] text-brand-maroon sm:text-[clamp(3rem,7.4vw,6.5rem)]">
          {profile.nameLines.map((line) => (
            <span key={line} className="block sm:whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>

        <p className="font-sans text-sm font-semibold uppercase tracking-[0.3em] text-brand-maroon/80">
          {profile.location.label}
        </p>

        {lede && (
          <p className="max-w-[42ch] font-sans text-lg leading-snug text-brand-maroon sm:text-xl">
            {lede}
          </p>
        )}

        {/* One action, not four. The bar above this carries "Work with me"
            on every screen of the page, so the hire path is permanent and
            doesn't need restating here; what the top of a portfolio owes a
            first-time reader is the way INTO the evidence. The status line
            above is the secondary — it answers "is he even taking work"
            without spending a second button on the question. */}
        {/* Screen only: "Explore my work" is an instruction to scroll, and
            on paper the work is already three pages further down. */}
        <div className="print:hidden">
          <a
            href="#wall"
            className="inline-block border-2 border-brand-maroon bg-brand-maroon px-7 py-3.5 font-sans font-semibold text-brand-cream hover:bg-transparent hover:text-brand-maroon"
          >
            Explore my work
          </a>
        </div>

        {/* Paper only. On screen the contact routes are the bar's button and
            the footer's marks, both of which are things you click; a printed
            page has to spell them out or it is a CV nobody can answer. */}
        <p className="hidden font-sans text-sm text-brand-maroon print:block">
          {CONTACT_EMAIL}
          {socials.map((social) => (
            <span key={social.name}> · {social.href.replace(/^https?:\/\//, "")}</span>
          ))}
        </p>
      </div>

      {/* ── The artwork ─────────────────────────────────────────────────
          The Coral loop, taking the right half. On a phone it becomes a
          band under the words rather than a background behind them: the
          piece has its own detail and its own movement, and type over it
          needed a scrim that made both worse. */}
      <div className="hero-art relative min-h-[55svh] bg-brand-orange lg:min-h-0">
        <HeroBackdrop src={profile.heroBackdrop.src} />

        {/* The portrait, straddling the seam. Pulled left across the column
            boundary at `lg` so the photograph belongs to neither half,
            which is the whole move of an editorial split — the two panels
            read as one spread rather than two boxes side by side. */}
        <figure
          className="hero-plate absolute bottom-6 left-6 w-[38vw] max-w-[13rem] sm:bottom-10 sm:left-10 lg:-left-16 lg:bottom-16 lg:w-[16rem] lg:max-w-none"
          style={{ zIndex: Z.CARD_CONTENT }}
        >
          <div className="border-4 border-brand-red bg-white p-2.5">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={profile.photo.src}
                alt={profile.photo.alt}
                fill
                sizes="(min-width: 1024px) 16rem, 38vw"
                className="object-cover brightness-[1.16] saturate-[1.06]"
                priority
              />
            </div>
          </div>
        </figure>

        {/* The backdrop isn't mine, so it gets a name on it. Bottom-right
            and small — the treatment a print would get. */}
        {backdropCredit && (
          <p
            className="pointer-events-none absolute bottom-4 right-4 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-white/90 [text-shadow:0_1px_3px_rgb(122_23_16_/_0.9)] print:hidden sm:right-6"
            style={{ zIndex: Z.CARD_CONTENT }}
          >
            Backdrop — {backdropCredit}
          </p>
        )}
      </div>
    </section>
  );
}
