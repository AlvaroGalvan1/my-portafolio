import TestimonialsPicker, { type PickerItem } from "./TestimonialsPicker";
import { testimonials } from "@/content/testimonials";
import { say } from "@/content/i18n";
import { currentLocale } from "@/content/locale.server";
import { UI } from "@/content/ui";

// Other people's words, under Work with me: the ask, then the evidence
// that someone has already said yes to it.
//
// Empty in production renders nothing (see content/testimonials.ts). In
// development, three marked placeholders stand in so the layout can be
// designed before the first real quote exists. They never ship.
const PLACEHOLDERS: PickerItem[] = [
  {
    quote: "Their words go here, two to four sentences about what it was like to work together and what changed because of it.",
    name: "Manager Name",
    role: "Role",
    org: "Company",
    relation: "Managed me",
    project: "Project name",
    href: "#",
    placeholder: true,
  },
  {
    quote: "A client's quote goes here: the problem they brought, and what they got at the end.",
    name: "Client Name",
    role: "Role",
    org: "Organization",
    relation: "Client",
    project: "Project name",
    placeholder: true,
  },
  {
    quote: "A collaborator's quote goes here: what I was like to build something with.",
    name: "Collaborator Name",
    role: "Role",
    org: "Team",
    relation: "Built it with me",
    placeholder: true,
  },
];

export default async function Testimonials() {
  const dev = process.env.NODE_ENV !== "production";
  if (testimonials.length === 0 && !dev) return null;

  const locale = await currentLocale();
  const ui = UI[locale].testimonials;

  const items: PickerItem[] =
    testimonials.length > 0
      ? testimonials.map((t) => ({
          quote: say(t.quote, locale),
          name: t.name,
          role: say(t.role, locale),
          relation: say(t.relation, locale),
          org: t.org,
          project: t.project ? say(t.project, locale) : undefined,
          href: t.href,
          photoSrc: t.photoSrc,
        }))
      : PLACEHOLDERS;

  return (
    <section id="testimonials" className="border-t-2 border-brand-maroon/15 bg-brand-cream px-6 py-[clamp(3rem,8vh,5rem)] sm:px-16 print:hidden">
      <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand-maroon sm:text-4xl">{ui.heading}</h2>
      <p className="mt-2 font-sans text-base text-neutral-600">{ui.intro}</p>
      <TestimonialsPicker items={items} strings={{ verify: ui.verify, project: ui.project, placeholder: ui.placeholder }} />
    </section>
  );
}
