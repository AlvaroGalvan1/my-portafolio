import { lang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./i18n";

// The locale, for a Server Component that needs it without being handed it.
//
// `next/root-params` is what makes this possible: `[lang]` sits above the
// root layout, so every getter for it is available to any server component
// in the tree without the value being threaded through six sets of props.
// Background doesn't have to accept a locale in order to pass one to
// Experience, and Wall doesn't have to in order to pass one to the gallery.
//
// It lives in its own file, not in i18n.ts, for one blunt reason: i18n.ts
// is imported by Client Components (for the `Locale` type and the `say`
// helper), and `next/root-params` cannot be. Splitting them keeps that
// import from ever reaching the browser bundle.
//
// The fallback is not defensive padding — the getter's type allows
// `undefined`, and a page rendered outside the `[lang]` segment (the API
// route's error boundary, for one) would hit it.
export async function currentLocale(): Promise<Locale> {
  const value = await lang();
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
