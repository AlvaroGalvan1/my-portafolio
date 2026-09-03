import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/content/site";

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
export const alt = "Álvaro Emilio Galván Sandoval — GeoAI and wildfire modelling";

export default function Image() {
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
          <span>Álvaro Emilio</span>
          <span>Galván Sandoval</span>
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
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    size,
  );
}
