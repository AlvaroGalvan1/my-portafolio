import FireProgression from "./FireProgression";
import RiskCollage from "./RiskCollage";
import type { Job } from "@/content/experience";
import { say, type Locale } from "@/content/i18n";
import { UI } from "@/content/ui";

// What an Experience entry opens into: the project's story, in the beats
// from STORYTELLING.md. The picture first, because it does the most work.
// Then what was at stake, what was in the way and what I built, one line
// each. Then the proof, as the entry's numbers. Then the way in.
//
// Same story as the project's card on fuego.earth, told as "I" rather than
// "we", and ending on the work rather than on "tell us your problem".

type Story = NonNullable<Job["story"]>;

function Visual({ kind, locale }: { kind: NonNullable<Story["visual"]>; locale: Locale }) {
  if (kind === "riskCollage") return <RiskCollage locale={locale} />;
  return (
    <FireProgression
      alt={
        locale === "es"
          ? "Ilustración de un incendio simulado sobre imágenes satelitales de cerros junto a un pueblo: seis perímetros, uno por hora, avanzan cuesta abajo con el viento."
          : "Illustration of a simulated fire on satellite imagery of hills above a town: six perimeters, one per hour, stretch downhill with the wind."
      }
      caption={
        locale === "es"
          ? "Incendio ilustrado sobre imágenes del USGS, cerros de Santa Bárbara"
          : "Illustrated fire on USGS imagery, Santa Barbara foothills"
      }
    />
  );
}

export default function StoryPanel({ job, story, locale }: { job: Job; story: Story; locale: Locale }) {
  const ui = UI[locale].background;
  const beats = [
    [ui.stakes, story.stakes],
    [ui.problem, story.snag],
    [ui.built, story.move],
  ] as const;

  return (
    <div className="mt-4 space-y-5">
      {story.visual && <Visual kind={story.visual} locale={locale} />}

      <ol className="space-y-3">
        {beats.map(([label, text], i) => (
          <li key={label} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2">
            <span aria-hidden className="font-[family-name:var(--font-display)] text-lg leading-none text-brand-red">
              0{i + 1}
            </span>
            <div>
              <p className="eyebrow text-brand-red">{label}</p>
              <p className="mt-0.5 font-sans text-sm leading-relaxed text-neutral-800">{say(text, locale)}</p>
            </div>
          </li>
        ))}
      </ol>

      {job.stats.length > 0 && (
        <div>
          <p className="eyebrow text-brand-maroon/60">{ui.results}</p>
          <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-3 border-t-2 border-brand-maroon/15 pt-3 sm:grid-cols-2">
            {job.stats.map((stat) => (
              <div key={say(stat.label, "en")}>
                <dt className="sr-only">{say(stat.label, locale)}</dt>
                <dd>
                  <span className="block font-[family-name:var(--font-display)] text-2xl leading-none text-brand-maroon">
                    {say(stat.value, locale)}
                  </span>
                  <span className="mt-1 block font-sans text-xs leading-snug text-neutral-700">
                    {say(stat.label, locale)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-sans text-xs text-neutral-600">
          <span className="font-semibold text-brand-maroon">{ui.builtWith}</span> {job.stack.join(" · ")}
        </p>
        {story.door && (
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            {story.door.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs font-semibold text-brand-red underline decoration-brand-red/40 decoration-2 underline-offset-4 hover:decoration-brand-red"
              >
                {say(link.label, locale)} ↗<span className="sr-only">{ui.newTab}</span>
              </a>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
