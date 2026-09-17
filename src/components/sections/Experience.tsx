import OrgLogo from "./OrgLogo";
import { experience } from "@/content/experience";

// The right half of Background: where I've worked, as four lines rather
// than sixteen bullets.
//
// This is the section that was deleted once already for being cluttered,
// and the fix isn't a shorter version of the same thing — it's a different
// thing. Each role shows its mark, its title and its dates, and then ONE
// sentence saying what the job was for. `experience.ts` still holds every
// bullet, and the CV still prints them; what a visitor gets here is the
// part they'd remember anyway.
//
// It also answers the tuned-CV problem head on: a takeaway written as "what
// changed because I was there" reads as true against a GIS CV and a climate
// CV alike, where a bullet list written for one of them contradicts the
// other.
export default function Experience() {
  return (
    <div>
      <h3 className="font-[family-name:var(--font-display)] text-3xl text-brand-maroon">
        Experience
      </h3>
      <div aria-hidden className="mt-4 h-1 w-24 bg-brand-red" />

      {/* A rule down the left of the column with each role hanging off it:
          the shape of a timeline without drawing dots and connectors that
          would have to be kept in step with the rows. */}
      <ol className="mt-8 space-y-8 border-l-4 border-brand-maroon/25 pl-6">
        {experience.map((job) => (
          <li key={`${job.org}-${job.dates}`}>
            {/* The mark and the dates on one line, the title under it. The
                logo hides itself when the file isn't there yet (OrgLogo),
                so a missing mark costs a row nothing — two of these four
                are still waiting on files. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {job.logoSrc && <OrgLogo src={job.logoSrc} alt={job.org} />}
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-maroon/75">
                {job.dates}
              </span>
            </div>

            <h4 className="mt-3 font-sans text-lg font-semibold leading-tight text-brand-maroon">
              {job.role}
              <span className="font-normal text-brand-maroon/70"> · {job.org}</span>
            </h4>

            {/* The takeaway, set larger than the title it sits under. That
                inversion is deliberate: the sentence is the content and the
                job title is the label on it. */}
            <p className="mt-3 font-sans text-base leading-relaxed text-neutral-700">
              {job.takeaway}
            </p>

            {/* Paper gets the detail the screen refuses. This is the whole
                bargain of printing the site as the CV: on a page the reader
                can skim four takeaways in ten seconds, and in a PDF that
                lands in an inbox they need the bullets a recruiter is
                searching for. Same data, both times — nothing here is
                written twice. */}
            {job.summary && (
              <p className="mt-2 hidden font-sans text-sm leading-relaxed text-neutral-700 print:block">
                {job.summary}
              </p>
            )}
            {job.bullets.length > 0 && (
              <ul className="mt-2 hidden list-disc pl-5 font-sans text-sm leading-relaxed text-neutral-700 print:block">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            <p className="mt-1 hidden font-sans text-xs text-neutral-700 print:block">
              {job.location}
            </p>
          </li>
        ))}
      </ol>

      {/* Screen only, and necessarily so: printed, this line sits directly
          under the bullets it is promising. */}
      <p className="mt-8 font-sans text-sm text-brand-maroon/80 print:hidden">
        The bullets, the tools and the dates in full are in the{" "}
        <a href="/cv.pdf" className="font-semibold underline underline-offset-4 hover:text-brand-red">
          CV
        </a>
        .
      </p>
    </div>
  );
}
