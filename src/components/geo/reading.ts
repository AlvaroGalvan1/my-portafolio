import { nearestByElevation, type ElevationCity } from "@/content/elevations";
import type { Locale } from "@/content/i18n";
import { skyKind, type SkyKind } from "./stats";

// Everything the About you panel reads about one coordinate pair, fetched
// in parallel from public services and nothing else. Only elevation and
// the forecast are required; every other source may fail on its own, and
// the tile that needed it simply does not render.
//
// The hosts, all free and keyless:
//   api.open-meteo.com           elevation (Copernicus 90 m DEM), forecast
//   air-quality-api.open-meteo   air quality
//   archive-api.open-meteo.com   ERA5 reanalysis, for the same day in 1950
//   macrostrat.org               bedrock geology
//   nominatim.openstreetmap.org  the place's name
//   {lang}.wikipedia.org         articles about places nearby

export type Terrain = {
  /** 9×9 elevations, row 0 north, 250 m apart. */
  grid: number[][];
  slopeDeg: number;
  /** Bearing the ground faces, downhill. */
  aspectDeg: number;
  relief: number;
  highest: { metres: number; distanceM: number; bearing: number };
};

export type Bedrock = {
  name: string;
  lith: string;
  /** Age of the unit's oldest part, in millions of years. */
  maxAgeMa: number;
  period: string;
};

export type Nearby = { title: string; distanceM: number; url: string };

export type Reading = {
  lat: number;
  lon: number;
  accuracy?: number;
  /** "you" or "my street", already in the reader's language. */
  place: string;
  placeName?: { title: string; line: string };
  elevation: number;
  twin: ElevationCity;
  terrain?: Terrain;
  bedrock?: Bedrock | null;
  nearby?: Nearby[];
  timezone: string;
  utcOffsetSeconds: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  windDirection: number;
  cloud: number;
  pressure: number;
  sky: SkyKind;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  daylightSeconds: number;
  uvMax: number;
  todayHigh: number;
  /** The high on this calendar date in 1950, from ERA5. */
  high1950?: number;
  air?: { pm25: number; pm10: number; usAqi: number };
  fetchedAt: number;
};

const GRID = 9;
const STEP_M = 250;

