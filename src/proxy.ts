import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/content/i18n";

// Every page on this site lives under a language — /en or /es — so a bare
// "/" has to become one of them before anything renders. This is the thing
// that picks.
//
// It reads Accept-Language, which is the preference the visitor already
// set in their own browser and the only signal available before a single
// byte of the page has been sent. No cookie, no IP lookup, no "detecting
// your language…" interstitial: a Mexican reader lands on the Spanish page
// and an American on the English one, and either can change it with the
// toggle in the bar, which is a real link to a real URL.
//
// Note the file name. `middleware.ts` is deprecated in this version of
// Next; the convention is `proxy.ts` with an exported `proxy` function.
// See node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.

/**
 * The best supported language for an Accept-Language header.
 *
 * Deliberately hand-rolled rather than pulling in Negotiator and
 * intl-localematcher, which is what the Next guide reaches for. Two
 * locales and no region variants is not a negotiation problem: it is a
 * sort by q-value and a prefix match, and the two packages would be the
 * only runtime dependencies this site has that aren't rendering it.
 */
function pickLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.slice(2)) : 1 };
    })
    // A malformed q= gives NaN, which would sort unpredictably; treat it as
    // the lowest possible preference rather than dropping the tag.
    .sort((a, b) => (Number.isNaN(b.q) ? -1 : b.q) - (Number.isNaN(a.q) ? -1 : a.q));

  for (const { tag } of ranked) {
    // "es-419", "es-MX" and "es" all mean Spanish here. Matching on the
    // primary subtag is what makes that true without listing every region.
    const primary = tag.split("-")[0];
    const match = LOCALES.find((locale) => locale === primary);
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = pickLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  // "/" becomes "/en"; "/anything" becomes "/en/anything", so a link that
  // predates the language split still lands somewhere real.
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the framework's own paths, the API route, and any
  // request with a file extension — which is every asset in public/. A
  // matcher this shape is not optional: without it the proxy runs on the
  // stylesheet and the Coral loop too, and redirects them into a language
  // that has no such file.
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
