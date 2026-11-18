import MapCard from "./MapCard";
import MotionMap from "./MotionMap";
import { CLIMATE_MAPS, CLIMATE_STRINGS } from "./climate.content";
import { say, type Locale } from "@/content/i18n";

// C · Climate Adaptation. Four small maps in a 2×2 (C1–C4, the QGIS
// sheets), and C5 larger on the right: a new map whose only job for now is
// the motion (hover → Oaxaca appears → zoom out).
export default function ClimateSection({ locale }: { locale: Locale }) {
  return (
    <div className="grid h-full grid-cols-[1fr_1.4fr] items-center gap-[4%] px-[4.5%] pb-[4%] pt-[1%]">
      <figure className="m-0 flex min-w-0 flex-col gap-2" aria-label={say(CLIMATE_STRINGS.mapsLabel, locale)}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          {CLIMATE_MAPS.map((map) => (
            <MapCard
              key={map.id}
              src={map.src}
              alt={say(map.alt, locale)}
              caption={say(map.caption, locale)}
            />
          ))}
        </div>
        <figcaption className="px-0.5 text-[9px] uppercase tracking-[0.14em] opacity-60">
          {say(CLIMATE_STRINGS.credit, locale)}
        </figcaption>
      </figure>

      <figure className="m-0 flex min-w-0 flex-col gap-1">
        <div className="aspect-[4/3] w-full rounded-md bg-white/80 p-[3px] shadow-[0_1px_2px_rgba(31,74,69,0.12)] ring-1 ring-[#1f4a45]/10">
          <div className="h-full w-full rounded-[4px]">
            <MotionMap
              label={say(CLIMATE_STRINGS.motionLabel, locale)}
              name={say(CLIMATE_STRINGS.oaxaca, locale)}
              hint={say(CLIMATE_STRINGS.motionHint, locale)}
            />
          </div>
        </div>
        <figcaption className="px-0.5 text-[10px] leading-tight tracking-wide opacity-80">
          {say(CLIMATE_STRINGS.motionCaption, locale)}
        </figcaption>
      </figure>
    </div>
  );
}
