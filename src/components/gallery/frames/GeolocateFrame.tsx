"use client";

import { useState } from "react";
import type { FrameBase, FrameCellProps } from "./base";
import { TileLabel } from "./shared";
import { nearestByElevation, type ElevationCity } from "@/content/elevations";

// The one tile on this wall that is about the visitor rather than about me.
//
// Everything else here says "I work with location data". This does it to
// you: give it your coordinates and it tells you the height of the ground
// you're standing on, which city in my life sits at that same height, and
// what the air is doing over your head. That's the argument the rest of the
// page has to make in sentences.
//
// Three rules it follows, and they're the difference between a flex and an
// annoyance:
//
//   1. It never asks on load. A permission dialog fired at a stranger is
//      the fastest way to lose them, so the browser is only asked after a
//      deliberate click on a button that says what will happen.
//   2. Saying no still works. Decline and it offers to run on my own
//      street instead, so the piece is legible to everyone rather than
//      being a locked door for anyone who doesn't trust it.
//   3. It says where the coordinates go. They're sent to open-meteo.com
//      and nowhere else — not to this site, not to analytics, not to
//      storage. For a page arguing that its author is careful with
//      location data, that sentence is part of the work.
export type GeolocateFrameData = FrameBase & {
  type: "geolocate";
  /** Where to run when the visitor declines, or has no geolocation at all.
   *  Somewhere with a story attached, so the fallback is a demonstration
   *  rather than an apology. */
  fallback: { label: string; lat: number; lon: number };
};

const ELEVATION_API = "https://api.open-meteo.com/v1/elevation";
const FORECAST_API = "https://api.open-meteo.com/v1/forecast";

// WMO weather codes, grouped rather than enumerated. The full table has
// twenty-eight entries distinguishing "slight" from "moderate" drizzle,
// which is more precision than a tile this size can spend a line on.
function weatherLabel(code: number): string {
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

type Reading = {
  lat: number;
  lon: number;
  /** Metres of GPS uncertainty, where the browser gave a figure. Absent for
   *  the fallback, which is a stated address rather than a measurement. */
  accuracy?: number;
  elevation: number;
  twin: ElevationCity;
  temperature: number;
  humidity: number;
  wind: number;
  weather: string;
  place: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "reading" }
  | { kind: "ready"; reading: Reading }
  | { kind: "denied" }
  | { kind: "error"; message: string };

async function readGround(lat: number, lon: number, place: string, accuracy?: number) {
  // Two requests rather than one. The forecast response carries an
  // elevation of its own, but it's the weather model's grid cell — tens of
  // kilometres across, and in mountains it can be a thousand metres out.
  // The elevation endpoint reads a 90m digital elevation model at the
  // point, which is the number this tile is actually about.
  const [elevationRes, forecastRes] = await Promise.all([
    fetch(`${ELEVATION_API}?latitude=${lat}&longitude=${lon}`),
    fetch(
      `${FORECAST_API}?latitude=${lat}&longitude=${lon}` +
        "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto",
    ),
  ]);

  if (!elevationRes.ok || !forecastRes.ok) throw new Error("The lookup failed");

  const elevationJson = (await elevationRes.json()) as { elevation: number[] };
  const forecastJson = (await forecastRes.json()) as {
    current: {
      temperature_2m: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
      weather_code: number;
    };
  };

  const elevation = elevationJson.elevation?.[0] ?? 0;

  return {
    lat,
    lon,
    accuracy,
    elevation,
    twin: nearestByElevation(elevation),
    temperature: forecastJson.current.temperature_2m,
    humidity: forecastJson.current.relative_humidity_2m,
    wind: forecastJson.current.wind_speed_10m,
    weather: weatherLabel(forecastJson.current.weather_code),
    place,
  } satisfies Reading;
}

export function GeolocateFrameCell({ frame }: FrameCellProps<GeolocateFrameData>) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const run = async (lat: number, lon: number, place: string, accuracy?: number) => {
    setStatus({ kind: "reading" });
    try {
      setStatus({ kind: "ready", reading: await readGround(lat, lon, place, accuracy) });
    } catch {
      setStatus({
        kind: "error",
        message: "Open-Meteo didn't answer. It's a free service; try again in a moment.",
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
          "You",
          position.coords.accuracy,
        ),
      // Every failure lands here — refused, unavailable, timed out — and
      // they all mean the same thing to this tile: no coordinates, offer
      // the fallback.
      () => setStatus({ kind: "denied" }),
      // High accuracy because the whole point is the precision. The long
      // timeout is for the cold GPS fix on a phone, which genuinely can
      // take fifteen seconds outdoors and never resolves indoors — hence a
      // cache window, so a second press doesn't wait for the satellites
      // twice.
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  // Not `useFallback`: a plain function whose name begins with "use" is a
  // hook as far as the linter is concerned, and it refused to let it be
  // called from a click handler.
  const runFallback = () =>
    run(frame.fallback.lat, frame.fallback.lon, frame.fallback.label);

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden bg-[#0a0a0a] p-4 text-brand-cream sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand-yellow">
          Where you are
        </p>
        {status.kind === "ready" && (
          <p className="font-mono text-[0.65rem] text-brand-cream/60">
            {status.reading.lat.toFixed(4)}, {status.reading.lon.toFixed(4)}
            {status.reading.accuracy !== undefined && (
              <> ±{Math.round(status.reading.accuracy)}m</>
            )}
          </p>
        )}
      </div>

      {status.kind === "ready" ? (
        <Readout reading={status.reading} />
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-4">
          <p className="max-w-[34ch] font-sans text-sm leading-relaxed text-brand-cream/85 sm:text-base">
            {status.kind === "denied"
              ? "No coordinates, which is a perfectly good answer. Here's the same readout for my own street instead."
              : status.kind === "error"
                ? status.message
                : "Tell me where you are and I'll tell you the height of the ground under you, whose city that matches, and what the air is doing."}
          </p>

          <div className="flex flex-wrap gap-3">
            {status.kind !== "denied" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  locate();
                }}
                disabled={status.kind === "locating" || status.kind === "reading"}
                className="border-2 border-brand-yellow bg-brand-yellow px-4 py-2 font-sans text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-transparent hover:text-brand-yellow disabled:opacity-60"
              >
                {status.kind === "locating"
                  ? "Asking your browser…"
                  : status.kind === "reading"
                    ? "Reading the ground…"
                    : "Locate me"}
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                runFallback();
              }}
              className="border-2 border-brand-cream/40 px-4 py-2 font-sans text-sm font-semibold text-brand-cream/80 transition-colors hover:border-brand-cream hover:text-brand-cream"
            >
              Use {frame.fallback.label}
            </button>
          </div>
        </div>
      )}

      <p className="font-sans text-[0.6rem] leading-relaxed text-brand-cream/45">
        Coordinates go to open-meteo.com for the lookup. They are not stored,
        logged or sent anywhere else.
      </p>

      <TileLabel title={frame.title} />
    </div>
  );
}

