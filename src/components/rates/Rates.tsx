import type { Locale } from "@/content/i18n";
import { HOURLY_RATE_USD } from "@/content/services";
import { ratesContent } from "./rates.content";

export default function Rates({ lang }: { lang: Locale }) {
  const copy = ratesContent[lang];
  const price = lang === "es" ? `${HOURLY_RATE_USD} USD` : `$${HOURLY_RATE_USD}`;

  return (
    <section className="px-4 py-12 sm:px-16">
      <h1 className="sr-only">{copy.heading}</h1>
      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="flex flex-col gap-2 rounded-xl bg-brand-cream p-6 text-brand-maroon">
          <p className="eyebrow">{copy.rateLabel}</p>
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none">
            {price} <span className="font-sans text-xl font-semibold">{copy.unit}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl bg-brand-cream p-6 text-brand-maroon">
          {/* Bungee draws a 0 like an O, so the number is set in the sans. */}
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none">
            {copy.floorLead} <span className="font-sans font-extrabold">{copy.floorAmount}</span>
          </p>
          <p className="font-sans text-base font-semibold">{copy.floorNote}</p>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center font-sans text-lg font-semibold text-brand-maroon">
        {copy.availability}
      </p>
    </section>
  );
}
