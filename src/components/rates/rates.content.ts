import type { Locale } from "@/content/i18n";

// Copy for this section, en + es. The $125 itself is in content/services.ts.
export const ratesContent: Record<Locale, {
  rateLabel: string;
  unit: string;
  floor: string;
  floorNote: string;
}> = {
  en: {
    rateLabel: "My rate",
    unit: "/ hour",
    floor: "down to $0",
    floorNote: "NGOs and mission-driven work. I adjust.",
  },
  es: {
    rateLabel: "Mi tarifa",
    unit: "/ hora",
    floor: "hasta 0 USD",
    floorNote: "ONG y trabajo con propósito. Me adapto.",
  },
};
