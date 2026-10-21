import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. Empty on purpose: the ticket that builds
// the section fills it in. `placeholder` labels the stub until then.
export const areasContent: Record<Locale, { placeholder: string }> = {
  en: { placeholder: "What I do" },
  es: { placeholder: "Lo que hago" },
};
