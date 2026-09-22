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
