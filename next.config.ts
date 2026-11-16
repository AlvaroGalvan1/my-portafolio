import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Open Library's cover API — used for the "How to Do Nothing" book
      // tile in the gallery (data.ts) rather than hosting a copy of the
      // cover art ourselves.
      { protocol: "https", hostname: "covers.openlibrary.org" },
      // YouTube video thumbnails — the Wall's `youtube` tiles show these as
      // static posters rather than loading a player per tile.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [
      // The QR code on the printed cards points at /hola. A redirect (not a
      // page) so a scan goes straight to the iPhone/Android "Add to
      // Contacts" sheet with no tap. `permanent: false` = 307, which
      // browsers don't cache, so the destination stays editable.
      { source: "/hola", destination: "/alvaro.vcf", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        // iOS Safari opens the contact sheet for text/vcard served inline.
        source: "/alvaro.vcf",
        headers: [
          { key: "Content-Type", value: "text/vcard; charset=utf-8" },
          { key: "Content-Disposition", value: "inline; filename=alvaro.vcf" },
        ],
      },
    ];
  },
};

export default nextConfig;
