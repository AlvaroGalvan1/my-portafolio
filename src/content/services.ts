import type { Phrase } from "./i18n";

// What someone can actually hire me for, in their words rather than mine.
//
// Three, not eight. A list long enough to cover everything reads as a list
// of things I've heard of; three reads as the things I'd take money for.
//
// They're named by the shape of the problem, not by the tool — "wildfire
// modelling" and "satellite pipelines" described a stack, and a reader
// whose problem isn't literally either one has to work out whether they
// count. Each one still ends in something you'd actually receive, because
// "geospatial consulting" is not something anyone can picture buying.
//
// Kept as data for the same reason the rest of `content/` is: this list
// will change faster than the section that renders it, and it should be
// possible to change it without opening a component.
export type Service = {
  title: Phrase;
  /** What you get, concretely enough to price. */
  body: Phrase;
};

export const services: Service[] = [
  {
    title: {
      en: "Data to decision",
      es: "De los datos a la decisión",
    },
    body: {
      en: "Environmental data is messy. I work out which sources actually carry signal for your problem, build the pipeline, and give you something repeatable — not a one-time answer.",
      es: "Los datos ambientales son un desastre. Averiguo qué fuentes llevan de verdad señal para tu problema, construyo el flujo, y te doy algo repetible, no una respuesta de una sola vez.",
    },
  },
  {
    title: {
      en: "Cartography & design",
      es: "Cartografía y diseño",
    },
    body: {
      en: "Cartography and design as one thing. Maps and figures built to communicate precisely to people who know the subject — for reports, decks, or public pages.",
      es: "Cartografía y diseño como una sola cosa. Mapas y figuras hechos para comunicar con precisión a quien sabe del tema — para reportes, presentaciones o páginas públicas.",
    },
  },
  {
    title: {
      en: "0 to 1",
      es: "0 a 1",
    },
    body: {
      en: "You have a problem and no infrastructure. I take it from the first question to a working output — data, model, map, pipeline — and hand it over as something you own.",
      es: "Tienes un problema y ninguna infraestructura. Lo llevo desde la primera pregunta hasta algo que funciona —datos, modelo, mapa, flujo— y te lo entrego como algo tuyo.",
    },
  },
];

// The line beside the two actions at the top of the section: the rate,
// how far it bends, why, and what kind of work I'm open to.
//
// ONE statement, on purpose, and it stays one — no tiers, no packages, no
// pricing table. A single rate and a single reason it drops is simpler to
// read and more honest than a grid of options, and it says the thing a
// grid can't, which is that the price is not the point for the right
// project. It always names both kinds of work, consulting and full-time,
// so neither kind of reader leaves thinking the other is all that's on
// offer.
//
// Split into a headline and a body rather than one run-on paragraph: the
// number is the fact a skimming reader needs first, and the belief plus
// the availability are the reasoning that only the reader who stops to
// read gets. Still one statement — a lead sentence and its support, not
// separate options.
export const RATES_NOTE: { headline: Phrase; body: Phrase } = {
  headline: {
    en: "$85 USD/hour — flexible to $0 for mission-aligned work",
    es: "85 USD/hora — flexible hasta 0 USD para proyectos alineados con la misión",
  },
  body: {
    en: "Pro bono for climate, environmental and field-conservation projects. We need to solve the climate crisis together, so I'm open to both consulting contracts and full-time geospatial roles.",
    es: "Pro bono para proyectos climáticos, ambientales y de conservación en campo. Tenemos que resolver la crisis climática juntos, así que estoy abierto tanto a contratos de consultoría como a puestos de tiempo completo en ingeniería geoespacial.",
  },
};
