import type { ReactNode } from "react";
import BaseMap from "@/components/map/BaseMap";
import Experience from "./Experience";
import SkillBadges from "./SkillBadges";
import { places, GROUPS, journeyStats, type PlaceGroup } from "@/content/places";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// The voyage's dates, for the one printed line that stands in for its
// thirteen ports. The same string is on every voyage pin in places.ts; it
// is repeated here rather than read from one of them because picking "the
// dates of the first port" to mean "the dates of the voyage" is a coupling
// that breaks the moment a pin is reordered.
const VOYAGE_DATES = { en: "Jan – Apr 2022", es: "Ene – Abr 2022" };

// The groups that are schooling, as opposed to the voyage. Print lists
// these as entries and the voyage as one line — see below.
const STUDIED_GROUPS: PlaceGroup[] = ["minerva", "uwc", "uaa"];

// The CV's top half: education, then work, then whatever comes next.
//
// Two columns, one card each, and the right column starts lower than the
// left. That offset is the whole layout. Level with each other, the two
// cards ask to be read in parallel and neither wins; staggered, the page
// hands them over one at a time — Education arrives, you scroll, Experience
// comes up beside it — while both keep the half-measure they were designed
// at. The map is still a half-width map and the roles are still one column
// of four, which is what each of them was already sized for.
//
// Each column is a `space-y` stack rather than a single card, so a second
// panel goes under either one without the layout being renegotiated. The
// next one belongs on the left, under Education, where the shorter column
// has the room.
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  // Cream inside orange, which is what makes this much small type safe:
  // maroon on orange is 4.14:1 and fine for a heading, but body copy wants
  // the 6.13:1 it gets on cream.
  return <div className={`bg-brand-cream p-6 sm:p-10 lg:p-7 ${className}`}>{children}</div>;
}

function PanelHeading({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className="font-[family-name:var(--font-display)] text-3xl text-brand-maroon lg:text-2xl">
        {children}
      </h3>
      <div aria-hidden className="mt-4 h-1 w-24 bg-brand-red lg:mt-3" />
    </>
  );
}

export default async function Background() {
  const locale = await currentLocale();
  const ui = UI[locale].background;
  const skills = UI[locale].skills;

  return (
    <section id="background" className="bg-brand-orange px-6 py-20 sm:px-16 lg:py-0">
      {/* One screen tall from `lg`, like every other part of the page —
          hero, this, the Wall, the close.
          That constraint shaped what is inside: the stagger between the
          columns went, Experience runs two by two, and Skills runs three
          across under it. `min-h` rather than `h`, so a short laptop grows
          the panel instead of clipping the last role.

          Under `lg` none of this applies: one column, as long as it needs. */}
      <div className="flex flex-col lg:min-h-[calc(100svh-var(--nav-h))] lg:justify-center lg:py-[clamp(1.5rem,4vh,3rem)] print:block print:min-h-0">
      {/* The section title, and the CV on the same line at the right: the
          first thing in the section, not the last. A reader who came for
          the CV finds it before scrolling a map and four roles, and a
          reader who didn't still sees there is one.

          The button wears the site's stamp — the hard offset shadow the
          plates and buttons use — in yellow, the page's "press this"
          colour, which is what lifts it off the orange. Pressed, it sinks
          into its shadow. Screen only: printed, it would sit inside the
          document it offers. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-5">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
          {ui.heading}
        </h2>
        <a
          href="/cv.pdf"
          className="group inline-flex shrink-0 items-center gap-3 border-2 border-brand-maroon bg-brand-maroon px-6 py-3.5 font-sans text-base font-semibold text-brand-cream shadow-[5px_5px_0_var(--color-brand-yellow)] transition-[transform,box-shadow] duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_var(--color-brand-yellow)] print:hidden"
        >
          {skills.downloadPdf}
          <span className="border border-brand-cream/40 px-1.5 py-0.5 font-mono text-[0.65rem] tracking-wider text-brand-cream/80">
            PDF
          </span>
          <span aria-hidden className="transition-transform duration-150 group-hover:translate-y-0.5">
            ↓
          </span>
        </a>
      </div>
      <div className="mt-10 grid gap-6 lg:mt-[clamp(1rem,3vh,2rem)] lg:grid-cols-[11fr_13fr]">
        {/* `min-w-0` on both columns: a grid item defaults to
            `min-width: auto`, which means its content can push it wider
            than its track. At 320px the longest institution name did
            exactly that and gave the whole page a horizontal scrollbar. */}
        <div className="flex min-w-0 flex-col gap-6">
          <Panel className="flex-1">
          <PanelHeading>{ui.education}</PanelHeading>

          {/* The map, then the story under it in one line — see
              JourneyStory.tsx. The school marks live in that line rather
              than in a row of their own above the map: they are there to be
              recognised, not to be the heading. */}
          <div className="mt-6 print:hidden">
            <BaseMap
              locale={locale}
              itineraryLabel={ui.itinerary}
              journeyStrings={{
                play: ui.playJourney,
                stop: ui.stopJourney,
                ports: ui.ports,
                cities: ui.cities,
                flight: ui.flight,
                sea: ui.sea,
              }}
            />
          </div>

          {/* What replaces the map on paper. A Leaflet canvas prints as a
              grey rectangle at best and nothing at all at worst, and the
              education section of a CV is the one thing that cannot go
              missing from it — so the campuses are set as a list, from the
              same array that places them. */}
          <ul className="mt-4 hidden font-sans text-sm text-neutral-700 print:block">
            {places
              .filter((place) => STUDIED_GROUPS.includes(place.group))
              .map((place) => (
                <li key={place.id} className="mb-2">
                  <span className="font-semibold text-brand-maroon">
                    {place.name}
                  </span>{" "}
                  · {say(GROUPS[place.group].short, locale)} ·{" "}
                  {say(place.country, locale)}
                  {place.credential && <> · {say(place.credential, locale)}</>}
                  {place.dates && <> · {say(place.dates, locale)}</>}
                </li>
              ))}
          </ul>

          {/* The voyage as one line rather than thirteen. On the map its
              thirteen ports are the whole point — a line drawn across Europe
              is an argument no sentence makes — but thirteen list items on
              paper would out-length the four degrees above them and say
              less. So print gets the route, in order, as prose. */}
          <p className="mt-4 hidden font-sans text-sm text-neutral-700 print:block">
            <span className="font-semibold text-brand-maroon">
              {say(GROUPS.voyage.label, locale)}
            </span>{" "}
            · {journeyStats.ports} {ui.ports} · {say(VOYAGE_DATES, locale)} ·{" "}
            {places
              .filter((place) => place.group === "voyage")
              .map((place) => place.name)
              .join(", ")}
          </p>
          </Panel>

        </div>

        {/* Experience, then Skills under it — the two halves of one claim,
            what I did and what I did it with. Skills used to close the left
            column under the map; it moved here because the map is the one
            thing on this side that can give up height gracefully, and it
            needs the room more than a list of tools does. */}
        <div className="flex min-w-0 flex-col gap-6">
          <Panel>
            <PanelHeading>{ui.experience}</PanelHeading>
            <Experience />
          </Panel>
          <Panel>
            <PanelHeading>{skills.heading}</PanelHeading>
            <SkillBadges />
          </Panel>
        </div>
      </div>
      </div>

    </section>
  );
}
