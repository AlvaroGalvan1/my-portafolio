import OrgLogo from "./OrgLogo";
import { experience, type Job } from "@/content/experience";

// The right half of Background: where I've worked, as five entries rather
// than twenty bullets.
//
// Three things carry a row, in this order of size: the mark, the takeaway,
// the scope line. That order is the argument. A reader skimming a CV sees
// logos first whether or not you designed for it, so every entry gets a
// plate of the same size — the real mark where the file exists and two
// letters in the display face where it doesn't, which is what makes a
// column of five read as a set instead of three gaps and two logos.
//
// Then one sentence saying what the job was FOR, and one saying at what
// scale or by what method. `experience.ts` still holds every bullet and
// print brings them back (see the @media print block in globals.css), so
// the screen can stay at five sentences without the CV losing anything.
//
// It also answers the tuned-CV problem: a takeaway written as "what changed
// because I was there" reads as true against a GIS CV and a climate CV
// alike, where a bullet list written for one contradicts the other.
export default function Experience() {
  return (
    <div>
      <h3 className="font-[family-name:var(--font-display)] text-3xl text-brand-maroon">
        Experience
      </h3>
      <div aria-hidden className="mt-4 h-1 w-24 bg-brand-red" />

      <ol className="mt-8 space-y-9">
        {experience.map((job) => (
          <li key={`${job.org}-${job.dates}`} className="print-keep flex gap-5">
            <Plate job={job} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-maroon/75">
                  {job.dates}
                </span>
                {/* The tag only appears on entries that aren't jobs. A term
                    abroad sitting unlabelled in a work history is the kind
                    of thing that gets found out in an interview. */}
                {job.kind === "voyage" && (
                  <span className="border border-brand-red px-2 py-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-brand-red">
                    Voyage
                  </span>
                )}
              </div>

              <h4 className="mt-2 font-sans text-lg font-semibold leading-tight text-brand-maroon">
                {job.role}
                <span className="font-normal text-brand-maroon/70"> · {job.org}</span>
              </h4>

              <p className="mt-2 font-sans text-base leading-relaxed text-neutral-700">
                {job.takeaway}
              </p>

              {job.scope && (
                <p className="mt-2 font-sans text-sm leading-relaxed text-neutral-600">
                  {job.scope}
                </p>
              )}

              {/* Paper gets the detail the screen refuses. This is the whole
                  bargain of printing the site as the CV: on a page the
                  reader skims five takeaways in ten seconds, and in a PDF
                  that lands in an inbox they need the bullets a recruiter is
                  searching for. Same data, both times. */}
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

  const plate = (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-brand-red/40 bg-white p-2">
      {mark}
    </div>
  );

  // The plate becomes the link where there's somewhere worth going. No
  // underline and no colour change: the mark IS the affordance, and a lift
  // on hover says so without decorating a logo.
  return job.href ? (
    <a
      href={job.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${job.org} (opens in a new tab)`}
      className="shrink-0 transition-transform hover:-translate-y-0.5"
    >
      {plate}
    </a>
  ) : (
    plate
  );
}

function Lettermark({ text }: { text: string }) {
  return (
    <span className="font-[family-name:var(--font-display)] text-xl leading-none text-brand-maroon">
      {text}
    </span>
  );
}
