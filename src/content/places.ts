// The pins on "My Journey".
//
// Coordinates were geocoded from the addresses via OpenStreetMap's
// Nominatim and spot-checked against the postcodes given: Seoul resolved to
// 04337 and Berlin to 10245, both matching. Mahindra resolved to the campus
// itself rather than the village. They're stored as literals rather than
// looked up at runtime — these places don't move, and a map that needs a
// third-party geocoder to draw itself is a map that breaks when that
// service does.

export type PlaceGroup = "education" | "minerva" | "friends";

export type Place = {
  id: string;
  name: string;
  /** Second line in the popup — the address or campus. */
  detail: string;
  group: PlaceGroup;
  lat: number;
  lon: number;
  /** Longer note. UWC's two campuses share one, since "what is UWC" is the
   *  question those pins actually raise. */
  blurb?: string;
};

export const GROUPS: Record<PlaceGroup, { label: string; color: string }> = {
  education: { label: "Education", color: "#ffc93c" },
  minerva: { label: "Minerva campuses", color: "#d92b1c" },
  friends: { label: "Friends", color: "#f5821f" },
};

const UWC_BLURB =
  "UWC (United World Colleges) is a network of eighteen international schools that deliberately recruit students from every corner of the world and put them through the IB together. Admission runs through national committees and is largely need-blind, so a cohort is genuinely mixed by nationality and income rather than by who can pay. Two years of it is where most of this map's later stops come from.";

export const places: Place[] = [
  // ── Education ───────────────────────────────────────────────────────
  {
    id: "uaa",
    name: "Universidad Autónoma de Aguascalientes",
    detail: "Aguascalientes, Mexico",
    group: "education",
    lat: 21.88122,
    lon: -102.29248,
  },
  {
    id: "uwc-mahindra",
    name: "UWC Mahindra College",
    detail: "Khubavali, Paud, Mulshi, Pune 412108, Maharashtra, India",
    group: "education",
    lat: 18.54436,
    lon: 73.58198,
    blurb: UWC_BLURB,
  },
  {
    id: "uwc-maastricht",
    name: "UWC Maastricht",
    detail: "Maastricht, Netherlands",
    group: "education",
    lat: 50.85606,
    lon: 5.72385,
    blurb: UWC_BLURB,
  },

  // ── Minerva University ──────────────────────────────────────────────
  // One city per term — the degree moves you through all six.
  {
    id: "minerva-sf",
    name: "Minerva University — San Francisco",
    detail: "16 Turk Street",
    group: "minerva",
    lat: 37.78354,
    lon: -122.40941,
  },
  {
    id: "minerva-seoul",
    name: "Minerva University — Seoul",
    detail: "Shinheungno 26-gil, Yongsan-gu, 04337",
    group: "minerva",
    lat: 37.54551,
    lon: 126.98304,
  },
  {
    id: "minerva-hyderabad",
    name: "Minerva University — Hyderabad",
    detail: "Survey No. 09, Kondapur, Whitefields, Telangana 500084",
    group: "minerva",
    lat: 17.45758,
    lon: 78.36521,
  },
  {
    id: "minerva-berlin",
    name: "Minerva University — Berlin",
    detail: "Boxhagener Straße 73, Friedrichshain, 10245",
    group: "minerva",
    lat: 52.50747,
    lon: 13.46993,
  },
  {
    id: "minerva-buenos-aires",
    name: "Minerva University — Buenos Aires",
    detail: "Esmeralda 920, 9th floor, Retiro",
    group: "minerva",
    lat: -34.59742,
    lon: -58.37884,
  },
  {
    id: "minerva-taipei",
    name: "Minerva University — Taipei",
    detail: "No. 81 Jingfeng St, Wenshan District, 11687",
    group: "minerva",
    lat: 25.00073,
    lon: 121.5457,
  },

  // ── Friends ─────────────────────────────────────────────────────────
  // Nothing here yet — add entries with group: "friends" and the legend
  // row appears on its own. Until then the toggle stays hidden rather than
  // offering an empty layer.
];
