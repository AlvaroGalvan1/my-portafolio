import type { Locale } from "@/content/i18n";

export const shellContent: Record<
  Locale,
  {
    nav: { label: string; home: string; wall: string; about: string; work: string };
    footer: {
      label: string;
      email: string;
      linkedin: string;
      github: string;
      cv: string;
      pricing: string;
      faq: string;
      language: string;
    };
  }
> = {
  en: {
    nav: {
      label: "Main",
      home: "Álvaro Galván, home",
      wall: "Wall",
      about: "About",
      work: "Work with me",
    },
    footer: {
      label: "Footer",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      cv: "CV",
      pricing: "Pricing",
      faq: "FAQ",
      language: "Language",
    },
  },
  es: {
    nav: {
      label: "Principal",
      home: "Álvaro Galván, inicio",
      wall: "Muro",
      about: "Sobre mí",
      work: "Trabaja conmigo",
    },
    footer: {
      label: "Pie de página",
      email: "Correo",
      linkedin: "LinkedIn",
      github: "GitHub",
      cv: "CV",
      pricing: "Tarifas",
      faq: "Preguntas",
      language: "Idioma",
    },
  },
};
