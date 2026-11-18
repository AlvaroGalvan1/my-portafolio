import type { Phrase } from "@/content/i18n";

// The Wall v3: one screen, four quadrants. Each quadrant is one section
// folder next to this file (agents/, brand/, climate/, apps/), so each can
// be built on its own without touching the others.
export type QuadrantId = "a" | "b" | "c" | "d";

// Each quadrant has its own colours, not the Wall's red: `panel` is the
// background and the text colour (everything inside inherits it, the
// placeholders included), `accent` is the title's letter.
export type QuadrantTheme = { panel: string; accent: string };

export const QUADRANTS: { id: QuadrantId; letter: string; title: Phrase; theme: QuadrantTheme }[] = [
  {
    id: "a",
    letter: "A",
    title: { en: "Agents", es: "Agentes" },
    // A plain tabletop the agents stand on.
    theme: { panel: "bg-[#f4f1ec] text-[#1c1c1c]", accent: "text-[#1c1c1c]" },
  },
  {
    id: "b",
    letter: "B",
    title: { en: "Brand", es: "Marca" },
    // Fuego's orange; maroon is the only text that reads on it.
    theme: { panel: "bg-brand-orange text-brand-maroon", accent: "text-white" },
  },
  {
    id: "c",
    letter: "C",
    title: { en: "Climate Adaptation", es: "Adaptación climática" },
    // Soft green into soft blue: land into water.
    theme: {
      panel: "bg-gradient-to-br from-[#dcefdc] to-[#d6e8f5] text-[#1f4a45]",
      accent: "text-[#2f7d6b]",
    },
  },
  {
    id: "d",
    letter: "D",
    title: { en: "Design", es: "Diseño" },
    // Websites and apps.
    theme: { panel: "bg-[#0f1f3d] text-white", accent: "text-[#87ceeb]" },
  },
];

export const STAGE_STRINGS = {
  zoomIn: { en: "Zoom into {title}", es: "Acercar a {title}" } as Phrase,
  back: { en: "Back to the Wall", es: "Volver al Muro" } as Phrase,
};
