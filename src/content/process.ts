import type { Phrase } from "./i18n";

// What happens after someone books, in the order it happens. Services says
// what I build; this says how working together actually runs, so a reader
// deciding whether to book knows what the next three steps look like
// before they commit to the first one.
export type ProcessStep = {
  title: Phrase;
  body: Phrase;
};

export const process: ProcessStep[] = [
  {
    title: { en: "Talk it through", es: "Hablamos primero" },
    body: {
      en: "One call, no deck required. Tell me what's broken or missing and I'll tell you honestly if it's something I can help with.",
      es: "Una llamada y ya, sin necesidad de armar nada. Cuéntame qué te falta o qué no funciona, y te digo con toda honestidad si puedo ayudarte.",
    },
  },
  {
    title: { en: "Scope the plan", es: "Definimos el plan" },
    body: {
      en: "A short written plan: what gets built, in what order, and what it costs. No surprises once we start.",
      es: "Un plan breve y por escrito: qué se construye, en qué orden y cuánto cuesta. Sin sorpresas una vez que empezamos.",
    },
  },
  {
    title: { en: "Ship it", es: "Lo entregamos" },
    body: {
      en: "Working code in a repo you own, deployed and documented, with a call to walk through it.",
      es: "Código funcionando en un repositorio que te pertenece, desplegado y documentado, con una llamada para revisarlo juntos.",
    },
  },
];
