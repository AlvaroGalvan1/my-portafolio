import type { Locale } from "@/content/i18n";
import { contactContent } from "./contact.content";

// Stub: a labelled slot so the next ticket can see where this section goes.
export default function Contact({ lang }: { lang: Locale }) {
  return (
    <section className="px-6 py-10 sm:px-16">
      <div className="mx-auto max-w-5xl rounded-lg border-2 border-dashed border-brand-maroon/40 p-8 text-center font-sans text-brand-maroon">
        <p className="eyebrow">{contactContent[lang].placeholder}</p>
      </div>
    </section>
  );
}
