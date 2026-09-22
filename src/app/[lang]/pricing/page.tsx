import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/sections/Nav";
import Pricing from "@/components/sections/Pricing";
import Footer from "@/components/sections/Footer";
import ContactModal from "@/components/contact/ContactModal";
import { BCP47, LOCALES, isLocale } from "@/content/i18n";
import { UI } from "@/content/ui";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = UI[lang].pricing;

  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: {
      canonical: `/${lang}/pricing`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [BCP47[locale], `/${locale}/pricing`]),
      ),
    },
    openGraph: { url: `/${lang}/pricing`, title: ui.metaTitle, description: ui.metaDescription },
    twitter: { title: ui.metaTitle, description: ui.metaDescription },
  };
}

export default async function PricingPage({ params }: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = UI[lang];

  return (
    <>
      <Nav lang={lang} strings={ui.nav} />
      <main>
        <Pricing />
      </main>
      <Footer />
      <ContactModal strings={ui.contact} />
    </>
  );
}
