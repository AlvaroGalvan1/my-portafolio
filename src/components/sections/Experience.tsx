import OrgLogo from "./OrgLogo";
import { experience, type Job } from "@/content/experience";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// The Experience panel's contents: where I've worked, as four entries
// rather than sixteen bullets. The heading and the card around it belong to
// Background, which owns the panel shape every section of it shares.
//
// Each entry is one plate and three lines: who and when, what changed
// because I was there, and what the company does. Three of these four
// names mean nothing to a reader who hasn't met them, so the company line
// stays on screen; the takeaway is the heading, because it is the one
// sentence a recruiter is here for.
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
export default async function Experience() {
  const locale = await currentLocale();
  const ui = UI[locale].background;

  return (
    <div>
      {/* One column, at every width. The panel is half the page wide, and
          splitting it again into two columns of roles gives each heading
          a twenty-five-character measure — a fifteen-word takeaway in
          display caps wrapped to five lines there, which is the opposite
          of the point. The section went two-by-two at `lg` once, to fit
          one screen when each entry ran to eight lines; at three lines an
          entry, four stacked rows come out the same height as the grid
          did, with the sentences on two lines instead of five. */}
      <ol className="mt-2 divide-y divide-brand-red/15 lg:mt-4">
        {experience.map((job) => (
          <li key={`${job.org}-${say(job.dates, "en")}`} className="print-keep py-7 first:pt-1 lg:py-5 lg:first:pt-1 lg:last:pb-1">
            {/* Block one: the company. Its mark, its name, and what it
                actually does — which was missing, and without it three of
                these four names tell a reader nothing at all. */}
            <div className="flex items-start gap-4 sm:gap-5 lg:gap-4">
              <Plate job={job} />

              <div className="min-w-0 flex-1">
                {/* ── Three lines, and that is the whole entry ─────────
                    Who and when, the takeaway, the company. Nothing else
                    on screen.

                    This section has now three times grown past that and
                    three times been cut back, so it is worth writing down
                    why: four roles times one extra element is four more
                    things in a half-width column, and a reader skimming a
                    portfolio does not read the fourth one. The last
                    version had a question heading, its one-line answer
                    AND a red methods line — the question and the answer
                    said the same thing twice, and the methods repeated
                    Skills, two inches below. Everything cut is in the
                    print-only fields further down, where a reader has
                    already decided they want it.

                    Adding a line here means taking one out. */}
                <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-maroon/60">
                  {job.href ? (
                    <a
                      href={job.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-red"
                    >
                      {job.org}
                      <span className="sr-only">{ui.newTab}</span>
                    </a>
                  ) : (
                    job.org
                  )}
                  {" · "}
                  {say(job.role, locale)}
                  {" · "}
                  {say(job.dates, locale)}
                </p>

                {/* The takeaway, and it is the heading. See the note on
                    `answer` in experience.ts: "experienced in geospatial
                    analysis" is a claim a reader cannot check, and "faults
                    found in the data before they were found in the field"
                    is a thing that happened. They draw the conclusion; the
                    page never states it. Sized to hold a fifteen-word
                    sentence in two lines across the panel. */}
                <h4 className="mt-2 font-[family-name:var(--font-display)] text-[1.25rem] leading-[1.15] text-brand-maroon sm:text-[1.4rem] lg:text-[1.2rem]">
                  {say(job.answer, locale)}
                </h4>

                {/* What the company does, in one quiet line. The plate
                    shows a mark the reader has never seen, and the
                    takeaway assumes they know what a Hyticos is. */}
                <p className="mt-2.5 font-sans text-[0.95rem] leading-relaxed text-neutral-600 lg:mt-2 lg:text-sm lg:leading-snug">
                  {say(job.what, locale)}
                </p>

                {/* ── Paper only, from here down ─────────────────────────
                    The bargain of printing the site as the CV: on screen
                    the reader skims four problems in ten seconds, and in a
                    PDF that lands in an inbox they need the bullets a
                    recruiter is searching for. Same data, both times. */}
                <div className="hidden print:block">
                  {/* The methods, as one middot-separated line under the
                      role they were used on — the one place a skill is
                      evidence rather than a claim. Paper only: on screen
                      they were a red all-caps line that wrapped, and the
                      Skills panel says the same words two inches down. */}
                  {job.methods.length > 0 && (
                    <p className="mt-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-brand-red">
                      {job.methods.map((m) => say(m, locale)).join(" · ")}
                    </p>
                  )}
                  {job.scope && (
                    <p className="mt-2 font-sans text-sm leading-relaxed text-neutral-700">
                      {say(job.scope, locale)}
                    </p>
                  )}
                  {job.summary && (
                    <p className="mt-2 font-sans text-sm leading-relaxed text-neutral-700">
                      {say(job.summary, locale)}
                    </p>
                  )}
                  {job.bullets.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 font-sans text-sm leading-relaxed text-neutral-700">
                      {job.bullets.map((bullet) => (
                        <li key={say(bullet, "en")}>{say(bullet, locale)}</li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-1 font-sans text-xs text-neutral-700">
                    {say(job.location, locale)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* The line that pointed at "the CV below, in both flavours" stood
          here and no longer does: the CV is now the closing action of this
          same section, about four inches down, and a link telling a reader
          to go to a button they can already see is noise. */}
    </div>
  );
}

// One mark, one size, every row — and big enough to be the first thing the
// eye lands on in each entry. At 64px with a pale red hairline the marks
// read as bullet points; three of these four companies are names a reader
// hasn't met, and the mark is the one thing about them that can be
// recognised the second time. So: a larger white plate, a maroon frame,
// and the site's offset red shadow — the same stamp the buttons wear — so
// the column reads as a stack of four marks with prose beside them.
function Plate({ job }: { job: Job }) {
  const mark = job.logoSrc ? (
    <OrgLogo
      src={job.logoSrc}
      alt={job.org}
      className="max-h-full max-w-full object-contain"
      fallback={<Lettermark text={job.lettermark} />}
    />
  ) : (
    <Lettermark text={job.lettermark} />
  );

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center border-2 border-brand-maroon bg-white p-2 shadow-[4px_4px_0_var(--color-brand-red)] sm:h-24 sm:w-24 sm:p-2.5 lg:h-[4.5rem] lg:w-[4.5rem] lg:p-2">
      {mark}
    </div>
  );
}

function Lettermark({ text }: { text: string }) {
  return (
    <span className="font-[family-name:var(--font-display)] text-2xl leading-none text-brand-maroon">
      {text}
    </span>
  );
}
