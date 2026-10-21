import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. The questions themselves live in
// content/faq.ts.
export const faqContent: Record<Locale, { end: string }> = {
  en: { end: "Didn't find your answer? Ask me" },
  es: { end: "¿No encontraste tu respuesta? Pregúntame" },
};
