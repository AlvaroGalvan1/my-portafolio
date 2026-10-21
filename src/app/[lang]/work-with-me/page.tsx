import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Steps from "@/components/steps/Steps";
import Contact from "@/components/contact/Contact";
import Chat from "@/components/chat/Chat";
import { BCP47, LOCALES, isLocale, type Locale } from "@/content/i18n";

const META: Record<Locale, { title: string; description: string }> = {
  en: { title: "Work with me", description: "Tell me the problem. I build the tool your team uses." },
  es: { title: "Trabajemos juntos", description: "Cuéntame el problema. Yo construyo la herramienta que tu equipo usa." },
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

  return (
    <main>
      <Steps lang={lang} />
      <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
        <Contact lang={lang} />
        <Chat lang={lang} />
      </div>
    </main>
  );
}
