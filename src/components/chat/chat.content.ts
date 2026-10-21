import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. Empty on purpose: the ticket that builds
// the section fills it in. `placeholder` labels the stub until then.
export const chatContent: Record<Locale, { placeholder: string }> = {
  en: { placeholder: "Chat card" },
  es: { placeholder: "Tarjeta de charla" },
};
