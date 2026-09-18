"use client";

import { useState } from "react";
import { MINE_LABEL, nearestByElevation, type ElevationCity } from "@/content/elevations";
import { places } from "@/content/places";
import { fill, type Locale } from "@/content/i18n";
import type { UiStrings } from "@/content/ui";
import { useUnitSystem } from "@/lib/useUnitSystem";
import type { UnitSystem } from "@/lib/units";
import {
  formatDistance,
  formatElevation,
  formatHeightGap,
  formatPressure,
  formatSpeed,
  formatTemperature,
} from "@/lib/units";
import {
  aqiBand,
  antipode,
  clockTime,
  compassPoint,
  distanceKm,
  distanceToEquatorKm,
  formatDuration,
  skyKind,
  solarNoon,
  spinSpeedKmh,
  toDms,
  utmZone,
  type AqiBand,
  type SkyKind,
} from "./stats";

// The one thing on this site that is about the visitor rather than about
// me. Everything else here says "I work with location data"; this does it
// to you.
//
// Four rules, and they are the difference between a demonstration and an
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
//   4. The figures are in units the reader thinks in. A height in metres
//      shown to someone who has never used one is a number, not a fact —
//      see lib/units.ts for how the guess is made and lib/useUnitSystem.ts
//      for how the override is kept.

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
export const FALLBACK = { lat: 37.7599, lon: -122.4148 };

type Strings = UiStrings["aboutYou"];

type Reading = {
  lat: number;
  lon: number;
  accuracy?: number;
  /** "you" or "my street", already in the reader's language. */
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
  sky: SkyKind;
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
  | { kind: "error" };

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
    // Always requested in Celsius, km/h and hPa, and converted at render.
    // Asking Open-Meteo for imperial units instead would mean refetching
    // the whole readout every time the toggle is pressed.
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
    air,
  };
}

