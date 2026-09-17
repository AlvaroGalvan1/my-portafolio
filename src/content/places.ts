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

export type PlaceGroup = "uwc" | "minerva" | "uaa" | "voyage" | "friends";

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
  /** Somewhere to read more, linked from the foot of every popup in the
   *  group. Used where the thing is unfamiliar enough that a reader would
   *  want to look it up — the voyage, whose itinerary is published. */
  href?: string;
  /** Draw a line through this group's pins, in the order they appear in
   *  `places`. A route rather than a scatter: true for the voyage, where
   *  the sequence IS the fact, and false for campuses, which are places
   *  attended rather than a path taken. */
  route?: boolean;
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
  voyage: {
    label: "Semester at Sea",
    short: "At sea",
    logo: "/logos/voyage.svg",
    // Maroon, the one value in the palette not already spent on a group.
    // It also reads as the darkest ring of the four, which suits a line of
    // pins that is meant to be seen as one object rather than four.
    color: "#7a1710",
    route: true,
    href: "https://www.semesteratsea.org/spring-2022-voyage-itinerary-update/",
    about:
      "A shipboard study-abroad programme: one term of coursework taught between ports rather than on a campus. The Spring 2022 voyage ran 106 days, Naples to Bremerhaven.",
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

  // ── Semester at Sea, Spring 2022 ────────────────────────────────────
  // IN ITINERARY ORDER, and it has to stay that way: `route: true` on the
  // group draws the line through these pins in exactly this sequence, so
  // re-sorting this block re-routes the ship.
  //
  // Dates are the voyage's, not each port's — a port call is a day or
  // three, and putting thirteen sets of two-day ranges on the map would be
  // precision nobody asked for.
  //
  // Coordinates are the port cities, geocoded the same way as the campuses
  // above. They locate the city rather than the berth, which is the right
  // resolution for a pin at world zoom.
  //
  // The itinerary is the published one for this voyage, linked from every
  // popup in the group (GROUPS.voyage.href).
  { id: "sea-naples", name: "Naples", detail: "Embarkation", country: "Italy", group: "voyage", lat: 40.8518, lon: 14.2681, dates: "Jan – Apr 2022", note: "Where the voyage began: 106 days, thirteen ports, one term of coursework carried between them." },
  { id: "sea-piraeus", name: "Piraeus", detail: "Port call", country: "Greece", group: "voyage", lat: 37.9470, lon: 23.6370, dates: "Jan – Apr 2022" },
  { id: "sea-haifa", name: "Haifa", detail: "Port call", country: "Israel", group: "voyage", lat: 32.7940, lon: 34.9896, dates: "Jan – Apr 2022" },
  { id: "sea-dubrovnik", name: "Dubrovnik", detail: "Port call", country: "Croatia", group: "voyage", lat: 42.6507, lon: 18.0944, dates: "Jan – Apr 2022" },
  { id: "sea-valletta", name: "Valletta", detail: "Port call", country: "Malta", group: "voyage", lat: 35.8989, lon: 14.5146, dates: "Jan – Apr 2022" },
  { id: "sea-barcelona", name: "Barcelona", detail: "Port call", country: "Spain", group: "voyage", lat: 41.3851, lon: 2.1734, dates: "Jan – Apr 2022" },
  { id: "sea-casablanca", name: "Casablanca", detail: "Port call", country: "Morocco", group: "voyage", lat: 33.5731, lon: -7.5898, dates: "Jan – Apr 2022" },
  { id: "sea-lisbon", name: "Lisbon", detail: "Port call", country: "Portugal", group: "voyage", lat: 38.7223, lon: -9.1393, dates: "Jan – Apr 2022" },
  { id: "sea-brest", name: "Brest", detail: "Port call", country: "France", group: "voyage", lat: 48.3904, lon: -4.4861, dates: "Jan – Apr 2022" },
  { id: "sea-dublin", name: "Dublin", detail: "Port call", country: "Ireland", group: "voyage", lat: 53.3498, lon: -6.2603, dates: "Jan – Apr 2022" },
  { id: "sea-gdansk", name: "Gdańsk", detail: "Port call", country: "Poland", group: "voyage", lat: 54.3520, lon: 18.6466, dates: "Jan – Apr 2022" },
  { id: "sea-stockholm", name: "Stockholm", detail: "Port call", country: "Sweden", group: "voyage", lat: 59.3293, lon: 18.0686, dates: "Jan – Apr 2022" },
  { id: "sea-bremerhaven", name: "Bremerhaven", detail: "Disembarkation", country: "Germany", group: "voyage", lat: 53.5396, lon: 8.5809, dates: "Jan – Apr 2022", note: "Where it ended, 106 days after Naples." },

  // ── Friends ─────────────────────────────────────────────────────────
  // Nothing here yet. Add entries with group: "friends" and the legend row
  // appears on its own; until then the toggle stays hidden rather than
  // offering an empty layer.
];

// The headline numbers under the section title. Derived rather than typed
// out, so adding a pin can never leave the summary saying something false.
// Nothing renders these today: the line that read "9 campuses, 8 countries,
// one degree" came off the Education column, and the map and the printed
// campus list each say it without counting out loud. Kept rather than
// deleted because it is derived, not written — it costs nothing, it cannot
// go stale, and the next thing that wants a headline number wants exactly
// this.
const STUDIED: PlaceGroup[] = ["minerva", "uwc", "uaa"];
const studied = places.filter((p) => STUDIED.includes(p.group));
const atSea = places.filter((p) => p.group === "voyage");

export const journeyStats = {
  campuses: studied.length,
  countries: new Set(studied.map((p) => p.country)).size,
  institutions: new Set(studied.map((p) => p.group)).size,
  ports: atSea.length,
  /** Countries touched either way, with the overlap counted once. This is
   *  the number that is true of the map as a whole. */
  countriesInAll: new Set([...studied, ...atSea].map((p) => p.country)).size,
};
