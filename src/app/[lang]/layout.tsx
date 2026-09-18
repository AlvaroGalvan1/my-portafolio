import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Bungee } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/content/site";
import { BCP47, LOCALES, isLocale } from "@/content/i18n";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bungee = Bungee({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

// Both languages, both built. Two static pages rather than one page that
// swaps its strings in the browser — see content/i18n.ts for why that
// choice was made and what it buys.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

// A portfolio is a link people paste to each other, so the unfurled card
// is often the first thing anyone sees of it — before the site itself.
// This shipped as title "Alvaro Galvan" / description "Portfolio" with no
// image, which unfurls as a blank box reading "Portfolio".
//
// `metadataBase` is what makes the relative URLs below resolve to absolute
// ones in the rendered tags; without it Next warns and social crawlers get
// paths they can't fetch. The origin lives in content/site.ts so the custom
// domain is a one-line change.
//
// One string, three places: the browser tab, the OG card and the Twitter
// card. It used to be the same template literal written out three times,
// which is how a title gets changed in two of them and not the third.
//
// `alternates.languages` is the part a crawler needs that a human never
// sees: it tells Google the two URLs are the same page in two languages
// rather than duplicate content, and it is what puts the Spanish result in
// front of a Spanish searcher.
export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_TITLE[lang],
      // Any future route can set a bare title and still be attributed.
      template: `%s — ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION[lang],
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [BCP47[locale], `/${locale}`]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_TITLE[lang],
      description: SITE_DESCRIPTION[lang],
      url: `/${lang}`,
      locale: BCP47[lang].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE[lang],
      description: SITE_DESCRIPTION[lang],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} ${bungee.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Vercel Web Analytics. Imported from `@vercel/analytics/next`
            rather than `/react`: that entry is the one built for the App
            Router, and it already carries its own "use client", so it drops
            into this server component without a client boundary here.

            Collects nothing until Web Analytics is switched on in the
            Vercel dashboard (Project → Analytics → Enable). No cookies, no
            PII, so there's nothing to add to a privacy policy. */}
        <Analytics />
      </body>
    </html>
  );
}
