import { galleryItems } from "@/components/gallery/data";
import { experience } from "./experience";
import { journeyStats } from "./places";
import { skills } from "./skills";

// What I can do, and who has already paid me to do it.
//
// This replaced a block of three big counted numbers ("3 pieces that run",
// "4 of them are about fire"). The numbers were true and they were still
// the wrong shape: a stat card asks the reader to be impressed by an
// integer, and an integer with no organisation behind it is a claim about
// volume, not about competence. What a hiring manager or a client is
// actually scanning for is the two things below — the names of places that
// have trusted me, and the list of things I do.
//
// The counting didn't go away, it just stopped being the headline: each
// capability still carries its evidence line, and every one of those is
// counted from the data that draws it, never typed. Delete the LANDFIRE
// tile and "3 run live on this page" becomes 2 on its own.

// Tile kinds that RUN rather than sit still: the LANDFIRE map pulls live
// tiles, the fire model spreads across a grid, Life iterates.
const RUNS_LIVE = new Set(["landfire", "fire", "cellularAutomata", "embed"]);
const WILDFIRE_IDS = new Set([
  "growing-ca",
  "landfire-viewer",
  "satanizar-el-fuego",
  "cuando-la-plataforma",
]);

const liveCount = galleryItems.filter((item) => RUNS_LIVE.has(item.type)).length;
const wildfireCount = galleryItems.filter((item) => WILDFIRE_IDS.has(item.id)).length;

/** The banner: every organisation that has had me on the work.
 *
 *  Read off experience.ts rather than listed here, so a new job appears in
 *  the banner the moment it's in the CV data and can never disagree with
 *  it. The engagement type is stripped — `org` carries "Gridware · Contract"
 *  because the Experience rows need it, and a row of marks doesn't. */
export const workedWith = experience.map((job) => ({
  name: job.org.split("·")[0].trim(),
  logoSrc: job.logoSrc,
}));

export type Capability = {
  title: string;
  /** What it means in practice, in a client's words rather than a CV's. */
  body: string;
  /** The counted line under it. Evidence, not decoration. */
  evidence: string;
  /** Where on the page to go and see it. */
  href: string;
};

export const capabilities: Capability[] = [
  {
    title: "Wildfire & fuels",
    body: "Fuel and risk layers, spread models, and perimeters checked against what the satellites actually saw.",
    evidence: `${wildfireCount} pieces on this page are fire work`,
    href: "#wall",
  },
  {
    title: "Geospatial engineering",
    body: "Pipelines that turn satellite and sensor data into something a team can query, and that keep running after I leave.",
    evidence: `${skills.length} tools in regular use`,
    href: "#skills",
  },
  {
    title: "Maps that explain",
    body: "Cartography for people who are not cartographers: the risk legible at a glance, the uncertainty still visible.",
    evidence: `${liveCount} of them run live in this browser`,
    href: "#wall",
  },
  {
    title: "Work across borders",
    body: "Research and delivery with the people who live with the result, in Spanish or English, on their ground.",
    evidence: `${journeyStats.countries} countries, ${journeyStats.campuses} campuses`,
    href: "#background",
  },
];
