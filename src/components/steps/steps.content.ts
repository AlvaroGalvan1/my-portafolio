import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. The visuals are placeholders (a simple
// icon per step); the final art is a later design pass.
export const stepsContent: Record<Locale, { heading: string; line: string; steps: string[]; label: string }> = {
  en: {
    heading: "Let's build your tool",
    line: "You bring the problem and the data. I turn them into a tool your team uses.",
    steps: ["Let's talk", "Explore it together", "Build it", "Test and refine"],
    label: "How we work together",
  },
  es: {
    heading: "Construyamos tu herramienta",
    line: "Tú traes el problema y los datos. Yo los convierto en una herramienta que tu equipo usa.",
    steps: ["Hablemos", "Exploremos juntos", "Construyámoslo", "Probemos y mejoremos"],
    label: "Cómo trabajamos juntos",
  },
};
