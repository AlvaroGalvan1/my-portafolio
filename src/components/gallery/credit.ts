import { DEFAULT_LOCALE, type Locale } from "@/content/i18n";

// Who made the thing on a tile, and how to say so.
//
// This replaces two older half-systems: a hover-only `@handle` byline that
// was invisible on any touch device, and a free-text `credit` string that
// only ever rendered inside the lightbox (so tiles that don't open a
// lightbox showed nothing at all). One shape now, rendered in one place —
// see FrameCell.tsx.

export type CreditRelation =
  /** Mine. Renders no byline, but must still be stated. */
  | "mine"
  /** They made the piece itself — wrote the deck, wrote the book. */
  | "author"
  /** The piece is built on their data. */
  | "data"
  /** They took the photograph. */
  | "photo"
  /** They shot the video. Distinct from `photo` only so the label reads right. */
  | "footage"
  /** Not theirs originally, but this is the post it came from. */
  | "posted"
  /** Mine, built after someone else's idea or article. */
  | "after";

export type Credit = {
  /** Person or organisation. Required — there is no uncredited tile. */
  who: string;
  relation: CreditRelation;
  /** Straight to them where possible. Deliberately optional: not everyone
   *  has a public profile, and no link beats a link to a homepage that
   *  doesn't mention them. */
  href?: string;
  /** Where it appeared, when. Shown in the lightbox, not on the tile. */
  context?: string;
};

// The word before the name. `mine` and `author` take none — a name on its
// own already reads as "they made this".
//
// Translated, because a byline is one of the few strings on this site that
// a reader meets dozens of times: it is on every tile of the Wall and under
// the hero's backdrop. An English "Photo:" under a Spanish caption is the
// kind of seam that makes a translated page feel machine-made.
const PREFIX: Record<Locale, Record<CreditRelation, string>> = {
  en: {
    mine: "",
    author: "",
    data: "Data: ",
    photo: "Photo: ",
    footage: "Footage: ",
    posted: "Posted by ",
    after: "After ",
  },
  es: {
    mine: "",
    author: "",
    data: "Datos: ",
    photo: "Foto: ",
    footage: "Video: ",
    posted: "Publicado por ",
    after: "A partir de ",
  },
};

/** The visible byline, or null for work that shouldn't carry one. */
export function creditLine(
  credit: Credit,
  locale: Locale = DEFAULT_LOCALE,
): string | null {
  if (credit.relation === "mine") return null;
  return `${PREFIX[locale][credit.relation]}${credit.who}`;
}
