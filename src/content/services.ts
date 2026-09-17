// What someone can actually hire me for, in their words rather than mine.
//
// Three, not eight. A list long enough to cover everything reads as a list
// of things I've heard of; three reads as the things I'd take money for.
// Each one names the deliverable, because "geospatial consulting" is not
// something anyone can picture buying.
//
// Kept as data for the same reason the rest of `content/` is: this list
// will change faster than the section that renders it, and it should be
// possible to change it without opening a component.
export type Service = {
  title: string;
  /** What you get, concretely enough to price. */
  body: string;
};

export const services: Service[] = [
  {
    title: "Wildfire & fuels modelling",
    body: "Fuel and risk layers for an area you care about, a spread model you can run against them, and a plain-language write-up of what it says and where it's uncertain.",
  },
  {
    title: "Satellite data pipelines",
    body: "Imagery and climate data turned into something your team can actually query, in Earth Engine, PostGIS or Python, handed over as code you own rather than a dashboard you rent.",
  },
  {
    title: "Maps that explain",
    body: "Interactive maps and figures for a report, a deck or a public page, built to survive being looked at closely by people who know the subject.",
  },
];

// The honest line about money. No rate card: the work is scoped per
// project, and a number here with no scope attached would be wrong in both
// directions. The call is the price discovery.
export const RATES_NOTE =
  "Scoped per project, fixed price where the work allows it. Tell me what you're trying to find out and I'll tell you what it takes.";
