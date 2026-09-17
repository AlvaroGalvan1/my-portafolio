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
// The greeting. One line, and it does a job no other line on the page can:
// it says what kind of thing this is before the reader has to work it out.
// A portfolio that opens on a name and a paragraph asks them to infer it.
export const SITE_WELCOME = "Welcome to my portfolio.";

// The mission, in one line, under the name in the hero.
//
// It is the three purposes below compressed into a sentence, and it has to
// stay that: if this line and SITE_PURPOSE ever say different things, the
// site has two missions and therefore none. Change them together.
//
// Under the name rather than in the footer with the long version, because
// the first thing a stranger wants after a name is what the person is for.
// The bio under it says who I am; this says what this is.
export const SITE_MISSION =
  "Somewhere to know the work, somewhere to keep it, and somewhere a climate or geospatial project can begin.";

// What this site is FOR, in its own words.
//
// Three purposes, and they're the northstars the whole thing is built
// against — see PURPOSE.md at the repo root, which is the longer version
// and the one to read before deciding whether something belongs here. If a
// new section serves none of these three, that is the argument against
// building it.
//
// Rendered in the footer, which is where a statement about a site belongs:
// a colophon is read by someone who has been through the thing and is
// deciding what to do about it, not by someone still deciding whether to
// scroll.
export const SITE_PURPOSE = [
  {
    title: "To be known",
    body: "Who I am and what I have actually built, in one place that is neither a PDF nor a profile on someone else's platform.",
  },
  {
    title: "To keep the work",
    body: "Maps, models, decks and experiments live here rather than scattered across drives and feeds, with whoever made each one named on it.",
  },
  {
    title: "To start things",
    body: "If you work on climate or geospatial problems, this is the front door. Collaborations, commissions and conversations all begin the same way.",
  },
];

export const SITE_DESCRIPTION =
  "Wildfire modelling, satellite data, and tools that help people adapt to a changing planet.";
