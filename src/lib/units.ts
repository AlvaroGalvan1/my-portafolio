import type { Locale } from "@/content/i18n";
import { BCP47 } from "@/content/i18n";

// Metres or feet, and who decides.
//
// The readout in "About you" is the one place on this site that puts
// numbers in front of a stranger, and a stranger in Sacramento does not
// know how tall 41 metres is any more than a stranger in Oaxaca knows how
// hot 78°F is. The figure is the whole point of that panel, so a figure in
// the wrong units is the panel failing.
//
// Three rules, in order:
//
//   1. Guess from the reader's own browser, because they have already told
//      it. See `detectUnitSystem` — it is not a geolocation lookup and it
//      asks no permission.
//   2. Let them override it, because the guess is a guess: plenty of
//      people read °C and miles, and a Mexican engineer reading a US site
//      may want either.
//   3. Remember the override. Changing it once per visit is a setting;
//      changing it every visit is a chore.

export type UnitSystem = "metric" | "imperial";

/** The three countries that have not adopted SI for everyday use. Liberia
 *  and Myanmar are both formally metric and both still sell fuel by the
 *  gallon, which is the same situation the US is in and the reason all
 *  three are listed rather than just the obvious one. */
const IMPERIAL_REGIONS = new Set(["US", "LR", "MM"]);

/** US and its territories, for the timezone fallback. Only used when the
 *  browser's language tag carries no region at all (a bare "en"), which is
 *  common enough to be worth a second guess rather than a coin toss. */
const IMPERIAL_TIMEZONE_PREFIXES = [
  "America/Adak",
  "America/Anchorage",
  "America/Boise",
  "America/Chicago",
  "America/Denver",
  "America/Detroit",
  "America/Indiana",
  "America/Juneau",
  "America/Kentucky",
  "America/Los_Angeles",
  "America/New_York",
  "America/Nome",
  "America/North_Dakota",
  "America/Phoenix",
  "America/Sitka",
  "America/Yakutat",
  "Pacific/Honolulu",
];

/**
 * What the reader's browser implies they measure in.
 *
 * `Intl.Locale.prototype.getTextInfo`-style accessors for measurement
 * system exist but are not everywhere yet, so this reads the region
 * subtag directly — `en-US` is a region, `es-MX` is a region, `en` is not.
 * Falls back to the IANA timezone, and then to metric, which is what most
 * of the planet uses and therefore the right coin to land on.
 *
 * Browser only: it touches `navigator` and `Intl`, so callers run it in an
 * effect rather than during render. Rendering metric on the server and
 * correcting on mount would flicker; the panel this feeds is opened by a
 * click, which is late enough for the answer to already be in.
 */
export function detectUnitSystem(): UnitSystem {
  if (typeof navigator === "undefined") return "metric";

  const tags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const tag of tags) {
    // "en-US" → "US"; "es-419" → "419"; "zh-Hant-TW" → "TW". The region is
    // the first subtag that is two letters or three digits, which is what
    // BCP 47 says and what a naive `split("-")[1]` gets wrong on a tag
    // carrying a script.
    const region = tag
      .split("-")
      .slice(1)
      .find((part) => /^[A-Za-z]{2}$/.test(part) || /^\d{3}$/.test(part));
    if (region) return IMPERIAL_REGIONS.has(region.toUpperCase()) ? "imperial" : "metric";
  }

  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (IMPERIAL_TIMEZONE_PREFIXES.some((prefix) => zone.startsWith(prefix))) {
      return "imperial";
    }
  } catch {
    // Intl without a resolvable timezone. Nothing to learn here.
  }

  return "metric";
}

const M_PER_FT = 0.3048;
const KM_PER_MI = 1.609344;
const HPA_PER_INHG = 33.8639;

/** A number the way the reader's language writes it. Spanish groups with a
 *  period and English with a comma, and a distance of "6.371 km" meaning
 *  six thousand is the kind of detail that makes a page feel translated
 *  rather than localised. */
function group(value: number, locale: Locale, digits = 0): string {
  return value.toLocaleString(BCP47[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** Height above sea level. Metres or feet, always whole: a digital
 *  elevation model sampled at 90 m does not know your doorstep to a
 *  decimal, and printing one would claim it does. */
export function formatElevation(
  metres: number,
  system: UnitSystem,
  locale: Locale,
): { value: string; unit: string } {
  return system === "imperial"
    ? { value: group(metres / M_PER_FT, locale), unit: "ft" }
    : { value: group(metres, locale), unit: "m" };
}

/** A gap between two heights — the "x apart" in the twin-city line. Same
 *  units as the elevation above it, necessarily. */
export function formatHeightGap(
  metres: number,
  system: UnitSystem,
  locale: Locale,
): string {
  const { value, unit } = formatElevation(metres, system, locale);
  return `${value} ${unit}`;
}

/** A distance, rounded the way a person would say it. Under ten units the
 *  decimal matters; over a thousand it is noise. */
export function formatDistance(
  km: number,
  system: UnitSystem,
  locale: Locale,
): string {
  const value = system === "imperial" ? km / KM_PER_MI : km;
  const unit = system === "imperial" ? "mi" : "km";
  if (value < 10) return `${group(value, locale, 1)} ${unit}`;
  return `${group(value, locale)} ${unit}`;
}

/** Temperature. Open-Meteo is asked in Celsius and converted here rather
 *  than requested in Fahrenheit, so switching the toggle costs no request
 *  and the readout never half-updates. */
export function formatTemperature(
  celsius: number,
  system: UnitSystem,
  locale: Locale,
): string {
  const value = system === "imperial" ? celsius * 1.8 + 32 : celsius;
  return `${group(value, locale)}°${system === "imperial" ? "F" : "C"}`;
}

export function formatSpeed(
  kmh: number,
  system: UnitSystem,
  locale: Locale,
): string {
  const value = system === "imperial" ? kmh / KM_PER_MI : kmh;
  return `${group(value, locale)} ${system === "imperial" ? "mph" : "km/h"}`;
}

/** Pressure. Millibars for most of the world, inches of mercury for the
 *  US aviation and broadcast convention — which is the one place two
 *  decimals are genuinely wanted, since the whole useful range is 28–31. */
export function formatPressure(
  hPa: number,
  system: UnitSystem,
  locale: Locale,
): string {
  return system === "imperial"
    ? `${group(hPa / HPA_PER_INHG, locale, 2)} inHg`
    : `${group(hPa, locale)} hPa`;
}
