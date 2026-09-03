import BaseMap from "@/components/map/BaseMap";

// Base layer only for now — TODO.md tracks the pins to add (places lived,
// friends' locations, a "What is UWC" marker + popup).
export default function MapSection() {
  return (
    <section className="bg-brand-cream px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-red">
        Map
      </h2>
      <div className="mt-10 h-[85vh] w-full border-4 border-brand-maroon">
        <BaseMap />
      </div>
    </section>
  );
}
