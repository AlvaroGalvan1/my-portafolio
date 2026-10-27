import type { Locale } from "@/content/i18n";

// The Home hero's copy, en + es.
export const heroContent: Record<Locale, { tagline: string; identity: string; cta: string }> = {
  en: { tagline: "I build software for wildfire.", identity: "Geospatial engineer, San Francisco", cta: "Let's build together" },
  es: {
    tagline: "Construyo software para incendios forestales.",
    identity: "Ingeniería geoespacial, San Francisco",
    cta: "Construyamos juntos",
  },
};
