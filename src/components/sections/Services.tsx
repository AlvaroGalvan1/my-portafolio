import ContactTrigger from "@/components/contact/ContactTrigger";
import { services, RATES_NOTE } from "@/content/services";
import { CALENDLY_URL } from "@/content/socials";

// "Work with me" — the one place on the page that asks for the sale.
//
// Last before the footer on purpose. Everything above it is evidence, and
// an ask that comes before the evidence is an advert; an ask that comes
// after it is the obvious next step. A reader who gets this far has already
// seen the models run and the map drawn.
//
// The buying itself is a booked call, not a checkout. That is not a
// placeholder for a real one: consulting at this size is priced per project
// (see RATES_NOTE), so there is no fixed thing to put in a cart. When there
// IS one — an hourly block, a fixed-scope audit, a template — the payment
// link goes in the button row below beside the two that are already there,
// and nothing else about this section has to change.
export default function Services() {
  return (
    // Yellow, the hero card's own colour, and the only other time the page
    // uses it as a field. That's the association being made: the card at
    // the top introduces the person, this one asks to be hired by you.
    // Maroon on yellow is 6.98:1, so body copy is comfortable here.
    <section id="work" className="bg-brand-yellow px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
        Work with me
      </h2>
      <p className="mt-4 max-w-2xl font-sans text-lg leading-snug text-brand-maroon">
        I take on consulting work in wildfire, climate adaptation and
        geospatial data. Independent, or alongside your team.
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {services.map((service) => (
          <div key={service.title}>
            {/* A rule over each one rather than a box around it: three
                bordered cards here would rhyme with the fact boxes above
                and read as the same kind of thing, which they aren't —
                those are links, these are prose. */}
            <div aria-hidden className="h-1 w-16 bg-brand-red" />
            <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl text-brand-maroon">
              {service.title}
            </h3>
            <p className="mt-4 font-sans text-base leading-relaxed text-brand-maroon">
              {service.body}
            </p>
          </div>
        ))}
      </div>

      {/* The ask, in a white panel so it separates from the three columns
          above without introducing a fourth colour. */}
      <div className="mt-12 flex flex-col gap-6 border-4 border-brand-maroon bg-white p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-xl font-sans text-base leading-relaxed text-neutral-700">
          {RATES_NOTE}
        </p>

        <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
          {/* The booking link first: it's the lower-effort of the two for
              the visitor, and the one that puts a real conversation in both
              calendars rather than a message in an inbox. */}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-brand-maroon bg-brand-maroon px-6 py-3 text-center font-sans font-semibold text-brand-cream hover:bg-transparent hover:text-brand-maroon"
          >
            Book a 30-minute call ↗
          </a>
          <ContactTrigger className="border-2 border-brand-maroon bg-white px-6 py-3 text-center font-sans font-semibold text-brand-maroon hover:bg-brand-cream">
            Send a brief
          </ContactTrigger>
        </div>
      </div>
    </section>
  );
}
