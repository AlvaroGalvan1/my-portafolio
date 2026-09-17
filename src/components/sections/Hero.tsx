import HeroBackdrop from "./HeroBackdrop";
import HeroCard from "./HeroCard";
import { creditLine } from "@/components/gallery/credit";
import { profile } from "@/content/profile";
import { Z } from "@/lib/layers";

// The opening stage: the Coral loop held still behind a card that opens as
// you scroll. At the top of the page the card is just the name, in the
// bottom-left corner; by the bottom of the track it holds the About text,
// the portrait and the buttons. See HeroCard.tsx and the `.hero-card` block
// in globals.css.
//
// This absorbed what used to be a separate yellow About section below the
// hero. Two sections meant the name scrolled away before the bio arrived;
// one card that grows keeps them on screen together, which is the point —
// a visitor reaching the Wall now knows whose work it is.
export default function Hero() {
  // Null for `relation: "mine"` — work that shouldn't carry a byline. The
  // plate hides entirely in that case rather than rendering "Backdrop —"
  // with nothing after it.
  const backdropCredit = creditLine(profile.heroBackdrop.credit);

  return (
    <section className="relative bg-brand-orange">
      {/* Two screens tall: the first is the card closed, the second is the
          distance over which it opens. Collapses to one screen under
          prefers-reduced-motion — see globals.css. */}
      <div data-hero-track className="hero-track relative">
        {/* The nav's two anchors into this stage, as bare markers rather
            than ids on the section itself.
            
            The section spans the whole track, so an id on it would sit in
            the observer's band the entire way down and "Home" — being first
            in Nav's LINKS — would win over "About" for the whole stage,
            leaving that link unable to ever highlight. One marker per screen
            gives each link a distinct band and a scroll target that lands
            where it should: #home at the closed card, #about at the open
            one. */}
        <div id="home" aria-hidden className="absolute top-0 h-svh w-px" />
        <div id="about" aria-hidden className="absolute bottom-0 h-svh w-px" />

        <div className="hero-stage">
          {/* The orange underneath is what shows for the moment before the
              video paints, and if the file ever fails to load the stage is
              an orange field rather than a black rectangle. */}
          <HeroBackdrop src={profile.heroBackdrop.src} />

          <HeroCard />

          {/* The backdrop isn't mine, so it gets a name on it. Bottom-right
              and small — the treatment a print would get. `creditLine` is
              the Wall's own helper, so the wording can't drift from how
              every tile credits its maker. */}
          {backdropCredit && (
            <p
              className="pointer-events-none absolute bottom-6 right-6 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-white/90 [text-shadow:0_1px_3px_rgb(122_23_16_/_0.9)] print:hidden sm:right-16"
              style={{ zIndex: Z.CARD_CONTENT }}
            >
              Backdrop — {backdropCredit}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
