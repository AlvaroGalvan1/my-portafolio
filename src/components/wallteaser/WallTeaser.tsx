import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { galleryItems, localizeGallery } from "@/components/gallery/data";
import type { Locale } from "@/content/i18n";
import { wallTeaserContent } from "./wallteaser.content";

// Three pieces from the Wall, picked by id so the Home page shows real work
// without a new data model. The maps are an image; the two Fuego.Earth pieces
// show their real page, a small non-interactive preview (the iframe is
// scaled down and cannot be clicked, so the whole tile is just the link) that
// only loads when it scrolls near. Every tile links to /wall.
const PICKS = ["maps-mexico-oaxaca", "fuego-platform", "fuego-risk-map"] as const;

export default function WallTeaser({ lang }: { lang: Locale }) {
  const copy = wallTeaserContent[lang];
  const items = localizeGallery(galleryItems, lang);
  const tiles = PICKS.map((id) => items.find((item) => item.id === id)).filter((item) => item !== undefined);

  return (
    <section className="px-4 py-12 sm:px-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="sr-only">{copy.label}</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {tiles.map((item) => {
            const image = "src" in item && item.type === "post" ? item : null;
            return (
              <li key={item.id}>
                <Link
                  href={`/${lang}/wall`}
                  className="group block overflow-hidden rounded-xl bg-brand-cream text-brand-maroon shadow-[0_14px_30px_-18px_rgba(59,19,15,.6)]"
                >
                  <div className="relative aspect-[4/3] bg-brand-cream">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt ?? ""}
                        fill
                        sizes="(min-width: 640px) 26vw, 90vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      // Four times the tile's size, drawn at a quarter: the app lays out as desktop.
                      <iframe
                        src={"src" in item ? item.src : undefined}
                        title={item.title}
                        loading="lazy"
                        tabIndex={-1}
                        sandbox="allow-scripts allow-same-origin"
                        className="pointer-events-none absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-25 border-0"
                      />
                    )}
                  </div>
                  <p className="px-4 py-3 font-sans text-base font-semibold">{item.title.replace(/ \((live|en vivo)\)$/, "")}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex justify-center">
          <Button variant="quiet" href={`/${lang}/wall`}>
            {copy.more}
          </Button>
        </div>
      </div>
    </section>
  );
}
