import type { Phrase } from "./i18n";

// What other people say, which is the one claim on this site I cannot make
// myself.
//
// Everything above this section is me describing my own work — the takeaways,
// the products, the Wall. That is evidence, and it is evidence with an
// obvious interest in the conclusion. A sentence from someone who managed
// me, or shipped something with me, is the only thing on the page that a
// reader has no reason to discount.
//
// ── The rules, and they are not negotiable ──────────────────────────
//
// 1. REAL PEOPLE, WITH THEIR NAMES ON IT. Every entry needs a name and a
//    role. No "a former manager", no initials, no stock portraits. An
//    anonymous testimonial is indistinguishable from one I wrote myself,
//    which means it is worth less than nothing — it teaches a reader to
//    discount the ones that are real.
//
// 2. THEY HAVE TO HAVE SAID IT. Written by them, or said by them and
//    approved by them in the exact words that appear here. Tightening
//    someone's grammar is fine. Writing the quote and asking them to sign
//    off is not: that is my sentence in their mouth.
//
// 3. ASK BEFORE PUBLISHING. A LinkedIn recommendation is public, and it is
//    still theirs — lifting one onto a personal site without asking is the
//    kind of thing that costs a reference.
//
// 4. NOT TRANSLATED UNLESS THEY TRANSLATED IT. A `quote` is the one field
//    in `content/` that should usually stay a bare string in whatever
//    language it was said in. Putting words in someone's mouth in a
//    language they did not speak them in breaks rule 2. If a person gave
//    both versions, use both. `role` and `relation` are mine to write, so
//    those translate freely.
//
// The section renders nothing at all while this array is empty — see
// Testimonials.tsx. That is deliberate: a "Testimonials" heading over a
// placeholder is worse than no section, and this file is the only thing
// that needs to change to turn it on.

export type Testimonial = {
  /** Their words, in the language they said them in. See rule 4. */
  quote: Phrase;
  /** Their name, spelled the way they spell it. */
  name: string;
  /** Their role at the time, and where. "Engineering Manager, Gridware". */
  role: Phrase;
  /** How we actually worked together, in a few words — "managed me at
   *  Pano", "built Fuego.Earth with me". A reader weighs a manager's
   *  sentence differently from a classmate's, and hiding which is which
   *  helps neither of them. */
  relation: Phrase;
  /** Somewhere to verify them: LinkedIn, a company page. Optional, and
   *  worth having — a quote with a name you can check is a different
   *  object from a quote with a name you cannot. */
  href?: string;
};

// EMPTY ON PURPOSE. Add entries and the section appears on its own.
export const testimonials: Testimonial[] = [];
