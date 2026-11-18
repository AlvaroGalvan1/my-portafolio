import { FUEGO_CREAM, FUEGO_ORANGE, LETTERS } from "./fuegoMark";

// A1 · the Fuego logo as a home-screen app icon.
//
// The artwork is the platform's own apple-touch-icon (fuego-earth-platform
// apps/web/public/apple-touch-icon.png): the FUEGO mark from fuego.earth,
// its letters stretched tall to fill the square, cream on orange with a
// burnt-orange drop shadow. Redrawn here as a vector from the same letter
// paths (AppHeader.tsx's FuegoMark) so it stays sharp when the stage zooms.

// The letters span x 16–218, y 0–100; the icon puts them at 10–166 × 19–158
// of a 180 square, as the PNG does.
const FIT = "matrix(0.772 0 0 1.39 -2.36 19)";

export default function AppIcon({ name, alt }: { name: string; alt: string }) {
  return (
    <figure className="flex w-full flex-col items-center gap-[0.45em]">
      <div
        className="aspect-square w-full overflow-hidden rounded-[22.37%] shadow-[0_1px_1px_rgba(90,20,0,.25),0_6px_14px_-4px_rgba(90,20,0,.45),0_16px_30px_-12px_rgba(90,20,0,.4)] ring-1 ring-black/10"
      >
        <svg viewBox="0 0 180 180" role="img" aria-label={alt} className="block h-full w-full">
          <defs>
            {/* The faint top-lit gloss of a home-screen icon. */}
            <linearGradient id="brand-a1-gloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".16" />
              <stop offset=".55" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity=".06" />
            </linearGradient>
          </defs>
          <rect width="180" height="180" fill={FUEGO_ORANGE} />
          <g fill="#b4400f" transform={`translate(4 4) ${FIT}`}>
            {LETTERS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g fill={FUEGO_CREAM} transform={FIT}>
            {LETTERS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <rect width="180" height="180" fill="url(#brand-a1-gloss)" />
        </svg>
      </div>
      <figcaption className="text-[11px] font-medium leading-none tracking-wide">{name}</figcaption>
    </figure>
  );
}
