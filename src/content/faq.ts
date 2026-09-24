import type { Phrase } from "./i18n";

// The questions a reader has right before they'd otherwise write an email
// to ask them. Answered here so the email, if it comes, is about the
// project instead.
//
// Each one earns its place by covering ground nothing else on the page
// does — response time and timezone are in the footer, not here; what a
// project delivers is in Process. A question that just repeats another
// section in FAQ clothing is worse than no question at all.
export type FaqItem = {
  question: Phrase;
  answer: Phrase;
};

export const faq: FaqItem[] = [
  {
    question: { en: "Full-time or contract — which is this?", es: "¿Tiempo completo o por contrato?" },
    answer: {
      en: "Either. I'm open to consulting contracts and to full-time geospatial roles — say which one you've got and we'll go from there.",
      es: "Cualquiera de los dos. Estoy abierto a contratos de consultoría y a puestos de tiempo completo en geoespacial — dime cuál tienes en mente y seguimos de ahí.",
    },
  },
  {
    question: { en: "Do you only work on wildfire and climate projects?", es: "¿Solo trabajas en proyectos de incendios y clima?" },
    answer: {
      en: "That's where most of my work lives and where I'm fastest, but the skills are general geospatial engineering. If it's spatial data and it needs building, ask.",
      es: "Ahí vive la mayoría de mi trabajo y donde soy más rápido, pero las habilidades son de ingeniería geoespacial en general. Si es un problema de datos espaciales, pregúntame.",
    },
  },
  {
    question: { en: "Do you sign NDAs?", es: "¿Firmas acuerdos de confidencialidad?" },
    answer: {
      en: "Yes — send yours, or I'll send mine on the call.",
      es: "Sí. Envía el tuyo, o yo mando el mío en la llamada.",
    },
  },
  {
    question: { en: "What if my org can't pay the base rate?", es: "¿Y si mi organización no puede pagar la tarifa base?" },
    answer: {
      en: "NGOs, nonprofits and pro bono climate work get reduced or free rates — details on the pricing page.",
      es: "ONG, organizaciones sin fines de lucro y proyectos climáticos pro bono tienen tarifas reducidas o gratuitas — los detalles están en la página de tarifas.",
    },
  },
];
