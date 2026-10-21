import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Steps from "@/components/steps/Steps";
import Contact from "@/components/contact/Contact";
import Chat from "@/components/chat/Chat";
import { BCP47, LOCALES, isLocale, type Locale } from "@/content/i18n";

const META: Record<Locale, { title: string; description: string }> = {
  en: { title: "Work with me", description: "Tell me the problem. I build the tool your team uses." },
  es: { title: "Trabaja conmigo", description: "Cuéntame el problema. Yo construyo la herramienta que tu equipo usa." },
};

const costLine: Record<Locale, { before: string; pricing: string; middle: string; faq: string; after: string }> = {
  en: { before: "Wondering about cost or timing? See ", pricing: "pricing", middle: " and ", faq: "common questions", after: "." },
  es: { before: "¿Dudas sobre costo o tiempos? Mira las ", pricing: "tarifas", middle: " y las ", faq: "preguntas frecuentes", after: "." },
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work-with-me">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const meta = META[lang];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}/work-with-me`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [BCP47[locale], `/${locale}/work-with-me`]),
      ),
    },
    openGraph: { url: `/${lang}/work-with-me`, title: meta.title, description: meta.description },
    twitter: { title: meta.title, description: meta.description },
  };
}

export default async function WorkWithMePage({ params }: PageProps<"/[lang]/work-with-me">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const line = costLine[lang];

  return (
    <main className="flex-1 bg-brand-orange pb-12">
      <Steps lang={lang} />
      <section className="px-4 pt-6 sm:px-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1.4fr_1fr]">
          <Contact lang={lang} />
          <Chat lang={lang} />
        </div>
        <p className="mx-auto mt-6 max-w-5xl font-sans text-base font-semibold text-brand-maroon">
          {line.before}
          <Link href={`/${lang}/pricing`} className="underline decoration-2 underline-offset-4">
            {line.pricing}
          </Link>
          {line.middle}
          <Link href={`/${lang}/faq`} className="underline decoration-2 underline-offset-4">
            {line.faq}
          </Link>
          {line.after}
        </p>
      </section>
    </main>
  );
}
