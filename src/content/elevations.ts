import type { Locale } from "./i18n";

// Cities with a known height above sea level, for the "you are standing at
// about the height of ___" line in the Where You Are tile.
//
// Two thirds of this list is deliberately mine: campuses from places.ts and
// ports from the Spring 2022 voyage. That's what turns a number into a
// sentence — "you're at 41 m, which is Maastricht, where I spent a year"
// says something about both of us, where "41 m" says nothing at all. The
// rest are here for coverage, because a table of only my own places has a
// hole between 600 m and 1,500 m that most of the world's highlands fall
// into.
//
// Figures are approximate city-centre elevations, rounded to the metre.
// They are not survey data and the copy says "about" for that reason: a
// city is not a point, and the difference between one end of Mexico City
// and the other is larger than most of the gaps in this list.
export type ElevationCity = {
  name: string;
  /** Metres above sea level, approximate. */
  metres: number;
  /** Where I've been, and in what capacity. Renders as the second half of
   *  the sentence; omitted for cities that are here purely for coverage.
   *
   *  A key rather than the phrase itself. Six relationships cover all
   *  twenty-odd entries, so writing them out per city was already three
   *  dozen copies of six strings — and translating it that way would have
   *  been seventy-two. Add a relationship here and both languages have to
   *  answer for it, which is the point. */
  mine?: MineRelation;
};

export type MineRelation =
  | "studied"
  | "port"
  | "voyageStart"
  | "voyageEnd"
  | "live"
  | "from";

/** Reads as the second half of "…which is about the height of Maastricht,
 *  where I studied." Lower case and no leading comma: the sentence in
 *  WhereYouAre supplies both. */
export const MINE_LABEL: Record<Locale, Record<MineRelation, string>> = {
  en: {
    studied: "where I studied",
    port: "a port on the voyage",
    voyageStart: "where the voyage began",
    voyageEnd: "where the voyage ended",
    live: "where I live",
    from: "where I'm from",
  },
  es: {
    studied: "donde estudié",
    port: "un puerto del viaje",
    voyageStart: "donde empezó el viaje",
    voyageEnd: "donde terminó el viaje",
    live: "donde vivo",
    from: "de donde soy",
  },
};

export const elevationCities: ElevationCity[] = [
  { name: "Rotterdam", metres: 0 },
  { name: "Bremerhaven", metres: 2, mine: "voyageEnd" },
  { name: "Dubrovnik", metres: 3, mine: "port" },
  { name: "Taipei", metres: 9, mine: "studied" },
  { name: "Piraeus", metres: 10, mine: "port" },
  { name: "London", metres: 11 },
  { name: "Barcelona", metres: 12, mine: "port" },
  { name: "Gdańsk", metres: 12, mine: "port" },
  { name: "Copenhagen", metres: 14 },
  { name: "San Francisco", metres: 16, mine: "live" },
  { name: "Naples", metres: 17, mine: "voyageStart" },
  { name: "Dublin", metres: 20, mine: "port" },
  { name: "Buenos Aires", metres: 25, mine: "studied" },
  { name: "Stockholm", metres: 28, mine: "port" },
  { name: "Brest", metres: 34, mine: "port" },
  { name: "Berlin", metres: 34, mine: "studied" },
  { name: "Paris", metres: 35 },
  { name: "Seoul", metres: 38, mine: "studied" },
  { name: "Lagos", metres: 41 },
  { name: "Maastricht", metres: 49, mine: "studied" },
  { name: "Casablanca", metres: 50, mine: "port" },
  { name: "Valletta", metres: 56, mine: "port" },
  { name: "Lisbon", metres: 100, mine: "port" },
  { name: "Haifa", metres: 300, mine: "port" },
  { name: "Hyderabad", metres: 542, mine: "studied" },
  { name: "Pune", metres: 560, mine: "studied" },
  { name: "Kathmandu", metres: 1400 },
  { name: "Oaxaca", metres: 1555, mine: "from" },
  { name: "Denver", metres: 1609 },
  { name: "Nairobi", metres: 1795 },
  { name: "Aguascalientes", metres: 1888, mine: "studied" },
  { name: "Mexico City", metres: 2240 },
  { name: "Addis Ababa", metres: 2355 },
  { name: "Bogotá", metres: 2640 },
  { name: "Quito", metres: 2850 },
  { name: "Cusco", metres: 3399 },
  { name: "La Paz", metres: 3640 },
  { name: "Lhasa", metres: 3656 },
];

/** The city closest in height to a given elevation. Linear scan: the list
 *  is under forty entries and sorting or bisecting it would be machinery
 *  for a loop that runs once per visitor. */
export function nearestByElevation(metres: number): ElevationCity {
  return elevationCities.reduce((best, city) =>
    Math.abs(city.metres - metres) < Math.abs(best.metres - metres) ? city : best,
  );
}
