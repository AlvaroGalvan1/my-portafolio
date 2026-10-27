import type { Locale } from "@/content/i18n";
import { testimonials, type Testimonial } from "@/content/testimonials";
import Highlight from "@/components/ui/Highlight";
import Marquee from "@/components/ui/Marquee";
import { testimonialsContent } from "./testimonials.content";

// Splits the excerpt around its highlight words so they can be set in orange.
function Excerpt({ excerpt, highlight }: Pick<Testimonial, "excerpt" | "highlight">) {
  const pattern = new RegExp(`(${highlight.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "i");
  return (
    <>
      “…
      {excerpt.split(pattern).map((part, i) =>
        i % 2 === 1 ? <Highlight key={i}>{part}</Highlight> : part,
      )}
      …”
    </>
  );
}

export default function Testimonials({ lang }: { lang: Locale }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-12">
      <Marquee label={testimonialsContent[lang].label}>
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="flex w-72 flex-none flex-col justify-between gap-4 rounded-xl bg-brand-maroon p-5 font-sans text-brand-cream"
          >
            <blockquote className="text-base leading-snug">
              <Excerpt excerpt={t.excerpt} highlight={t.highlight} />
            </blockquote>
            <figcaption className="flex items-center justify-between gap-3 text-sm font-semibold">
              {t.href ? (
                <a href={t.href} className="underline-offset-4 hover:underline">
                  {t.name}
                </a>
              ) : (
                t.name
              )}
              {/* Plain <img>: a small brand mark of unknown size, on a cream plate because the logos are dark. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.logo} alt={t.org ?? ""} className="h-6 w-auto max-w-24 rounded bg-brand-cream px-2 py-1 box-content object-contain" />
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
