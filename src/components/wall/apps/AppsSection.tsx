import Slot from "../Slot";
import type { Locale } from "@/content/i18n";

// D · Websites & Apps. Jayda, the site for Mom's English school:
// D1 on a desktop, D2 on a phone, and Note D beside them.
export default function AppsSection({ locale: _locale }: { locale: Locale }) {
  return (
    <div className="grid h-full grid-cols-[3fr_1fr] items-center gap-[6%] px-[6%] py-[6%]">
      <Slot id="D1" label="Jayda · desktop" className="aspect-[16/10] w-full" />
      <div className="flex flex-col items-center gap-3">
        <Slot id="D2" label="Jayda · phone" rounded="rounded-2xl" className="aspect-[9/19] w-[80%]" />
        <Slot id="Note D" label="“I built this for my mom's English school”" className="h-16 w-full" />
      </div>
    </div>
  );
}
