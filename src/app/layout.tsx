import type { Metadata } from "next";
import { Geist, Geist_Mono, Bungee } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  title: "Alvaro Galvan",
  description: "Portfolio",
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
