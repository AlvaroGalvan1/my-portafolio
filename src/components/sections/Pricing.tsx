import ContactTrigger from "@/components/contact/ContactTrigger";
import { rates, AVAILABILITY } from "@/content/services";
import { CALENDLY_URL } from "@/content/socials";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// The Pricing page's body: the four ways to pay, and how to start.
//
// The one page outside the home page's scroll. What I do stays on the home
// page, in Work with me, which links here; the numbers live here so a
// reader who wants them can be sent one link.
export default async function Pricing() {
  const locale = await currentLocale();
  const ui = UI[locale].pricing;

  return (
    <>
      {/* ── The header, in the yellow the old Work with me section wore ── */}
      <section className="bg-brand-yellow px-6 pb-[clamp(2.5rem,6vh,4.5rem)] pt-[clamp(3rem,8vh,6rem)] sm:px-16">
        <p className="eyebrow text-brand-red">{ui.eyebrow}</p>
        <h1 className="text-signpainted-display mt-3 font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,5rem)] leading-[1.05] text-brand-maroon">
          {ui.heading}
        </h1>
        <p className="mt-5 max-w-2xl font-sans text-lg leading-snug text-brand-maroon">
          {ui.lede}
        </p>
        <p className="eyebrow mt-6 flex items-start gap-2.5 text-brand-maroon">
          <span aria-hidden className="mt-[0.3em] h-2 w-2 shrink-0 rounded-full bg-brand-red" />
          {say(AVAILABILITY, locale)}
        </p>
      </section>

      {/* ── Rates: four cards, the price falling left to right ──
          Each card keeps the rates note's shape: a label, the figure in
          the display face, and one line under it. Pro bono is filled
          maroon, because it is the card the belief lives on. */}
      <section className="bg-brand-orange px-6 py-[clamp(3rem,8vh,5.5rem)] sm:px-16">
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {rates.map((rate, i) => {
            const featured = i === rates.length - 1;
            return (
              <li
                key={say(rate.label, "en")}
                className={`flex flex-col border-4 border-brand-maroon p-6 shadow-[6px_6px_0_var(--color-brand-maroon)] ${
                  featured ? "bg-brand-maroon text-brand-cream" : "bg-brand-cream text-brand-maroon"
                }`}
              >
                <p className={`eyebrow ${featured ? "text-brand-yellow" : "text-brand-red"}`}>
                  {say(rate.label, locale)}
                </p>
                <p className="mt-3 font-[family-name:var(--font-display)] text-[1.75rem] leading-tight">
                  {say(rate.price, locale)}
                </p>
                <p
                  className={`mt-3 font-sans text-sm leading-relaxed ${
                    featured ? "text-brand-cream/90" : "text-neutral-700"
                  }`}
                >
                  {say(rate.body, locale)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Let's talk: the call, or the message form ── */}
      <section className="bg-brand-maroon px-6 py-[clamp(3rem,8vh,5.5rem)] sm:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand-yellow sm:text-4xl">
            {ui.talkHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-lg leading-snug text-brand-cream">
            {ui.talkBody}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-x-6 gap-y-4 sm:flex-row">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-brand-yellow bg-brand-yellow px-7 py-3.5 font-sans font-semibold text-brand-maroon transition-colors hover:bg-transparent hover:text-brand-yellow"
            >
              {ui.book}
            </a>
            <ContactTrigger className="font-sans text-base font-semibold text-brand-cream underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-yellow">
              {ui.brief}
            </ContactTrigger>
          </div>
        </div>
      </section>
    </>
  );
}
