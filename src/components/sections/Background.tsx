import Image from "next/image";
import type { ReactNode } from "react";
import BaseMap from "@/components/map/BaseMap";
import Experience from "./Experience";
import { places, GROUPS, journeyStats, type PlaceGroup } from "@/content/places";

// The groups that are schooling, as opposed to the voyage. Print lists
// these as entries and the voyage as one line — see below.
const STUDIED_GROUPS: PlaceGroup[] = ["minerva", "uwc", "uaa"];

// The named row above the map. Every group that has a name worth spelling
// out, in the order they read best — three institutions, then the voyage,
// which is the one a reader is least likely to recognise and the one the
// map draws as a line rather than a scatter.
const NAMED_GROUPS: PlaceGroup[] = ["minerva", "uwc", "uaa", "voyage"];

// The CV's top half: education, then work, then whatever comes next.
//
// These were two columns inside one card, and the card is now one card per
// thing, stacked. Side by side, each half was squeezed into a column it
// didn't want: the map is a world map and half a screen of it is mostly
// ocean, and the roles were a single narrow list of four when the same four
// sit comfortably two-up. Stacked, each panel gets the full measure and the
// page scrolls through them one at a time rather than asking the eye to
// read two things in parallel.
//
// Panels are a list on purpose. A third — and a fourth — is meant to go in
// below, so this is built as a stack that accepts one rather than a layout
// that has to be renegotiated when one arrives.
function Panel({ children }: { children: ReactNode }) {
  // Cream inside orange, which is what makes this much small type safe:
  // maroon on orange is 4.14:1 and fine for a heading, but body copy wants
  // the 6.13:1 it gets on cream.
  return <div className="bg-brand-cream p-6 sm:p-10">{children}</div>;
}

function PanelHeading({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className="font-[family-name:var(--font-display)] text-3xl text-brand-maroon">
        {children}
      </h3>
      <div aria-hidden className="mt-4 h-1 w-24 bg-brand-red" />
    </>
  );
}

export default function Background() {
  return (
    <section id="background" className="bg-brand-orange px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-maroon">
        Background
      </h2>
      <p className="mt-4 max-w-2xl font-sans text-base text-brand-maroon">
        Where I studied, including the term I spent at sea, and what
        I&apos;ve been paid to work out since.
      </p>

      <div className="mt-10 space-y-6">
        <Panel>
          <PanelHeading>Education</PanelHeading>

          {/* The marks with the institutions spelled out. The map's own
              legend already carries these logos, but only as "UWC" and
              "UAA" — abbreviations a reader outside this world has no way
              to expand. This row is where the names live; the legend is
              where the counts and the toggles do. */}
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
            {NAMED_GROUPS.map((key) => (
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

          {/* Taller now that it has the full measure: at half width this was
              a column of ocean at any height, and the fix was to keep it
              short. A world map across the whole panel can afford to be a
              world map. The no-repeat zoom floor is derived from the
              container's larger side, so a wide box is also what keeps
              every pin in the opening view. */}
          <div className="mt-7 h-[55svh] w-full border-4 border-brand-maroon print:hidden sm:h-[65svh]">
            <BaseMap />
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
                  · {GROUPS[place.group].short} · {place.country}
                  {place.credential && <> · {place.credential}</>}
                  {place.dates && <> · {place.dates}</>}
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
              {GROUPS.voyage.label}
            </span>{" "}
            · {journeyStats.ports} ports · Jan – Apr 2022 ·{" "}
            {places
              .filter((place) => place.group === "voyage")
              .map((place) => place.name)
              .join(", ")}
          </p>
        </Panel>

        <Panel>
          <PanelHeading>Experience</PanelHeading>
          <Experience />
        </Panel>

        <NextPanelSlot />
      </div>
    </section>
  );
}

// The empty panel, waiting for whatever goes in it next.
//
// It renders in development ONLY, and that is deliberate rather than shy.
// The slot is genuinely useful while building — it holds the shape, so the
// spacing of a three-panel stack can be judged before there are three
// panels — and it is exactly the thing this site's guardrails exist to keep
// off a live page. The Wall made this mistake once already and the note in
// data.ts records it: twenty dashed placeholders meant twenty empty boxes,
// and empty boxes are the first thing a visitor counts.
//
// To ship a third panel: write it as another <Panel> above, and delete this.
// `NODE_ENV` is statically replaced at build time, so nothing below reaches
// the production bundle at all — it isn't hidden with CSS, it isn't there.
function NextPanelSlot() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="flex min-h-[14rem] items-center justify-center border-4 border-dashed border-brand-cream/60 p-10">
      <p className="max-w-sm text-center font-sans text-sm leading-relaxed text-brand-cream">
        <span className="font-semibold uppercase tracking-[0.2em]">
          Next panel
        </span>
        <br />
        Visible in development only. Add a third <code>&lt;Panel&gt;</code> in
        Background.tsx and delete <code>NextPanelSlot</code>.
      </p>
    </div>
  );
}
