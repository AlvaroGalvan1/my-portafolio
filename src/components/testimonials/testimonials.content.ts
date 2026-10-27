import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. The quotes themselves live in
// content/testimonials.ts and stay in the language they were said in.
export const testimonialsContent: Record<Locale, { label: string }> = {
  en: { label: "What colleagues say" },
  es: { label: "Lo que dicen mis colegas" },
};
