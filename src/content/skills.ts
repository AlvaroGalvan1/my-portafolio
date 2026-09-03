import {
  siPython,
  siR,
  siGithub,
  siQgis,
  siArcgis,
  siGoogleearthengine,
  siPostgresql,
  siVercel,
  siDocker,
  type SimpleIcon,
} from "simple-icons";

export type Skill = {
  name: string;
  /** Brand mark from simple-icons. Omitted where none exists — the badge
   *  falls back to a lettermark drawn in the display font. */
  icon?: SimpleIcon;
  /** Overrides the icon's own brand hex. Used for marks whose brand colour
   *  is too pale/dark to read on the cream card. */
  color?: string;
  /** Shown in place of a logo when there's no mark available. */
  lettermark?: string;
};

// Adobe, SQL and Remote Sensing have no simple-icons mark available
// (Adobe's was removed over trademark restrictions; the other two are a
// language and a discipline, not brands), so they render as lettermark
// badges instead.
//
// PostGIS borrows the PostgreSQL mark — it's the spatial extension to
// Postgres rather than a separate product, and the label disambiguates.
export const skills: Skill[] = [
  { name: "Python", icon: siPython },
  { name: "SQL", lettermark: "SQL" },
  { name: "R", icon: siR },
  { name: "GitHub", icon: siGithub, color: "#181717" },
  { name: "QGIS", icon: siQgis },
  { name: "ArcGIS", icon: siArcgis },
  { name: "Google Earth Engine", icon: siGoogleearthengine },
  { name: "PostGIS", icon: siPostgresql },
  { name: "Remote Sensing", lettermark: "RS" },
  { name: "Adobe", lettermark: "Ad" },
  { name: "Vercel", icon: siVercel, color: "#111111" },
  { name: "Docker", icon: siDocker },
];
