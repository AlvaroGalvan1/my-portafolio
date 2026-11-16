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
      // The QR code on the printed cards points at /hola. It's a redirect
      // rather than a page so the destination can change without reprinting.
      // `permanent: false` sends 307, which browsers don't cache — keep it
      // that way, or a visitor's browser will remember the old destination.
      // Next: change `destination` to "/alvaro.vcf" (file in public/).
      {
        source: "/hola",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
