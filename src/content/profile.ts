import type { Credit } from "@/components/gallery/credit";

export const profile = {
  // Two given names and two surnames is the full legal form, and it was
  // the thing the hero shouted. The short form is what I introduce myself
  // as, what the bio's first line already says, and what SITE_NAME has
  // carried all along — the hero was the one place disagreeing with it.
  // Still two lines: the stack is the poster, not a consequence of length.
  nameLines: ["Álvaro", "Galván"],
  // The only line under the name. Add an `href` here and Hero will need a
  // link element again — left off deliberately, see the note there.
  location: { label: "Mission District, San Francisco" },
  // The portrait. Not rendered anywhere at the moment: Intro.tsx shows an
  // empty frame instead, because this file is 293×220 — a real
  // background-removed shot, but too small to run at the size the layout
  // gives it. Point this at a larger export and fill the frame; the comment
  // in Intro.tsx says how.
  photoSrc: "/profile.png",
  // The loop playing behind the name. A 16:9 generative piece — 36 captured
  // variations of a sea-fan textile, played in sequence — so the hero's flat
  // orange field becomes something that moves without anything competing
  // with the name for attention.
  //
  // The credit is the same `Credit` shape the Wall's tiles use, so there's
  // one vocabulary for attribution on the site rather than a second ad-hoc
  // one here. `author` renders as a bare name, which is what "credits to
  // Dahlia" asks for. If the render is yours and Dahlia's is the *tool*,
  // this is `relation: "after"` instead — it renders "After Dahlia" and is
  // the more accurate of the two in that case.
  heroBackdrop: {
    src: "/hero/coral-loop.mp4",
    credit: { who: "Dahlia", relation: "author" } satisfies Credit,
  },
  // One paragraph, not three. The two that followed it — the wildfire-model
  // detail and the calisthenics/raves line — said things the About section
  // doesn't have to carry: the model is on the Wall as a working tile, and
  // the CV panel below covers the history. Kept as one line so the section
  // reads as an introduction rather than a statement.
  //
  // About.tsx takes bio[0] as the lede and lays any remaining entries out
  // in two columns; with one entry that block doesn't render at all. Add a
  // second string here and it comes back on its own.
  bio: [
    "Hola! Soy Álvaro de Oaxaca 🌍 I work where GeoAI, satellite data, and people meet — mostly wildfire, and the energy transition.",
  ],
};
