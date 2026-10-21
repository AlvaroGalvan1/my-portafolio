import Link from "next/link";
import { CONTACT_EMAIL, socials } from "@/content/socials";
import type { Locale } from "@/content/i18n";
import LanguageSwitch from "./LanguageSwitch";
import { shellContent } from "./shell.content";

const LINK = "inline-flex min-h-11 items-center px-2 hover:text-brand-yellow";

export default function Footer({ lang }: { lang: Locale }) {
  const t = shellContent[lang].footer;
  const social = (name: string) => socials.find((s) => s.name === name)!.href;

  const links = [
    { label: t.email, href: `mailto:${CONTACT_EMAIL}` },
    { label: t.linkedin, href: social("LinkedIn") },
    { label: t.github, href: social("GitHub") },
    { label: t.cv, href: "/cv.pdf" },
    { label: t.pricing, href: `/${lang}/pricing` },
    { label: t.faq, href: `/${lang}/faq` },
  ];

  return (
    // `mt-auto` pushes the footer to the bottom of a short page: the body
    // is a flex column, so auto margins soak up the spare height.
    <footer className="mt-auto bg-brand-maroon px-6 py-8 text-brand-cream print:hidden sm:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <nav aria-label={t.label}>
          <ul className="flex flex-wrap justify-center gap-x-2 font-sans text-sm font-semibold">
            {links.map((link) => (
              <li key={link.label}>
                {link.href.startsWith("/") && !link.href.endsWith(".pdf") ? (
                  <Link href={link.href} className={LINK}>
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={LINK}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitch current={lang} label={t.language} />
      </div>
    </footer>
  );
}
