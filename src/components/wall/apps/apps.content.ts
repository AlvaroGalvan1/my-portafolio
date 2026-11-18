import type { Phrase } from "@/content/i18n";

// The words in D · Websites & Apps. The site itself is in Spanish; these
// are only the Wall's words around it.
export const APPS_STRINGS = {
  // The browser's address bar. No live address yet, so it shows where the
  // page really lives: the repo and its file.
  url: "qea-webpage/index.html",
  desktopAlt: {
    en: "Quick English Academy's landing page on a desktop browser: a sky-blue header with the button to book a free sample class, then the Offer, Testimonials and Contact sections.",
    es: "La página de Quick English Academy en un navegador de escritorio: un encabezado azul cielo con el botón para agendar una clase muestra gratis, y después las secciones de Oferta, Testimonios y Contacto.",
  } as Phrase,
  phoneAlt: {
    en: "The same Quick English Academy page on a phone, its sections stacked in one column.",
    es: "La misma página de Quick English Academy en un teléfono, con las secciones en una sola columna.",
  } as Phrase,
  // The line break is where the note wraps, so "mom's" stays with "English school".
  note: {
    en: "I built this for my\nmom's English school",
    es: "Lo hice para la escuela\nde inglés de mi mamá",
  } as Phrase,
};
