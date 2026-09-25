import HeroArt from "./HeroArt";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { creditLine } from "@/components/gallery/credit";
import { profile } from "@/content/profile";
import { socials, CONTACT_EMAIL } from "@/content/socials";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// An editorial split, and the two halves are two subjects: me on the left,
// you on the right. The words and the bio stand in the cream column; the
// Coral loop takes the other, with a live plate on it about wherever the
// reader happens to be standing. A hard maroon seam between them.
//
// ── One screen, exactly ───────────────────────────────────────────────
// The section is `h-[calc(100svh-var(--nav-h))]`, not `min-h-`. That is a
// real constraint and it is the reason the type below is sized in `vh` as
// well as `vw`: a hero that is 100svh tall and 110svh full of words is a
// hero with a scrollbar inside it, which is worse than one that was simply
// allowed to grow. Everything in the left column has a ceiling derived
// from the viewport height, so the whole column shrinks together on a short
// laptop instead of the last line falling off the bottom.
//
// Adding anything here means taking something out. That is the point.
//
// ── What came out, and why ────────────────────────────────────────────
// The portrait went first: a photograph floating across the seam gave the
// eye a third thing to land on in a composition that only works if it has
// two. The availability pill went with it. "Welcome to my portfolio." went
// last — a reader looking at a name set eight inches tall does not need to
// be told they have arrived at a portfolio, and the line cost a whole beat
// of the one screen this section gets.
export default async function Hero() {
  const locale = await currentLocale();
  const ui = UI[locale];

  // Null for `relation: "mine"` — work that shouldn't carry a byline. The
  // plate hides entirely in that case rather than rendering "Backdrop —"
  // with nothing after it.
  const backdropCredit = creditLine(profile.heroBackdrop.credit, locale);

  return (
    // Two rows on a phone, two columns from `lg`. The artwork is a fixed
    // band underneath the words on a phone rather than a field behind
    // them: the piece has its own detail and its own movement, and type
    // over it needed a scrim that made both worse.
    //
    // 26svh for that band, and the number is measured rather than chosen.
    // The words have to fit in what is left of one screen at every size
    // this layout covers, in BOTH languages — Spanish runs longer, and a
    // 768x844 tablet is the worst case of all because the columns have not
    // split yet and the bio is showing. 34svh clipped by 32px there, 30 by
    // 14, 28 by 6. 26 clips nothing anywhere from 320x640 up. Raise it and
    // re-measure, or the hero starts eating its own last line again.
    //
    // The artwork gets the larger half, 44:56, and that is a reversal: the
    // words had the extra tenth for several passes on the argument that the
    // name needed room to be the largest thing on the page. It does not —
    // the name is sized by viewport HEIGHT on any screen this layout
    // applies to (see the clamp below), so giving the column more width
    // bought the type nothing and spent it on empty cream.
    //
    // What the artwork does with the same pixels is show more of the Coral
    // loop, which is the only moving thing in the hero. The words still
    // have a comfortable measure; the video is no longer a strip.
    <section
      id="home"
      className="hero-split grid h-[calc(100svh-var(--nav-h))] border-b-4 border-brand-maroon grid-rows-[minmax(0,1fr)_26svh] overflow-hidden lg:grid-cols-[0.88fr_1.12fr] lg:grid-rows-1"
    >
      {/* ── The words ───────────────────────────────────────────────────
          Cream: the page's own paper stock, and the warm neutral this half
          needs. Every other field on the site is saturated — orange, brick,
          yellow — and type at this size wants the quiet one. Maroon on
          cream is 6.13:1, so the bio under the name is comfortable rather
          than merely legal.

          `min-h-0` is load-bearing on a grid child: without it the column
          refuses to shrink below its content and the row blows past the
          100svh the section was given. */}
      <div className="hero-words flex min-h-0 flex-col justify-center bg-brand-cream px-6 py-8 sm:px-16 lg:py-12">
        {/* ── The name ──────────────────────────────────────────────────
            The whole left half, and sized like it. `clamp` takes the
            smaller of a width-derived and a height-derived figure, so the
            name fills the column on a wide screen and gets out of the way
            on a short one — which is what keeps the 100svh promise above.

            `leading-[1.02]` is measured, not chosen. Bungee draws the
            acute on Á reaching 0.965em above the baseline (read straight
            off the TTF: unitsPerEm 1000, yMax 965, against a cap height of
            720). Stacked at the 0.9 this used to run at, GALVÁN's accent
            was driven 0.065em INTO ÁLVARO's baseline — the two á's visibly
            colliding — and the drop shadow pushed it further. Anything
            below ~1.0 brings that back. If the name ever loses its
            accents, this can tighten; while it has them, it cannot.

            The two terms inside `min()` are two different ceilings and
            both are real: `13.5vw` stops ÁLVARO running out of the column
            on a phone, `13vh` stops the name eating the screen the rest of
            the hero has to share. Which one binds depends on the shape of
            the viewport — width on a phone, height on a laptop — and that
            is exactly the behaviour a one-screen hero needs.

            The shadow is in `em` for the same reason (see
            .text-signpainted-display in globals.css): at fixed pixels it
            was a heavy slab under a 44px phone name and a hairline under a
            104px desktop one. */}
        <h1 className="text-signpainted-display font-[family-name:var(--font-display)] text-[clamp(2.6rem,min(13.5vw,13vh),8rem)] leading-[1.02] tracking-[-0.015em] text-brand-maroon">
          {profile.nameLines.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>

        {/* The dateline, under the name it belongs to: tracked-out small
            caps against the display face. */}
        <p className="eyebrow mt-[clamp(0.6rem,1.8vh,1.1rem)] flex items-center gap-3 text-brand-maroon">
          <span className="location-dot" aria-hidden />
          {profile.location.label}
        </p>

        {/* The site's one repeated mark, at the stub width it has in every
            other section. It was run out to the full 46ch measure for one
            pass and that was the single change that tipped this hero from
            "sign painted" to "Swiss editorial": a rule the width of the
            column is a typographic device, where a short heavy stub is a
            mark — the same mark over Education, over Experience, over each
            service. Painted things repeat their marks. Keep it short. */}
        <div aria-hidden className="mt-[clamp(0.75rem,2.5vh,1.5rem)] h-1.5 w-24 shrink-0 bg-brand-red" />

        {/* ── The block that yields ────────────────────────────────────
            A hero promised to be exactly one screen tall has to decide
            what happens when the screen is too small for what is in it,
            and "clip it" is not a decision, it is what happens when nobody
            decides. Measured: a 390×844 phone holds all of this with room
            to spare; a 360×640 one overflows the column by 54px, which
            `overflow-hidden` was quietly eating — the name lost its top and
            the buttons lost their bottom.

            So this is the block that goes, and it is the right one: the
            name and the buttons are what the hero owes a
            stranger, and the pitch is the paragraph they read if they stay.
            It comes back on anything 700px tall, and on any screen wide
            enough for the two-column layout, where the words have a full
            column to themselves.

            A height query rather than a width one, because height is the
            constraint. A 360px-wide phone with a tall screen has room for
            this; a 900px-wide window 600px tall does not. */}
        {/* What I do and how I work, then who it is open to. The personal
            bio that stood here is off the page for now (see profile.ts):
            this column is for the reader deciding whether to hire me, and
            the pitch is the paragraph that answers that. */}
        <div className="mt-[clamp(1rem,3vh,2rem)] hidden [@media(min-height:700px)]:block lg:block">
          <p className="max-w-[46ch] font-sans text-[clamp(0.95rem,1.8vh,1.1rem)] leading-relaxed text-brand-maroon">
            {ui.hero.pitch}
          </p>
        </div>

        {/* One action, not two. This used to sit beside its own "Book a
            30-minute call" button, straight to the calendar — but the
            panel this opens leads with exactly that button (see
            ContactModal.tsx: "booking first"), so the second button on the
            hero wasn't a shortcut, it was the same click with the message
            form removed. That left "Book a 30-minute call" appearing
            twice within one scroll — here, and again at Work with me —
            which reads as the page repeating itself rather than confirming
            the offer.

            Screen only: on paper a button is a dead rectangle, and the
            print-only line under it carries the addresses instead. */}
        <div className="mt-[clamp(1.25rem,3.5vh,2.5rem)] flex flex-wrap gap-3 print:hidden">
          <ContactTrigger className="inline-block border-2 border-brand-yellow bg-brand-yellow px-6 py-3.5 font-sans text-base font-semibold text-brand-maroon transition-colors hover:bg-transparent hover:text-brand-maroon">
            {ui.nav.cta}
          </ContactTrigger>
        </div>

        {/* Paper only. On screen the contact routes are the bar's button and
            the footer's marks, both of which are things you click; a printed
            page has to spell them out or it is a CV nobody can answer. */}
        <p className="mt-6 hidden font-sans text-sm text-brand-maroon print:block">
          {ui.hero.reachMe} {CONTACT_EMAIL}
          {socials.filter((social) => !social.footerOnly).map((social) => (
            <span key={social.name}> · {social.href.replace(/^https?:\/\//, "")}</span>
          ))}
        </p>
      </div>

      {/* ── The artwork, and the visitor ───────────────────────────────
          The Coral loop, taking the right panel whole, with the one piece
          on this site that is about the reader rather than about me. See
          HeroArt.tsx — the plate on it is live before it is pressed, and
          what it opens covers the screen rather than the panel. */}
      <HeroArt
        src={profile.heroBackdrop.src}
        credit={backdropCredit}
        locale={locale}
        strings={{ hero: ui.hero, aboutYou: ui.aboutYou, about: ui.about }}
      />
    </section>
  );
}