function Readout({ reading }: { reading: Reading }) {
  const difference = Math.round(Math.abs(reading.elevation - reading.twin.metres));

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 py-3">
      <div>
        <p className="font-[family-name:var(--font-display)] text-4xl leading-none text-brand-yellow sm:text-6xl">
          {Math.round(reading.elevation)}
          <span className="ml-2 text-2xl text-brand-cream/70">m</span>
        </p>
        <p className="mt-2 font-sans text-[0.65rem] uppercase tracking-[0.25em] text-brand-cream/55">
          above sea level · {reading.place}
        </p>
      </div>

      {/* The twin city. This is the line the tile exists for — a number
          nobody has intuition for, converted into a place they might. */}
      <p className="font-sans text-sm leading-relaxed text-brand-cream sm:text-base">
        About the height of{" "}
        <span className="font-semibold text-brand-yellow">{reading.twin.name}</span>
        {reading.twin.mine && (
          <span className="text-brand-cream/70">, {reading.twin.mine}</span>
        )}
        <span className="text-brand-cream/50">
          {difference === 0 ? " — to the metre" : ` — ${difference} m apart`}
        </span>
      </p>

      <dl className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
        <div>
          <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-brand-cream/50">
            Air
          </dt>
          <dd className="font-mono text-brand-cream">
            {Math.round(reading.temperature)}°C
          </dd>
        </div>
        <div>
          <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-brand-cream/50">
            Humidity
          </dt>
          <dd className="font-mono text-brand-cream">{Math.round(reading.humidity)}%</dd>
        </div>
        <div>
          <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-brand-cream/50">
            Wind
          </dt>
          <dd className="font-mono text-brand-cream">
            {Math.round(reading.wind)} km/h
          </dd>
        </div>
        <div>
          <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-brand-cream/50">
            Sky
          </dt>
          <dd className="font-mono text-brand-cream">{reading.weather}</dd>
        </div>
      </dl>
    </div>
  );
}
