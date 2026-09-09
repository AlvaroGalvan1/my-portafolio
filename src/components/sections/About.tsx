import { profile } from "@/content/profile";
import SkillBadges from "./SkillBadges";

// The bio is the voice; the CV is the evidence, and the CV is a PDF. The
// full job history used to be transcribed here — logos, dates, locations,
// bullets, four times over — which turned the section under the hero into a
// dense second résumé that nobody reads twice. It's one download away
// instead, and what's left says who I am and what I work with.
//
// `src/content/experience.ts` is still the source of truth for the roles and
// is deliberately kept: nothing here reads it today, but it's the data any
// future treatment of that history would be built from.
export default function About() {
  const [lede, ...rest] = profile.bio;

  return (
    <section id="about" className="bg-white px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-red">
        About
      </h2>

      {/* No card, no border, no cream — the only thing separating this from
          the page is its size. Capped at ~60 characters: full-bleed display
          type is a poster move, but a paragraph run to 1400px is unreadable
          no matter how nice the font is. */}
      {lede && (
        <p className="mt-10 max-w-[36ch] font-sans text-2xl leading-snug text-brand-maroon sm:max-w-[52ch] sm:text-3xl">
          {lede}
        </p>
      )}

      {/* The remaining paragraphs drop to body size and split into two
          columns, so the block uses the width the lede deliberately doesn't
          while each line stays inside a readable measure. */}
      {rest.length > 0 && (
        <div className="mt-8 grid max-w-5xl gap-x-12 gap-y-4 font-sans leading-relaxed text-neutral-700 md:grid-cols-2">
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      {/* One cream panel, split: the tools on the left, the way to the rest
          of the history on the right. The CV isn't a footnote to the skills
          any more — with the job list gone it's the only route to that
          detail, so it gets half the panel and a line saying what's in it. */}
      <div className="mt-16 border-t-2 border-brand-red/15 pt-12">
        <div className="grid gap-10 bg-brand-cream p-8 font-sans sm:p-10 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-red">
              Skills
            </h3>
            <SkillBadges />
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-red">
              The rest of it
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-neutral-700">
              Roles, dates, and what each one actually involved — all of it is
              in the CV, written out properly rather than squeezed into a
              column here.
            </p>
            <a
              href="/cv.pdf"
              className="mt-6 inline-block border-2 border-brand-red bg-brand-red px-5 py-2.5 font-sans font-semibold text-white hover:bg-transparent hover:text-brand-red"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
