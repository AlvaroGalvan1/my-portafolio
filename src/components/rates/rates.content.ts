import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. The $85 itself is in content/services.ts.
export const ratesContent: Record<Locale, {
  heading: string;
  rateLabel: string;
  unit: string;
  floorLead: string;
  floorAmount: string;
  floorNote: string;
  availability: string;
}> = {
  en: {
    heading: "Pricing",
    rateLabel: "My rate",
    unit: "/ hour",
    floorLead: "down to",
    floorAmount: "$0",
    floorNote: "NGOs and mission-driven work. I adjust.",
    availability: "Open to consulting contracts and full-time geospatial roles.",
  },
  es: {
    heading: "Tarifas",
    rateLabel: "Mi tarifa",
    unit: "/ hora",
    floorLead: "hasta",
    floorAmount: "0 USD",
    floorNote: "ONG y trabajo con propósito. Me adapto.",
    availability: "Disponible para contratos de consultoría y puestos de tiempo completo en ingeniería geoespacial.",
  },
};
