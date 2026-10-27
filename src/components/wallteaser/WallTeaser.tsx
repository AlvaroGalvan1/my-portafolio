import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { galleryItems, localizeGallery } from "@/components/gallery/data";
import type { Locale } from "@/content/i18n";
import { wallTeaserContent } from "./wallteaser.content";

// Three pieces from the Wall, picked by id so the Home page shows real work
// without a new data model. Each is a still: the maps are images already, and
// the live Fuego.Earth platform shows as its mark (and loses its "(live)" tag,
// since the tile is not live), so Home never loads an embed. Every tile links to /wall.
const PICKS = ["map-rivers", "map-soils", "fuego-platform"] as const;

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
                      <Image src="/logos/fuego-earth.svg" alt="" fill className="object-contain p-10" />
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
