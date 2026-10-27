import WallSections from "./WallSections";
import { galleryItems } from "./data";
import { creditLine } from "./credit";
import type { WallSection } from "./frames/base";
import type { FrameData } from "./frames/registry";
import { say, type Locale } from "@/content/i18n";
import { UI } from "@/content/ui";

// Three rows, not one: what's mine, what I've read, what's someone else's
// that I liked enough to hang up. This used to be one wall where "mine"
// meant "no byline" — correct, but the kind of correct a first-time reader
// has to already know to read for. Splitting by `section` (see
// frames/base.ts) says it in a heading instead, three times, and the
// byline convention still holds underneath as the second confirmation.
//
// On screen only Featured projects shows at first — see WallSections.tsx.
// The other two rows are a tab click away, not a second and third scroll
// past the point of the page. Print isn't interactive, so the printed
// version still lists all three, one under another; see the print block
// below.
const ROW_ORDER: WallSection[] = ["featured", "books", "seen"];

function bySection(items: FrameData[]): Record<WallSection, FrameData[]> {
  const groups: Record<WallSection, FrameData[]> = { featured: [], books: [], seen: [] };
  for (const item of items) groups[item.section].push(item);
  return groups;
}

// A horizontally-scrollable, looping wall of pieces — sits inline in the
// normal page flow (no scroll hijacking). See src/components/gallery/ for
// the implementation and src/components/gallery/data.ts for the pieces.
export default function Wall({ locale }: { locale: Locale }) {
  const ui = UI[locale].wall;
  const groups = bySection(galleryItems);
  const rowStrings: Record<WallSection, { heading: string; note: string }> = {
    featured: { heading: ui.featuredHeading, note: ui.featuredNote },
    books: { heading: ui.booksHeading, note: ui.booksNote },
    seen: { heading: ui.seenHeading, note: ui.seenNote },
  };

  return (
    <section
      id="wall"
      className="relative flex flex-1 flex-col justify-center gap-4 bg-brand-brick py-4 print:block"
    >
      {/* One screen: the title, the tabs and two rows of pieces. */}
      <header className="px-6 sm:px-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
          {ui.heading}
        </h2>
      </header>
      <div className="print:hidden">
        <WallSections
          order={ROW_ORDER.filter((section) => groups[section].length > 0)}
          groups={groups}
          rowStrings={rowStrings}
          locale={locale}
          strings={ui}
        />
      </div>

      {/* The Wall, printed. A horizontal scroller that renders its items
          three times over for the loop is the single most unprintable thing
          on this site — on paper it is one frozen tile and two-thirds of
          another. So print gets the index instead: every piece by name, with
          whose work it is, which is what a CV's "selected work" section is
          anyway. Grouped the same way the screen is, so the paper version
          answers the same "is this yours?" question rather than going back
          to bylines alone. */}
      <div className="hidden bg-white px-6 py-8 font-sans sm:px-16 print:block">
        {ROW_ORDER.filter((section) => groups[section].length > 0).map((section) => (
          <div key={section} className="mb-6 last:mb-0">
            <h3 className="mb-2 font-semibold text-brand-maroon">
              {rowStrings[section].heading}
            </h3>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-700">
              {groups[section].map((item) => {
                const credit = creditLine(item.credit, locale);
                return (
                  <li key={item.id}>
                    <span className="font-semibold text-brand-maroon">
                      {say(item.title, locale)}
                    </span>
                    {credit && <> · {credit}</>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
