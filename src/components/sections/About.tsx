import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import SkillBadges from "./SkillBadges";
import OrgLogo from "./OrgLogo";

// Three equal boxed columns read as three equal things. They aren't: the
// bio is the voice, and the résumé blocks are the evidence. So the bio runs
// first and unboxed — plain type on the page, the way a lede is set — and
// the two reference blocks split below it, Experience twice the width of
// Skills because it carries twice the reading.
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

      <div className="mt-16 grid gap-12 border-t-2 border-brand-red/15 pt-12 lg:grid-cols-3">
        {/* Two-thirds. Each job hangs off a left rule rather than sitting in
            its own box — it groups the list as one column of history
            without drawing four more rectangles on the page. */}
        <div className="lg:col-span-2">
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-red">
            Experience
          </h3>
          <div className="mt-8 space-y-8">
            {experience.map((job) => (
              <div key={job.org} className="border-l-2 border-brand-red/20 pl-5 font-sans">
                {job.logoSrc && (
                  <div className="mb-3">
                    <OrgLogo src={job.logoSrc} alt={job.org} />
                  </div>
                )}
                <p className="font-semibold text-brand-maroon">{job.role}</p>
                <p className="text-sm text-neutral-600">
                  {job.org} · {job.dates}
                </p>
                {/* Was in the data and never shown. It's the answer to
                    "where are you based?", which is the next question after
                    "what did you do?" */}
                <p className="text-sm text-neutral-500">{job.location}</p>
                {/* Some roles are one sustained piece of work rather than a
                    list of three, and read better as a paragraph. Sits above
                    the bullets on the rare job that has both. */}
                {job.summary && (
                  <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                    {job.summary}
                  </p>
                )}
                {job.bullets.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                    {job.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* One-third, and the only warm panel left in the section — with the
            bio unboxed it has the job of anchoring the page's right side
            rather than being one cream block among three. */}
        <div className="bg-brand-cream p-8 font-sans lg:col-span-1">
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-red">
            Skills
          </h3>
          <SkillBadges />
          <a
            href="/cv.pdf"
            className="mt-8 inline-block border-2 border-brand-red bg-brand-red px-5 py-2.5 font-sans font-semibold text-white hover:bg-transparent hover:text-brand-red"
          >
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}
