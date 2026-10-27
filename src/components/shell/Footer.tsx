import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { CONTACT_EMAIL, socials } from "@/content/socials";
import type { Locale } from "@/content/i18n";
import LanguageSwitch from "./LanguageSwitch";
import { shellContent } from "./shell.content";

const LINK = "inline-flex min-h-11 items-center px-2 hover:text-brand-yellow";

export default function Footer({ lang }: { lang: Locale }) {
  const t = shellContent[lang].footer;
  const social = (name: string) => socials.find((s) => s.name === name)!;
  const linkedin = social("LinkedIn");
  const github = social("GitHub");

  // The three ways to reach me are logos; their names stay as the accessible label.
  const marks = [
    {
      label: t.email,
      href: `mailto:${CONTACT_EMAIL}`,
      icon: (
        <Icon label={t.email} className="size-6">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </Icon>
      ),
    },
    {
      label: t.linkedin,
      href: linkedin.href,
      icon: (
        <Icon label={t.linkedin} variant="solid" viewBox={linkedin.viewBox} className="size-6">
          <path d={linkedin.path} />
        </Icon>
      ),
    },
    {
      label: t.github,
      href: github.href,
      icon: (
        <Icon label={t.github} variant="solid" viewBox={github.viewBox} className="size-6">
          <path d={github.path} />
        </Icon>
      ),
    },
  ];

  const links = [
    { label: t.pricing, href: `/${lang}/pricing` },
    { label: t.faq, href: `/${lang}/faq` },
  ];

  return (
    // `mt-auto` pushes the footer to the bottom of a short page: the body
    // is a flex column, so auto margins soak up the spare height.
    <footer className="mt-auto bg-brand-maroon px-6 py-8 text-brand-cream print:hidden sm:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <nav aria-label={t.label}>
          <ul className="flex flex-wrap items-center justify-center gap-x-2 font-sans text-sm font-semibold">
            {marks.map((mark) => (
              <li key={mark.label}>
                <a
                  href={mark.href}
                  {...(mark.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`${LINK} justify-center`}
                >
                  {mark.icon}
                </a>
              </li>
            ))}
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitch current={lang} label={t.language} />
      </div>
    </footer>
  );
}
