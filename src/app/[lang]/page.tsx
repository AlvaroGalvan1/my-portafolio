import { notFound } from "next/navigation";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Background from "@/components/sections/Background";
import Wall from "@/components/sections/Wall";
import Testimonials from "@/components/sections/Testimonials";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import ContactModal from "@/components/contact/ContactModal";
import { isLocale } from "@/content/i18n";
import { UI } from "@/content/ui";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = UI[lang];

  return (
    <>
      {/* The bar and the contact overlay are the two Client Components at
          this level, so they're handed their strings rather than reading
          the locale themselves — `next/root-params` runs on the server
          only, which is the whole reason the sections below can call it
          and these two can't. */}
      <Nav lang={lang} strings={ui.nav} />
      {/* The content sections were flat siblings of the nav and the footer,
          which left the page with no main landmark at all — nothing for
          assistive tech to jump to, and nothing marking where the chrome
          stops and the content starts. The contact overlay stays outside:
          it covers the page rather than being part of it. */}
      <main>
        {/* The page reads as a CV, in a CV's order, with each part told the
            way this site can tell it rather than the way a PDF has to.

            Hero       — the name, the line, and one way to start.
            Background — education as a map, experience as the roles.
            Wall       — the personal work, which is the proof.
                         The toolkit and the CV close it — they used to be
                         an "About" section of their own after the Wall,
                         and a list of tools read after the work is a
                         footnote where the same list read at the end of
                         the four problems it solved is an answer.

            Services   — what I do and how to start, once everything above
                         has earned it. The rates are not in this run:
                         they are the Pricing page, /[lang]/pricing, the
                         one route outside the scroll, linked from here.
            Process    — what happens after the call: three steps, in
                         order, so booking isn't a leap into the unknown.
                         Right after Services on purpose: both are a row of
                         three cards answering "what happens if I press the
                         button", and Testimonials used to sit between them
                         — which split one argument into two.
            Testimonials — other people's words, which is the one claim I
                         cannot make myself. Placed after Services and
                         Process so it reads as proof that the pitch just
                         made is true, right before Faq mops up what's
                         left. Renders nothing until there are any; see
                         content/testimonials.ts.
            Faq        — the questions that would otherwise become an
                         email, answered before they're asked.

            A "Capabilities" band sat between Background and the Wall for
            one deploy — a "Worked with" logo row and four what-I-do cards.
            It went because it said, in summary, what the section directly
            above it had just said in detail: the same four organisations,
            the same four subjects. A summary that close to its source reads
            as padding. The Experience rows below carry the marks now.

            This is also the print order. The @media print block in
            globals.css turns this same run of sections into a paged CV
            when someone prints it. Nothing below is print-only markup for
            its own sake: every `hidden print:block` in these sections is
            detail the screen deliberately withholds (job bullets, the
            campus list, the project index) and paper has room for. */}
        <Hero />
        <Background />
        <Wall />
        <Services />
        <Process />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
      <ContactModal strings={ui.contact} />
    </>
  );
}
