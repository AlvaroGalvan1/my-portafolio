import {
  siGooglecloud,
  siGooglebigquery,
  siDocker,
  siVercel,
  siPostgresql,
  siPython,
  siPandas,
  siNumpy,
  siScikitlearn,
  siGeopandas,
  siGdal,
  siArcgis,
  siQgis,
  siGoogleearthengine,
  type SimpleIcon,
} from "simple-icons";
import type { Phrase } from "./i18n";

// The toolkit, in three rows, and the rows are the argument.
//
// ── The order is the point ────────────────────────────────────────────
// Build → process → domain, and it is deliberately not alphabetical, not
// by how much I like them, and not "languages, then tools, then platforms"
// the way a CV skills section usually goes. It is the order the work
// happens in:
//
//   1. Build pipelines — the 0-to-1 infrastructure story. Somebody has to
//      stand the thing up before anyone can analyse anything, and this is
//      the row that says four of these projects existed because of it.
//   2. Process & analyse — where the computation actually happens.
//   3. Geospatial & earth observation — the domain-specific credibility.
//      Anyone can learn Docker; knowing what LANDFIRE is and what it gets
//      wrong is the part that took years.
//
// A reader looking for someone to build them a risk map reads down that
// order and finds their whole problem in it.
//
// ── One list per row, and a mark where one exists ────────────────────
// Every name in a row sits in a single list, in order, and carries its
// logo if it has one. Rasterio, Xarray, Rioxarray, Shapely, dbt,
// Sentinel-2, LANDFIRE and Copernicus have no mark in any open icon set;
// they render as the name alone, which is exactly what they are.
//
// The version before this one split each row in two — marks on the first
// line, then the full list repeated as text underneath — which printed
// "GCP · BigQuery · dbt · Docker · Vercel · PostgreSQL · PostGIS" directly
// below seven badges saying the same seven words. Say it once. The marks
// are accents on a list, not a second list.
//
// PostGIS deliberately has no mark even though it could borrow
// PostgreSQL's: the two sit next to each other, and the same logo twice in
// a row reads as a rendering bug.
//
// ── How deep, and the star-rating question ────────────────────────────
// One level deeper than a logo, and that level is `detail`: named
// libraries and the programmes the data comes from.
//
// Deliberately NOT proficiency levels. No stars, no bars, no
// "Advanced / Intermediate". Self-rated proficiency is unverifiable, every
// reader discounts it, and it would be the only thing on this page that is
// an assertion rather than evidence — on a page whose whole argument is
// four problems and what answering them took. Named libraries earn their
// place for the opposite reason: they are checkable, and they are what a
// person actually searches for. Someone hiring for Xarray greps "Xarray".

export type Skill = {
  /** Product names, and the same in any language — so this stays a bare
   *  string rather than a `Phrase`. See i18n.ts. */
  name: string;
  /** Brand mark from simple-icons. */
  icon?: SimpleIcon;
  // No `lettermark`. A tool without a mark renders as its name, which is
  // what it is — inventing a two-letter monogram for "Rioxarray" produces
  // a badge that looks like a logo and is not one.
};

export type SkillGroup = {
  /** What this row is FOR. The reader is matching against a problem they
   *  have, not auditing a stack. */
  label: Phrase;
  tools: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: { en: "Build pipelines", es: "Construir flujos" },
    tools: [
      { name: "GCP", icon: siGooglecloud },
      { name: "BigQuery", icon: siGooglebigquery },
      { name: "dbt" },
      { name: "Docker", icon: siDocker },
      { name: "Vercel", icon: siVercel },
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "PostGIS" },
    ],
  },
  {
    label: { en: "Process & analyse", es: "Procesar y analizar" },
    tools: [
      { name: "Python", icon: siPython },
      { name: "Pandas", icon: siPandas },
      { name: "NumPy", icon: siNumpy },
      { name: "Rasterio" },
      { name: "GeoPandas", icon: siGeopandas },
      { name: "Xarray" },
      { name: "Rioxarray" },
      { name: "Shapely" },
      { name: "GDAL", icon: siGdal },
      { name: "scikit-learn", icon: siScikitlearn },
    ],
  },
  {
    label: {
      en: "Geospatial & earth observation",
      es: "Geoespacial y observación terrestre",
    },
    tools: [
      { name: "ArcGIS", icon: siArcgis },
      { name: "QGIS", icon: siQgis },
      { name: "Google Earth Engine", icon: siGoogleearthengine },
      { name: "Sentinel-2" },
      { name: "LANDFIRE" },
      { name: "Copernicus" },
    ],
  },
];
