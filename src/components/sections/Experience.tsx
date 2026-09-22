import OrgLogo from "./OrgLogo";
import { experience, type Job } from "@/content/experience";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// The Experience panel's contents: where I've worked, as four entries
// rather than sixteen bullets. The heading and the card around it belong to
// Background, which owns the panel shape every section of it shares.
//
// Each entry is built to be skimmed in three seconds: the company and what
// it does, the headline of the work, one or two results set large, and the
// stack as chips. Under it, Expand opens the problem and what changed, for
// the reader who wants the story behind the numbers.
//
// Everything else prints. The entries carried a second paragraph of scope
// on screen as well, which across four roles is eight paragraphs of body
// copy in a half-width column, and the section's problem was never that it
// said too little. `experience.ts` still holds every bullet and the @media
// print block in globals.css brings them all back, so the screen can run at
// one sentence each without the CV losing a word.
//
// It also answers the tuned-CV problem: one broad line on what I did
// reads as true against a GIS CV and a climate CV
// alike, where a bullet list written for one contradicts the other.
export default async function Experience() {
  const locale = await currentLocale();
  const ui = UI[locale].background;

  return (
    <div>
      {/* One column, at every width. The panel is half the page wide, and
          splitting it again into two columns of roles gives each line a
          twenty-five-character measure. At three short lines an entry,
          four stacked rows come out about the height the grid was. */}
      <ol className="mt-2 divide-y divide-brand-red/15 lg:mt-4">
        {experience.map((job) => (
          <li key={`${job.org}-${say(job.dates, "en")}`} className="print-keep py-6 first:pt-1 lg:py-4 lg:first:pt-1 lg:last:pb-1">
            <div className="flex items-start gap-4 sm:gap-5 lg:gap-4">
              <Plate job={job} />

              <div className="min-w-0 flex-1">
                {/* ── Where, as what, and when ─────────────────────────
                    The company (linked where the address is checked), the
                    role, and the dates at the right. */}
                <div className="flex flex-col gap-x-4 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="eyebrow text-brand-maroon/60">
                    {job.href ? (
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-maroon hover:text-brand-red"
                      >
                        {job.org}
                        <span className="sr-only">{ui.newTab}</span>
                      </a>
                    ) : (
                      <span className="text-brand-maroon">{job.org}</span>
                    )}
                    {" · "}
                    {say(job.role, locale)}
                  </p>
                  <p className="shrink-0 font-sans text-xs font-semibold tabular-nums text-brand-maroon/60">
                    {say(job.dates, locale)}
                  </p>
                </div>

                <p className="mt-0.5 font-sans text-xs italic text-neutral-600 print:hidden">
                  {say(job.what, locale)}
                </p>

                {/* The headline: the label is what a skimming reader keeps,
                    the line under it is what makes the label true. */}
                <h4 className="mt-1.5 font-[family-name:var(--font-display)] text-[1.2rem] leading-tight text-brand-maroon lg:text-[1.1rem]">
                  {say(job.headline.label, locale)}
                </h4>
                <p className="mt-1 font-sans text-[0.95rem] leading-relaxed text-neutral-700 lg:text-sm lg:leading-snug">
                  {say(job.headline.line, locale)}
                </p>

                {/* The results, set large: what a skimming reader should
                    leave the entry remembering. Screen only; paper has
                    the bullets. */}
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 print:hidden">
                  {job.stats.map((stat) => (
                    <div key={say(stat.label, "en")} className="min-w-0 max-w-[14rem]">
                      <dt className="sr-only">{say(stat.label, locale)}</dt>
                      <dd className="font-[family-name:var(--font-display)] text-2xl leading-none text-brand-red">
                        {say(stat.value, locale)}
                      </dd>
                      <dd aria-hidden className="mt-1 font-sans text-xs leading-snug text-neutral-600">
                        {say(stat.label, locale)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-3 flex flex-wrap gap-1.5 print:hidden" aria-label={ui.tech}>
                  {job.stack.map((tool) => (
                    <li
                      key={tool}
                      className="border border-brand-maroon/20 bg-white/60 px-2 py-0.5 font-sans text-[0.7rem] font-semibold text-brand-maroon"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>

                {/* The next level down, behind one control. A native
                    <details>: keyboard and screen readers get the
                    open/closed state for free, and it works before any
                    JavaScript has loaded. The label swaps with the state.
                    Labels beside their text from `sm`, above it on a phone,
                    where two columns leave the text a word wide.
                    Screen only: paper gets the full bullets below. */}
                <details className="group mt-3 print:hidden">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-sans text-xs font-semibold text-brand-red underline decoration-brand-red/40 decoration-2 underline-offset-4 hover:decoration-brand-red [&::-webkit-details-marker]:hidden">
                    <span aria-hidden className="inline-block w-2.5 text-center">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">–</span>
                    </span>
                    <span className="group-open:hidden">{ui.expand}</span>
                    <span className="hidden group-open:inline">{ui.collapse}</span>
                  </summary>
                  <dl className="mt-3 grid min-w-0 grid-cols-1 gap-x-4 gap-y-1 border-l-2 border-brand-red/30 pl-4 font-sans text-sm leading-snug sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-y-2">
                    {(
                      [
                        [ui.problem, job.details.problem],
                        [ui.impact, job.details.impact],
                      ] as const
                    ).map(([term, value]) => (
                      <div key={term} className="contents">
                        <dt className="eyebrow pt-0.5 text-brand-red">{term}</dt>
                        <dd className="mb-2 text-neutral-700 last:mb-0 sm:mb-0">{say(value, locale)}</dd>
                      </div>
                    ))}
                  </dl>
                </details>

                {/* ── Paper only, from here down ─────────────────────────
                    The bargain of printing the site as the CV: on screen
                    the reader skims four problems in ten seconds, and in a
                    PDF that lands in an inbox they need the bullets a
                    recruiter is searching for. Same data, both times. */}
                <div className="hidden print:block">
                  <p className="mt-2 font-sans text-sm leading-relaxed text-neutral-600">
                    {say(job.what, locale)}
                  </p>
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
