import type { Locale } from "@/content/i18n";

// Copy for this section, en + es: the names of the three areas, nothing else.
export const areasContent: Record<Locale, { grid: string; fire: string; data: string }> = {
  en: {
    grid: "Grid Intelligence",
    fire: "Fire Tech",
    data: "Data Fusion",
  },
  es: {
    grid: "Inteligencia de Red",
    fire: "Tecnología contra Incendios",
    data: "Fusión de Datos",
  },
};
