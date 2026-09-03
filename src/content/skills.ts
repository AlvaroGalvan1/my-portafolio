import {
  siPython,
  siR,
  siGithub,
  siQgis,
  siArcgis,
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

// Adobe and SQL have no simple-icons mark available (Adobe's was removed
// over trademark restrictions; SQL is a language, not a brand), so they
// render as lettermark badges instead.
export const skills: Skill[] = [
  { name: "Python", icon: siPython },
  { name: "SQL", lettermark: "SQL" },
  { name: "R", icon: siR },
  { name: "GitHub", icon: siGithub, color: "#181717" },
  { name: "QGIS", icon: siQgis },
  { name: "ArcGIS", icon: siArcgis },
  { name: "Adobe", lettermark: "Ad" },
  { name: "Vercel", icon: siVercel, color: "#111111" },
  { name: "Docker", icon: siDocker },
];
