import type { Metadata } from "next";
import { Geist, Geist_Mono, Bungee } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/content/site";
import "./globals.css";

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

// A portfolio is a link people paste to each other, so the unfurled card
// is often the first thing anyone sees of it — before the site itself.
// This shipped as title "Alvaro Galvan" / description "Portfolio" with no
// image, which unfurls as a blank box reading "Portfolio".
//
// `metadataBase` is what makes the relative URLs below resolve to absolute
// ones in the rendered tags; without it Next warns and social crawlers get
// paths they can't fetch. The origin lives in content/site.ts so the custom
// domain is a one-line change.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — GeoAI & wildfire modelling`,
    // Any future route can set a bare title and still be attributed.
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — GeoAI & wildfire modelling`,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — GeoAI & wildfire modelling`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
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
