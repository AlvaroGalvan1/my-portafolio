import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/sections/Nav";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import ContactModal from "@/components/contact/ContactModal";
import { BCP47, LOCALES, isLocale } from "@/content/i18n";
import { UI } from "@/content/ui";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = UI[lang].about;

  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: {
      canonical: `/${lang}/about`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [BCP47[locale], `/${locale}/about`]),
      ),
    },
    openGraph: { url: `/${lang}/about`, title: ui.metaTitle, description: ui.metaDescription },
    twitter: { title: ui.metaTitle, description: ui.metaDescription },
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = UI[lang];

  return (
    <>
      <Nav lang={lang} strings={ui.nav} />
      <main>
        <About />
      </main>
      <Footer />
      <ContactModal strings={ui.contact} />
    </>
  );
}
