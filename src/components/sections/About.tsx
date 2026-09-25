import Link from "next/link";
import BaseMap from "@/components/map/BaseMap";
import { profile } from "@/content/profile";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// Education used to be its own panel on the homepage, next to Experience.
// It's gone from there now — everything it carried lives here instead: the
// bio that had nowhere to render, the photo, and the journey map, moved
// here wholesale from Background.tsx (see the note there). The photo sits
// next to the map rather than next to the words — a face beside the place
// that made it, which is a better pairing than a face beside a paragraph.
export default async function About() {
  const locale = await currentLocale();
  const ui = UI[locale].about;
  const background = UI[locale].background;

  return (
    <>
      {/* ── Who I am, in one line ── */}
      <section className="bg-brand-yellow px-6 pb-[clamp(2.5rem,6vh,4.5rem)] pt-[clamp(3rem,8vh,6rem)] sm:px-16">
        <p className="eyebrow text-brand-red">{ui.eyebrow}</p>
        <h1 className="text-signpainted-display mt-3 font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,5rem)] leading-[1.05] text-brand-maroon">
          {ui.heading}
        </h1>
        <p className="mt-5 max-w-2xl font-sans text-lg leading-snug text-brand-maroon">
          {say(profile.bio[0], locale)}
        </p>
      </section>

      {/* ── The photo, next to the map, then the words ── */}
      <section className="bg-brand-cream px-6 py-[clamp(3rem,8vh,5.5rem)] sm:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-brand-maroon">
            {ui.transition}
          </p>

          {/* The face and the place, side by side. Stacked on a phone —
              photo above the map, in that order, since a name and a face
              earn the map's trust rather than the other way round. */}
          <div className="mt-8 grid gap-6 sm:grid-cols-[14rem_1fr] sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo.src}
              alt={profile.photo.alt}
              className="aspect-square w-40 border-4 border-brand-maroon object-cover shadow-[6px_6px_0_var(--color-brand-red)] sm:w-full"
            />
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-brand-maroon">
                {ui.journeyHeading}
              </h2>
              <div aria-hidden className="mt-3 h-1 w-24 bg-brand-red" />
              <div className="mt-4">
                <BaseMap
                  locale={locale}
                  itineraryLabel={background.itinerary}
                  journeyStrings={{
                    play: background.playJourney,
                    stop: background.stopJourney,
                    ports: background.ports,
                    cities: background.cities,
                    flight: background.flight,
                    sea: background.sea,
                  }}
                />
              </div>
            </div>
          </div>

          {/* One link, not a second set of buttons. Booking a call and
              sending a brief are Work with me's job — repeating them here
              just gives a reader two different "reach out" moments to
              choose between on two different pages. This points at the
              one that actually is that moment. */}
          <Link
            href={`/${locale}#work`}
            className="mt-8 inline-block font-sans text-sm font-semibold text-brand-red underline decoration-brand-red/40 decoration-2 underline-offset-4 hover:decoration-brand-red"
          >
            {ui.workLink}
          </Link>
        </div>
      </section>
    </>
  );
}
