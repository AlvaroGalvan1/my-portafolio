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
   *  the sentence; omitted for cities that are here purely for coverage. */
  mine?: string;
};

export const elevationCities: ElevationCity[] = [
  { name: "Rotterdam", metres: 0 },
  { name: "Bremerhaven", metres: 2, mine: "where the voyage ended" },
  { name: "Dubrovnik", metres: 3, mine: "a port on the voyage" },
  { name: "Taipei", metres: 9, mine: "where I studied" },
  { name: "Piraeus", metres: 10, mine: "a port on the voyage" },
  { name: "London", metres: 11 },
  { name: "Barcelona", metres: 12, mine: "a port on the voyage" },
  { name: "Gdańsk", metres: 12, mine: "a port on the voyage" },
  { name: "Copenhagen", metres: 14 },
  { name: "San Francisco", metres: 16, mine: "where I live" },
  { name: "Naples", metres: 17, mine: "where the voyage began" },
  { name: "Dublin", metres: 20, mine: "a port on the voyage" },
  { name: "Buenos Aires", metres: 25, mine: "where I studied" },
  { name: "Stockholm", metres: 28, mine: "a port on the voyage" },
  { name: "Brest", metres: 34, mine: "a port on the voyage" },
  { name: "Berlin", metres: 34, mine: "where I studied" },
  { name: "Paris", metres: 35 },
  { name: "Seoul", metres: 38, mine: "where I studied" },
  { name: "Lagos", metres: 41 },
  { name: "Maastricht", metres: 49, mine: "where I studied" },
  { name: "Casablanca", metres: 50, mine: "a port on the voyage" },
  { name: "Valletta", metres: 56, mine: "a port on the voyage" },
  { name: "Lisbon", metres: 100, mine: "a port on the voyage" },
  { name: "Haifa", metres: 300, mine: "a port on the voyage" },
  { name: "Hyderabad", metres: 542, mine: "where I studied" },
  { name: "Pune", metres: 560, mine: "where I studied" },
  { name: "Kathmandu", metres: 1400 },
  { name: "Oaxaca", metres: 1555, mine: "where I'm from" },
  { name: "Denver", metres: 1609 },
  { name: "Nairobi", metres: 1795 },
  { name: "Aguascalientes", metres: 1888, mine: "where I studied" },
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
