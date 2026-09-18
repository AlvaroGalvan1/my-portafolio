import HorizontalGallery from "@/components/gallery/HorizontalGallery";
import { galleryItems } from "@/components/gallery/data";
import { creditLine } from "@/components/gallery/credit";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";
import { Z } from "@/lib/layers";

// A horizontally-scrollable, looping wall of pieces — sits inline in the
// normal page flow (no scroll hijacking). See src/components/gallery/ for
// the implementation and src/components/gallery/data.ts for the pieces.
export default async function Wall() {
  const locale = await currentLocale();
  const ui = UI[locale].wall;

  return (
    // One screen tall, like every other part of the page: hero,
    // background, this, and the close. A flex column so the gallery can
    // take whatever height the heading leaves.
    <section
      id="wall"
      className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col bg-brand-brick print:block print:min-h-0"
    >
      {/* The Wall renders its items three times over for the loop, so a
          keyboard visitor who tabs into it has 48 tiles to get through
          before reaching what follows. This is the way out: invisible until
          it takes focus, which happens exactly once — on the tab that would
          otherwise have started that walk.

          The target is whatever section follows the Wall. That was
          `#skills` until the toolkit moved up into Background; it is now
          `#work`, which is the next section a keyboard visitor can
          actually land on — `#testimonials` renders nothing while that
          array is empty, and a skip link to an element that is not in the
          document does nothing at all. Revisit this the day testimonials
          ship. A skip link goes forward, and no further than it has to. */}
      <a
        href="#work"
        style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:border-2 focus:border-brand-yellow focus:bg-brand-maroon focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:normal-case focus:text-brand-cream sm:focus:left-16"
      >
        {ui.skip}
      </a>
      {/* "My Wall" says what it looks like, not what it holds, so the info
          marker carries the rest. It's a hover/focus note rather than a
          standing line of body copy: the heading stays a heading, and the
          explanation is there for whoever wonders. CSS-only — the button
          exists to give keyboard and touch users a focus target, since
          hover alone would strand both. */}
      <h2 className="flex items-center gap-3 bg-brand-brick px-6 pt-16 font-[family-name:var(--font-display)] text-4xl text-white sm:px-16">
        {ui.heading}
        <span className="group relative inline-flex">
          <button
            type="button"
            aria-label={ui.whatsThis}
            aria-describedby="wall-note"
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/50 font-sans text-xs font-bold leading-none text-white/80 transition-colors hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white"
          >
            i
          </button>
          <span
            id="wall-note"
            role="tooltip"
            /* Shifted two thirds of its own width left on a phone, not one
               third. The note is laid out even while it is transparent, so
               at 360px the old offset left it hanging 17px past the right
               edge of the document — which gives the WHOLE PAGE a
               horizontal scrollbar, permanently, for a tooltip nobody can
               see. Above `sm` there is room and it sits under its marker. */
            style={{ zIndex: Z.CARD_CONTENT }}
            className="pointer-events-none absolute left-0 top-full mt-3 w-64 max-w-[60vw] -translate-x-2/3 border-2 border-brand-maroon bg-brand-cream p-3 font-sans text-sm font-normal normal-case leading-snug text-brand-maroon opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:w-80 sm:-translate-x-0"
          >
            {ui.note}
          </span>
        </span>
      </h2>
      <div className="flex flex-1 flex-col print:hidden">
        <HorizontalGallery items={galleryItems} locale={locale} strings={ui} />
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
    </section>
  );
}
