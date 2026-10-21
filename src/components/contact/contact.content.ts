import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. Empty on purpose: the ticket that builds
// the section fills it in. `placeholder` labels the stub until then.
export const contactContent: Record<Locale, { placeholder: string }> = {
  en: { placeholder: "Form" },
  es: { placeholder: "Formulario" },
};