const json = async <T,>(url: string): Promise<T | null> => {
  try {
    const res = await fetch(url);
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
};

function terrainFrom(elevations: number[]): Terrain {
  const grid = Array.from({ length: GRID }, (_, i) => elevations.slice(i * GRID, (i + 1) * GRID));
  const c = (GRID - 1) / 2;
  const dzdx = (grid[c][c + 1] - grid[c][c - 1]) / (2 * STEP_M);
  const dzdy = (grid[c - 1][c] - grid[c + 1][c]) / (2 * STEP_M);
  const slopeDeg = (Math.atan(Math.hypot(dzdx, dzdy)) * 180) / Math.PI;
  const aspectDeg = ((Math.atan2(-dzdx, -dzdy) * 180) / Math.PI + 360) % 360;

  let min = Infinity;
  let max = -Infinity;
  let at = [c, c];
  grid.forEach((row, i) =>
    row.forEach((z, j) => {
      if (z < min) min = z;
      if (z > max) {
        max = z;
        at = [i, j];
      }
    }),
  );
  const [hi, hj] = at;
  return {
    grid,
    slopeDeg,
    aspectDeg,
    relief: max - min,
    highest: {
      metres: max,
      distanceM: Math.hypot(hj - c, c - hi) * STEP_M,
      bearing: ((Math.atan2(hj - c, c - hi) * 180) / Math.PI + 360) % 360,
    },
  };
}

type MacrostratUnit = {
  name?: string;
  strat_name?: string;
  lith?: string;
  b_age?: number;
  best_int_name?: string;
  b_int_name?: string;
};

export async function readGround(
  lat: number,
  lon: number,
  place: string,
  locale: Locale,
  accuracy?: number,
): Promise<Reading> {
  const c = (GRID - 1) / 2;
  const dLat = STEP_M / 111_320;
  const dLon = STEP_M / (111_320 * Math.max(0.1, Math.cos((lat * Math.PI) / 180)));
  const gLat: string[] = [];
  const gLon: string[] = [];
  for (let i = 0; i < GRID; i++)
    for (let j = 0; j < GRID; j++) {
      gLat.push((lat + (c - i) * dLat).toFixed(5));
      gLon.push((lon + (j - c) * dLon).toFixed(5));
    }

  // Month and day for the 1950 comparison. 29 February falls back a day,
  // since 1950 had none.
  const md = new Date().toISOString().slice(5, 10);
  const day1950 = `1950-${md === "02-29" ? "02-28" : md}`;

  const [elevationRes, forecastRes, gridJson, airJson, archiveJson, geoJson, placeJson, wikiJson] =
    await Promise.all([
      fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          "&current=temperature_2m,apparent_temperature,relative_humidity_2m," +
          "wind_speed_10m,wind_direction_10m,cloud_cover,pressure_msl,weather_code,is_day" +
          "&daily=sunrise,sunset,daylight_duration,uv_index_max,temperature_2m_max" +
          "&timezone=auto&forecast_days=1",
      ),
      json<{ elevation: number[] }>(
        `https://api.open-meteo.com/v1/elevation?latitude=${gLat.join(",")}&longitude=${gLon.join(",")}`,
      ),
      json<{ current: { pm2_5: number; pm10: number; us_aqi: number } }>(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,us_aqi`,
      ),
      json<{ daily: { temperature_2m_max: (number | null)[] } }>(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
          `&start_date=${day1950}&end_date=${day1950}&daily=temperature_2m_max&timezone=auto`,
      ),
      json<{ success?: { data?: MacrostratUnit[] } }>(
        `https://macrostrat.org/api/v2/geologic_units/map?lat=${lat}&lng=${lon}`,
      ),
      json<{
        name?: string;
        address?: Record<string, string>;
      }>(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=14&accept-language=${locale}`,
      ),
      json<{ query?: { geosearch?: { pageid: number; title: string; dist: number }[] } }>(
        `https://${locale}.wikipedia.org/w/api.php?action=query&list=geosearch` +
          `&gscoord=${lat}%7C${lon}&gsradius=10000&gslimit=4&format=json&origin=*`,
      ),
    ]);

  if (!elevationRes.ok || !forecastRes.ok) throw new Error("lookup failed");

  const elevation = ((await elevationRes.json()) as { elevation: number[] }).elevation?.[0] ?? 0;
  const forecast = (await forecastRes.json()) as {
    timezone: string;
    utc_offset_seconds: number;
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
      wind_direction_10m: number;
      cloud_cover: number;
      pressure_msl: number;
      weather_code: number;
      is_day: number;
    };
    daily: {
      sunrise: string[];
      sunset: string[];
      daylight_duration: number[];
      uv_index_max: number[];
      temperature_2m_max: number[];
    };
  };

  const units = geoJson?.success?.data ?? [];
  const unit = units.find((u) => u.name || u.strat_name);
  const bedrock: Bedrock | null | undefined = geoJson
    ? unit
      ? {
          name: unit.name || unit.strat_name || "",
          lith: unit.lith ?? "",
          maxAgeMa: unit.b_age ?? 0,
          period: unit.b_int_name || unit.best_int_name || "",
        }
      : null
    : undefined;

  let placeName: Reading["placeName"];
  if (placeJson?.address) {
    const a = placeJson.address;
    const title =
      a.neighbourhood || a.quarter || a.suburb || a.city || a.town || a.village || placeJson.name || "";
    const parts = [a.city || a.town || a.village || a.county, a.state, a.country].filter(
      (p, i, all): p is string => !!p && p !== title && all.indexOf(p) === i,
    );
    if (title) placeName = { title, line: parts.join(", ") };
  }

  const nearby = wikiJson?.query?.geosearch?.map((g) => ({
    title: g.title,
    distanceM: g.dist,
    url: `https://${locale}.wikipedia.org/?curid=${g.pageid}`,
  }));

  const high1950 = archiveJson?.daily.temperature_2m_max?.[0] ?? undefined;

  return {
    lat,
    lon,
    accuracy,
    place,
    placeName,
    elevation,
    twin: nearestByElevation(elevation),
    terrain: gridJson?.elevation?.length === GRID * GRID ? terrainFrom(gridJson.elevation) : undefined,
    bedrock,
    nearby,
    timezone: forecast.timezone,
    utcOffsetSeconds: forecast.utc_offset_seconds,
    temperature: forecast.current.temperature_2m,
    feelsLike: forecast.current.apparent_temperature,
    humidity: forecast.current.relative_humidity_2m,
    wind: forecast.current.wind_speed_10m,
    windDirection: forecast.current.wind_direction_10m,
    cloud: forecast.current.cloud_cover,
    pressure: forecast.current.pressure_msl,
    sky: skyKind(forecast.current.weather_code),
    isDay: forecast.current.is_day === 1,
    sunrise: forecast.daily.sunrise[0],
    sunset: forecast.daily.sunset[0],
    daylightSeconds: forecast.daily.daylight_duration[0],
    uvMax: forecast.daily.uv_index_max[0],
    todayHigh: forecast.daily.temperature_2m_max[0],
    high1950: high1950 === null ? undefined : high1950,
    air: airJson
      ? { pm25: airJson.current.pm2_5, pm10: airJson.current.pm10, usAqi: airJson.current.us_aqi }
      : undefined,
    fetchedAt: Date.now(),
  };
}

/** The moon, from the date alone: days since a known new moon, modulo
 *  the synodic month. Good to within a few hours, which is all a phase
 *  name needs. */
export function moonPhase(at: number): { fraction: number; illumination: number; index: number } {
  const synodic = 29.530588853;
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const age = ((((at - ref) / 86_400_000) % synodic) + synodic) % synodic;
  const fraction = age / synodic;
  return {
    fraction,
    illumination: (1 - Math.cos(2 * Math.PI * fraction)) / 2,
    index: Math.round(fraction * 8) % 8,
  };
}
