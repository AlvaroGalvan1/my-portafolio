"use client";

import { GROUPS, type JourneyStop, type PlaceGroup } from "@/content/places";
import { say, type Locale } from "@/content/i18n";

export type Chapter = {
  group: PlaceGroup;
  stops: JourneyStop[];
  /** Index in `journey` of this chapter's first and last stop. */
  first: number;
  last: number;
};

/** The journey cut into chapters: each run of consecutive stops in the same
 *  group is one. Derived, so a pin added to places.ts lands in the right
 *  chapter (or makes a new one) without anything here changing. */
export function chaptersOf(journey: JourneyStop[]): Chapter[] {
  const chapters: Chapter[] = [];
  journey.forEach((stop, i) => {
    const current = chapters.at(-1);
    if (current && current.group === stop.group) {
      current.stops.push(stop);
      current.last = i;
    } else {
      chapters.push({ group: stop.group, stops: [stop], first: i, last: i });
    }
  });
  return chapters;
}

// The whole story in one line, readable in the ten seconds a reader gives
// it: home, then each school in the order it happened, each shown by its
// own logo with its name in it. It sits above the map, so it is the first
// thing the Education panel says, and the names are the point: a mark
// without its name is a flicker of "oh, UWC" for someone who went there and
// nothing for anyone else.
//
// It is also the map's progress bar. While the route plays, each chapter's
// rule fills red as the marker reaches it and the one it is in now turns
// yellow; before and after, it is just the line. The rule is under the
// marks, against the map, since that is what it is measuring.
export default function JourneyStory({
  chapters,
  reached,
  locale,
  strings,
}: {
  chapters: Chapter[];
  /** Furthest stop reached by the player, or null if it hasn't run. */
  reached: number | null;
  locale: Locale;
  strings: { ports: string; cities: string };
}) {
  return (
    <ol className="grid grid-cols-2 items-end gap-x-3 gap-y-4 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ "--n": chapters.length } as React.CSSProperties}>
      {chapters.map((chapter) => {
        const group = GROUPS[chapter.group];
        const lit = reached !== null && reached >= chapter.first;
        const current = lit && reached !== null && reached <= chapter.last;
        const faded = reached !== null && !lit;
        const cities = [...new Set(chapter.stops.map((s) => s.name))];
        const where =
          cities.length <= 2
            ? cities.join(" · ")
            : `${cities.length} ${group.route ? strings.ports : strings.cities}`;

        // The logo with the name in it, where there is one. Otherwise the
        // square mark and the short name beside it, or a dot for home.
        const nameMark = group.nameMark ?? (group.wordmark ? group.logo : null);

        return (
          <li
            key={chapter.first}
            className={`flex flex-col justify-end border-b-4 px-1.5 pt-1 pb-2 transition-colors duration-300 ${
              lit ? "border-brand-red" : "border-brand-maroon/20"
            } ${current ? "bg-brand-yellow" : ""} ${faded ? "opacity-40" : ""}`}
          >
            <div className="flex h-9 items-center gap-2">
              {nameMark ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={nameMark}
                  alt={say(group.label, locale)}
                  className="max-h-full max-w-full object-contain object-left"
                />
              ) : group.logo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={group.logo} alt="" className="h-7 w-7 object-contain" />
                  <span className="truncate font-sans text-sm font-semibold text-brand-maroon">
                    {say(group.short, locale)}
                  </span>
                </>
              ) : (
                <>
                  <span
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white shadow-[0_0_0_2px_var(--color-brand-red)]"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="truncate font-sans text-sm font-semibold text-brand-maroon">
                    {say(group.short, locale)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 truncate font-sans text-xs text-brand-maroon/70">{where}</p>
          </li>
        );
      })}
    </ol>
  );
}
