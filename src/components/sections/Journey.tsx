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
      <div className="mt-10 h-[85vh] w-full border-4 border-brand-maroon">
        <BaseMap />
      </div>
    </section>
  );
}
