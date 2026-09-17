import HorizontalGallery from "@/components/gallery/HorizontalGallery";
import { galleryItems } from "@/components/gallery/data";
import { creditLine } from "@/components/gallery/credit";
import { Z } from "@/lib/layers";

const WALL_NOTE =
  "A collection of my own projects alongside work I admire in the wildfire and climate-adaptation space.";

// A horizontally-scrollable, looping wall of pieces — sits inline in the
// normal page flow (no scroll hijacking). See src/components/gallery/ for
// the implementation and src/components/gallery/data.ts for the pieces.
export default function Wall() {
  return (
    <section id="wall" className="relative">
      {/* The Wall renders its items three times over for the loop, so a
          keyboard visitor who tabs into it has 48 tiles to get through
          before reaching what follows. This is the way out: invisible until
          it takes focus, which happens exactly once — on the tab that would
          otherwise have started that walk.

          The target is whatever section follows the Wall, which is now
          `#skills` — the map moved above the Wall into Background, and a
          link pointing at it would send a keyboard visitor back up the
          page, which is worse than no skip link at all. A skip link goes
          forward, and no further than it has to. */}
      <a
        href="#skills"
        style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:border-2 focus:border-brand-yellow focus:bg-brand-maroon focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:normal-case focus:text-brand-cream sm:focus:left-16"
      >
        Skip the Wall
      </a>
      {/* "My Wall" says what it looks like, not what it holds, so the info
          marker carries the rest. It's a hover/focus note rather than a
          standing line of body copy: the heading stays a heading, and the
          explanation is there for whoever wonders. CSS-only — the button
          exists to give keyboard and touch users a focus target, since
          hover alone would strand both. */}
      <h2 className="flex items-center gap-3 bg-brand-brick px-6 pt-16 font-[family-name:var(--font-display)] text-4xl text-white sm:px-16">
        My Wall
        <span className="group relative inline-flex">
          <button
            type="button"
            aria-label="What's on this wall?"
            aria-describedby="wall-note"
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/50 font-sans text-xs font-bold leading-none text-white/80 transition-colors hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white"
          >
            i
          </button>
          <span
            id="wall-note"
            role="tooltip"
            style={{ zIndex: Z.CARD_CONTENT }}
            className="pointer-events-none absolute left-0 top-full mt-3 w-64 -translate-x-1/3 border-2 border-brand-maroon bg-brand-cream p-3 font-sans text-sm font-normal normal-case leading-snug text-brand-maroon opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:w-80 sm:-translate-x-0"
          >
            {WALL_NOTE}
          </span>
        </span>
      </h2>
      <div className="print:hidden">
        <HorizontalGallery items={galleryItems} />
      </div>

      {/* The Wall, printed. A horizontal scroller that renders its items
          three times over for the loop is the single most unprintable thing
          on this site — on paper it is one frozen tile and two-thirds of
          another. So print gets the index instead: every piece by name, with
          whose work it is, which is what a CV's "selected work" section is
          anyway. Same array, no second list to maintain. */}
      <div className="hidden bg-white px-6 py-8 font-sans sm:px-16 print:block">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-neutral-700">
          {galleryItems.map((item) => {
            const credit = creditLine(item.credit);
            return (
              <li key={item.id}>
                <span className="font-semibold text-brand-maroon">{item.title}</span>
                {credit && <> · {credit}</>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
