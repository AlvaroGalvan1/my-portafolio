import { skills, type Skill } from "@/content/skills";

// Brand marks instead of a text list. Each badge is the logo plus its name
// underneath — the name stays because a logo alone is only recognisable to
// people who already know the tool, and a recruiter skimming shouldn't have
// to decode icons. Not links: these say what he works with, they aren't
// somewhere to navigate to.
export default function SkillBadges() {
  return (
    <ul className="mt-6 grid grid-cols-3 gap-3">
      {skills.map((skill) => (
        <li
          key={skill.name}
          className="flex flex-col items-center border-2 border-brand-red/25 bg-white px-2 py-3"
        >
          <BadgeMark skill={skill} />
          <span className="mt-1.5 block text-center font-sans text-[11px] font-semibold uppercase tracking-wide text-neutral-700">
            {skill.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

function BadgeMark({ skill }: { skill: Skill }) {
  return (
    <span className="flex h-8 items-center justify-center">
      {skill.icon ? (
        <svg
          role="img"
          aria-hidden
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill={skill.color ?? `#${skill.icon.hex}`}
        >
          <path d={skill.icon.path} />
        </svg>
      ) : (
        <span className="font-[family-name:var(--font-display)] text-xl text-brand-maroon">
          {skill.lettermark ?? skill.name.slice(0, 2)}
        </span>
      )}
    </span>
  );
}
