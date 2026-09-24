import type { ReactNode } from "react";
import Experience from "./Experience";
import SkillBadges from "./SkillBadges";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// The CV's top half: work, then the toolkit it was built with.
//
// Education used to stand here too, in a column of its own next to
// Experience, carrying a map. It's on the About page now — the photo and
// the bio that had nowhere to render moved with it (see About.tsx) — so
// this section is Experience and Skills, one column, stacked.
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
      <div className="mx-auto mt-10 flex w-full max-w-3xl min-w-0 flex-col gap-6 lg:mt-[clamp(1rem,3vh,2rem)]">
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

    </section>
  );
}
