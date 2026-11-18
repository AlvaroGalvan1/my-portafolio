import AppIcon from "./AppIcon";
import FuegoBrowser from "./FuegoBrowser";
import Team from "./Team";
import BuiltThisNote from "./BuiltThisNote";
import { BRAND_STRINGS as S, FUEGO_LINKS, FUEGO_PAGE, TEAM } from "./brand.content";
import { say, sayAll, type Locale } from "@/content/i18n";

// B · Brand. Fuego shown as a product, in orange.
// B1 the Fuego logo as an app icon · B2 the fuego.earth page, usable ·
// B3 the team · Note B: a hand-drawn arrow at B2 ("we built this!").
// B1 and B3 sit vertically centred on B2; the note fills the bottom-left
// corner under B1. Everything is sized to the quadrant: the stage's zoom is
// a transform, so the zoomed view is this same layout, twice as big.
// On a phone the section stacks instead: B2 full width, the note under it
// pointing up, then B1 and B3 side by side.
export default function BrandSection({ locale }: { locale: Locale }) {
  return (
    <div className="relative px-[4.5%] sm:h-full sm:pb-[6%]">
      <div className="grid grid-cols-2 items-center gap-x-4 gap-y-3 sm:h-full sm:gap-x-[3%] sm:gap-y-0 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,3.6fr)_minmax(0,1.3fr)]">
        <div className="order-3 px-[14%] sm:order-none sm:px-[4%]">
          <a
            href={FUEGO_LINKS.app}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-[22%] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 motion-reduce:transition-none"
          >
            <AppIcon name={S.appName} alt={say(S.appIconAlt, locale)} />
          </a>
        </div>
        <div className="order-1 col-span-2 aspect-[16/10] max-h-full w-full min-w-0 sm:order-none sm:col-span-1">
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
          className="order-4 sm:order-none"
          title={say(S.teamTitle, locale)}
          about={{ href: FUEGO_LINKS.about, label: FUEGO_LINKS.aboutLabel }}
          members={TEAM.map((m) => ({ ...m, area: say(m.area, locale) }))} />
        <BuiltThisNote
          text={say(S.note, locale)}
          className="order-2 col-span-2 h-20 sm:absolute sm:bottom-[4%] sm:left-[4.5%] sm:order-none sm:col-span-1 sm:h-[29%]"
        />
      </div>
    </div>
  );
}
