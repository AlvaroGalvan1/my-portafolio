import Link from "next/link";
import ContactTrigger from "@/components/contact/ContactTrigger";
import { services } from "@/content/services";
import { CALENDLY_URL } from "@/content/socials";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// "Work with me": end-to-end products, and how to start.
//
// Cream rather than the full yellow field it used to be: after the Wall
// the page needs a quiet screen to read, and yellow is kept for the one
// thing to press. Two blocks only: the heading row with its actions, then
// the three stages of a product on a ruled line. The rates are one link
// away on the Pricing page.
export default async function Services() {
  const locale = await currentLocale();
  const ui = UI[locale].services;

  return (
    <section
      id="work"
      className="border-t-4 border-brand-maroon bg-brand-cream px-6 py-[clamp(3rem,8vh,5.5rem)] sm:px-16 print:hidden"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
            {ui.heading}
          </h2>
          <p className="mt-3 font-sans text-lg leading-snug text-brand-maroon/80">{ui.lede}</p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-brand-maroon bg-brand-yellow px-6 py-3 font-sans font-semibold text-brand-maroon shadow-[4px_4px_0_var(--color-brand-maroon)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-brand-maroon)]"
            >
              {ui.book}
            </a>
            <ContactTrigger className="font-sans text-sm font-semibold text-brand-maroon underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red">
              {ui.brief}
            </ContactTrigger>
          </div>
          <p className="font-sans text-sm text-neutral-600">
            {ui.callBefore}
            <Link
              href={`/${locale}/pricing`}
              className="font-semibold text-brand-maroon underline decoration-brand-red/50 decoration-2 underline-offset-4 hover:decoration-brand-red"
            >
              {ui.callLink}
            </Link>
            {ui.callAfter}
          </p>
        </div>
      </div>

      {/* The three stages as three cards, same offset-shadow frame the rate
          cards on Pricing use — this row is a menu of what I do, not a
          ruled progression, so it reads as one now. */}
      <p className="eyebrow mt-[clamp(2rem,5vh,3.5rem)] text-brand-red">{ui.pipeline}</p>
      <ol className="mt-3 grid gap-6 md:grid-cols-3">
        {services.map((service, i) => {
          const title = say(service.title, locale);
          return (
            <li
              key={title}
              className="flex flex-col border-2 border-brand-maroon bg-white p-6 shadow-[4px_4px_0_var(--color-brand-red)]"
            >
              <p className="font-[family-name:var(--font-display)] text-sm text-brand-red">0{i + 1}</p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-brand-maroon">
                {title}
              </h3>
              <p className="mt-2 font-sans text-base leading-snug text-neutral-800">
                {say(service.body, locale)}
              </p>
              <ul className="mt-4 space-y-1.5 font-sans text-sm leading-snug text-neutral-600">
                {service.includes.map((item) => (
                  <li key={say(item, "en")} className="flex gap-2.5">
                    <span aria-hidden className="mt-[0.5em] h-1 w-2.5 shrink-0 bg-brand-red/70" />
                    {say(item, locale)}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
