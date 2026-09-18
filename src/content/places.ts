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

import { say, type Phrase } from "./i18n";

export type PlaceGroup = "uwc" | "minerva" | "uaa" | "voyage" | "home" | "friends";

export type Place = {
  id: string;
  /** The campus or city. The institution name comes from its group. */
  name: string;
  /** Street address or region, shown under the name. A street address is
   *  the same string in both languages and stays a bare one; "Port call"
   *  is not, and carries both. */
  detail: Phrase;
  /** Country, used for the "eight countries" count and the popup tag.
   *
   *  The count keys on the ENGLISH side (see journeyStats below), because
   *  a `Set` of objects dedupes by identity and would have counted Germany
   *  twice the moment this stopped being a string. */
  country: Phrase;
  group: PlaceGroup;
  lat: number;
  lon: number;
  /** Degree or programme, where there is one to state. */
  credential?: Phrase;
  /** Years, where known. */
  dates?: Phrase;
  /** One line of substance, the way a CV bullet would read. */
  note?: Phrase;
  /** WHERE THIS SITS IN THE STORY, and the field the map's player reads.
   *
   *  The map is called My Journey and for a long time it was not one: it
   *  was nine campuses scattered by institution plus a line through
   *  thirteen ports, which is a map of WHERE, with no WHEN in it anywhere.
   *  A journey is an order.
   *
   *  So every pin carries its place in the sequence, and the sequence is
   *  the real one — Oaxaca, Aguascalientes, Pune, Maastricht, the voyage,
   *  then the six Minerva cities, then home. Note that San Francisco
   *  appears twice in that story and only once on this map: `step` is the
   *  first arrival and `returnStep` is the second, which is what lets the
   *  player finish where it does.
   *
   *  Gaps in the numbering are fine and expected — they are room for a
   *  step that has not been added yet. What is NOT fine is two pins
   *  sharing a number, which would make the order depend on array
   *  position again. */
  step?: number;
  /** A second visit, for the one pin that has one. */
  returnStep?: number;
};

export type GroupDef = {
  /** Full institution name, used as the popup's heading. An institution's
   *  own name is not translated — Minerva University is called that in
   *  Spanish too — so most of these stay bare strings. */
  label: Phrase;
  /** Short name for the legend, where space is tight. */
  short: Phrase;
  /** Logo in public/logos. Square, unless `wordmark` says otherwise. */
  logo: string;
  /** The logo is a wide wordmark that already spells the name, so the
   *  legend shows it on its own, without the short label beside it. */
  wordmark?: boolean;
  /** Ring colour on the pin, and the legend swatch. */
  color: string;
  // `about` lived here: one line per institution explaining what it is.
  // It was printed at the foot of every popup in the group (six identical
  // paragraphs across the six Minerva cities), then moved to a caption
  // under each mark in the Education panel, and is now gone entirely —
  // the panel is four logos and nothing else.
  //
  // Deleted rather than kept unused. A field nothing reads is
  // indistinguishable from a field whose renderer broke, and the next
  // person to open this file has no way to tell which. It is in the git
  // history if the captions ever come back.
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
  },
  uwc: {
    label: "United World Colleges",
    short: "UWC",
    logo: "/logos/uwc.png",
    color: "#ffc93c",
  },
  uaa: {
    label: "Universidad Autónoma de Aguascalientes",
    short: "UAA",
    logo: "/logos/uaa.png",
    color: "#f5821f",
  },
  voyage: {
    // Semester at Sea is the programme; Colorado State University is the
    // institution that grants the credit, and has been the academic
    // partner since 2016 — so CSU is what belongs on a CV and the
    // programme is what makes it recognisable. Both, in that order.
    //
    // NOT the University of Colorado, which is a different university in
    // the same state. Checked against CSU's own pages rather than taken
    // on trust, because "close enough" on the name of a degree-granting
    // institution is the kind of error a reader who knows the field spots
    // instantly and cannot unsee.
    label: {
      en: "Semester at Sea — Colorado State University",
      es: "Semester at Sea — Colorado State University",
    },
    short: { en: "At sea", es: "En el mar" },
    // The programme's own wordmark. The pins on the route are dots either
    // way; this is what the legend and the popups show.
    logo: "/logos/semester-at-sea.svg",
    wordmark: true,
    // Maroon, the one value in the palette not already spent on a group.
    // It also reads as the darkest ring of the four, which suits a line of
    // pins that is meant to be seen as one object rather than four.
    color: "#7a1710",
    route: true,
    href: "https://www.semesteratsea.org/spring-2022-voyage-itinerary-update/",
  },
  home: {
    label: { en: "Home, and the year between", es: "Casa, y el año intermedio" },
    short: { en: "Home", es: "Casa" },
    logo: "",
    color: "#d92b1c",
  },
  friends: {
    label: { en: "Friends", es: "Amistades" },
    short: { en: "Friends", es: "Amistades" },
    logo: "",
    color: "#fff4de",
  },
};

