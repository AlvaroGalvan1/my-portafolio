// The pins on "My Journey".
//
// This is the education section of the CV, told as a map instead of a list.
// A list of nine campuses across eight countries reads as a wall of place
// names; the same nine as pins reads as a route, which is the actual point.
// So the popups carry what a CV entry carries (institution, credential,
// dates, one line of substance) and the map carries the geography.
//
// Coordinates were geocoded from the addresses via OpenStreetMap's
// Nominatim and spot-checked against the postcodes given: Seoul resolved to
// 04337 and Berlin to 10245, both matching. Mahindra resolved to the campus
// itself rather than the village. They're stored as literals rather than
// looked up at runtime, because these places do not move and a map that
// needs a third-party geocoder to draw itself is a map that breaks when
// that service does.

export type PlaceGroup = "uwc" | "minerva" | "uaa" | "friends";

export type Place = {
  id: string;
  /** The campus or city. The institution name comes from its group. */
  name: string;
  /** Street address or region, shown under the name. */
  detail: string;
  /** Country, used for the "eight countries" count and the popup tag. */
  country: string;
  group: PlaceGroup;
  lat: number;
  lon: number;
  /** Degree or programme, where there is one to state. */
  credential?: string;
  /** Years, where known. */
  dates?: string;
  /** One line of substance, the way a CV bullet would read. */
  note?: string;
};

export type GroupDef = {
  /** Full institution name, used as the popup's heading. */
  label: string;
  /** Short name for the legend, where space is tight. */
  short: string;
  /** Square logo mark in public/logos. */
  logo: string;
  /** Ring colour on the pin, and the legend swatch. */
  color: string;
  /** Shown once per institution at the foot of every one of its popups. */
  about?: string;
};

export const GROUPS: Record<PlaceGroup, GroupDef> = {
  minerva: {
    label: "Minerva University",
    short: "Minerva",
    logo: "/logos/minerva.png",
    color: "#d92b1c",
    about:
      "A highly selective programme (under 2% acceptance) built around critical and creative thinking, with coursework spanning six countries over four years. The six pins are one degree, not six schools.",
  },
  uwc: {
    label: "United World Colleges",
    short: "UWC",
    logo: "/logos/uwc.png",
    color: "#ffc93c",
    about:
      "UWC is a network of eighteen international schools that deliberately recruit students from every corner of the world and put them through the IB together. Admission runs through national committees and is largely need-blind, so a cohort is genuinely mixed by nationality and income rather than by who can pay.",
  },
  uaa: {
    label: "Universidad Autónoma de Aguascalientes",
    short: "UAA",
    logo: "/logos/uaa.png",
    color: "#f5821f",
  },
  friends: {
    label: "Friends",
    short: "Friends",
    logo: "",
    color: "#fff4de",
  },
};

export const places: Place[] = [
  // ── UAA ─────────────────────────────────────────────────────────────
  {
    id: "uaa",
    name: "Aguascalientes",
    detail: "Universidad Autónoma de Aguascalientes",
    country: "Mexico",
    group: "uaa",
    lat: 21.88122,
    lon: -102.29248,
  },

  // ── UWC ─────────────────────────────────────────────────────────────
  {
    id: "uwc-mahindra",
    name: "Pune",
    detail: "Khubavali, Paud, Mulshi 412108, Maharashtra",
    country: "India",
    group: "uwc",
    lat: 18.54436,
    lon: 73.58198,
  },
  {
    id: "uwc-maastricht",
    name: "Maastricht",
    detail: "UWC Maastricht",
    country: "Netherlands",
    group: "uwc",
    lat: 50.85606,
    lon: 5.72385,
  },

  // ── Minerva University ──────────────────────────────────────────────
  // One city per term. The degree moves you through all six, which is why
  // they share a credential line rather than each claiming their own.
  {
    id: "minerva-sf",
    name: "San Francisco",
    detail: "16 Turk Street",
    country: "United States",
    group: "minerva",
    lat: 37.78354,
    lon: -122.40941,
    credential: "B.S. Computational Sciences",
    dates: "Expected May 2026",
  },
  {
    id: "minerva-seoul",
    name: "Seoul",
    detail: "Shinheungno 26-gil, Yongsan-gu, 04337",
    country: "South Korea",
    group: "minerva",
    lat: 37.54551,
    lon: 126.98304,
    credential: "B.S. Computational Sciences",
  },
  {
    id: "minerva-hyderabad",
    name: "Hyderabad",
    detail: "Survey No. 09, Kondapur, Whitefields, Telangana 500084",
    country: "India",
    group: "minerva",
    lat: 17.45758,
    lon: 78.36521,
    credential: "B.S. Computational Sciences",
  },
  {
    id: "minerva-berlin",
    name: "Berlin",
    detail: "Boxhagener Straße 73, Friedrichshain, 10245",
    country: "Germany",
    group: "minerva",
    lat: 52.50747,
    lon: 13.46993,
    credential: "B.S. Computational Sciences",
  },
  {
    id: "minerva-buenos-aires",
    name: "Buenos Aires",
    detail: "Esmeralda 920, 9th floor, Retiro",
    country: "Argentina",
    group: "minerva",
    lat: -34.59742,
    lon: -58.37884,
    credential: "B.S. Computational Sciences",
  },
  {
    id: "minerva-taipei",
    name: "Taipei",
    detail: "No. 81 Jingfeng St, Wenshan District, 11687",
    country: "Taiwan",
    group: "minerva",
    lat: 25.00073,
    lon: 121.5457,
    credential: "B.S. Computational Sciences",
  },

  // ── Friends ─────────────────────────────────────────────────────────
  // Nothing here yet. Add entries with group: "friends" and the legend row
  // appears on its own; until then the toggle stays hidden rather than
  // offering an empty layer.
];

// The headline numbers under the section title. Derived rather than typed
// out, so adding a pin can never leave the summary saying something false.
export const journeyStats = {
  campuses: places.filter((p) => p.group !== "friends").length,
  countries: new Set(
    places.filter((p) => p.group !== "friends").map((p) => p.country),
  ).size,
  institutions: new Set(
    places.filter((p) => p.group !== "friends").map((p) => p.group),
  ).size,
};
