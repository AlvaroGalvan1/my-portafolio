import type { Locale } from "./i18n";

// Place names are stored once, in English. Spanish has its own name for
// many of them, and "Naples" or "London" inside a Spanish sentence is the
// seam that makes a page read as machine-translated. Only the ones that
// differ are listed; everything else passes through unchanged.
const ES: Record<string, string> = {
  Rotterdam: "Róterdam",
  Taipei: "Taipéi",
  Piraeus: "El Pireo",
  London: "Londres",
  Gdańsk: "Gdansk",
  Copenhagen: "Copenhague",
  Naples: "Nápoles",
  Dublin: "Dublín",
  Stockholm: "Estocolmo",
  Berlin: "Berlín",
  Paris: "París",
  Seoul: "Seúl",
  Valletta: "La Valeta",
  Lisbon: "Lisboa",
  Kathmandu: "Katmandú",
  "Mexico City": "Ciudad de México",
  "Addis Ababa": "Adís Abeba",
};

export function cityName(name: string, locale: Locale): string {
  return locale === "es" ? (ES[name] ?? name) : name;
}
