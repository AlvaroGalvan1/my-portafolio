import BaseMap from "@/components/map/BaseMap";
import Button from "@/components/ui/Button";
import type { Locale } from "@/content/i18n";
import { profile } from "@/content/profile";
import { UI } from "@/content/ui";
import { aboutContent } from "./about.content";

export default function About({ lang }: { lang: Locale }) {
  const copy = aboutContent[lang];
  const background = UI[lang].background;

  return (
    <section className="px-6 py-12 sm:px-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        {/* Photo and two lines side by side; stacked on a phone, face first. */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.photo.src}
            alt={profile.photo.alt}
            className="aspect-square w-40 flex-none rounded-xl border-4 border-brand-maroon object-cover sm:w-48"
          />
          <div className="font-sans text-2xl font-semibold leading-snug text-brand-maroon sm:text-3xl">
            <h1>{copy.bio[0]}</h1>
            <p>{copy.bio[1]}</p>
          </div>
        </div>

        <BaseMap
          locale={lang}
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

        <div>
          <Button href="/cv.pdf">{copy.cv}</Button>
        </div>
      </div>
    </section>
  );
}
