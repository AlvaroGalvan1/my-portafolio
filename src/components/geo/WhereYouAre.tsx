"use client";

import { useState } from "react";
import { nearestByElevation, type ElevationCity } from "@/content/elevations";
import { places } from "@/content/places";
import {
  aqiLabel,
  antipode,
  clockTime,
  compassPoint,
  distanceKm,
  distanceToEquatorKm,
  formatDuration,
  formatKm,
  solarNoon,
  spinSpeedKmh,
  toDms,
  utmZone,
  weatherLabel,
} from "./stats";

// The one thing on this site that is about the visitor rather than about
// me. Everything else here says "I work with location data"; this does it
// to you.
//
// Three rules, and they are the difference between a demonstration and an
// annoyance:
//
//   1. It never asks on load. A permission dialog fired at a stranger is
//      the fastest way to lose them, so the browser is only asked after a
//      deliberate click on a button that says what will happen.
//   2. Saying no still works. Decline and it runs on my own street, so the
//      piece is legible to everyone rather than a locked door.
//   3. It says where the coordinates go. Two hosts, both Open-Meteo, and
//      nowhere else. For a page arguing its author is careful with
//      location data, that sentence is part of the work.

const ELEVATION_API = "https://api.open-meteo.com/v1/elevation";
const FORECAST_API = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_API = "https://air-quality-api.open-meteo.com/v1/air-quality";

/** Home, for the distance line. Not a pin in places.ts, which holds the
 *  campuses and the ports: Oaxaca is where I am from rather than somewhere
 *  I went, so it has never needed a marker. */
const OAXACA = { name: "Oaxaca", lat: 17.0732, lon: -96.7266 };

/** Where the fallback runs. The Mission, which the hero has already told
 *  the reader is where I live, so declining the permission still gives a
 *  real readout of a real place. */
export const FALLBACK = { label: "my street", lat: 37.7599, lon: -122.4148 };

type Reading = {
  lat: number;
  lon: number;
  accuracy?: number;
  place: string;
  elevation: number;
  twin: ElevationCity;
  utcOffsetSeconds: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  windDirection: number;
  cloud: number;
  pressure: number;
  weather: string;
  isDay: boolean;
  sunrise: string;
  sunset: string;
  daylightSeconds: number;
  uvMax: number;
  /** Absent when the air-quality host is the one that fails. The rest of
   *  the readout is worth showing without it. */
  air?: { pm25: number; pm10: number; usAqi: number };
};

type Status =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "reading" }
  | { kind: "ready"; reading: Reading }
  | { kind: "denied" }
  | { kind: "error"; message: string };

async function readGround(
  lat: number,
  lon: number,
  place: string,
  accuracy?: number,
): Promise<Reading> {
  // Elevation is its own request rather than the one the forecast carries.
  // The forecast's figure is the weather model's grid cell, tens of
  // kilometres across, and in mountains it can be a thousand metres out.
  // This endpoint reads a 90m digital elevation model at the point.
  const [elevationRes, forecastRes, airRes] = await Promise.all([
    fetch(`${ELEVATION_API}?latitude=${lat}&longitude=${lon}`),
    fetch(
      `${FORECAST_API}?latitude=${lat}&longitude=${lon}` +
        "&current=temperature_2m,apparent_temperature,relative_humidity_2m," +
        "wind_speed_10m,wind_direction_10m,cloud_cover,pressure_msl,weather_code,is_day" +
        "&daily=sunrise,sunset,daylight_duration,uv_index_max" +
        "&timezone=auto&forecast_days=1",
    ),
    // Allowed to fail on its own: air quality is a different host, and a
    // readout missing one row beats a readout that refused to appear.
    fetch(
      `${AIR_QUALITY_API}?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,us_aqi`,
    ).catch(() => null),
  ]);

  if (!elevationRes.ok || !forecastRes.ok) throw new Error("lookup failed");

  const elevationJson = (await elevationRes.json()) as { elevation: number[] };
  const forecast = (await forecastRes.json()) as {
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
    };
  };

  let air: Reading["air"];
  if (airRes && airRes.ok) {
    const airJson = (await airRes.json()) as {
      current: { pm2_5: number; pm10: number; us_aqi: number };
    };
    air = {
      pm25: airJson.current.pm2_5,
      pm10: airJson.current.pm10,
      usAqi: airJson.current.us_aqi,
    };
  }

  const elevation = elevationJson.elevation?.[0] ?? 0;

  return {
    lat,
    lon,
    accuracy,
    place,
    elevation,
    twin: nearestByElevation(elevation),
    utcOffsetSeconds: forecast.utc_offset_seconds,
    temperature: forecast.current.temperature_2m,
    feelsLike: forecast.current.apparent_temperature,
    humidity: forecast.current.relative_humidity_2m,
    wind: forecast.current.wind_speed_10m,
    windDirection: forecast.current.wind_direction_10m,
    cloud: forecast.current.cloud_cover,
    pressure: forecast.current.pressure_msl,
    weather: weatherLabel(forecast.current.weather_code),
    isDay: forecast.current.is_day === 1,
    sunrise: forecast.daily.sunrise[0],
    sunset: forecast.daily.sunset[0],
    daylightSeconds: forecast.daily.daylight_duration[0],
    uvMax: forecast.daily.uv_index_max[0],
    air,
  };
}

