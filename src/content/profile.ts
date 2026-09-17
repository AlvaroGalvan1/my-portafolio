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
  // The portrait. Nothing renders it today: it sat across the seam of the
  // hero split until that composition turned out to work better as two
  // things rather than three. Kept because the file is in the repo and the
  // alt text is written — a `post` tile on the Wall is where it goes if it
  // comes back, not the hero.
  //
  // Not a headshot, and the layout follows from that: three of us at the
  // Minerva commencement, shot at 960×1280. The frame runs at the photo's
  // own 3:4 so nothing is cropped out of it, and larger than a head-and
  // -shoulders would need — at the 13rem the empty frame used to be, three
  // faces came out about the size of the body copy beside them.
  //
  // `/profile.png`, which this used to point at, is a background-removed
  // cutout and only 293×220 — too small for any size this frame runs at.
  // It stays in `public/` for whenever a real cutout replaces it.
  photo: {
    src: "/gallery/portraits/graduation-friends.jpeg",
    alt: "Álvaro with two friends at their Minerva University commencement, in graduation stoles.",
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
  // One paragraph, and it ends in an invitation rather than a summary: it
  // is the only thing on the page that asks the reader for anything, and
  // the ask is deliberately not addressed to one industry. "In any field"
  // is doing that work, so don't narrow it to hiring managers later.
  //
  // No em dashes here, on purpose. The rest of this file is full of them
  // and this is the one string a visitor reads as a voice.
  //
  // Hero.tsx takes bio[0] as the lede of the left column. Any further
  // entries are unrendered today; a second paragraph needs a place in that
  // layout first, so add the markup with the string.
  bio: [
    "Hey, I'm Álvaro from Oaxaca. I live in San Francisco and build geospatial software, mostly around wildfire and the energy transition. If you're building toward a livable future, in any field, let's chat 🌸",
  ],
};
