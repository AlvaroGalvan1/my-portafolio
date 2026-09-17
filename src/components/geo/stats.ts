// Everything the Where You Are panel can work out from a pair of
// coordinates without asking anyone.
//
// Half of that panel is fetched from Open-Meteo and half is computed here,
// and the half computed here is the more interesting half: a distance, a
// grid square and the speed the planet is carrying you at are all sitting
// inside the two numbers the browser already handed over. No key, no
// request, no failure mode.

const EARTH_RADIUS_KM = 6371;
/** Circumference at the equator over one sidereal day, in km/h. Everything
 *  on the surface goes round once a day; how fast depends on how far from
 *  the axis you are, which is a cosine of latitude away. */
const EQUATORIAL_SPIN_KMH = 1674.4;
/** Mean length of a degree of latitude. Latitude degrees are not quite
 *  even — the planet is an oblate spheroid, so a degree near the poles is
 *  about 1% longer than one at the equator — which is why anything derived
 *  from this is labelled "about" in the copy. */
const KM_PER_DEGREE_LAT = 111.195;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle distance in kilometres. Haversine rather than the simpler
 *  equirectangular approximation, which is fine for a city and wrong by
 *  hundreds of kilometres for the transcontinental distances this panel
 *  mostly deals in. */
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

const COMPASS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
];

/** Sixteen points rather than four. "West-northwest" is a direction a
 *  person can picture; "west" covers 90 degrees of sky. */
export function compassPoint(degrees: number): string {
  return COMPASS[Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16];
}

/** Degrees, minutes and seconds. The format every map in the world used
 *  before decimal degrees won, and still the one engraved on boundary
 *  markers. */
export function toDms(value: number, axis: "lat" | "lon"): string {
  const hemisphere =
    axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutesFull = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFull);
  const seconds = (minutesFull - minutes) * 60;
  return `${degrees}° ${minutes}' ${seconds.toFixed(1)}" ${hemisphere}`;
}

// Latitude bands, 8 degrees each, running C at 80S up to X at 84N. I and O
// are missing on purpose: on a chart they are unreadable next to 1 and 0,
// so the standard skips them.
const UTM_BANDS = "CDEFGHJKLMNPQRSTUVWX";

/** The UTM grid square, as a surveyor would give it. Zone number is a
 *  sixtieth of the planet, band letter is the latitude slice, and together
 *  they are the first thing on any field data sheet. */
export function utmZone(lat: number, lon: number): string {
  const zone = Math.floor(((lon + 180) % 360) / 6) + 1;
  const clamped = Math.max(-80, Math.min(83.9, lat));
  const band = UTM_BANDS[Math.floor((clamped + 80) / 8)] ?? "Z";
  return `${zone}${band}`;
}

/** The point directly through the planet. Latitude flips sign, longitude
 *  goes half a world round. */
export function antipode(lat: number, lon: number): { lat: number; lon: number } {
  return { lat: -lat, lon: lon > 0 ? lon - 180 : lon + 180 };
}

/** How fast the planet is carrying you east, in km/h. Maximum at the
 *  equator, nothing at all standing on a pole. */
export function spinSpeedKmh(lat: number): number {
  return EQUATORIAL_SPIN_KMH * Math.cos(toRadians(lat));
}

/** Kilometres to the equator, give or take the planet not being a sphere. */
export function distanceToEquatorKm(lat: number): number {
  return Math.abs(lat) * KM_PER_DEGREE_LAT;
}

/** The equation of time, in minutes: how far ahead or behind a sundial
 *  runs against a clock on a given day. It swings about sixteen minutes
 *  either way over a year, because the orbit is an ellipse and the axis is
 *  tilted, so ignoring it would put solar noon out by a quarter of an hour
 *  in November. This is the standard approximation, good to under a
 *  minute. */
function equationOfTimeMinutes(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

/** When the sun is actually overhead, on the clock the visitor is reading.
 *  Rarely twelve: time zones are political shapes, so a clock can run the
 *  best part of an hour away from the sun at the edge of one. */
export function solarNoon(lon: number, utcOffsetSeconds: number, now = new Date()): string {
  const offsetHours = utcOffsetSeconds / 3600;
  const minutesFromNoon = 4 * (lon - 15 * offsetHours) + equationOfTimeMinutes(now);
  const totalMinutes = 12 * 60 - minutesFromNoon;
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(wrapped / 60);
  const minutes = Math.round(wrapped % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Seconds of daylight as hours and minutes. */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

/** An ISO timestamp as a clock time. Open-Meteo returns local times with
 *  no zone suffix when asked for `timezone=auto`, so the clock face is
 *  already the visitor's and the string only has to be trimmed. */
export function clockTime(isoLocal: string): string {
  return isoLocal.slice(11, 16);
}

/** US AQI, in the words the scale is actually defined in. The number alone
 *  means nothing to anyone who does not already work with it. */
export function aqiLabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for sensitive groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very unhealthy";
  return "Hazardous";
}

/** WMO weather codes, grouped rather than enumerated. The full table has
 *  twenty-eight entries distinguishing slight from moderate drizzle, which
 *  is more precision than one line can spend. */
export function weatherLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloud";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

/** A distance, rounded the way a person would say it. Under ten kilometres
 *  the decimal matters; over a thousand it is noise. */
export function formatKm(km: number): string {
  if (km < 10) return `${km.toFixed(1)} km`;
  if (km < 1000) return `${Math.round(km)} km`;
  return `${Math.round(km).toLocaleString("en-US")} km`;
}
