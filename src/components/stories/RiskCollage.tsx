import { say, type Locale } from "@/content/i18n";

// The Hyticos story in three pictures, read in order: what is at stake,
// where the fires start, and what I built. The same three tell the story on
// fuego.earth/portfolio/risk-map. Both photos are CC BY-SA 4.0 and are
// credited under the collage, as the licence asks.

const TILES = [
  {
    src: "/stories/tiger-tadoba.jpg",
    alt: { en: "A Bengal tiger in tall, dry grass.", es: "Un tigre de Bengala entre pasto alto y seco." },
    label: { en: "The forest", es: "El bosque" },
    position: "object-[35%_50%]",
  },
  {
    src: "/stories/india-forest-fire.jpg",
    alt: {
      en: "A burned slope beside a mountain road in India, with a motorbike passing.",
      es: "Una ladera quemada junto a un camino de montaña en India, con una moto pasando.",
    },
    label: { en: "The fires", es: "Los incendios" },
    position: "object-[70%_50%]",
  },
  {
    src: "/stories/risk-map-illustration.jpg",
    alt: {
      en: "Illustration of a fire risk map: red where risk is high, along roads and around villages; green where it is low.",
      es: "Ilustración de un mapa de riesgo de incendio: rojo donde el riesgo es alto, junto a caminos y pueblos; verde donde es bajo.",
    },
    label: { en: "The map", es: "El mapa" },
    position: "object-center",
  },
];

const CREDITS = [
  {
    name: "Rohit Sharma",
    href: "https://commons.wikimedia.org/wiki/File:Bengal_tiger_at_Tadoba_Andhari_Tiger_Reserve,_Maharashtra,_India.jpg",
  },
  { name: "P. Jeganathan", href: "https://commons.wikimedia.org/wiki/File:Forest_fire_in_Anaimalai_Hills_JEG7881.jpg" },
];

export default function RiskCollage({ locale }: { locale: Locale }) {
  return (
    <figure>
      <div className="grid aspect-[16/10] grid-cols-3 grid-rows-2 gap-1 border-2 border-brand-maroon bg-brand-maroon shadow-[4px_4px_0_var(--color-brand-red)]">
        {TILES.map((tile, i) => (
          <div
            key={tile.src}
            className={`relative overflow-hidden ${i === 2 ? "col-span-2 col-start-2 row-span-2 row-start-1" : "col-start-1"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tile.src}
              alt={say(tile.alt, locale)}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover ${tile.position}`}
            />
            <span className="eyebrow pointer-events-none absolute bottom-1.5 left-1.5 whitespace-nowrap bg-brand-cream px-1.5 py-0.5 !text-[0.6rem] !tracking-[0.12em] text-brand-maroon">
              <span className="text-brand-red">{i + 1}</span>
              {/* the word only where the tile is wide enough to hold it */}
              <span className="hidden sm:inline"> {say(tile.label, locale)}</span>
            </span>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 font-sans text-[0.7rem] leading-snug text-neutral-600">
        {locale === "es" ? "Fotos: " : "Photos: "}
        {CREDITS.map((c, i) => (
          <span key={c.name}>
            {i > 0 && ", "}
            <a href={c.href} target="_blank" rel="noopener noreferrer" className="underline decoration-neutral-400 hover:text-brand-red">
              {c.name}
            </a>
          </span>
        ))}
        {", "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-neutral-400 hover:text-brand-red"
        >
          CC BY-SA 4.0
        </a>
        {locale === "es" ? ". El mapa es una ilustración." : ". The map is an illustration."}
      </figcaption>
    </figure>
  );
}
