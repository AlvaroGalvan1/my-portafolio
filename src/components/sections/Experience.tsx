import OrgLogo from "./OrgLogo";
import { experience, type Job } from "@/content/experience";

// The Experience panel's contents: where I've worked, as four entries
// rather than sixteen bullets. The heading and the card around it belong to
// Background, which owns the panel shape every section of it shares.
//
// Each entry is two blocks, and the split is the point. First the company:
// its mark, its name, and one line saying what it does, because three of
// these four names mean nothing to a reader who hasn't met them. Then, hung
// off a rule and indented under it, what I did there: role, dates, and one
// sentence on what the job was FOR.
//
// Everything else prints. The entries carried a second paragraph of scope
// on screen as well, which across four roles is eight paragraphs of body
// copy in a half-width column, and the section's problem was never that it
// said too little. `experience.ts` still holds every bullet and the @media
// print block in globals.css brings them all back, so the screen can run at
// one sentence each without the CV losing a word.
//
// It also answers the tuned-CV problem: a takeaway written as "what changed
// because I was there" reads as true against a GIS CV and a climate CV
// alike, where a bullet list written for one contradicts the other.
export default function Experience() {
  return (
    <div>
      {/* One column. The panel is half the page wide, and splitting half a
          page into two columns of roles gives each a thirty-character
          measure — narrower than the takeaway sentences that are the point
          of the entries. */}
      <ol className="mt-2 space-y-12">
        {experience.map((job) => (
          <li key={`${job.org}-${job.dates}`} className="print-keep">
            {/* Block one: the company. Its mark, its name, and what it
                actually does — which was missing, and without it three of
                these four names tell a reader nothing at all. */}
            <div className="flex items-start gap-4">
              <Plate job={job} />
              <div className="min-w-0 flex-1">
                <h4 className="font-[family-name:var(--font-display)] text-2xl leading-none text-brand-maroon">
                  {job.href ? (
                    <a
                      href={job.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-red"
                    >
                      {job.org}
                      {/* No mark and no underline. A display face at this
                          size underlines badly, and an arrow after every
                          company name put four of them down one column. The
                          colour shift on hover is the affordance; the note
                          below is the one for anyone not seeing it. */}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    job.org
                  )}
                </h4>
                <p className="mt-2 font-sans text-sm leading-relaxed text-neutral-600">
                  {job.what}
                </p>
              </div>
            </div>

            {/* Block two: what I did there, hung off a rule and indented to
                clear the mark above it. The rule is what divides the role
                from the company rather than a blank line doing it, so the
                two read as two things at a glance. */}
            <div className="mt-5 border-l-2 border-brand-red/30 pl-5 sm:ml-20">
              <p className="font-sans font-semibold leading-tight text-brand-maroon">
                {job.role}
              </p>
              <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-maroon/60">
                {job.dates}
              </p>

              {/* One line on screen. The scope line that used to sit under
                  this said something true and made every entry two
                  paragraphs, which across four roles is eight paragraphs of
                  body copy in a half-width column. It prints instead, with
                  the bullets. */}
              <p className="mt-3 font-sans text-base leading-relaxed text-neutral-700">
                {job.takeaway}
              </p>

              {/* Paper gets the detail the screen refuses. This is the whole
                  bargain of printing the site as the CV: on a page the
                  reader skims four takeaways in ten seconds, and in a PDF
                  that lands in an inbox they need the bullets a recruiter
                  is searching for. Same data, both times. */}
              {job.scope && (
                <p className="mt-2 hidden font-sans text-sm leading-relaxed text-neutral-700 print:block">
                  {job.scope}
                </p>
              )}
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
            </div>
          </li>
        ))}
      </ol>

      {/* Screen only, and necessarily so: printed, this line sits directly
          under the bullets it is promising. */}
      <p className="mt-8 font-sans text-sm text-brand-maroon/80 print:hidden">
        The bullets, the tools and the dates in full are in the{" "}
        <a
          href="#skills"
          className="font-semibold underline underline-offset-4 hover:text-brand-red"
        >
          CV below
        </a>
        , in both flavours.
      </p>
    </div>
  );
}

// One mark, one size, every row. White, so the plate reads as a frame around
// the logo rather than a tile behind it — the same mount the portrait gets
// in the hero, at a twelfth of the size.
function Plate({ job }: { job: Job }) {
  const mark = job.logoSrc ? (
    <OrgLogo
      src={job.logoSrc}
      alt={job.org}
      className="max-h-8 max-w-full object-contain"
      fallback={<Lettermark text={job.lettermark} />}
    />
  ) : (
    <Lettermark text={job.lettermark} />
  );

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-brand-red/40 bg-white p-2">
      {mark}
    </div>
  );
}

function Lettermark({ text }: { text: string }) {
  return (
    <span className="font-[family-name:var(--font-display)] text-xl leading-none text-brand-maroon">
      {text}
    </span>
  );
}
