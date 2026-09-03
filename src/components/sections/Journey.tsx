import BaseMap from "@/components/map/BaseMap";
import { journeyStats } from "@/content/places";

// "My Journey", not "Map". The map is the medium, not the subject. What
// goes on it is the education section of the CV, drawn instead of listed:
// nine campuses across eight countries reads as a wall of place names in a
// bulleted list and as a route on a map, and the route is the actual point.
export default function Journey() {
  const stats = [
    { value: journeyStats.campuses, label: "campuses" },
    { value: journeyStats.countries, label: "countries" },
    { value: journeyStats.institutions, label: "institutions" },
  ];

  return (
    <section id="journey" className="bg-brand-cream px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-red">
        My Journey
      </h2>

      {/* The headline numbers do the work a CV heading would: they say how
          much there is before anyone clicks a single pin. Counted from the
          data in places.ts, so they cannot drift out of date. */}
      <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-display)] text-4xl leading-none text-brand-maroon">
              {stat.value}
            </span>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-maroon/60">
              {stat.label}
            </span>
          </div>
        ))}
        <p className="font-sans text-sm text-brand-maroon/70">
          Where the studying happened. Tap a mark to read the entry.
        </p>
      </div>

      {/* Shorter on a phone. The no-repeat zoom floor is derived from the
          container's larger side, so an 85vh-tall, 340px-wide box forced
          the map two zoom levels in and opened on about 60 degrees of
          longitude, two pins out of nine. Landscape-ish is also just the
          right shape for a world map. */}
      <div className="mt-8 h-[55vh] w-full border-4 border-brand-maroon sm:h-[85vh]">
        <BaseMap />
      </div>
    </section>
  );
}