export default function WhereYouAre({
  locale,
  strings,
}: {
  locale: Locale;
  strings: Strings;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [units, setUnits] = useUnitSystem();

  const run = async (lat: number, lon: number, place: string, accuracy?: number) => {
    setStatus({ kind: "reading" });
    try {
      setStatus({ kind: "ready", reading: await readGround(lat, lon, place, accuracy) });
    } catch {
      setStatus({ kind: "error" });
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
          strings.you,
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

  const runFallback = () => run(FALLBACK.lat, FALLBACK.lon, strings.myStreet);

  if (status.kind === "ready") {
    return (
      <Readout
        reading={status.reading}
        locale={locale}
        strings={strings}
        units={units}
        onUnits={setUnits}
        onReset={() => setStatus({ kind: "idle" })}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-[52ch] font-sans text-base leading-relaxed text-brand-maroon">
        {status.kind === "denied"
          ? strings.denied
          : status.kind === "error"
            ? strings.error
            : strings.intro}
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
              ? strings.locating
              : status.kind === "reading"
                ? strings.reading
                : strings.locate}
          </button>
        )}
        <button
          type="button"
          onClick={runFallback}
          className="border-2 border-brand-maroon/40 px-5 py-2.5 font-sans text-sm font-semibold text-brand-maroon transition-colors hover:border-brand-maroon"
        >
          {fill(strings.useFallback, { place: strings.myStreet })}
        </button>
      </div>

      <Privacy text={strings.privacy} />
    </div>
  );
}

function Readout({
  reading,
  locale,
  strings,
  units,
  onUnits,
  onReset,
}: {
  reading: Reading;
  locale: Locale;
  strings: Strings;
  units: UnitSystem;
  onUnits: (next: UnitSystem) => void;
  onReset: () => void;
}) {
  const { lat, lon, elevation, twin, accuracy, place, utcOffsetSeconds, air } = reading;

  const other = antipode(lat, lon);
  const twinGap = Math.abs(elevation - twin.metres);
  const headline = formatElevation(elevation, units, locale);

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
    <div className="flex flex-col gap-7">
      {/* The headline: one number, and the sentence that makes it mean
          something. A height is a fact nobody has intuition for until it is
          a place — and, since this pass, until it is in the units the
          reader grew up with. */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,4rem)] leading-none text-brand-red">
            {headline.value}
            <span className="ml-2 text-2xl text-brand-maroon/70">{headline.unit}</span>
          </p>
          <p className="mt-3 max-w-[46ch] font-sans text-base leading-relaxed text-brand-maroon">
            {strings.aboveSeaLevel}{" "}
            <span className="font-semibold">{twin.name}</span>
            {twin.mine ? `, ${MINE_LABEL[locale][twin.mine]}` : ""}
            {/* "to the metre" is only true to the metre. Rounded into feet
                a one-metre gap becomes three, so the exact-match sentence
                is claimed on the underlying figure rather than the shown
                one. */}
            {Math.round(twinGap) === 0
              ? strings.toTheMetre
              : fill(strings.apart, {
                  gap: formatHeightGap(twinGap, units, locale),
                })}
          </p>
        </div>

        <UnitToggle units={units} onUnits={onUnits} strings={strings} />
      </div>

      <Group title={strings.groups.ground}>
        <Stat label={strings.stat.coordinates} value={`${lat.toFixed(5)}, ${lon.toFixed(5)}`} />
        <Stat label={strings.stat.inDegrees} value={`${toDms(lat, "lat")} ${toDms(lon, "lon")}`} />
        <Stat label={strings.stat.utm} value={utmZone(lat, lon)} />
        <Stat
          label={strings.stat.fix}
          value={
            accuracy === undefined
              ? place
              : `${place}, ${formatHeightGap(accuracy, units, locale)}`
          }
        />
      </Group>

      <Group title={strings.groups.air}>
        <Stat
          label={strings.stat.temperature}
          value={formatTemperature(reading.temperature, units, locale)}
        />
        <Stat
          label={strings.stat.feelsLike}
          value={formatTemperature(reading.feelsLike, units, locale)}
        />
        <Stat label={strings.stat.humidity} value={`${Math.round(reading.humidity)}%`} />
        <Stat
          label={strings.stat.wind}
          value={`${formatSpeed(reading.wind, units, locale)} ${compassPoint(reading.windDirection)}`}
        />
        <Stat label={strings.stat.cloud} value={`${Math.round(reading.cloud)}%`} />
        <Stat
          label={strings.stat.pressure}
          value={formatPressure(reading.pressure, units, locale)}
        />
        <Stat label={strings.stat.sky} value={strings.sky[reading.sky]} />
        {air && (
          <Stat
            label={strings.stat.airQuality}
            value={`${strings.aqi[aqiBand(air.usAqi) as AqiBand]}, AQI ${Math.round(air.usAqi)}`}
          />
        )}
        {/* Micrograms per cubic metre in both systems, deliberately. There
            is no imperial unit for particulate mass concentration that
            anyone uses; every US air-quality source quotes µg/m³ too. */}
        {air && (
          <Stat
            label={strings.stat.fineParticles}
            value={`${air.pm25.toFixed(1)} µg/m³ PM2.5`}
          />
        )}
      </Group>

      <Group title={strings.groups.day}>
        <Stat label={strings.stat.sunrise} value={clockTime(reading.sunrise)} />
        <Stat label={strings.stat.sunset} value={clockTime(reading.sunset)} />
        <Stat
          label={strings.stat.daylight}
          value={formatDuration(reading.daylightSeconds, locale)}
        />
        <Stat label={strings.stat.solarNoon} value={solarNoon(lon, utcOffsetSeconds)} />
        <Stat
          label={strings.stat.rightNow}
          value={reading.isDay ? strings.daytime : strings.night}
        />
        <Stat label={strings.stat.peakUv} value={reading.uvMax.toFixed(1)} />
      </Group>

      <Group title={strings.groups.planet}>
        <Stat
          label={strings.stat.spinSpeed}
          value={`${formatSpeed(spinSpeedKmh(lat), units, locale)} ${strings.east}`}
        />
        <Stat
          label={strings.stat.toEquator}
          value={formatDistance(distanceToEquatorKm(lat), units, locale)}
        />
        <Stat
          label={strings.stat.toOaxaca}
          value={formatDistance(distanceKm(lat, lon, OAXACA.lat, OAXACA.lon), units, locale)}
        />
        <Stat
          label={strings.stat.nearestMine}
          value={`${nearest.name}, ${formatDistance(
            distanceKm(lat, lon, nearest.lat, nearest.lon),
            units,
            locale,
          )}`}
        />
        <Stat
          label={strings.stat.antipode}
          value={`${other.lat.toFixed(2)}, ${other.lon.toFixed(2)}`}
        />
      </Group>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className="border-2 border-brand-maroon/40 px-4 py-2 font-sans text-sm font-semibold text-brand-maroon transition-colors hover:border-brand-maroon"
        >
          {strings.clear}
        </button>
      </div>

      <Privacy text={strings.privacy} />
    </div>
  );
}

// A segmented pair rather than a switch: a switch has an implied "off",
// and neither of these is the absence of the other. It sits beside the
// headline figure — the place a reader notices the units are wrong is the
// place to offer to change them, not a settings row at the bottom.
function UnitToggle({
  units,
  onUnits,
  strings,
}: {
  units: UnitSystem;
  onUnits: (next: UnitSystem) => void;
  strings: Strings;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-1.5">
      <span
        id="unit-toggle-label"
        className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-brand-maroon/55"
      >
        {strings.units}
      </span>
      <div
        role="group"
        aria-labelledby="unit-toggle-label"
        className="flex border-2 border-brand-maroon"
      >
        {(["metric", "imperial"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onUnits(option)}
            aria-pressed={units === option}
            className={`px-3 py-1.5 font-sans text-xs font-semibold transition-colors ${
              units === option
                ? "bg-brand-maroon text-brand-cream"
                : "text-brand-maroon hover:bg-brand-maroon/10"
            }`}
          >
            {strings[option]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="eyebrow text-brand-red">
        {title}
      </h4>
      {/* Label-over-value, two columns on a phone and four where there is
          room. A definition list is what this is, so it is a definition
          list: the label is the term and the figure is the definition, and
          a screen reader reads them paired rather than as ten loose
          strings. */}
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
        {children}
      </dl>
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

function Privacy({ text }: { text: string }) {
  return (
    <p className="max-w-[60ch] font-sans text-xs leading-relaxed text-brand-maroon/60">
      {text}
    </p>
  );
}
