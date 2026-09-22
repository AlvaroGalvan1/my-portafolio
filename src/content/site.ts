import type { Locale, Phrase } from "./i18n";

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
// "Portafolio" with the Spanish spelling in both languages, matching the
// repo and the way he'd say it — it was never the English word with a typo
// in it. Title case, not the shout — caps belong to the display type in the
// hero, not to the tab.
export const SITE_TITLE: Record<Locale, string> = {
  en: `${SITE_NAME} Portafolio`,
  es: `${SITE_NAME} Portafolio`,
};

// Used as the meta description, as the social card's subtitle, AND as the
// text rendered into the OG image itself (see app/[lang]/opengraph-image.tsx)
// — so it has to stand alone: someone reading it in a Slack unfurl has no
// other context about who this is.
//
// "GeoAI" is out of it. The title is the line people read when they look
// the site up, but the description is the line directly under it in a
// search result and the subtitle printed on the card, so leaving the term
// here would have kept it in exactly the places it was meant to leave.
// What's left says the same thing in words that aren't a field's name.
export const SITE_DESCRIPTION: Record<Locale, string> = {
  en: "Wildfire modelling, satellite data, and tools that help people adapt to a changing planet.",
  es: "Modelado de incendios forestales, datos satelitales y herramientas para adaptarnos a un planeta que cambia.",
};

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
export const SITE_PURPOSE: { title: Phrase; body: Phrase }[] = [
  {
    title: { en: "My work", es: "Mi trabajo" },
    body: {
      en: "Everything I have built, in one place.",
      es: "Todo lo que he construido, en un solo lugar.",
    },
  },
  {
    title: { en: "My archive", es: "Mi archivo" },
    body: {
      en: "I keep my maps, models and experiments here so I can find them later.",
      es: "Aquí guardo mis mapas, modelos y experimentos para poder encontrarlos después.",
    },
  },
  {
    title: { en: "Get in touch", es: "Escríbeme" },
    body: {
      en: "Working on climate or geospatial problems? Write to me.",
      es: "¿Trabajas en problemas climáticos o geoespaciales? Escríbeme.",
    },
  },
];
