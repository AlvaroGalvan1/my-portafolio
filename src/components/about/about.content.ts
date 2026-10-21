import type { Locale } from "@/content/i18n";

// Copy for this section, en + es: two lines of bio and the CV button. The
// map's own labels live with the map (content/ui.ts, `background`).
export const aboutContent: Record<Locale, { bio: [string, string]; cv: string }> = {
  en: {
    bio: [
      "Hey, I'm Álvaro from Oaxaca.",
      "Now in San Francisco, building software for wildfire.",
    ],
    cv: "Download my CV",
  },
  es: {
    bio: [
      "Hola, soy Álvaro, de Oaxaca.",
      "Ahora en San Francisco, construyo software para incendios forestales.",
    ],
    cv: "Descargar mi CV",
  },
};
