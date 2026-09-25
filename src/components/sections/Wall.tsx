import WallSections from "@/components/gallery/WallSections";
import { galleryItems } from "@/components/gallery/data";
import { creditLine } from "@/components/gallery/credit";
import type { WallSection } from "@/components/gallery/frames/base";
import type { FrameData } from "@/components/gallery/frames/registry";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";
import { Z } from "@/lib/layers";

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
export default async function Wall() {
  const locale = await currentLocale();
  const ui = UI[locale].wall;
  const groups = bySection(galleryItems);
  const rowStrings: Record<WallSection, { heading: string; note: string }> = {
    featured: { heading: ui.featuredHeading, note: ui.featuredNote },
    books: { heading: ui.booksHeading, note: ui.booksNote },
    seen: { heading: ui.seenHeading, note: ui.seenNote },
  };

  return (
    // No fixed height any more: three rows run taller than the one screen
    // every other part of the page keeps to, and that's the right trade —
    // see the note above. `min-h` was already a floor, not a cap, so this
    // is the same rule the rest of the page uses, just no longer the only
    // thing deciding the section's height.
    <section
      id="wall"
      className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col bg-brand-brick print:block print:min-h-0"
    >
      {/* Each row renders its items three times over for the loop, so a
          keyboard visitor who tabs in has three rows of tripled tiles to
          get through before reaching what follows. This is the way out:
          invisible until it takes focus, which happens exactly once — on
          the tab that would otherwise have started that walk.

          The target is whatever follows the Wall: `#work` today, since
          `#testimonials` renders nothing while that array is empty and a
          skip link to an element not in the document does nothing at all.
          Revisit this the day testimonials ship. */}
      <a
        href="#work"
        style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:border-2 focus:border-brand-yellow focus:bg-brand-maroon focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:normal-case focus:text-brand-cream sm:focus:left-16"
      >
        {ui.skip}
      </a>
      {/* The title and what the Wall is, together above the pieces, like
          the sign over a gallery wall. The line under the title used to
          hide behind an "i" marker as a tooltip; it says what the pieces
          are and that more keep arriving, which is worth saying out loud
          rather than on hover. Same heading size and side padding as
          every other section. */}
      <header className="px-6 pt-16 sm:px-16">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-white">
          {ui.heading}
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-white/85 sm:text-lg">
          {ui.note}
        </p>
      </header>
      <div className="pb-4 print:hidden">
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
