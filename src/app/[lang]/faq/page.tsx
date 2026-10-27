import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Faq from "@/components/faq/Faq";
import { BCP47, LOCALES, isLocale, type Locale } from "@/content/i18n";

const META: Record<Locale, { title: string; description: string }> = {
  en: { title: "FAQ", description: "Short answers about how I work." },
  es: { title: "Preguntas", description: "Respuestas cortas sobre cómo trabajo." },
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const meta = META[lang];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/faq`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [BCP47[locale], `/${locale}/faq`]),
      ),
    },
    openGraph: { url: `/${lang}/faq`, title: meta.title, description: meta.description },
    twitter: { title: meta.title, description: meta.description },
  };
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <main className="flex-1 bg-brand-orange">
      <Faq lang={lang} />
    </main>
  );
}