export default function WhereYouAre() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const run = async (lat: number, lon: number, place: string, accuracy?: number) => {
    setStatus({ kind: "reading" });
    try {
      setStatus({ kind: "ready", reading: await readGround(lat, lon, place, accuracy) });
    } catch {
      setStatus({
        kind: "error",
        message: "Open-Meteo did not answer. It is a free service, so try again in a moment.",
      });
    }
  };

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setStatus({ kind: "denied" });
      return;
    }
    setStatus({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      (position) =>
        run(
          position.coords.latitude,
          position.coords.longitude,
          "you",
          position.coords.accuracy,
        ),
      // Refused, unavailable, timed out: all the same to this panel, which
      // is no coordinates, so offer the fallback.
      () => setStatus({ kind: "denied" }),
      // High accuracy because the precision is the point. The long timeout
      // is for a cold GPS fix on a phone, which genuinely takes fifteen
      // seconds outdoors and never resolves indoors; the cache window stops
      // a second press waiting on the satellites twice.
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const runFallback = () => run(FALLBACK.lat, FALLBACK.lon, FALLBACK.label);

  if (status.kind === "ready") {
    return <Readout reading={status.reading} onReset={() => setStatus({ kind: "idle" })} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-[46ch] font-sans text-base leading-relaxed text-brand-maroon">
        {status.kind === "denied"
          ? "No coordinates, which is a perfectly good answer. Here is the same readout for my own street instead."
          : status.kind === "error"
            ? status.message
            : "Give me your coordinates and I will tell you the height of the ground under you, which city in my life sits at that same height, what the air is doing, and how fast the planet is carrying you east."}
      </p>

      <div className="flex flex-wrap gap-3">
        {status.kind !== "denied" && (
          <button
            type="button"
            onClick={locate}
            disabled={status.kind === "locating" || status.kind === "reading"}
            className="border-2 border-brand-maroon bg-brand-maroon px-5 py-2.5 font-sans text-sm font-semibold text-brand-cream transition-colors hover:bg-transparent hover:text-brand-maroon disabled:opacity-60"
          >
            {status.kind === "locating"
              ? "Asking your browser"
              : status.kind === "reading"
                ? "Reading the ground"
                : "Locate me"}
          </button>
        )}
        <button
          type="button"
          onClick={runFallback}
          className="border-2 border-brand-maroon/40 px-5 py-2.5 font-sans text-sm font-semibold text-brand-maroon transition-colors hover:border-brand-maroon"
        >
          Use {FALLBACK.label}
        </button>
      </div>

      <Privacy />
    </div>
  );
}

function Readout({ reading, onReset }: { reading: Reading; onReset: () => void }) {
  const {
    lat,
    lon,
    elevation,
    twin,
    accuracy,
    place,
    utcOffsetSeconds,
    air,
  } = reading;

  const other = antipode(lat, lon);
  const twinGap = Math.round(Math.abs(elevation - twin.metres));

  // The nearest pin on my own map. Ports and campuses both count: the
  // question is which place in my life you are closest to, and a port I
  // spent a day in is still an answer to that.
  const mine = places.filter((p) => p.group !== "friends");
  const nearest = mine.reduce((best, candidate) =>
    distanceKm(lat, lon, candidate.lat, candidate.lon) <
    distanceKm(lat, lon, best.lat, best.lon)
      ? candidate
      : best,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* The headline: one number, and the sentence that makes it mean
          something. A height in metres is a fact nobody has intuition for
          until it is a place. */}
      <div>
        <p className="font-[family-name:var(--font-display)] text-5xl leading-none text-brand-red">
          {Math.round(elevation)}
          <span className="ml-2 text-2xl text-brand-maroon/70">m</span>
        </p>
        <p className="mt-3 max-w-[46ch] font-sans text-base leading-relaxed text-brand-maroon">
          above sea level, which is about the height of{" "}
          <span className="font-semibold">{twin.name}</span>
          {twin.mine ? `, ${twin.mine}` : ""}
          {twinGap === 0 ? ", to the metre." : `, ${twinGap} m apart.`}
        </p>
      </div>

      <Group title="Your ground">
        <Stat label="Coordinates" value={`${lat.toFixed(5)}, ${lon.toFixed(5)}`} />
        <Stat label="In degrees" value={`${toDms(lat, "lat")} ${toDms(lon, "lon")}`} />
        <Stat label="UTM square" value={utmZone(lat, lon)} />
        <Stat
          label="Fix"
          value={accuracy === undefined ? place : `${place}, ${Math.round(accuracy)} m`}
        />
      </Group>

      <Group title="Your air, right now">
        <Stat label="Temperature" value={`${Math.round(reading.temperature)}°C`} />
        <Stat label="Feels like" value={`${Math.round(reading.feelsLike)}°C`} />
        <Stat label="Humidity" value={`${Math.round(reading.humidity)}%`} />
        <Stat
          label="Wind"
          value={`${Math.round(reading.wind)} km/h ${compassPoint(reading.windDirection)}`}
        />
        <Stat label="Cloud" value={`${Math.round(reading.cloud)}%`} />
        <Stat label="Pressure" value={`${Math.round(reading.pressure)} hPa`} />
        <Stat label="Sky" value={reading.weather} />
        {air && <Stat label="Air quality" value={`${aqiLabel(air.usAqi)}, AQI ${Math.round(air.usAqi)}`} />}
        {air && <Stat label="Fine particles" value={`${air.pm25.toFixed(1)} µg/m³ PM2.5`} />}
      </Group>

      <Group title="Your day">
        <Stat label="Sunrise" value={clockTime(reading.sunrise)} />
        <Stat label="Sunset" value={clockTime(reading.sunset)} />
        <Stat label="Daylight" value={formatDuration(reading.daylightSeconds)} />
        <Stat label="Solar noon" value={solarNoon(lon, utcOffsetSeconds)} />
        <Stat label="Right now" value={reading.isDay ? "Daytime" : "Night"} />
        <Stat label="Peak UV today" value={reading.uvMax.toFixed(1)} />
      </Group>

      <Group title="Your planet">
        <Stat
          label="Spin speed"
          value={`${Math.round(spinSpeedKmh(lat)).toLocaleString("en-US")} km/h east`}
        />
        <Stat label="To the equator" value={formatKm(distanceToEquatorKm(lat))} />
        <Stat
          label="To Oaxaca"
          value={formatKm(distanceKm(lat, lon, OAXACA.lat, OAXACA.lon))}
        />
        <Stat
          label="Nearest place I have been"
          value={`${nearest.name}, ${formatKm(distanceKm(lat, lon, nearest.lat, nearest.lon))}`}
        />
        <Stat
          label="Straight down and out"
          value={`${other.lat.toFixed(2)}, ${other.lon.toFixed(2)}`}
        />
      </Group>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className="border-2 border-brand-maroon/40 px-4 py-2 font-sans text-sm font-semibold text-brand-maroon transition-colors hover:border-brand-maroon"
        >
          Clear
        </button>
      </div>

      <Privacy />
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-brand-red">
        {title}
      </h4>
      {/* Two columns of label-over-value. A definition list is what this
          is, so it is a definition list: the label is the term and the
          figure is the definition, and a screen reader reads them paired
          rather than as ten loose strings. */}
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">{children}</dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-brand-maroon/55">
        {label}
      </dt>
      <dd className="mt-0.5 break-words font-mono text-sm text-brand-maroon">{value}</dd>
    </div>
  );
}

function Privacy() {
  return (
    <p className="font-sans text-xs leading-relaxed text-brand-maroon/60">
      Coordinates go to open-meteo.com for the lookup and nowhere else. They
      are not stored, logged, or sent to this site.
    </p>
  );
}
