import { testimonials } from "@/content/testimonials";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// Other people's words, between the work and the ask.
//
// The position is the argument. Everything above is me describing my own
// work; everything below asks to be hired. A reader arrives at the ask
// having just read someone else say the thing I have spent five sections
// implying, which is the only place in the page where that sentence does
// any work. Before the Wall it would be a claim with no evidence under it;
// after the Services panel it would be an afterthought to a decision
// already made.
//
// ── It renders nothing while there are no testimonials ──────────────
// Not a placeholder, not "coming soon", not three greyed-out cards. An
// empty section with a heading on it is a promise the page is visibly
// failing to keep, and it is the single most common way a personal site
// looks abandoned. See content/testimonials.ts, which is the only file
// that has to change to switch this on.
export default async function Testimonials() {
  if (testimonials.length === 0) return null;

  const locale = await currentLocale();
  const ui = UI[locale].testimonials;

  return (
    // White, between the yellow Services below and the white About above —
    // so it reads as the last of the evidence rather than the first of the
    // sales pitch. The palette has three fields and this section
    // deliberately takes none of them.
    <section id="testimonials" className="bg-white px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-red">
        {ui.heading}
      </h2>
      <div aria-hidden className="mt-4 h-1.5 w-24 bg-brand-red" />

      {/* A list, because that is what it is: several people, each saying
          one thing. Up to three across — beyond that the quotes get a
          measure too narrow to read and the row starts looking like
          pricing tiers. */}
      <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <li
            key={testimonial.name}
            className="flex flex-col border-2 border-brand-red/25 bg-brand-cream p-7"
          >
            {/* The quote carries real quotation marks in the markup rather
                than CSS pseudo-elements: a screen reader should hear that
                this is someone else speaking, and `content: '"'` is not
                announced. */}
            <blockquote className="flex-1 font-sans text-base leading-relaxed text-brand-maroon">
              &ldquo;{say(testimonial.quote, locale)}&rdquo;
            </blockquote>

            <figcaption className="mt-6 border-t-2 border-brand-red/20 pt-4">
              <p className="font-sans text-sm font-bold text-brand-maroon">
                {testimonial.href ? (
                  <a
                    href={testimonial.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red"
                  >
                    {testimonial.name}
                  </a>
                ) : (
                  testimonial.name
                )}
              </p>
              <p className="mt-1 font-sans text-xs leading-relaxed text-brand-maroon/70">
                {say(testimonial.role, locale)}
              </p>
              {/* How we worked together, set apart from the role — a
                  reader weighs "managed me at Pano" differently from
                  "studied with me", and the two are different facts. */}
              <p className="eyebrow mt-1 text-brand-red">
                {say(testimonial.relation, locale)}
              </p>
            </figcaption>
          </li>
        ))}
      </ul>
    </section>
  );
}
