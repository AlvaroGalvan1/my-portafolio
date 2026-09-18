// Two languages, one page.
//
// The site is statically generated twice — /en and /es — rather than
// swapped in the browser. That choice is what makes `<html lang>` correct,
// what keeps every section a Server Component (a client-side dictionary
// would have dragged the whole page across the boundary), and what stops
// the Spanish reader seeing a flash of English before an effect fires.
// See src/app/[lang]/layout.tsx for the two static params and src/proxy.ts
// for how a bare "/" is routed to one of them.

export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

/** The one the proxy falls back to, and the one the metadata is written
 *  in. Not "whichever is first in the array" — that's the kind of coupling
 *  that breaks when someone alphabetises a list. */
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** What the toggle in the bar says, and what a screen reader announces.
 *  `native` is deliberately each language's own name for itself: a reader
 *  looking for Spanish is looking for "Español", not for "Spanish". */
export const LOCALE_META: Record<Locale, { code: string; native: string; switchTo: string }> = {
  en: { code: "EN", native: "English", switchTo: "View this page in English" },
  es: { code: "ES", native: "Español", switchTo: "Ver esta página en español" },
};

/**
 * A string that may or may not have been translated.
 *
 * The union is the whole trick. Plenty of what this site says needs no
 * Spanish at all — "Pano AI", "QGIS", "Pune", a coordinate — and forcing
 * every one of those through `{ en: "Pune", es: "Pune" }` would double the
 * content files to say nothing, and would hide the fields that genuinely
 * do differ inside the noise of the ones that don't.
 *
 * So: a bare string is a string in both languages, and only the fields
 * where the two readers need different words carry both. Translating a
 * field later is a local edit with no type churn anywhere else.
 */
export type Phrase = string | Record<Locale, string>;

/** Resolve a Phrase for a locale. Named `say` rather than `t` because it
 *  reads at the call site: `say(job.takeaway, lang)`. */
export function say(phrase: Phrase, locale: Locale): string {
  return typeof phrase === "string" ? phrase : phrase[locale];
}

/** The same, for a list. */
export function sayAll(phrases: readonly Phrase[], locale: Locale): string[] {
  return phrases.map((phrase) => say(phrase, locale));
}

/**
 * Substitute `{name}` placeholders in a string.
 *
 * The dictionary in ui.ts held two of these as functions taking the value
 * and returning the sentence, which is the obvious way to write it and is
 * the one thing that cannot work here: the dictionary is built on the
 * server and handed to Client Components as props, and React refuses to
 * serialise a function across that boundary. A template plus this is the
 * same thing in data the boundary can carry.
 *
 * It also keeps word order out of the code. Spanish and English do not put
 * the value in the same place in every sentence, and a template lets the
 * translation move it without a second code path.
 */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? values[key] : whole,
  );
}

/** BCP 47 tags, for `<html lang>`, `Intl` formatting and the OG locale. */
export const BCP47: Record<Locale, string> = { en: "en-US", es: "es-MX" };
