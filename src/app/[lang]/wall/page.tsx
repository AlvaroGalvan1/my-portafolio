import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BCP47, LOCALES, isLocale, type Locale } from "@/content/i18n";

const META: Record<Locale, { title: string; description: string }> = {
  en: { title: "Wall", description: "Things I made and things that caught my eye." },
  es: { title: "Muro", description: "Cosas que hice y cosas que me llamaron la atención." },
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/wall">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const meta = META[lang];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/wall`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [BCP47[locale], `/${locale}/wall`]),
      ),
    },
    openGraph: { url: `/${lang}/wall`, title: meta.title, description: meta.description },
    twitter: { title: meta.title, description: meta.description },
  };
}

export default async function WallPage({ params }: PageProps<"/[lang]/wall">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <main>
      <section className="bg-brand-red px-6 py-10 sm:px-16">
        <div className="mx-auto max-w-5xl rounded-lg border-2 border-dashed border-brand-cream/60 p-8 text-center font-sans text-brand-cream">
          <p className="eyebrow">{lang === "es" ? "Muro" : "Wall"}</p>
        </div>
      </section>
    </main>
  );
}
