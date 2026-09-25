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
// In production the section renders nothing while this array is empty: a
// heading over placeholders is worse than no section. In development it
// renders three clearly marked placeholders, so the layout can be worked
// on before the first real quote arrives. See Testimonials.tsx.

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
  /** The organisation, shown beside the role. */
  org?: string;
  /** Which piece of work the quote is about, when it is about one. */
  project?: Phrase;
  /** A portrait they sent, under /public. Initials stand in without one. */
  photoSrc?: string;
};

export const testimonials: Testimonial[] = [
  {
    // Trimmed from a longer written blurb, with Jack's OK to cut — see
    // rule 2 and rule 3 above. Cut: a sentence that repeated ground the
    // kept sentences already cover, and every mention of "internship" —
    // still his exact words either side of the cut, just without the
    // clause naming the engagement type, which read as junior on a page
    // arguing the opposite. Two grammar fixes, per rule 2: "their ability"
    // → "his ability", "and were a reliable" → "and was a reliable".
    // Nothing else changed from his own words.
    quote:
      "Álvaro made a strong contribution to our geospatial analytics work, particularly on tools and workflows supporting site selection and impact assessment. I was impressed by his ability to turn loosely defined problems into practical, maintainable and communicable solutions while incorporating feedback from the team. He grew considerably in both technical independence and communication, and was a reliable and thoughtful contributor to our team.",
    name: "Jack Royero",
    role: { en: "Head of GIS", es: "Jefe del equipo de SIG" },
    relation: { en: "Manager at Pano AI", es: "Gerente en Pano AI" },
    org: "Pano AI",
    href: "https://www.linkedin.com/in/jack-royero-aa9b2a192",
    photoSrc: "/gallery/portraits/jack-royero.jpeg",
  },
  {
    quote:
      "Our team lacked a streamlined way to evaluate and compare the performance of different solutions. Álvaro developed a reusable geospatial analysis framework that automated and standardized these workflows, making analyses faster, more robust, and reproducible. His ability to learn quickly, take ownership of challenging problems, and consistently deliver thorough and reliable work has made him an incredibly valuable member of the team.",
    // Spelled per her own LinkedIn vanity URL — "McQuillan", not
    // "McQuillian" as this was first entered. See rule 1.
    name: "Katie McQuillan",
    role: { en: "Data Engineer", es: "Ingeniera de Datos" },
    relation: { en: "Colleague at Pano AI", es: "Colega en Pano AI" },
    org: "Pano AI",
    // Trimmed to the profile itself — the link the user gave was a
    // contact-info overlay carrying a session-specific `lipi` tracking
    // token, which isn't a stable public URL for anyone else to open.
    href: "https://www.linkedin.com/in/katie-ann-mcquillan/",
    photoSrc: "/gallery/portraits/katie-mcquillan.jpeg",
  },
];
