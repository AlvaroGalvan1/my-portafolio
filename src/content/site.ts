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

// What the browser tab says, and the headline of every search result and
// unfurl. The name and what the site is, nothing else: the tab is the one
// place with no room for a specialism, and a tab strip full of dashes and
// ampersands truncates to nothing useful.
//
// "Portafolio" with the Spanish spelling, matching the repo and the way
// he'd say it. Title case, not the shout — caps belong to the display type
// in the hero, not to the tab.
export const SITE_TITLE = `${SITE_NAME} Portafolio`;

// Used as the meta description, as the social card's subtitle, AND as the
// text rendered into the OG image itself (see app/opengraph-image.tsx) — so
// it has to stand alone: someone reading it in a Slack unfurl has no other
// context about who this is.
//
// "GeoAI" is out of it. The title is the line people read when they look
// the site up, but the description is the line directly under it in a
// search result and the subtitle printed on the card, so leaving the term
// here would have kept it in exactly the places it was meant to leave.
// What's left says the same thing in words that aren't a field's name.
export const SITE_DESCRIPTION =
  "Wildfire modelling, satellite data, and tools that help people adapt to a changing planet.";
