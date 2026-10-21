import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. Empty on purpose: the ticket that builds
// the section fills it in. `placeholder` labels the stub until then.
export const stepsContent: Record<Locale, { placeholder: string }> = {
  en: { placeholder: "Steps panel" },
  es: { placeholder: "Panel de pasos" },
};
