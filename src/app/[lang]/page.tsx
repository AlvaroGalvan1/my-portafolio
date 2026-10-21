import { notFound } from "next/navigation";
import Areas from "@/components/areas/Areas";
import Testimonials from "@/components/testimonials/Testimonials";
import { heroContent } from "@/components/hero/hero.content";
import { shellContent } from "@/components/shell/shell.content";
import Button from "@/components/ui/Button";
import Story from "@/components/story/Story";
import { isLocale } from "@/content/i18n";

// Portfolio 2.0 starts from one screen: the name, one line and one way to start.
// The v1 sections still exist in components/sections; they come back one
// at a time, if and when 2.0 wants them.
const STORY = {
  en: {
    beats: [
      { title: "Detect the fault", line: "At Gridware I watched Gridscope sensors on the poles and got the real faults to crews the same day." },
      { title: "Confirm the smoke", line: "At Pano AI I built the tools that place the cameras, so they see the land and the lines." },
      { title: "Forecast the spread", line: "At FUEGO I built the public map that turns fire-spread simulations into an hour-by-hour picture." },
      { title: "Track it from space", line: "At Hyticos I turned satellite bands into fire maps for forest teams with no ground data." },
    ],
    close: "If you want wildfire intelligence, let's talk.",
    cta: "Let's talk",
  },
  es: {
    beats: [
      { title: "Detectar la falla", line: "En Gridware vigilé los sensores Gridscope en los postes y llevé las fallas reales a las cuadrillas el mismo día." },
      { title: "Confirmar el humo", line: "En Pano AI construí las herramientas que ubican las cámaras, para que vean el terreno y las líneas." },
      { title: "Pronosticar la propagación", line: "En FUEGO construí el mapa público que convierte simulaciones de propagación en una imagen hora por hora." },
      { title: "Seguirlo desde el espacio", line: "En Hyticos convertí bandas satelitales en mapas de fuego para equipos forestales sin datos de campo." },
    ],
    close: "Si quieres inteligencia contra incendios, hablemos.",
    cta: "Hablemos",
  },
};

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <main className="bg-brand-orange pb-[10svh]">
        {/* The bottom quarter is left for the map card, which peeks up
            into it (see Story). */}
        <section id="hero" className="grid min-h-svh place-items-center px-6 pb-[26svh]">
          <div className="flex flex-col items-center text-center">
            {/* The site's display face, as large as the screen allows: by
                width on phones, by height on short laptops. A touch of
                tracking keeps the heavy caps apart, and the line height
                leaves room for the accent on Galván. */}
            <h1 className="font-[family-name:var(--font-display)] text-[min(19vw,27svh)] leading-[1.1] tracking-[0.02em] text-brand-maroon">
              Álvaro
              <br />
              Galván
            </h1>
            <p className="mt-4 max-w-[22ch] font-sans text-xl font-semibold text-brand-maroon sm:max-w-none sm:text-2xl">
              {heroContent[lang].tagline}
            </p>
            <Button href={`/${lang}/work-with-me`} className="mt-10">
              {heroContent[lang].cta}
            </Button>
          </div>
        </section>
        <Story strings={STORY[lang]} ctaHref={`/${lang}/work-with-me`} />
        <Areas lang={lang} />
        <Testimonials lang={lang} />
        <div className="flex justify-center px-6 pb-4 pt-2">
          <Button href={`/${lang}/work-with-me`}>{shellContent[lang].nav.work}</Button>
        </div>
      </main>
    </>
  );
}
