import type { SimpleIcon } from "simple-icons";
import { skillGroups } from "@/content/skills";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";

// The toolkit, as three stacked rows rather than a grid of equal tiles.
//
// ── Why vertical ──────────────────────────────────────────────────────
// A grid of identical tiles says every one of these is the same kind of
// thing and equally important, which is false twice over: GCP and GDAL do
// not do the same job, and a reader who needs a risk map built does not
// care about them equally. Twelve identical squares is a shape that gets
// skimmed as one object and read as none of them.
//
// Stacked rows make the reader pass each group in turn, and each row is a
// small argument: here is a stage of the work, here is what I do it with,
// here is how far into it I go. Three of those beats twelve logos, and the
// ORDER carries meaning the grid could not — build, then process, then
// domain, which is the order the work actually happens in. See skills.ts.
//
// ── Alignment ─────────────────────────────────────────────────────────
// ONE left edge, all the way down. Label, marks and sentence all start at
// the same x, separated by a hairline rule per row and nothing else.
//
// There was a version with the label in its own 11rem column and the
// content beside it, which is the handsomer layout and the wrong one here:
// this card now sits in a half-width column under Education, and a fixed
// label column inside a 548px card leaves ~330px for seven marks and a
// sentence — the marks wrap to three lines and the prose runs at 45
// characters. Stacked, every row gets the card's full measure.
//
// Nothing is centred. A centred logo row inside a left-aligned panel is
// the most common way a section like this stops looking designed.
export default async function SkillBadges() {
  const locale = await currentLocale();

  return (
    // Three across from `lg`: the card now sits under Experience in a section
    // that has to fit one screen, and three stacked rows were three times
    // the height of three columns. Each group still reads top to bottom.
    <ul className="mt-5 divide-y divide-brand-red/15 border-y border-brand-red/15 lg:mt-4 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:divide-y-0 lg:border-y-0">
      {skillGroups.map((group) => (
        <li key={say(group.label, "en")} className="py-6 lg:py-0">
          <h5 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.18em] text-brand-red">
            {say(group.label, locale)}
          </h5>

          {/* One list, with a mark where the tool has one. See skills.ts:
              this used to be marks on one line and the same names repeated
              as text underneath, which is a list and its own echo. */}
          <ul className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2.5 lg:mt-2.5 lg:gap-x-4 lg:gap-y-1.5">
            {group.tools.map((tool) => (
              <li key={tool.name} className="flex items-center gap-1.5">
                {tool.icon && <BadgeMark icon={tool.icon} />}
                <span className="font-sans text-[0.8rem] font-medium text-brand-maroon">
                  {tool.name}
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

// ── Why the logos are not in their brand colours ──────────────────────
// Every mark here is drawn in brand maroon at 80%, and that is the single
// biggest visual decision in this panel.
//
// In their own colours these are Python blue-and-yellow, Docker blue,
// scikit-learn orange, QGIS green, ArcGIS blue, Vercel black. A dozen
// logos in as many unrelated hues, on a cream card, inside a section whose
// palette is three warm colours and which says explicitly (see the top of
// globals.css) that nothing here is blue, green, grey or black by choice.
// The brand-coloured version was the only place on the page that broke
// that rule, and it read exactly like what it was: a row of other
// companies' logos pasted into someone else's design.
//
// The cost is real and worth naming: a Python logo in one colour is a
// fraction slower to recognise than the two-tone original. The name is
// printed beside every one of them, so nothing is actually lost — and what
// is gained is that the row reads as one family of things I use rather
// than as a dozen brands competing for the same square inch.
function BadgeMark({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      role="img"
      aria-hidden
      viewBox="0 0 24 24"
      className="h-[1.05rem] w-[1.05rem] shrink-0 text-brand-maroon/75"
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}
