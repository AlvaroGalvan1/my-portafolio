import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import SkillBadges from "./SkillBadges";
import OrgLogo from "./OrgLogo";

export default function About() {
  return (
    <section id="about" className="bg-white px-6 py-20 sm:px-16">
      <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-red">
        About
      </h2>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="bg-brand-cream p-8 font-sans leading-relaxed text-neutral-800">
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-red">
            Bio
          </h3>
          <div className="mt-4 space-y-4">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="border-2 border-brand-red p-8 font-sans">
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-red">
            Experience
          </h3>
          <div className="mt-6 space-y-6">
            {experience.map((job) => (
              <div key={job.org}>
                {job.logoSrc && (
                  <div className="mb-2">
                    <OrgLogo src={job.logoSrc} alt={job.org} />
                  </div>
                )}
                <p className="font-semibold text-brand-maroon">{job.role}</p>
                <p className="text-sm text-neutral-600">
                  {job.org} · {job.dates}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-cream p-8 font-sans">
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-brand-red">
            Skills
          </h3>
          <SkillBadges />
          <a
            href="/cv.pdf"
            className="mt-8 inline-block border-2 border-brand-red bg-brand-red px-5 py-2.5 font-sans font-semibold text-white hover:bg-transparent hover:text-brand-red"
          >
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}
