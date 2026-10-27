import type { Locale } from "@/content/i18n";

// Copy for this section, en + es.
export const chatContent: Record<Locale, { question: string; note: string; book: string }> = {
  en: {
    question: "Want to learn more, swap ideas, or just chat?",
    note: "No project needed.",
    book: "Book 30 minutes",
  },
  es: {
    question: "¿Quieres saber más, intercambiar ideas o solo platicar?",
    note: "No hace falta un proyecto.",
    book: "Agenda 30 minutos",
  },
};
