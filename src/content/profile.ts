import type { Credit } from "@/components/gallery/credit";
import type { Phrase } from "./i18n";

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
  // The headshot, on the About page. A real one now — 800×800, square —
  // rather than the graduation group shot this used to point at, which was
  // kept only because a real cutout was expected to replace it eventually.
  // The frame runs at the photo's own 1:1, so nothing is cropped.
  //
  // The graduation photo (three of us at the Minerva commencement,
  // 960×1280) is still in `public/` under the same folder if a candid ever
  // belongs somewhere — a Wall tile, most likely — but nothing points at
  // it now.
  photo: {
    src: "/gallery/portraits/headshot.jpeg",
    alt: "Álvaro Galván",
  },
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
  // Three sentences, and it ends in an invitation rather than a summary:
  // it is the only thing on the page that asks the reader for anything.
  //
  // It was five sentences and it was the longest thing in a hero that gets
  // exactly one screen — "I live in San Francisco" repeats the location
  // line directly above the name, and "in any field" was qualifying an
  // invitation that is more generous without the qualifier. What is left
  // is where I'm from, what I build, and the ask.
  //
  // No em dashes here, on purpose. The rest of this file is full of them
  // and this is the one string a visitor reads as a voice.
  //
  // It stood under the name until the hero's left column took the pitch,
  // then briefly sat behind an "About me" plate on the artwork, which came
  // out. It's the opening line of the About page now — see About.tsx.
  bio: [
    {
      en: "Hey, I'm Álvaro from Oaxaca. If you're building toward a livable future, let's chat.",
      es: "Hola, soy Álvaro, de Oaxaca. Si estás construyendo hacia un futuro habitable, platiquemos.",
    },
  ] satisfies Phrase[],
};
