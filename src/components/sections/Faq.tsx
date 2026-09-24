import { faq } from "@/content/faq";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// The questions answered before anyone has to ask them. Same native
// <details>/<summary> pattern as the Expand control on Experience: no JS
// required, keyboard and screen readers get the open/closed state for free.
export default async function Faq() {
  const locale = await currentLocale();
  const ui = UI[locale].faq;

  return (
    <section
      id="faq"
      className="border-t-4 border-brand-maroon bg-brand-cream px-6 py-[clamp(3rem,8vh,5.5rem)] sm:px-16 print:hidden"
    >
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
        {ui.heading}
      </h2>

      <div className="mt-[clamp(2rem,5vh,3.5rem)] divide-y-2 divide-brand-maroon/15 border-t-2 border-brand-maroon/25 sm:max-w-3xl">
        {faq.map((item) => (
          <details key={say(item.question, "en")} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-display)] text-lg text-brand-maroon [&::-webkit-details-marker]:hidden">
              {say(item.question, locale)}
              <span aria-hidden className="shrink-0 text-xl text-brand-red">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">–</span>
              </span>
            </summary>
            <p className="mt-3 font-sans text-sm leading-relaxed text-neutral-700">
              {say(item.answer, locale)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
