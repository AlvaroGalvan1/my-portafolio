import Slot from "../Slot";
import type { Locale } from "@/content/i18n";

// C · Climate Adaptation. Four small maps in a 2×2, and C5: a new map
// whose only job for now is the motion (hover → Oaxaca appears → zoom out).
export default function ClimateSection({ locale: _locale }: { locale: Locale }) {
  return (
    <div className="grid h-full grid-cols-[1fr_1.4fr] items-center gap-[5%] px-[6%] py-[6%]">
      <div className="grid grid-cols-2 gap-3">
        <Slot id="C1" label="Mexico · rivers" className="aspect-[4/3]" />
        <Slot id="C2" label="Oaxaca · soil" className="aspect-[4/3]" />
        <Slot id="C3" label="Oaxaca · river" className="aspect-[4/3]" />
        <Slot id="C4" label="Mexico · soil" className="aspect-[4/3]" />
      </div>
      <Slot id="C5" label="hover → Oaxaca → zoom out" className="aspect-[4/3] w-full" />
    </div>
  );
}
