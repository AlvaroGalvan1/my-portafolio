import type { Locale } from "@/content/i18n";
import { say } from "@/content/i18n";
import { faq } from "@/content/faq";
import Button from "@/components/ui/Button";
import { faqContent } from "./faq.content";

// <details> is the whole interaction: it opens and closes with the keyboard
// and a screen reader, and needs no JavaScript.
export default function Faq({ lang }: { lang: Locale }) {
  return (
    <section className="px-4 py-12 sm:px-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {faq.slice(0, 4).map((item) => (
          <details key={say(item.question, "en")} className="group rounded-xl bg-brand-cream text-brand-maroon">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-sans text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {say(item.question, lang)}
              <span aria-hidden className="text-2xl leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-5 pb-5 font-sans text-base leading-relaxed">{say(item.answer, lang)}</p>
          </details>
        ))}
        <div className="mt-4 flex justify-center">
          <Button variant="quiet" href={`/${lang}/work-with-me`}>
            {faqContent[lang].end}
          </Button>
        </div>
      </div>
    </section>
  );
}