const allPlaces: Place[] = [
  // ── Home ────────────────────────────────────────────────────────────
  // Oaxaca was not on this map at all, which is a strange thing for a map
  // of someone's journey: it is where the journey starts. It was left off
  // because the map was built as an education section and Oaxaca is not a
  // school — the moment the map became a story, it had to be step one.
  {
    id: "oaxaca",
    name: "Oaxaca",
    detail: { en: "Where I'm from", es: "De donde soy" },
    country: { en: "Mexico", es: "México" },
    group: "home",
    lat: 17.0732,
    lon: -96.7266,
    step: 1,
    note: {
      en: "Where it starts. Everything below is the order it actually happened in.",
      es: "Donde empieza. Todo lo de abajo está en el orden en que de verdad pasó.",
    },
  },

  // ── UAA ─────────────────────────────────────────────────────────────
  {
    id: "uaa",
    step: 2,
    name: "Aguascalientes",
    detail: "Universidad Autónoma de Aguascalientes",
    country: { en: "Mexico", es: "México" },
    group: "uaa",
    lat: 21.88122,
    lon: -102.29248,
  },

  // ── UWC ─────────────────────────────────────────────────────────────
  {
    id: "uwc-mahindra",
    step: 3,
    name: "Pune",
    detail: "Khubavali, Paud, Mulshi 412108, Maharashtra",
    country: { en: "India", es: "India" },
    group: "uwc",
    lat: 18.54436,
    lon: 73.58198,
  },
  {
    id: "uwc-maastricht",
    step: 4,
    name: "Maastricht",
    detail: "UWC Maastricht",
    country: { en: "Netherlands", es: "Países Bajos" },
    group: "uwc",
    lat: 50.85606,
    lon: 5.72385,
  },

  // ── Minerva University ──────────────────────────────────────────────
  // One city per term. The degree moves you through all six, which is why
  // they share a credential line rather than each claiming their own.
  {
    id: "minerva-sf",
    // Twice: arrived here after the ship, and back here now. The player
    // opens and closes on this pin, which is the shape of the story.
    step: 20,
    returnStep: 26,
    name: "San Francisco",
    detail: "16 Turk Street",
    country: { en: "United States", es: "Estados Unidos" },
    group: "minerva",
    lat: 37.78354,
    lon: -122.40941,
    credential: { en: "B.S. Computational Sciences", es: "Lic. en Ciencias Computacionales" },
    dates: { en: "Expected May 2026", es: "Prevista mayo 2026" },
  },
  {
    id: "minerva-seoul",
    step: 21,
    name: "Seoul",
    detail: "Shinheungno 26-gil, Yongsan-gu, 04337",
    country: { en: "South Korea", es: "Corea del Sur" },
    group: "minerva",
    lat: 37.54551,
    lon: 126.98304,
    credential: { en: "B.S. Computational Sciences", es: "Lic. en Ciencias Computacionales" },
  },
  {
    id: "minerva-hyderabad",
    step: 25,
    name: "Hyderabad",
    detail: "Survey No. 09, Kondapur, Whitefields, Telangana 500084",
    country: { en: "India", es: "India" },
    group: "minerva",
    lat: 17.45758,
    lon: 78.36521,
    credential: { en: "B.S. Computational Sciences", es: "Lic. en Ciencias Computacionales" },
  },
  {
    id: "minerva-berlin",
    step: 22,
    name: "Berlin",
    detail: "Boxhagener Straße 73, Friedrichshain, 10245",
    country: { en: "Germany", es: "Alemania" },
    group: "minerva",
    lat: 52.50747,
    lon: 13.46993,
    credential: { en: "B.S. Computational Sciences", es: "Lic. en Ciencias Computacionales" },
  },
  {
    id: "minerva-buenos-aires",
    step: 23,
    name: "Buenos Aires",
    detail: "Esmeralda 920, 9th floor, Retiro",
    country: { en: "Argentina", es: "Argentina" },
    group: "minerva",
    lat: -34.59742,
    lon: -58.37884,
    credential: { en: "B.S. Computational Sciences", es: "Lic. en Ciencias Computacionales" },
  },
  {
    id: "minerva-taipei",
    step: 24,
    name: "Taipei",
    detail: "No. 81 Jingfeng St, Wenshan District, 11687",
    country: { en: "Taiwan", es: "Taiwán" },
    group: "minerva",
    lat: 25.00073,
    lon: 121.5457,
    credential: { en: "B.S. Computational Sciences", es: "Lic. en Ciencias Computacionales" },
  },

  // ── The year between ────────────────────────────────────────────────
  // Volunteering in Mexico, between Maastricht and the ship. The city has
  // not been established yet, so this entry filters itself off the map
  // rather than putting a pin on a guess — same rule the Wall follows for
  // an uncredited tile and the Experience column for an unfinished role.
  // Fill in `name`, `detail` and the coordinates and it appears, in the
  // right place in the sequence, with no other change.
  {
    id: "volunteering-mx",
    name: "TODO: which city?",
    detail: { en: "Volunteering", es: "Voluntariado" },
    country: { en: "Mexico", es: "México" },
    group: "home",
    lat: 0,
    lon: 0,
    step: 5,
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
  { id: "sea-naples", name: "Naples", detail: { en: "Embarkation", es: "Embarque" }, country: { en: "Italy", es: "Italia" }, group: "voyage", step: 6, lat: 40.8518, lon: 14.2681, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" }, note: { en: "Where the voyage began: 106 days, thirteen ports, one term of coursework carried between them.", es: "Donde empezó el viaje: 106 días, trece puertos, un semestre de clases cargado entre ellos." } },
  { id: "sea-piraeus", name: "Piraeus", detail: { en: "Port call", es: "Escala" }, country: { en: "Greece", es: "Grecia" }, group: "voyage", step: 7, lat: 37.9470, lon: 23.6370, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-haifa", name: "Haifa", detail: { en: "Port call", es: "Escala" }, country: { en: "Israel", es: "Israel" }, group: "voyage", step: 8, lat: 32.7940, lon: 34.9896, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-dubrovnik", name: "Dubrovnik", detail: { en: "Port call", es: "Escala" }, country: { en: "Croatia", es: "Croacia" }, group: "voyage", step: 9, lat: 42.6507, lon: 18.0944, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-valletta", name: "Valletta", detail: { en: "Port call", es: "Escala" }, country: { en: "Malta", es: "Malta" }, group: "voyage", step: 10, lat: 35.8989, lon: 14.5146, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-barcelona", name: "Barcelona", detail: { en: "Port call", es: "Escala" }, country: { en: "Spain", es: "España" }, group: "voyage", step: 11, lat: 41.3851, lon: 2.1734, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-casablanca", name: "Casablanca", detail: { en: "Port call", es: "Escala" }, country: { en: "Morocco", es: "Marruecos" }, group: "voyage", step: 12, lat: 33.5731, lon: -7.5898, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-lisbon", name: "Lisbon", detail: { en: "Port call", es: "Escala" }, country: { en: "Portugal", es: "Portugal" }, group: "voyage", step: 13, lat: 38.7223, lon: -9.1393, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-brest", name: "Brest", detail: { en: "Port call", es: "Escala" }, country: { en: "France", es: "Francia" }, group: "voyage", step: 14, lat: 48.3904, lon: -4.4861, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-dublin", name: "Dublin", detail: { en: "Port call", es: "Escala" }, country: { en: "Ireland", es: "Irlanda" }, group: "voyage", step: 15, lat: 53.3498, lon: -6.2603, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-gdansk", name: "Gdańsk", detail: { en: "Port call", es: "Escala" }, country: { en: "Poland", es: "Polonia" }, group: "voyage", step: 16, lat: 54.3520, lon: 18.6466, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-stockholm", name: "Stockholm", detail: { en: "Port call", es: "Escala" }, country: { en: "Sweden", es: "Suecia" }, group: "voyage", step: 17, lat: 59.3293, lon: 18.0686, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" } },
  { id: "sea-bremerhaven", name: "Bremerhaven", detail: { en: "Disembarkation", es: "Desembarque" }, country: { en: "Germany", es: "Alemania" }, group: "voyage", step: 18, lat: 53.5396, lon: 8.5809, dates: { en: "Jan – Apr 2022", es: "Ene – Abr 2022" }, note: { en: "Where it ended, 106 days after Naples.", es: "Donde terminó, 106 días después de Nápoles." } },

  // ── Friends ─────────────────────────────────────────────────────────
  // Nothing here yet. Add entries with group: "friends" and the legend row
  // appears on its own; until then the toggle stays hidden rather than
  // offering an empty layer.
];

// Pins that are actually placed. Same "never show what isn't there" rule
// the Wall follows for an uncredited tile and the Experience column for an
// unfinished role: a pin at 0,0 is a marker in the Gulf of Guinea, and a
// popup reading "TODO: which city?" is worse than a gap in the story.
//
// Fill the entry in and it appears, in its right place in the sequence,
// with nothing else to change.
const isUnplaced = (place: Place) =>
  place.name.startsWith("TODO") || (place.lat === 0 && place.lon === 0);

export const places: Place[] = allPlaces.filter((place) => !isUnplaced(place));

export type JourneyStop = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  group: PlaceGroup;
};

/**
 * The journey, in the order it happened.
 *
 * This is what the map's player walks, and it is the reason `step` exists.
 * Built by sorting on that field rather than on array position, so the
 * pins above can stay grouped by institution — which is how they are
 * easiest to read and edit — while the story runs through them in a
 * completely different order.
 *
 * San Francisco appears twice, because it happened twice: once off the
 * ship, and again now. `returnStep` is what puts it back at the end, and
 * the second visit carries a distinct `id` so nothing downstream keyed on
 * id collides with the first.
 */
export const journey: JourneyStop[] = places
  .flatMap((place) => {
    const stops: { step: number; stop: JourneyStop }[] = [];
    const base = { id: place.id, name: place.name, lat: place.lat, lon: place.lon, group: place.group };
    if (place.step !== undefined) stops.push({ step: place.step, stop: base });
    if (place.returnStep !== undefined) {
      stops.push({ step: place.returnStep, stop: { ...base, id: `${place.id}-return` } });
    }
    return stops;
  })
  .sort((a, b) => a.step - b.step)
  .map((entry) => entry.stop);

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
  countries: new Set(studied.map((p) => say(p.country, "en"))).size,
  institutions: new Set(studied.map((p) => p.group)).size,
  ports: atSea.length,
  /** Countries touched either way, with the overlap counted once. This is
   *  the number that is true of the map as a whole. */
  countriesInAll: new Set([...studied, ...atSea].map((p) => say(p.country, "en"))).size,
};
