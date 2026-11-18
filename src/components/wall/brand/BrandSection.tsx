import Slot from "../Slot";
import type { Locale } from "@/content/i18n";

// A · Brand. Fuego shown as a product, in orange.
// A1 the Fuego logo as an app icon · A2 the fuego.earth page, usable ·
// A3 the team · Note A: a hand-drawn arrow at A2 ("we built this!").
export default function BrandSection({ locale: _locale }: { locale: Locale }) {
  return (
    <div className="relative grid h-full grid-cols-[1fr_3fr_1fr] items-start gap-[4%] px-[5%] pt-[6%]">
      <Slot id="A1" label="Logo · app icon" rounded="rounded-[22%]" className="aspect-square w-full" />
      <Slot id="A2" label="fuego.earth · screenshot + interactive" className="aspect-[16/11] w-full" />
      <Slot id="A3" label="Team" className="aspect-square w-full" />
      <Slot
        id="Note A"
        label="hand-drawn arrow → A2"
        className="absolute bottom-[8%] left-[5%] h-[15%] w-[19%]"
      />
    </div>
  );
}
