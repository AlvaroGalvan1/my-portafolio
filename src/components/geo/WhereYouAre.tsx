"use client";

import { cityName } from "@/content/cityNames";
import { useState } from "react";
import { MINE_LABEL } from "@/content/elevations";
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
  solarNoon,
  spinSpeedKmh,
  toDms,
  utmZone,
  type AqiBand,
} from "./stats";
import { Caption, Compass, Dial, Figure, Globe, Icons, Moon, Progress, RampBar, Ring, SunArc, TerrainMap, Tile } from "./tiles";
import { moonPhase, readGround, type Reading } from "./reading";

// The one thing on this site that is about the visitor rather than about
// me. Everything else here says "I work with location data"; this does it
// to you. It reads one coordinate pair against public data and lays out
// what comes back as space (terrain, rock, place), time (clock, sun, moon,
// year, 1950) and air (the weather), in that order: the weather is the
// least surprising thing a location can tell you, so it goes last.
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

/** Home, for the distance line. */
const OAXACA = { name: "Oaxaca", lat: 17.0732, lon: -96.7266 };

/** Where the fallback runs: the Mission, which the hero has already told
 *  the reader is where I live. */
export const FALLBACK = { lat: 37.7599, lon: -122.4148 };

type Strings = UiStrings["aboutYou"];

type Status =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "reading" }
  | { kind: "ready"; reading: Reading }
  | { kind: "denied" }
  | { kind: "error" };

