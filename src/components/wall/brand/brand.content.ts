import type { Phrase } from "@/content/i18n";

// A · Brand: every word the section says, in both languages, plus the few
// facts it shows (the page it frames, the team). Swap text here, not in the
// components.

/** The page A2 frames. platform.fuego.earth sends no X-Frame-Options or
 *  frame-ancestors (checked for the gallery's own embed in
 *  src/components/gallery/data.ts), so it can be shown live in an iframe. */
export const FUEGO_PAGE = {
  url: "https://platform.fuego.earth/simulator",
  /** What the address bar shows. */
  address: "platform.fuego.earth/simulator",
  /** A screenshot of the page under /public, shown until the visitor asks
   *  for the live page. `null` shows a labelled placeholder instead: the
   *  page could not be reached to capture one when this was built. Drop a
   *  ~1600×1000 image in public/wall/brand/ and point this at it. */
  screenshot: null as string | null,
};

export const BRAND_STRINGS = {
  /** A1's home-screen label, under the icon. A name: same in both. */
  appName: "Fuego",
  appIconAlt: { en: "The Fuego app icon", es: "El ícono de la app de Fuego" } as Phrase,

  browserTitle: { en: "The Fuego platform", es: "La plataforma de Fuego" } as Phrase,
  screenshotAlt: {
    en: "The Fuego wildfire spread simulator at platform.fuego.earth",
    es: "El simulador de propagación de incendios de Fuego en platform.fuego.earth",
  } as Phrase,
  tryLive: { en: "Try it live", es: "Pruébalo en vivo" } as Phrase,
  live: { en: "Live", es: "En vivo" } as Phrase,
  backToPreview: { en: "Back to the preview", es: "Volver a la vista previa" } as Phrase,
  openInTab: { en: "Open fuego.earth in a new tab", es: "Abrir fuego.earth en otra pestaña" } as Phrase,
  /** The two products, named as in the platform's own product switcher
   *  (fuego-earth-platform apps/web/src/lib/products.ts). */
  products: [
    { en: "Wildfire Spread Simulator", es: "Simulador de propagación" },
    { en: "Burn Probability Map", es: "Mapa de probabilidad de quema" },
  ] as Phrase[],
  previewPending: {
    en: "Screenshot coming soon",
    es: "Captura de pantalla pendiente",
  } as Phrase,

  teamTitle: { en: "The team", es: "El equipo" } as Phrase,

  /** Note A, handwritten. Kept short: it has to read at quadrant size. */
  note: { en: "We built this!", es: "¡Lo hicimos nosotros!" } as Phrase,
};

/**
 * The people who built the platform, from fuego-earth-platform's own
 * records: its commit history and .github/CODEOWNERS. Names are spelled as
 * in those records (Goran's commits sign "Goran Miletic"; Julia's GitHub
 * account is JuliaAlkmimSantos). `area` is the part of the code CODEOWNERS
 * makes each one a reviewer of, not a job title: none is written down.
 */
export type TeamMember = {
  name: string;
  initials: string;
  area: Phrase;
  github: string;
  /** A portrait under /public. Initials stand in without one. */
  photoSrc?: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Álvaro Galván",
    initials: "ÁG",
    area: { en: "Simulator, maps, deploy", es: "Simulador, mapas, despliegue" },
    github: "AlvaroGalvan1",
    photoSrc: "/gallery/portraits/headshot.jpeg",
  },
  {
    name: "Goran Miletic",
    initials: "GM",
    area: { en: "API & web app", es: "API y app web" },
    github: "miletic22",
  },
  {
    name: "Julia Alkmim Santos",
    initials: "JA",
    area: { en: "Risk map & research", es: "Mapa de riesgo e investigación" },
    github: "JuliaAlkmimSantos",
  },
];
