import BaseMap from "@/components/map/BaseMap";
import { journeyStats } from "@/content/places";

// "My Journey", not "Map". The map is the medium, not the subject. What
// goes on it is the education section of the CV, drawn instead of listed:
// nine campuses across eight countries reads as a wall of place names in a
// bulleted list and as a route on a map, and the route is the actual point.
export default function Journey() {
  const { campuses, countries } = journeyStats;

  return (
    // Orange, where this was cream. That change forces the type: on orange,
    // brand-red falls to 1.88:1 and white to 2.59:1, both unreadable, and
    // maroon is the only colour in the palette that survives it at 4.14:1.
    // So the heading is maroon rather than the red every other section
    // heading uses — at display size that clears the 3:1 large-text bar
    // comfortably.
    <section id="journey" className="bg-brand-orange px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
        My Journey
      </h2>

      {/* The numbers read as a sentence rather than standing as three
          display-size stats above the map. They were the least interesting
          thing in the section — the pins are the content — and at that size
          they competed with the map for the eye. Still counted from
          places.ts, so they cannot drift out of date.

          Full maroon, not the 80% it was on cream: the tint read fine
          against cream at 6.13:1 and drops to 3.10:1 on orange. Solid
          maroon brings it to 4.14:1 — the best this pairing allows, and
          still a little short of the 4.5:1 that body text at this size
          wants. Cream is the background that made this line comfortable. */}
      <p className="mt-4 max-w-2xl font-sans text-base text-brand-maroon">
        <span className="font-semibold">
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
