import type { Locale } from "@/content/i18n";

// The Home hero's copy, en + es.
export const heroContent: Record<Locale, { tagline: string; cta: string }> = {
  en: { tagline: "I build software for wildfire.", cta: "Let's build together" },
  es: {
    tagline: "Construyo software para incendios forestales.",
    cta: "Construyamos juntos",
  },
};
