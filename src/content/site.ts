// Where the site lives, in one place.
//
// This is the only line to change when the custom domain lands — Next
// resolves every relative metadata URL (OG image, canonical) against
// `metadataBase` in layout.tsx, so nothing else references the host.
//
// An absolute origin is not optional for social cards: link unfurlers on
// Slack, LinkedIn, iMessage and X fetch the OG image from a third-party
// crawler with no page context, so a relative path resolves to nothing and
// the card renders blank.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-portafolio-chi.vercel.app";

export const SITE_NAME = "Álvaro Galván";

// Used as the meta description and as the social card's subtitle, so it has
// to stand alone — someone reading it in a Slack unfurl has no other
// context about who this is.
export const SITE_DESCRIPTION =
  "GeoAI, satellite data and wildfire modelling — building tools that help people adapt to a changing planet.";
