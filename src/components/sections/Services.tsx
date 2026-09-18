import ContactTrigger from "@/components/contact/ContactTrigger";
import { services, RATES_NOTE } from "@/content/services";
import { CALENDLY_URL } from "@/content/socials";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// "Work with me" — the one place on the page that asks for the sale.
//
// Last before the footer on purpose. Everything above it is evidence, and
// an ask that comes before the evidence is an advert; an ask that comes
// after it is the obvious next step. A reader who gets this far has already
// seen the models run and the map drawn.
//
// The buying itself is a booked call or a written brief, not a checkout.
// That is not a placeholder for a real one: consulting at this size is
// priced per project (see RATES_NOTE), so there is no fixed thing to put in
// a cart. When there IS one — an hourly block, a fixed-scope audit, a
// template — the payment link goes in the panel beside the other two, and
// nothing else about this section has to change.
export default async function Services() {
  const locale = await currentLocale();
  const ui = UI[locale];

  return (
    // Yellow, the hero card's own colour, and the only other time the page
    // uses it as a field. That's the association being made: the card at
    // the top introduces the person, this one asks to be hired by you.
    // Maroon on yellow is 6.98:1, so body copy is comfortable here.
    //
    // With the footer under it, this is the last screen of the page, and it
    // is exactly one screen: tall enough that the Wall is gone from view
    // when you land on it, and the footer's height (measured, see
    // MeasuredFooter) taken off so the two end flush with the bottom. The
    // content is centred in whatever height that leaves. The vertical
    // padding here and in the footer is in vh so the pair can shrink to fit
    // a laptop screen instead of overshooting it by a few lines.
    <section
      id="work"
      className="flex min-h-[calc(100svh-var(--nav-h)-var(--footer-h,0px))] flex-col justify-center bg-brand-yellow px-6 py-[clamp(2.5rem,6vh,5rem)] sm:px-16 print:min-h-0"
    >
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
        {ui.services.heading}
      </h2>
      <p className="mt-4 max-w-2xl font-sans text-lg leading-snug text-brand-maroon">
        {ui.services.lede}
      </p>

      {/* The ask, directly under the lede rather than at the foot of the
          section. The argument for putting it last was that an ask should
          follow the evidence — but the evidence is the whole page above
          this section, not the three columns below it. A reader who has
          scrolled past the work, the map and the Wall has already been
          persuaded or hasn't; making them read three more paragraphs
          before finding the button taxes exactly the person who arrived
          ready.

          Both actions sit on this line, side by side. Talking and writing
          are two ways of doing the same thing, and a reader who would
          rather type than get on a call shouldn't have to find that out at
          the bottom of the page. The call is the filled button because it
          is the lower-effort of the two for the visitor; the brief is the
          link beside it.

          White panel so it separates from the yellow field without
          introducing a fourth colour. */}
      <div className="mt-[clamp(1.25rem,3vh,2rem)] flex flex-col gap-5 border-4 border-brand-maroon bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-[clamp(1.25rem,3vh,2rem)]">
        <p className="max-w-xl font-sans text-base leading-relaxed text-neutral-700">
          {say(RATES_NOTE, locale)}
        </p>

        <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-brand-maroon bg-brand-maroon px-6 py-3 text-center font-sans font-semibold text-brand-cream hover:bg-transparent hover:text-brand-maroon"
          >
            {ui.services.book}
          </a>
          <ContactTrigger className="font-sans text-sm font-semibold text-brand-maroon underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red">
            {ui.services.brief}
          </ContactTrigger>
        </div>
      </div>

      <div className="mt-[clamp(1.75rem,4.5vh,3rem)] grid gap-10 md:grid-cols-3">
        {services.map((service) => {
          const title = say(service.title, locale);
          return (
            <div key={title}>
              {/* A rule over each one rather than a box around it: three
                  bordered cards here would rhyme with the fact boxes above
                  and read as the same kind of thing, which they aren't —
                  those are links, these are prose. */}
              <div aria-hidden className="h-1 w-16 bg-brand-red" />
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl text-brand-maroon">
                {title}
              </h3>
              <p className="mt-4 font-sans text-base leading-relaxed text-brand-maroon">
                {say(service.body, locale)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
