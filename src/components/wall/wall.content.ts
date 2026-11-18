import type { Phrase } from "@/content/i18n";

// The Wall v3: one screen, four quadrants. Each quadrant is one section
// folder next to this file (brand/, agents/, climate/, apps/), so each can
// be built on its own without touching the others.
export type QuadrantId = "a" | "b" | "c" | "d";

export const QUADRANTS: { id: QuadrantId; letter: string; title: Phrase }[] = [
  { id: "a", letter: "A", title: { en: "Brand", es: "Marca" } },
  { id: "b", letter: "B", title: { en: "Agents", es: "Agentes" } },
  { id: "c", letter: "C", title: { en: "Climate Adaptation", es: "Adaptación climática" } },
  { id: "d", letter: "D", title: { en: "Websites & Apps", es: "Sitios y apps" } },
];

export const STAGE_STRINGS = {
  zoomIn: { en: "Zoom into {title}", es: "Acercar a {title}" } as Phrase,
  back: { en: "Back to the Wall", es: "Volver al Muro" } as Phrase,
};
