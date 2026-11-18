import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. The tiles themselves (titles, images) come
// from the Wall's data in components/gallery/data.ts.
export const wallTeaserContent: Record<Locale, { label: string; more: string; live: string }> = {
  en: { label: "Some of my work", more: "See the Wall", live: "Live" },
  es: { label: "Parte de mi trabajo", more: "Ver el Muro", live: "En vivo" },
};
