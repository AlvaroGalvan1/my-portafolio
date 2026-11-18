import type { Phrase } from "@/content/i18n";

// B · Brand: every word the section says, in both languages, plus the few
// facts it shows (the page it frames, the team). Swap text here, not in the
// components.

/** The page B2 frames. platform.fuego.earth sends no X-Frame-Options or
 *  frame-ancestors (checked for the gallery's own embed in
 *  src/components/gallery/data.ts), so it can be shown live in an iframe. */
// B1, the app icon, opens the simulator like opening the app; B3, the team,
// links to fuego.earth's About page.
export const FUEGO_LINKS = {
  app: "https://platform.fuego.earth/simulator",
  about: "https://www.fuego.earth/about",
  aboutLabel: "fuego.earth/about",
};

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
  /** B1's home-screen label, under the icon. A name: same in both. */
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

  /** Note B, handwritten. Kept short: it has to read at quadrant size. */
  note: { en: "We built this!", es: "¡Lo hicimos nosotros!" } as Phrase,
};

/**
 * The Fuego team as fuego.earth's About page lists it (fuego-earth repo,
 * src/lib/team.js): the same five people, roles, photos and LinkedIn links.
 * Keep the two in step: when the About page changes, change this.
 */
export type TeamMember = {
  name: string;
  initials: string;
  /** Their role, as written on the About page. */
  area: Phrase;
  href: string;
  /** A portrait under /public. Initials stand in without one. */
  photoSrc?: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Alvaro Galvan",
    initials: "AG",
    area: { en: "Full-Stack Software Engineer", es: "Ingeniero de software full-stack" },
    href: "https://www.linkedin.com/in/alvarogalvan",
    photoSrc: "/wall/brand/team/alvaro.jpg",
  },
  {
    name: "Goran Miletic",
    initials: "GM",
    area: { en: "Head of AI", es: "Jefe de IA" },
    href: "https://www.linkedin.com/in/gmiletic2",
    photoSrc: "/wall/brand/team/goran.jpg",
  },
  {
    name: "Julia Alkmim",
    initials: "JA",
    area: { en: "Simulation Platform Engineer", es: "Ingeniera de la plataforma de simulación" },
    href: "https://www.linkedin.com/in/j%C3%BAlia-alkmim",
    photoSrc: "/wall/brand/team/julia.jpg",
  },
  {
    name: "Sofiia Bilyk",
    initials: "SB",
    area: { en: "Product Manager", es: "Product Manager" },
    href: "https://www.linkedin.com/in/sofia-bilyk",
    photoSrc: "/wall/brand/team/sofiia.jpg",
  },
  {
    name: "My Chan",
    initials: "MC",
    area: { en: "Product Manager", es: "Product Manager" },
    href: "https://www.linkedin.com/in/mee-tran-34530725b",
    photoSrc: "/wall/brand/team/my.jpg",
  },
];
