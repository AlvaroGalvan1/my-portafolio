import SkillBadges from "./SkillBadges";

// What I work with, and the way to the rest of the history. The bio that
// used to open this section now sits above the Wall — see Intro.tsx — on
// the grounds that a visitor should know whose work they're looking at
// before they look at it, while the tools and the CV are evidence and read
// better after it.
//
// The id is `skills`, not `about`: `about` went with the bio, and the Wall's
// "Skip the Wall" link targets this section. That link exists to jump a
// keyboard visitor *past* 48 focusable tiles, so its target has to be the
// section after the Wall — pointed at the bio it would have sent them
// backwards, up the page, which is worse than no skip link at all.
//
// `src/content/experience.ts` is still the source of truth for the roles and
// is deliberately kept: nothing here reads it today, but it's the data any
// future treatment of that history would be built from.
export default function About() {
  return (
    <section id="skills" className="bg-white px-6 py-20 sm:px-16">
      {/* One cream panel, split: the tools on the left, the way to the rest
          of the history on the right. The CV isn't a footnote to the skills
          any more — with the job list gone it's the only route to that
          detail, so it gets half the panel and a line saying what's in it.

          The wrapper that used to hold this carried a top rule separating
          the panel from the bio above it. Both went with the bio: the rule
          had nothing left to divide, and the div had nothing left to do. */}
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
    </section>
  );
}
