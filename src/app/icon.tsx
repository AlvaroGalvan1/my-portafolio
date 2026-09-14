import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The tab icon, drawn rather than checked in as a .ico — same reasoning as
// opengraph-image.tsx next door: generated from the brand colours and the
// brand face, so it can't drift out of sync with them.
//
// The mark is "Á", accent included. The accent is the point: it's the
// letter that makes the name Spanish, and at tab size a bare "A" on red
// would read as any of a hundred other sites.
//
// 128px rather than the conventional 32: browsers downsample a favicon to
// whatever the tab needs (16px, 32px on retina, larger in a bookmark grid
// or Arc's sidebar), and downsampling a big crisp glyph beats upscaling a
// small one. Bungee is a heavy face, so the counter inside the A survives
// the shrink; the accent is the part to watch.
export const size = { width: 128, height: 128 };
export const contentType = "image/png";

export default async function Icon() {
  // Vendored next to this file rather than fetched from Google at build
  // time — the icon would otherwise fail to generate on any build without
  // network, and `next/font` gives us woff2, which Satori cannot parse
  // (ttf/otf/woff only).
  const bungee = await readFile(join(process.cwd(), "src/app/Bungee-Regular.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Brand red under cream, the same pairing the unfurl card uses,
          // so the tab and the link preview read as one thing.
          background: "#d92b1c",
          color: "#fff4de",
          fontFamily: "Bungee",
          // 90/22 puts 87px of ink in a 128px square with even 20px
          // margins — measured off the render, not guessed. Bungee carries
          // the acute high above the cap, so the glyph's ink box is taller
          // than its line box and the pair drifts upward when it's simply
          // centred; the padding is what brings it back. Change the font
          // size and this has to be re-measured, not scaled.
          fontSize: 90,
          lineHeight: 1,
          paddingTop: 22,
        }}
      >
        Á
      </div>
    ),
    { ...size, fonts: [{ name: "Bungee", data: bungee, weight: 400, style: "normal" }] },
  );
}
