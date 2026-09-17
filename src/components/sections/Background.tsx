import Image from "next/image";
import BaseMap from "@/components/map/BaseMap";
import Experience from "./Experience";
import { places, GROUPS, type PlaceGroup } from "@/content/places";

// The CV's top half, laid out as a CV is: education on one side, work on
// the other, read together rather than one after the other.
//
// The education side is a map and not a list, and that's the whole argument
// of this section. Nine campuses across eight countries is a wall of place
// names in a bulleted list; the same nine as pins is a route, and a route is
// a thing a reader can look at and draw their own conclusion from. Show,
// don't tell, with the map doing the showing.
//
// This was "My Journey", a full-width map sitting after the Wall. Same map,
// but the map alone answered "where has he been" and left "and what has he
// done" to a PDF. Side by side, each half is the other's context: the
// countries explain the range, the roles explain the point.
const INSTITUTIONS: PlaceGroup[] = ["minerva", "uwc", "uaa"];

export default function Background() {
  return (
    // Orange, as this section has always been. The panel inside it is what
    // makes that safe for this much small type: maroon on orange is 4.14:1
    // and fine for a heading, but the takeaways and captions here are body
    // copy, which wants the 6.13:1 it gets on cream.
    <section id="background" className="bg-brand-orange px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
        Background
      </h2>
      <p className="mt-4 max-w-2xl font-sans text-base text-brand-maroon">
        Where I studied, and what I&apos;ve been paid to work out since.
      </p>

      <div className="mt-10 bg-brand-cream p-6 sm:p-10">
        {/* Side by side from `lg`, stacked below it. Not `md`: the map needs
            real width before it's worth anything, and a half-column at
            768px is narrower than the full-width map was on a phone. */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-3xl text-brand-maroon">
              Education
            </h3>
            <div aria-hidden className="mt-4 h-1 w-24 bg-brand-red" />

            {/* The marks with the institutions spelled out. The map's own
                legend already carries these logos, but only as "UWC" and
                "UAA" — abbreviations a reader outside this world has no way
                to expand. This row is where the names live; the legend is
                where the counts and the toggles do. */}
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              {INSTITUTIONS.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <Image
                    src={GROUPS[key].logo}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-maroon">
                    {GROUPS[key].label}
                  </span>
                </div>
              ))}
            </div>

            {/* Shorter than the 85svh it ran at full width: at half the
                width, a map that tall is a column of ocean. The no-repeat
                zoom floor comes off the container's larger side, so the
                landscape-ish box is also what keeps all nine pins in the
                opening view. */}
            <div className="mt-6 h-[45svh] w-full border-4 border-brand-maroon print:hidden lg:h-[52svh]">
              <BaseMap />
            </div>

            {/* What replaces the map on paper. A Leaflet canvas prints as a
                grey rectangle at best and nothing at all at worst, and the
                education section of a CV is the one thing that cannot go
                missing from it — so the same nine pins are set as a list,
                from the same array that places them. */}
            <ul className="mt-4 hidden font-sans text-sm text-neutral-700 print:block">
              {places
                .filter((place) => place.group !== "friends")
                .map((place) => (
                  <li key={place.id} className="mb-2">
                    <span className="font-semibold text-brand-maroon">
                      {place.name}
                    </span>{" "}
                    · {GROUPS[place.group].short} · {place.country}
                    {place.credential && <> · {place.credential}</>}
                    {place.dates && <> · {place.dates}</>}
                  </li>
                ))}
            </ul>
          </div>

          <Experience />
        </div>
      </div>
    </section>
  );
}
