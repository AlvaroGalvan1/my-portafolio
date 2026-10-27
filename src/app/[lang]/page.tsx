import { notFound } from "next/navigation";
import Areas from "@/components/areas/Areas";
import WallTeaser from "@/components/wallteaser/WallTeaser";
import Testimonials from "@/components/testimonials/Testimonials";
import { heroContent } from "@/components/hero/hero.content";
import { shellContent } from "@/components/shell/shell.content";
import Button from "@/components/ui/Button";
import Story from "@/components/story/Story";
import { isLocale } from "@/content/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <main className="bg-brand-orange pb-[10svh]">
        <section id="hero" className="grid min-h-svh place-items-center px-6">
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
        <Story lang={lang} />
        <Areas lang={lang} />
        <WallTeaser lang={lang} />
        <Testimonials lang={lang} />
        <div className="flex justify-center px-6 pb-4 pt-2">
          <Button href={`/${lang}/work-with-me`}>{shellContent[lang].nav.work}</Button>
        </div>
      </main>
    </>
  );
}