export default function WhereYouAre({ locale, strings }: { locale: Locale; strings: Strings }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [units, setUnits] = useUnitSystem();

  const run = async (lat: number, lon: number, place: string, accuracy?: number) => {
    setStatus({ kind: "reading" });
    try {
      setStatus({ kind: "ready", reading: await readGround(lat, lon, place, locale, accuracy) });
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
        run(position.coords.latitude, position.coords.longitude, strings.you, position.coords.accuracy),
      () => setStatus({ kind: "denied" }),
      // High accuracy because the precision is the point; the long timeout
      // is for a cold GPS fix on a phone.
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
    <div className="flex max-w-3xl flex-col gap-6">
      {status.kind === "idle" || status.kind === "locating" || status.kind === "reading" ? (
        <>
          <p className="font-sans text-lg leading-relaxed text-brand-maroon">{strings.intro}</p>
          <p className="border-l-4 border-brand-red pl-4 font-sans text-base font-semibold leading-snug text-brand-maroon">
            {strings.notCollected}
          </p>
        </>
      ) : (
        <p className="font-sans text-base leading-relaxed text-brand-maroon">
          {status.kind === "denied" ? strings.denied : strings.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {status.kind !== "denied" && (
          <button
            type="button"
            onClick={locate}
            disabled={status.kind === "locating" || status.kind === "reading"}
            className="border-2 border-brand-maroon bg-brand-maroon px-5 py-2.5 font-sans text-sm font-semibold text-brand-cream transition-colors hover:bg-transparent hover:text-brand-maroon disabled:opacity-60"
          >
            {status.kind === "locating" ? strings.locating : status.kind === "reading" ? strings.reading : strings.locate}
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

      <Sources strings={strings} />
    </div>
  );
}

function Sources({ strings }: { strings: Strings }) {
  return (
    <p className="font-sans text-xs leading-relaxed text-brand-maroon/60">
      <span className="eyebrow mr-2 text-brand-maroon/70">{strings.sourcesLabel}</span>
      {strings.sources}
    </p>
  );
}

function Section({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-brand-maroon/15 pb-2">
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-maroon">{title}</h3>
        <p className="font-sans text-sm text-neutral-600">{note}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>
    </section>
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
  const { lat, lon, elevation, twin, accuracy, place, utcOffsetSeconds, air, terrain, bedrock, nearby } = reading;
  const day = reading.isDay;

  const other = antipode(lat, lon);
  const twinGap = Math.abs(elevation - twin.metres);
  const headline = formatElevation(elevation, units, locale);
  const dir = (deg: number) => compassPoint(deg).replace(/W/g, locale === "es" ? "O" : "W");
  const cardinal = (locale === "es" ? ["N", "E", "S", "O"] : ["N", "E", "S", "W"]) as [string, string, string, string];

  // ── Time, all on the reader's local clock ─────────────────────────
  const minutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
  const local = new Date(reading.fetchedAt + utcOffsetSeconds * 1000);
  const nowMin = local.getUTCHours() * 60 + local.getUTCMinutes();
  const clock = `${String(local.getUTCHours()).padStart(2, "0")}:${String(local.getUTCMinutes()).padStart(2, "0")}`;
  const rise = minutes(clockTime(reading.sunrise));
  const set = minutes(clockTime(reading.sunset));
  const dayProgress = set > rise ? (nowMin - rise) / (set - rise) : 0;
  const noon = solarNoon(lon, utcOffsetSeconds, new Date(reading.fetchedAt));
  const sunLag = minutes(noon) - 12 * 60;
  const offsetH = utcOffsetSeconds / 3600;
  const utc = `UTC${offsetH >= 0 ? "+" : "−"}${Math.abs(offsetH)}`;

  const year = local.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const dayOfYear = Math.floor((Date.UTC(year, local.getUTCMonth(), local.getUTCDate()) - startOfYear) / 86_400_000) + 1;
  const daysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

  const moon = moonPhase(reading.fetchedAt);

  // Differences of temperature convert by the factor alone, not the offset.
  const tempDiff = (c: number) => {
    const v = units === "imperial" ? c * 1.8 : c;
    return `${Math.abs(v).toFixed(1)}°`;
  };

  const uvBand =
    reading.uvMax < 3 ? "low" : reading.uvMax < 6 ? "moderate" : reading.uvMax < 8 ? "high" : reading.uvMax < 11 ? "veryHigh" : "extreme";

  const grade = (deg: number) =>
    deg < 2 ? strings.terrain.flat : `${deg.toFixed(0)}°, ${strings.terrain.grades[deg < 5 ? "gentle" : deg < 15 ? "moderate" : deg < 30 ? "steep" : "verySteep"]}`;

  const rockKind = (lith: string): keyof Strings["bedrock"]["kinds"] => {
    const l = lith.toLowerCase();
    if (l.includes("sediment")) return "sedimentary";
    if (l.includes("volcan")) return "volcanic";
    if (l.includes("plutonic") || l.includes("granit")) return "plutonic";
    if (l.includes("metamorph")) return "metamorphic";
    if (l.includes("igneous")) return "igneous";
    return "other";
  };
  const age = (ma: number) =>
    ma >= 1
      ? { value: ma < 10 ? ma.toFixed(1) : Math.round(ma).toLocaleString(locale), unit: strings.bedrock.million }
      : { value: Math.max(1, Math.round(ma * 1000)).toLocaleString(locale), unit: strings.bedrock.thousand };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Where you are ───────────────────────────────────────────
          The one card that answers the title: the place's name, the height
          of the ground, and the city in my life at that same height.
          Yellow by day, maroon at night. */}
      <div
        className={`grid gap-6 border-2 border-brand-maroon p-5 shadow-[5px_5px_0_var(--color-brand-maroon)] sm:grid-cols-[1.2fr_1fr] sm:p-6 ${
          day ? "bg-brand-yellow text-brand-maroon" : "bg-brand-maroon text-brand-cream"
        }`}
      >
        <div className="min-w-0">
          <p className={`eyebrow ${day ? "text-brand-red" : "text-brand-yellow"}`}>
            {place} · {day ? strings.daytime : strings.night}
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.9rem,6vw,3rem)] leading-[1.05]">
            {reading.placeName?.title ?? `${lat.toFixed(3)}, ${lon.toFixed(3)}`}
          </p>
          {reading.placeName?.line && <p className="mt-1 font-sans text-sm opacity-80">{reading.placeName.line}</p>}
          <p className="mt-3 font-mono text-xs opacity-70">
            {lat.toFixed(5)}, {lon.toFixed(5)}
          </p>
        </div>
        <div className={`sm:border-l-2 sm:pl-6 ${day ? "sm:border-brand-maroon/20" : "sm:border-brand-cream/20"}`}>
          <p className={`eyebrow ${day ? "text-brand-red" : "text-brand-yellow"}`}>{strings.groups.ground}</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.25rem,7vw,3.25rem)] leading-none">
            {headline.value}
            <span className="ml-1.5 text-xl opacity-70">{headline.unit}</span>
          </p>
          <p className="mt-2 font-sans text-sm leading-snug">
            {strings.aboveSeaLevel} <span className="font-semibold">{cityName(twin.name, locale)}</span>
            {twin.mine ? `, ${MINE_LABEL[locale][twin.mine]}` : ""}
            {/* "to the metre" is only true to the metre, so it is claimed on
                the underlying figure rather than the rounded one shown. */}
            {Math.round(twinGap) === 0 ? strings.toTheMetre : fill(strings.apart, { gap: formatHeightGap(twinGap, units, locale) })}
          </p>
        </div>
      </div>

      <div className="-mt-3 flex flex-wrap items-end justify-between gap-3">
        <UnitToggle units={units} onUnits={onUnits} strings={strings} />
        <button
          type="button"
          onClick={onReset}
          className="border-2 border-brand-maroon/40 px-4 py-1.5 font-sans text-sm font-semibold text-brand-maroon transition-colors hover:border-brand-maroon"
        >
          {strings.clear}
        </button>
      </div>

      {/* ── Space ──────────────────────────────────────────────────── */}
      <Section title={strings.sections.space.title} note={strings.sections.space.note}>
        {terrain && (
          <Tile label={strings.terrain.title} icon={Icons.mountain} className="col-span-2">
            <div className="flex gap-4">
              <TerrainMap grid={terrain.grid} />
              <dl className="grid flex-1 content-start gap-y-2.5">
                <Stat label={strings.terrain.slope} value={grade(terrain.slopeDeg)} />
                <Stat label={strings.terrain.facing} value={terrain.slopeDeg < 2 ? strings.terrain.flat : dir(terrain.aspectDeg)} />
                <Stat label={strings.terrain.relief} value={formatHeightGap(terrain.relief, units, locale)} />
                <Stat
                  label={strings.terrain.highest}
                  value={`${formatHeightGap(terrain.highest.metres, units, locale)}, ${
                    terrain.highest.distanceM < 100
                      ? strings.terrain.here
                      : fill(strings.terrain.away, {
                          d: formatDistance(terrain.highest.distanceM / 1000, units, locale),
                          dir: dir(terrain.highest.bearing),
                        })
                  }`}
                />
              </dl>
            </div>
            <p className="mt-3 font-sans text-xs text-neutral-500">{strings.terrain.caption}</p>
          </Tile>
        )}

        {bedrock !== undefined && (
          <Tile label={strings.bedrock.title} icon={Icons.rock} className="col-span-2">
            {bedrock ? (
              <>
                <p className="eyebrow text-brand-maroon/60">{strings.bedrock.upTo}</p>
                <Figure {...age(bedrock.maxAgeMa)} />
                <Caption>
                  {strings.bedrock.kinds[rockKind(bedrock.lith)]}
                  {bedrock.period && ` ${strings.bedrock.from} ${periodName(bedrock.period, locale)}`}
                  <span className="mt-1 block text-xs text-neutral-500">{bedrock.name}</span>
                </Caption>
              </>
            ) : (
              <Caption>{strings.bedrock.none}</Caption>
            )}
          </Tile>
        )}

        <Tile label={strings.stat.location} icon={Icons.pin} className="col-span-2">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <Stat label={strings.stat.coordinates} value={`${lat.toFixed(5)}, ${lon.toFixed(5)}`} />
            <Stat label={strings.stat.utm} value={utmZone(lat, lon)} />
            <Stat label={strings.stat.inDegrees} value={`${toDms(lat, "lat")} ${toDms(lon, "lon")}`} />
            <Stat
              label={strings.stat.fix}
              value={accuracy === undefined ? place : `± ${formatHeightGap(accuracy, units, locale)}`}
            />
          </dl>
        </Tile>

        <Tile label={strings.groups.planet} icon={Icons.globe} className="col-span-2">
          <div className="flex items-start gap-4">
            <Globe lat={lat} />
            <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2.5">
              <Stat label={strings.stat.spinSpeed} value={`${formatSpeed(spinSpeedKmh(lat), units, locale)} ${strings.east}`} />
              <Stat label={strings.stat.toEquator} value={formatDistance(distanceToEquatorKm(lat), units, locale)} />
              <Stat label={strings.stat.toOaxaca} value={formatDistance(distanceKm(lat, lon, OAXACA.lat, OAXACA.lon), units, locale)} />
              <Stat label={strings.stat.antipode} value={`${other.lat.toFixed(2)}, ${other.lon.toFixed(2)}`} />
            </dl>
          </div>
        </Tile>

        {nearby && (
          <Tile label={strings.nearby.title} icon={Icons.book} className="col-span-2 lg:col-span-4">
            {nearby.length === 0 ? (
              <Caption>{strings.nearby.none}</Caption>
            ) : (
              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {nearby.map((n) => (
                  <li key={n.url} className="flex items-baseline justify-between gap-3 border-b border-brand-maroon/10 pb-1.5">
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 truncate font-sans text-sm font-semibold text-brand-maroon underline decoration-brand-red/40 underline-offset-4 hover:decoration-brand-red"
                    >
                      {n.title}
                    </a>
                    <span className="shrink-0 font-mono text-xs text-neutral-500">
                      {formatDistance(n.distanceM / 1000, units, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Tile>
        )}
      </Section>

      {/* ── Time ───────────────────────────────────────────────────── */}
      <Section title={strings.sections.time.title} note={strings.sections.time.note}>
        <Tile label={strings.groups.day} icon={Icons.sun} className="col-span-2">
          <SunArc progress={dayProgress} up={day} />
          <div className="mt-2 flex justify-between font-sans text-sm text-brand-maroon">
            <span>
              <span className="block text-xs text-neutral-500">{strings.stat.sunrise}</span>
              <span className="font-semibold">{clockTime(reading.sunrise)}</span>
            </span>
            <span className="text-center">
              <span className="block text-xs text-neutral-500">{strings.stat.daylight}</span>
              <span className="font-semibold">{formatDuration(reading.daylightSeconds, locale)}</span>
            </span>
            <span className="text-right">
              <span className="block text-xs text-neutral-500">{strings.stat.sunset}</span>
              <span className="font-semibold">{clockTime(reading.sunset)}</span>
            </span>
          </div>
        </Tile>

        <Tile label={strings.clock.title} icon={Icons.clock}>
          <Figure value={clock} />
          <Caption>
            {utc} · {reading.timezone.replace(/_/g, " ")}
            <span className="mt-1 block text-xs text-neutral-500">
              {Math.abs(sunLag) < 2
                ? strings.clock.even
                : fill(sunLag > 0 ? strings.clock.ahead : strings.clock.behind, { n: String(Math.abs(sunLag)) })}
            </span>
          </Caption>
        </Tile>

        <Tile label={strings.moon.title} icon={Icons.moon}>
          <Moon fraction={moon.fraction} />
          <p className="mt-2 text-center font-sans text-sm font-semibold text-brand-maroon">
            {strings.moon.phases[moon.index]}
          </p>
          <p className="text-center font-sans text-xs text-neutral-500">
            {fill(strings.moon.lit, { n: String(Math.round(moon.illumination * 100)) })}
          </p>
        </Tile>

        {reading.high1950 !== undefined && (
          <Tile label={strings.then.title} icon={Icons.calendar} className="col-span-2">
            <Figure
              value={
                Math.abs(reading.todayHigh - reading.high1950) < 0.5
                  ? strings.then.same
                  : fill(reading.todayHigh > reading.high1950 ? strings.then.warmer : strings.then.cooler, {
                      d: tempDiff(reading.todayHigh - reading.high1950),
                    })
              }
            />
            <Caption>
              {fill(strings.then.body, {
                then: formatTemperature(reading.high1950, units, locale),
                now: formatTemperature(reading.todayHigh, units, locale),
              })}
            </Caption>
          </Tile>
        )}

        <Tile label={strings.year.title} icon={Icons.calendar} className="col-span-2">
          <Figure value={`${Math.round((dayOfYear / daysInYear) * 100)}%`} />
          <Caption>{fill(strings.year.body, { n: String(dayOfYear), total: String(daysInYear) })}</Caption>
          <Progress fraction={dayOfYear / daysInYear} />
        </Tile>
      </Section>

      {/* ── Air ────────────────────────────────────────────────────── */}
      <Section title={strings.sections.air.title} note={strings.sections.air.note}>
        <Tile label={strings.stat.rightNow} icon={Icons.thermo} className="col-span-2">
          <Figure value={formatTemperature(reading.temperature, units, locale)} />
          <Caption>
            {strings.sky[reading.sky]} · {strings.stat.feelsLike} {formatTemperature(reading.feelsLike, units, locale)}
          </Caption>
        </Tile>

        <Tile label={strings.stat.wind} icon={Icons.wind}>
          <Compass from={reading.windDirection} cardinal={cardinal} />
          <p className="mt-1 text-center font-sans text-sm font-semibold text-brand-maroon">
            {formatSpeed(reading.wind, units, locale)}
            <span className="font-normal text-neutral-500"> · {strings.windFrom} {dir(reading.windDirection)}</span>
          </p>
        </Tile>

        <Tile label={strings.stat.peakUv} icon={Icons.uv}>
          <Figure value={reading.uvMax.toFixed(0)} />
          <Caption>{strings.uvLevel[uvBand]}</Caption>
          <RampBar fraction={reading.uvMax / 11} />
        </Tile>

        {air && (
          <Tile label={strings.stat.airQuality} icon={Icons.air}>
            <Figure value={String(Math.round(air.usAqi))} />
            <Caption>
              {strings.aqi[aqiBand(air.usAqi) as AqiBand]}
              <span className="block text-xs text-neutral-500">{air.pm25.toFixed(1)} µg/m³ PM2.5</span>
            </Caption>
            <RampBar fraction={air.usAqi / 300} />
          </Tile>
        )}

        <Tile label={strings.stat.humidity} icon={Icons.drop}>
          <Ring percent={reading.humidity}>
            <span className="font-sans text-sm font-semibold text-brand-maroon">{Math.round(reading.humidity)}%</span>
          </Ring>
        </Tile>

        <Tile label={strings.stat.pressure} icon={Icons.gauge}>
          <Dial fraction={(reading.pressure - 960) / 90} />
          <p className="-mt-2 text-center font-sans text-sm font-semibold text-brand-maroon">
            {formatPressure(reading.pressure, units, locale)}
          </p>
        </Tile>

        <Tile label={strings.stat.cloud} icon={Icons.cloud}>
          <Ring percent={reading.cloud}>
            <span className="font-sans text-sm font-semibold text-brand-maroon">{Math.round(reading.cloud)}%</span>
          </Ring>
        </Tile>
      </Section>

      <div className="flex flex-col gap-2">
        <Privacy text={strings.privacy} />
        <Sources strings={strings} />
      </div>
    </div>
  );
}

// Geologic time names, which Macrostrat returns in English.
const PERIOD_ES: Record<string, string> = {
  Holocene: "Holoceno", Pleistocene: "Pleistoceno", Pliocene: "Plioceno", Miocene: "Mioceno",
  Oligocene: "Oligoceno", Eocene: "Eoceno", Paleocene: "Paleoceno", Quaternary: "Cuaternario",
  Neogene: "Neógeno", Paleogene: "Paleógeno", Tertiary: "Terciario", Cretaceous: "Cretácico",
  Jurassic: "Jurásico", Triassic: "Triásico", Permian: "Pérmico", Carboniferous: "Carbonífero",
  Pennsylvanian: "Pensilvánico", Mississippian: "Misisípico", Devonian: "Devónico", Silurian: "Silúrico",
  Ordovician: "Ordovícico", Cambrian: "Cámbrico", Precambrian: "Precámbrico", Proterozoic: "Proterozoico",
  Archean: "Arcaico", Cenozoic: "Cenozoico", Mesozoic: "Mesozoico", Paleozoic: "Paleozoico",
};
function periodName(name: string, locale: Locale): string {
  if (locale !== "es") return name;
  return name
    .split(" ")
    .map((w) => PERIOD_ES[w] ?? ({ Early: "Temprano", Middle: "Medio", Late: "Tardío", Upper: "Superior", Lower: "Inferior" } as Record<string, string>)[w] ?? w)
    .join(" ");
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-brand-maroon/55">
        {label}
      </dt>
      <dd className="mt-0.5 break-words font-mono text-[0.8rem] text-brand-maroon">{value}</dd>
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
