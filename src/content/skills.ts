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
  siReact,
  siD3,
  siGrafana,
  type SimpleIcon,
} from "simple-icons";
import { services } from "./services";
import type { Phrase } from "./i18n";

// The toolkit, in the same three stages Work with me is — Research, Build
// & deploy, Design — reusing those titles directly rather than a second
// translated copy of the same three words. See services.ts.
//
// ── Why the same three stages, and not Build → Process → Domain ────────
// The old three rows (build pipelines, process & analyse, geospatial &
// earth observation) described the toolkit's own shape. These describe
// mine as a hiring manager reads it: what do you know before you build,
// what do you build it with, what does the result look like. A reader who
// just read Work with me sees the same three words again here as evidence
// for the pitch, not a second list to parse cold.
//
// ── Research is data, not tools ─────────────────────────────────────────
// Every other row is software. This one names the datasets and data
// sources four different roles actually ran on: Sentinel-2, LANDFIRE,
// Copernicus and ERA5 for wildfire and vegetation, distribution-grid
// telemetry for utilities. That split is deliberate — wildfire and
// utilities are the two domains the Experience column's four rows actually
// back up (Pano AI, Hyticos and Fuego.Earth on fire; Gridware on the
// grid), and naming the data is a more specific claim than another line of
// "GIS" would be. See `note` below.
export type Skill = {
  /** Product or dataset names, and the same in any language — so this
   *  stays a bare string rather than a `Phrase`. See i18n.ts. */
  name: string;
  /** Brand mark from simple-icons, where one exists. */
  icon?: SimpleIcon;
};

export type SkillGroup = {
  /** Reused from services.ts — see the note above. */
  label: Phrase;
  /** One line under the label, where the row needs a claim a list of
   *  names can't make on its own. Only Research has one: "wildfire and
   *  utilities" is the sentence the datasets below it are evidence for. */
  note?: Phrase;
  tools: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: services[0].title, // "Research"
    note: {
      en: "Wildfire and utility-grid data, mostly.",
      es: "Sobre todo datos de incendios y de redes eléctricas.",
    },
    tools: [
      { name: "Sentinel-2" },
      { name: "LANDFIRE" },
      { name: "Copernicus" },
      { name: "ERA5" },
      { name: "Distribution-grid telemetry" },
    ],
  },
  {
    label: services[1].title, // "Build & deploy"
    tools: [
      { name: "Python", icon: siPython },
      { name: "Pandas", icon: siPandas },
      { name: "NumPy", icon: siNumpy },
      { name: "GeoPandas", icon: siGeopandas },
      { name: "Rasterio" },
      { name: "Xarray" },
      { name: "Rioxarray" },
      { name: "Shapely" },
      { name: "GDAL", icon: siGdal },
      { name: "scikit-learn", icon: siScikitlearn },
      { name: "Google Earth Engine", icon: siGoogleearthengine },
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
    label: services[2].title, // "Design"
    tools: [
      { name: "ArcGIS", icon: siArcgis },
      { name: "QGIS", icon: siQgis },
      { name: "React", icon: siReact },
      { name: "D3.js", icon: siD3 },
      { name: "Grafana", icon: siGrafana },
    ],
  },
];
