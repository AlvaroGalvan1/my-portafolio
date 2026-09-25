import type { Phrase } from "./i18n";

// The questions a reader has right before they'd otherwise write an email
// to ask them. Answered here so the email, if it comes, is about the
// project instead.
export type FaqItem = {
  question: Phrase;
  answer: Phrase;
};

export const faq: FaqItem[] = [
  {
    question: { en: "How long do projects typically run?", es: "¿Cuánto duran los proyectos normalmente?" },
    answer: {
      en: "It varies with scope. A short research sprint can wrap in a week or two. A full build can run several months. You'll see a realistic timeline in the written plan before work starts.",
      es: "Depende del alcance. Un sprint de investigación corto se puede cerrar en una o dos semanas. Un desarrollo completo puede tomar varios meses. Verás un cronograma realista en el plan por escrito antes de empezar.",
    },
  },
  {
    question: {
      en: "Do you work remotely, or does it need to be in-person?",
      es: "¿Trabajas remoto, o tiene que ser en persona?",
    },
    answer: {
      en: "Remote works for almost everything — the work is data and code, and that travels fine. In-person is possible around the Bay Area when it makes sense for the project.",
      es: "Remoto funciona para casi todo — el trabajo es datos y código, y eso viaja bien. En persona es posible en el área de la Bahía cuando tiene sentido para el proyecto.",
    },
  },
  {
    question: {
      en: "I don't have a scoped project yet, can I still reach out?",
      es: "Todavía no tengo un proyecto definido, ¿puedo escribirte de todos modos?",
    },
    answer: {
      en: "Yes. Plenty of projects start as \"something's not working\" rather than a finished spec — that's what the research phase is for.",
      es: "Sí. Muchos proyectos empiezan como «algo no está funcionando» en vez de una especificación terminada — para eso está la fase de investigación.",
    },
  },
  {
    question: {
      en: "What size teams or orgs do you usually work with?",
      es: "¿Con qué tamaño de equipos u organizaciones sueles trabajar?",
    },
    answer: {
      en: "Solo researchers, small NGOs, startups, and established companies. Scope and rate flex to match.",
      es: "Investigadores independientes, ONG pequeñas, startups y empresas establecidas. El alcance y la tarifa se ajustan según el caso.",
    },
  },
  {
    question: {
      en: "Can I hire you for one small task instead of a full project?",
      es: "¿Puedo contratarte para una sola tarea pequeña en vez de un proyecto completo?",
    },
    answer: {
      en: "Sure. Fixed-term projects can be scoped down to a single deliverable — a dataset, a model, a map — rather than a full build.",
      es: "Claro. Los proyectos a plazo fijo se pueden reducir a un solo entregable — un conjunto de datos, un modelo, un mapa — en vez de un desarrollo completo.",
    },
  },
  {
    question: {
      en: "Who owns the code and data once the project's done?",
      es: "¿De quién es el código y los datos cuando termina el proyecto?",
    },
    answer: {
      en: "You do. Everything ships in a repo under your ownership, documented, with a handover call included.",
      es: "Tuyos. Todo se entrega en un repositorio bajo tu propiedad, documentado, con una llamada de entrega incluida.",
    },
  },
];
