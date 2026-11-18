import AppIcon from "./AppIcon";
import FuegoBrowser from "./FuegoBrowser";
import Team from "./Team";
import BuiltThisNote from "./BuiltThisNote";
import { BRAND_STRINGS as S, FUEGO_PAGE, TEAM } from "./brand.content";
import { say, sayAll, type Locale } from "@/content/i18n";

// A · Brand. Fuego shown as a product, in orange.
// A1 the Fuego logo as an app icon · A2 the fuego.earth page, usable ·
// A3 the team · Note A: a hand-drawn arrow at A2 ("we built this!").
// A1 and A3 sit vertically centred on A2; the note fills the bottom-left
// corner under A1. Everything is sized to the quadrant: the stage's zoom is
// a transform, so the zoomed view is this same layout, twice as big.
// Narrower than `sm` (until the phone layout exists) only A2 and the note
// show, so nothing spills out of the quadrant.
export default function BrandSection({ locale }: { locale: Locale }) {
  return (
    <div className="relative h-full px-[4.5%] pb-[6%]">
      <div className="grid h-full grid-cols-1 items-center gap-x-[3%] sm:grid-cols-[minmax(0,0.8fr)_minmax(0,3.6fr)_minmax(0,1.3fr)]">
        <div className="hidden px-[4%] sm:block">
          <AppIcon name={S.appName} alt={say(S.appIconAlt, locale)} />
        </div>
        <div className="aspect-[16/10] max-h-full w-full min-w-0">
          <FuegoBrowser
            text={{
              title: say(S.browserTitle, locale),
              address: FUEGO_PAGE.address,
              url: FUEGO_PAGE.url,
              screenshot: FUEGO_PAGE.screenshot,
              screenshotAlt: say(S.screenshotAlt, locale),
              tryLive: say(S.tryLive, locale),
              live: say(S.live, locale),
              backToPreview: say(S.backToPreview, locale),
              openInTab: say(S.openInTab, locale),
              products: sayAll(S.products, locale),
              previewPending: say(S.previewPending, locale),
            }}
          />
        </div>
        <Team
          className="hidden sm:block"
          title={say(S.teamTitle, locale)} members={TEAM.map((m) => ({ ...m, area: say(m.area, locale) }))} />
      </div>
      <BuiltThisNote text={say(S.note, locale)} className="absolute bottom-[4%] left-[4.5%] h-[29%]" />
    </div>
  );
}
