import BaseMap from "@/components/map/BaseMap";
import { journeyStats } from "@/content/places";

// "My Journey", not "Map". The map is the medium, not the subject. What
// goes on it is the education section of the CV, drawn instead of listed:
// nine campuses across eight countries reads as a wall of place names in a
// bulleted list and as a route on a map, and the route is the actual point.
export default function Journey() {
  const { campuses, countries } = journeyStats;

  return (
    <section id="journey" className="bg-brand-cream px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-red">
        My Journey
      </h2>

      {/* The numbers read as a sentence rather than standing as three
          display-size stats above the map. They were the least interesting
          thing in the section — the pins are the content — and at that size
          they competed with the map for the eye. Still counted from
          places.ts, so they cannot drift out of date. */}
      <p className="mt-4 max-w-2xl font-sans text-base text-brand-maroon/80">
        <span className="font-semibold text-brand-maroon">
          {campuses} campuses, {countries} countries, one degree.
        </span>{" "}
        Where the studying happened — tap a mark to read the entry.
      </p>

      {/* Shorter on a phone. The no-repeat zoom floor is derived from the
          container's larger side, so an 85vh-tall, 340px-wide box forced
          the map two zoom levels in and opened on about 60 degrees of
          longitude, two pins out of nine. Landscape-ish is also just the
          right shape for a world map. */}
      <div className="mt-8 h-[55svh] w-full border-4 border-brand-maroon sm:h-[85svh]">
        <BaseMap />
      </div>
    </section>
  );
}
