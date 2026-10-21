import type { Phrase } from "./i18n";

// The questions a reader has right before they'd otherwise write an email
// to ask them. Four at most: the FAQ page is meant to be read in a glance.
export type FaqItem = {
  question: Phrase;
  answer: Phrase;
};

export const faq: FaqItem[] = [
  {
    question: { en: "How long do projects run?", es: "¿Cuánto duran los proyectos?" },
    answer: {
      en: "A short research sprint can wrap in a week or two; a full build can take several months. You get a realistic timeline in writing before work starts.",
      es: "Un sprint de investigación puede cerrar en una o dos semanas; un desarrollo completo puede tomar varios meses. Recibes un cronograma realista por escrito antes de empezar.",
    },
  },
  {
    question: { en: "Remote or in person?", es: "¿Remoto o en persona?" },
    answer: {
      en: "Remote works for almost everything. In person is possible around the Bay Area when it makes sense.",
      es: "Remoto funciona para casi todo. En persona es posible en el área de la Bahía cuando tiene sentido.",
    },
  },
  {
    question: {
      en: "Can I hire you for one small task?",
      es: "¿Puedo contratarte para una sola tarea pequeña?",
    },
    answer: {
      en: "Yes. A project can be scoped down to a single deliverable: a dataset, a model, a map.",
      es: "Sí. Un proyecto se puede reducir a un solo entregable: un conjunto de datos, un modelo, un mapa.",
    },
  },
  {
    question: { en: "Who owns the code?", es: "¿De quién es el código?" },
    answer: {
      en: "You do. Everything ships in a repo under your ownership, documented, with a handover call.",
      es: "Tuyo. Todo se entrega en un repositorio bajo tu propiedad, documentado, con una llamada de entrega.",
    },
  },
];
