import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { galleryItems, localizeGallery } from "@/components/gallery/data";
import type { Locale } from "@/content/i18n";
import LivePreview from "./LivePreview";
import { wallTeaserContent } from "./wallteaser.content";

// Three pieces from the Wall, picked by id so the Home page shows real work
// without a new data model. The maps are an image; the two Fuego.Earth pieces
// show their real page, a small non-interactive preview (see LivePreview)
// that only starts once its tile is on screen. Every tile links to /wall.
const PICKS = ["maps-mexico-oaxaca", "fuego-platform", "fuego-risk-map"] as const;

export default function WallTeaser({ lang }: { lang: Locale }) {
  const copy = wallTeaserContent[lang];
  const items = localizeGallery(galleryItems, lang);
  const tiles = PICKS.map((id) => items.find((item) => item.id === id)).filter((item) => item !== undefined);

  return (
    <section className="py-12 sm:px-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="sr-only">{copy.label}</h2>
        {/* On a phone the three tiles are one sideways row you swipe, with
            the next tile peeking in, rather than three screens of cards
            stacked between the testimonials and the button. From `sm` they
            sit side by side as a grid. */}
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-6 pt-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:p-0">
          {tiles.map((item) => {
            const image = "src" in item && item.type === "post" ? item : null;
            return (
              <li key={item.id} className="w-[78%] flex-none snap-start sm:w-auto">
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
                        sizes="(min-width: 640px) 26vw, 80vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <LivePreview src={"src" in item ? item.src : ""} title={item.title} label={copy.live} />
                    )}
                  </div>
                  <p className="px-4 py-3 font-sans text-base font-semibold">{item.title.replace(/ \((live|en vivo)\)$/, "")}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex justify-center sm:mt-6">
          <Button variant="quiet" href={`/${lang}/wall`}>
            {copy.more}
          </Button>
        </div>
      </div>
    </section>
  );
}
