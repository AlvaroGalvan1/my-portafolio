"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_META, type Locale } from "@/content/i18n";

// Two real links, not a state switch: /en and /es are two pages that both
// exist, so this stays middle-clickable and crawlable. It keeps the rest of
// the path, so /en/faq switches to /es/faq rather than dropping to Home.
export default function LanguageSwitch({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const rest = pathname.startsWith(`/${current}`) ? pathname.slice(current.length + 1) : "";

  return (
    <div
      role="group"
      aria-label={label}
      className="flex overflow-hidden rounded-md border-2 border-brand-yellow"
    >
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${rest}`}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
          title={LOCALE_META[locale].switchTo}
          className={`flex min-h-11 min-w-11 items-center justify-center px-3 text-sm font-semibold transition-colors ${
            locale === current
              ? "bg-brand-yellow text-brand-maroon"
              : "text-brand-yellow hover:bg-brand-yellow/20"
          }`}
        >
          {LOCALE_META[locale].code}
          <span className="sr-only"> — {LOCALE_META[locale].native}</span>
        </Link>
      ))}
    </div>
  );
}
