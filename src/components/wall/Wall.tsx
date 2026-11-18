import WallStage from "./WallStage";
import BrandSection from "./brand/BrandSection";
import AgentsSection from "./agents/AgentsSection";
import ClimateSection from "./climate/ClimateSection";
import AppsSection from "./apps/AppsSection";
import { QUADRANTS, STAGE_STRINGS, type QuadrantId } from "./wall.content";
import { fill, say, type Locale } from "@/content/i18n";

// The Wall v3: one screen split into four quadrants, A Agents · B Brand ·
// C Climate Adaptation · D Design (websites and apps). Clicking a quadrant's title
// zooms the stage into it. Each section lives in its own folder and only
// receives the locale, so it can be built without touching the others.
const PANELS: Record<QuadrantId, (props: { locale: Locale }) => React.ReactNode> = {
  a: AgentsSection,
  b: BrandSection,
  c: ClimateSection,
  d: AppsSection,
};

export default function Wall({ locale }: { locale: Locale }) {
  const quadrants = QUADRANTS.map((q) => {
    const Panel = PANELS[q.id];
    const title = say(q.title, locale);
    return {
      id: q.id,
      letter: q.letter,
      title,
      theme: q.theme,
      zoomLabel: fill(say(STAGE_STRINGS.zoomIn, locale), { title }),
      panel: <Panel locale={locale} />,
    };
  });

  return <WallStage quadrants={quadrants} backLabel={say(STAGE_STRINGS.back, locale)} />;
}
