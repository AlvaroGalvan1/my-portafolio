import type { Phrase } from "./i18n";

// What someone can hire me for, and what it costs. The services render in
// Work with me on the home page; the rates render on the Pricing page, the
// one route outside the home page's scroll.
//
// The three stages of one end-to-end product: working out what to build,
// building and deploying it, and designing what people see. Shown in that
// order on purpose, so the row reads as one pipeline rather than a menu.
export type Service = {
  title: Phrase;
  body: Phrase;
  includes: Phrase[];
};

export const services: Service[] = [
  {
    title: { en: "Research", es: "Investigación" },
    body: {
      en: "Working out what to build before anyone writes code.",
      es: "Definir qué construir antes de escribir código.",
    },
    includes: [
      { en: "Who is building what in wildfire and climate", es: "Quién construye qué en incendios y clima" },
      { en: "Which data sources are worth using", es: "Qué fuentes de datos vale la pena usar" },
      { en: "A plan you can take to your team or funders", es: "Un plan para presentar a tu equipo o a quien te financia" },
    ],
  },
  {
    title: { en: "Build & deploy", es: "Desarrollo y despliegue" },
    body: {
      en: "The pipelines, backend and infrastructure, shipped and running in production.",
      es: "Los pipelines, el backend y la infraestructura, en producción y funcionando.",
    },
    includes: [
      { en: "Satellite, terrain and sensor data pipelines", es: "Pipelines de datos satelitales, de terreno y de sensores" },
      { en: "Models, APIs and geospatial processing", es: "Modelos, APIs y procesamiento geoespacial" },
      { en: "Cloud deployment, docs and handover", es: "Despliegue en la nube, documentación y entrega" },
    ],
  },
  {
    title: { en: "Design", es: "Diseño" },
    body: {
      en: "The maps, interfaces and visuals people actually use.",
      es: "Los mapas, interfaces y visualizaciones que la gente de verdad usa.",
    },
    includes: [
      { en: "Cartography for reports and public pages", es: "Cartografía para reportes y páginas públicas" },
      { en: "Interactive maps, dashboards and frontends", es: "Mapas interactivos, tableros y frontends" },
      { en: "Figures for experts and the public", es: "Figuras para especialistas y para el público" },
    ],
  },
];

// The ways to pay, from the base rate down to free. Ordered so the price
// falls left to right and the row ends on pro bono and the reason for it.
// No dollar figure is invented for the NGO rate or fixed-term work: both
// are settled on the call, and the card says so.
export type Rate = {
  label: Phrase;
  price: Phrase;
  body: Phrase;
};

export const rates: Rate[] = [
  {
    label: { en: "Base rate", es: "Tarifa base" },
    price: { en: "$65 USD/hour", es: "65 USD/hora" },
    body: {
      en: "For companies and startups. Billed hourly.",
      es: "Para empresas y startups. Se cobra por hora.",
    },
  },
  {
    label: { en: "Fixed-term projects", es: "Proyectos a plazo fijo" },
    price: { en: "Fixed price", es: "Precio cerrado" },
    body: {
      en: "A set scope and timeline, with the total agreed before we start.",
      es: "Alcance y plazo definidos, con el total acordado antes de empezar.",
    },
  },
  {
    label: { en: "NGOs & nonprofits", es: "ONG y organizaciones sociales" },
    price: { en: "Reduced rate", es: "Tarifa reducida" },
    body: {
      en: "Lower rates for NGOs, nonprofits and research groups.",
      es: "Tarifas más bajas para ONG, organizaciones sin fines de lucro y grupos de investigación.",
    },
  },
  {
    label: { en: "Pro bono", es: "Pro bono" },
    price: { en: "$0", es: "0 USD" },
    body: {
      en: "For climate and conservation projects I believe in. We need to solve the climate crisis together.",
      es: "Para proyectos de clima y conservación en los que creo. La crisis climática la tenemos que resolver entre todos.",
    },
  },
];

export const AVAILABILITY: Phrase = {
  en: "Open to consulting contracts and full-time geospatial roles.",
  es: "Disponible para contratos de consultoría y puestos de tiempo completo en ingeniería geoespacial.",
};
