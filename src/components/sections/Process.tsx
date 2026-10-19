import ProcessSteps from "./ProcessSteps";
import { process } from "@/content/process";
import { CALENDLY_URL } from "@/content/socials";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// How working together runs, and the one button that starts it. "Work with
// me" used to sit above this with three cards of its own and the booking
// buttons; it went, and the booking call moved here, so the promise and
// the steps behind it are one dark panel instead of two sections in a row.
//
// The heading and the button on the left, the steps on a rail on the
// right (ProcessSteps, the one client piece, because only it has state).
// The panel is maroon on cream: the darkest field on the page, so the eye
// lands on it as the place to act.
export default async function Process() {
  const locale = await currentLocale();
  const ui = UI[locale].process;
  const book = UI[locale].services.book;

  return (
    <section
      id="process"
      className="border-t-4 border-brand-maroon bg-brand-cream px-6 py-[clamp(3rem,8vh,5.5rem)] sm:px-16 print:hidden"
    >
      <div className="grid gap-12 rounded-2xl bg-brand-maroon px-7 py-10 sm:px-12 sm:py-14 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col">
          <h2 className="font-[family-name:var(--font-display)] text-4xl uppercase leading-[0.95] text-brand-cream sm:text-5xl lg:text-6xl">
            {ui.heading}
          </h2>
          <p className="mt-6 max-w-md font-sans text-lg leading-snug text-brand-cream/80">{ui.lede}</p>
          <div className="mt-auto pt-10">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-brand-orange px-7 py-4 font-sans text-base font-semibold text-brand-maroon transition-colors hover:bg-brand-yellow"
          >
            {book}
          </a>
          </div>
        </div>

        <ProcessSteps
          steps={process.map((step) => ({ title: say(step.title, locale), body: say(step.body, locale) }))}
        />
      </div>
    </section>
  );
}
