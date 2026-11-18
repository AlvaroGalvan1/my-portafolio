import type { Phrase } from "@/content/i18n";

// C · Climate Adaptation: every word the section shows or announces.

// C1–C4: the QGIS sheets, in the owner's sketch order (top-left, top-right,
// bottom-left, bottom-right). The alt text follows the gallery entry
// `maps-mexico-oaxaca` in src/components/gallery/data.ts.
export const CLIMATE_MAPS: { id: string; src: string; caption: Phrase; alt: Phrase }[] = [
  {
    id: "C1",
    src: "/gallery/maps/river_mexico.jpeg",
    caption: { en: "Mexico · rivers", es: "México · ríos" },
    alt: { en: "The river network of Mexico.", es: "La red de ríos de México." },
  },
  {
    id: "C2",
    src: "/gallery/maps/soil_oaxaca.jpeg",
    caption: { en: "Oaxaca · soil", es: "Oaxaca · suelos" },
    alt: { en: "Soil type profiles across Oaxaca.", es: "Los tipos de suelo de Oaxaca." },
  },
  {
    id: "C3",
    src: "/gallery/maps/river_oaxaca.jpeg",
    caption: { en: "Oaxaca · rivers", es: "Oaxaca · ríos" },
    alt: { en: "The river network of Oaxaca.", es: "La red de ríos de Oaxaca." },
  },
  {
    id: "C4",
    src: "/gallery/maps/soil_mexico.jpeg",
    caption: { en: "Mexico · soil", es: "México · suelos" },
    alt: { en: "Soil type profiles across Mexico.", es: "Los tipos de suelo de México." },
  },
];

export const CLIMATE_STRINGS = {
  mapsLabel: { en: "Maps of Mexico and Oaxaca", es: "Mapas de México y Oaxaca" } as Phrase,
  // The gallery entry's credit ({ who: "Álvaro Galván", relation: "mine" }).
  credit: { en: "QGIS · Álvaro Galván", es: "QGIS · Álvaro Galván" } as Phrase,
  // C5 is a motion study only: no data, so it says nothing about Oaxaca
  // beyond its name, and its caption admits it is still being made.
  motionLabel: {
    en: "Oaxaca within Mexico, a map in progress. Hover or focus to zoom out.",
    es: "Oaxaca dentro de México, un mapa en proceso. Pasa el cursor o enfoca para alejar.",
  } as Phrase,
  motionCaption: { en: "Oaxaca · in progress", es: "Oaxaca · en proceso" } as Phrase,
  motionHint: { en: "hover", es: "pasa el cursor" } as Phrase,
  oaxaca: "Oaxaca" as Phrase,
};
