import { socials, CONTACT_EMAIL } from "@/content/socials";
import { SITE_PURPOSE } from "@/content/site";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// The colophon: what this site is for, then the three marks.
//
// The marks used to stand here alone, on the argument that at the end of a
// page there is nothing left to say. There was one thing: what the page is
// FOR. A portfolio states that nowhere by default — a reader is left to
// infer it from the fact that a portfolio exists — and inferring gets it
// wrong, because the usual inference is "he wants a job" and two of the
// three purposes here aren't that.
//
// It goes at the bottom rather than the top on purpose. A statement of
// intent is read by someone who has been through the thing and is deciding
// what to do about it; at the top it would be a claim made before any of
// the evidence, which is the one place it can't earn anything.
export default async function Footer() {
  const locale = await currentLocale();

  return (
    // Screen only. The three addresses are already set out in full under
    // the name on a printed page, and a second copy of them at the end —
    // as glyphs, each followed by its own URL — is the least useful square
    // inch on the CV.
    <footer id="colophon" className="scroll-mt-[var(--nav-h)] bg-brand-maroon px-6 py-[clamp(1.75rem,4vh,3.5rem)] print:hidden sm:px-16">
      <h2 className="eyebrow text-center text-brand-yellow">
        {UI[locale].footer.heading}
      </h2>

      {/* Three across from `sm`, stacked below. Cream on maroon is 6.4:1,
          so this is the one place on the page where body copy can sit on
          the dark field without a panel under it. */}
      <div className="mx-auto mt-[clamp(1rem,2.5vh,2rem)] grid max-w-5xl gap-8 sm:grid-cols-3 sm:gap-10">
        {SITE_PURPOSE.map((purpose) => {
          const title = say(purpose.title, locale);
          return (
            <div key={title}>
              <h3 className="font-[family-name:var(--font-display)] text-xl text-brand-yellow">
                {title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-brand-cream/85">
                {say(purpose.body, locale)}
              </p>
            </div>
          );
        })}
      </div>

      {/* A rule, then the marks. Without it the glyphs read as a fourth
          column of the grid above rather than as the end of the page. */}
      <div
        aria-hidden
        className="mx-auto mt-[clamp(1.5rem,3.5vh,3rem)] h-px max-w-5xl bg-brand-cream/25"
      />

      <div className="mt-[clamp(1.25rem,3vh,2.5rem)] flex items-center justify-center gap-8">
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            title={s.name}
            // -m-3 p-3 keeps a 44px tap target around a 24px glyph without
            // the padding pushing the marks apart visually.
            className="-m-3 p-3 text-white/70 transition-colors hover:text-white focus-visible:text-white"
          >
            <svg
              role="img"
              aria-hidden
              viewBox={s.viewBox ?? "0 0 24 24"}
              className="h-6 w-6"
              fill="currentColor"
            >
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </div>

      {/* The address in plain text too: a hiring manager who wants to
          write should not have to find the contact panel first. */}
      <p className="mt-6 text-center font-sans text-sm">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-brand-cream/85 underline decoration-brand-yellow/60 decoration-2 underline-offset-4 hover:text-white hover:decoration-brand-yellow"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </footer>
  );
}
