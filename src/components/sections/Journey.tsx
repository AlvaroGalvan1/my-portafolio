import BaseMap from "@/components/map/BaseMap";

// "My Journey", not "Map" — the map is the medium, not the subject. What
// goes on it is the route: campuses lived at, places passed through, where
// people are. See TODO.md for the pins still to add.
export default function Journey() {
  return (
    <section id="journey" className="bg-brand-cream px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-red">
        My Journey
      </h2>
      {/* Shorter on a phone. The no-repeat zoom floor is derived from the
          container's *larger* side, so an 85vh-tall, 340px-wide box forced
          the map two zoom levels in and opened on about 60° of longitude —
          two pins out of nine. Landscape-ish is also just the right shape
          for a world map. */}
      <div className="mt-10 h-[55vh] w-full border-4 border-brand-maroon sm:h-[85vh]">
        <BaseMap />
      </div>
    </section>
  );
}
