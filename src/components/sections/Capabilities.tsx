import OrgLogo from "./OrgLogo";
import { capabilities, workedWith } from "@/content/capabilities";

// The band between the CV's top half and the work itself: who has had me on
// the job, and what I do.
//
// The banner goes first and it is the shortest thing in the section, which
// is the right proportion — a row of organisations is read in about a
// second and does more than any paragraph here could. The capabilities under
// it are the same claim broken into four things someone could actually hire
// me for, each with one counted line of evidence and a link to where that
// evidence lives on the page.
//
// On paper this is the "Capabilities" block of the CV: the banner keeps its
// names (the marks drop out, since logos print badly and the names carry it)
// and the four capabilities set as a compact grid. See the @media print
// block in globals.css.
export default function Capabilities() {
  return (
    <section id="capabilities" className="bg-white px-6 py-16 sm:px-16 sm:py-20">
      {/* ── The banner ─────────────────────────────────────────────────── */}
      <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-brand-maroon/70">
        Worked with
      </h2>

      {/* The mark where the file exists, the name set in the display face
          where it doesn't — never both, which reads as a stutter. OrgLogo
          decides at runtime, because whether a logo loads isn't something
          this component can know. */}
      <div className="mt-5 flex flex-wrap items-center gap-x-10 gap-y-5 border-y-4 border-brand-red py-6">
        {workedWith.map((org) => {
          const name = (
            <span className="font-[family-name:var(--font-display)] text-xl text-brand-maroon">
              {org.name}
            </span>
          );
          return (
            <div key={org.name} className="flex items-center">
              {org.logoSrc ? (
                <OrgLogo src={org.logoSrc} alt={org.name} fallback={name} />
              ) : (
                name
              )}
            </div>
          );
        })}
      </div>

      {/* ── What that work is ──────────────────────────────────────────── */}
      <h3 className="mt-14 font-[family-name:var(--font-display)] text-4xl text-brand-red">
        What I do
      </h3>

      {/* Two up at `sm`, four across at `lg`. Four in a row on a laptop is
          the shape of a capability list; two columns of two on a tablet
          keeps each line long enough to read. */}
      <div className="mt-8 grid gap-px border-4 border-brand-red bg-brand-red sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((capability) => (
          // The cells share a red field with a 1px gap, so the rules between
          // them are the background showing through rather than four boxes
          // each drawing its own border and doubling up at every seam.
          <a
            key={capability.title}
            href={capability.href}
            className="group flex flex-col bg-brand-cream p-6 transition-colors hover:bg-brand-yellow"
          >
            <h4 className="font-[family-name:var(--font-display)] text-xl leading-tight text-brand-maroon">
              {capability.title}
            </h4>
            <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-neutral-700">
              {capability.body}
            </p>
            <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-red">
              {capability.evidence}{" "}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-1 print:hidden"
              >
                →
              </span>
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
