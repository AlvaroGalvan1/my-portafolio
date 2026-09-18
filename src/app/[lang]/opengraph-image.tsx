import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/content/site";
import { DEFAULT_LOCALE, isLocale } from "@/content/i18n";

// The card every link to this site unfurls as, in Slack, LinkedIn,
// iMessage and search results. Generated rather than a checked-in PNG so
// it can't drift out of sync with the copy, and so there's no 1200x630
// asset to maintain by hand.
//
// Deliberately not a screenshot of the Wall: unfurl cards render small, and
// a grid of tiny tiles reads as noise at that size. The name has to survive
// being 300px wide in a chat window.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Describes the generated card for anyone who gets the alt text instead of
// the image. Kept in step with SITE_TITLE by hand — `alt` has to be a
// static export, so it can't be built from the constant.
export const alt = "Álvaro Galván Portafolio";

// One card per language, generated from the same layout. The name is the
// same in both — it's a name — so the only thing that changes is the
// subtitle, which is the line a Spanish reader would otherwise get in
// English in their own feed.
// `params` typed by hand rather than through a route-aware helper: there
// is no `ImageProps` in this version the way there is `PageProps` and
// `LayoutProps`, and a metadata image file receives the segment's params
// all the same.
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#d92b1c",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            lineHeight: 1.05,
            fontWeight: 800,
            color: "#fff4de",
            letterSpacing: "-0.02em",
          }}
        >
          <span>Álvaro</span>
          <span>Galván</span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 30,
            lineHeight: 1.35,
            // Cream at reduced opacity, not brand maroon. Maroon on brand
            // red is only ~2.2:1 — below the 3:1 floor for large text — and
            // an unfurl card renders about 300px wide in a chat window,
            // where the subtitle is the first thing to become unreadable.
            color: "rgba(255, 244, 222, 0.85)",
            maxWidth: 900,
          }}
        >
          {SITE_DESCRIPTION[locale]}
        </div>
      </div>
    ),
    size,
  );
}
