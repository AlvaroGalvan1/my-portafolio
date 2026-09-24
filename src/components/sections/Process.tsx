import { process } from "@/content/process";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// How a project runs, once someone has booked the call Services points at.
// Three cards, same offset-shadow frame as Work with me and the Pricing
// rate cards, so the three sections read as one family of "what happens if
// you press the button".
export default async function Process() {
  const locale = await currentLocale();
  const ui = UI[locale].process;

  return (
    <section
      id="process"
      className="border-t-4 border-brand-maroon bg-brand-orange px-6 py-[clamp(3rem,8vh,5.5rem)] sm:px-16 print:hidden"
    >
      <div className="max-w-xl">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
          {ui.heading}
        </h2>
        <p className="mt-3 font-sans text-lg leading-snug text-brand-maroon/80">{ui.lede}</p>
      </div>

      <ol className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-6 md:grid-cols-3">
        {process.map((step, i) => {
          const title = say(step.title, locale);
          return (
            <li
              key={title}
              className="flex flex-col border-2 border-brand-maroon bg-brand-cream p-6 shadow-[4px_4px_0_var(--color-brand-maroon)]"
            >
              <p className="font-[family-name:var(--font-display)] text-sm text-brand-red">0{i + 1}</p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-brand-maroon">
                {title}
              </h3>
              <p className="mt-2 font-sans text-base leading-snug text-neutral-800">
                {say(step.body, locale)}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
