import HeroArt from "./HeroArt";
import { creditLine } from "@/components/gallery/credit";
import { profile } from "@/content/profile";
import { socials, CONTACT_EMAIL } from "@/content/socials";
import { SITE_MISSION, SITE_WELCOME } from "@/content/site";

// An editorial split, and the two halves are two subjects: me on the left,
// you on the right. The words and the bio stand in the cream column; the
// Coral loop takes the other, with a button on it that opens a readout of
// wherever the reader happens to be standing. A hard maroon seam between
// them.
//
// Two things came out of the first version of this and the layout is better
// for both. The portrait went: a photograph floating across the seam gave
// the eye a third thing to land on in a composition that only works if it
// has two, and a group shot at 16rem was doing none of the work a hero
// image is supposed to do. The availability pill went with it — a second
// status line above the name pushed the type down the column and said, in
// more words, what the location line already implies.
//
// What's left is one column of type against one field of movement. The
// weight is carried by the name, so the name is set as large as the column
// will take: `7.4vw` is not decorative here, it's the whole left half.
export default function Hero() {
  // Null for `relation: "mine"` — work that shouldn't carry a byline. The
  // plate hides entirely in that case rather than rendering "Backdrop —"
  // with nothing after it.
  const backdropCredit = creditLine(profile.heroBackdrop.credit);
  const [lede] = profile.bio;

  return (
    // 11:9 rather than half and half. An even split reads as a diagram; the
    // extra tenth on the left gives the name room to be the largest thing
    // on the page and still leaves the artwork a panel rather than a strip.
    <section
      id="home"
      className="hero-split grid lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-[1.1fr_0.9fr]"
    >
      {/* ── The words ───────────────────────────────────────────────────
          Cream: the page's own paper stock, and the warm neutral this half
          needs. Every other field on the site is saturated — orange, brick,
          yellow — and type at this size wants the quiet one. Maroon on
          cream is 6.13:1, so the bio under the name is comfortable rather
          than merely legal. */}
      <div className="hero-words flex flex-col justify-center bg-brand-cream px-6 py-16 sm:px-16 lg:py-24">
        {/* The dateline. Small caps over a huge name is the oldest trick in
            editorial layout and it works because the contrast is enormous:
            10px of tracked-out sans against 100px of display face. */}
        <p className="flex items-center gap-3 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-brand-maroon">
          <span className="location-dot" aria-hidden />
          {profile.location.label}
        </p>

        {/* Maroon letters with the red offset shadow — the sign-painted
            treatment in its original colours. Over the yellow card this had
            to flip to a cream shadow, because maroon under maroon is a
            smudge; on cream the red comes back. */}
        <h1 className="text-signpainted mt-6 font-[family-name:var(--font-display)] text-[clamp(2.75rem,13vw,3.75rem)] leading-[0.9] text-brand-maroon sm:text-[clamp(3.5rem,7.4vw,6.5rem)]">
          {profile.nameLines.map((line) => (
            <span key={line} className="block sm:whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>

        {/* The same rule that heads Education, Experience and every service
            column. It's the site's one repeated mark, and the hero was the
            only section not using it. */}
        <div aria-hidden className="mt-8 h-1 w-24 bg-brand-red" />

        {/* Three beats, in the order a stranger needs them. What this is,
            what it is for, and only then who is behind it — because a
            reader who has just met a name wants to know what they have
            arrived at before they are told about the author.

            The bio gets a label rather than running on from the mission:
            "About me" here and "About you" on the artwork opposite are the
            same kind of thing on either side of the seam, and the pair is
            what makes the split read as deliberate. */}
        <p className="mt-8 font-sans text-xl font-semibold leading-snug text-brand-maroon sm:text-2xl">
          {SITE_WELCOME}
        </p>

        <p className="mt-3 max-w-[46ch] font-sans text-base leading-relaxed text-brand-maroon sm:text-lg">
          {SITE_MISSION}
        </p>

        {lede && (
          <div className="mt-8">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
              About me
            </h2>
            <p className="mt-3 max-w-[46ch] font-sans text-base leading-relaxed text-brand-maroon sm:text-lg">
              {lede}
            </p>
          </div>
        )}

        {/* One action, and it points into the work rather than at another
            form. The bar above carries "Work with me" on every screen of
            the page, so the hire path is permanent and doesn't need
            restating here; what the top of a portfolio owes a first-time
            reader is the way INTO the evidence.

            Screen only: on paper "Explore my work" is an instruction to
            scroll, and the work is three pages further down. */}
        <div className="mt-10 print:hidden">
          <a
            href="#wall"
            className="inline-block border-2 border-brand-maroon bg-brand-maroon px-8 py-4 font-sans font-semibold text-brand-cream hover:bg-transparent hover:text-brand-maroon"
          >
            Explore my work
          </a>
        </div>

        {/* Paper only. On screen the contact routes are the bar's button and
            the footer's marks, both of which are things you click; a printed
            page has to spell them out or it is a CV nobody can answer. */}
        <p className="mt-6 hidden font-sans text-sm text-brand-maroon print:block">
          {CONTACT_EMAIL}
          {socials.map((social) => (
            <span key={social.name}> · {social.href.replace(/^https?:\/\//, "")}</span>
          ))}
        </p>
      </div>

      {/* ── The artwork, and the visitor ───────────────────────────────
          The Coral loop, taking the right panel whole, with the one piece
          on this site that is about the reader rather than about me: a
          button that opens a card over the artwork. See HeroArt.tsx.

          On a phone it becomes a band under the words rather than a
          background behind them: the piece has its own detail and its own
          movement, and type over it needed a scrim that made both worse. */}
      <HeroArt src={profile.heroBackdrop.src} credit={backdropCredit} />
    </section>
  );
}
