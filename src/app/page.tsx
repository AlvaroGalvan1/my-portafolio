import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Background from "@/components/sections/Background";
import Capabilities from "@/components/sections/Capabilities";
import Wall from "@/components/sections/Wall";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Footer from "@/components/sections/Footer";
import ContactModal from "@/components/contact/ContactModal";

export default function Home() {
  return (
    <>
      <Nav />
      {/* The content sections were flat siblings of the nav and the footer,
          which left the page with no main landmark at all — nothing for
          assistive tech to jump to, and nothing marking where the chrome
          stops and the content starts. The contact overlay stays outside:
          it covers the page rather than being part of it. */}
      <main>
        {/* The page reads as a CV, in a CV's order, with each part told the
            way this site can tell it rather than the way a PDF has to.

            Hero         — the name, the line, and how to reach me.
            Background   — education as a map, experience as four takeaways.
            Capabilities — who has hired me, and what for.
            Wall         — the personal work, which is the proof.
            About        — the tools, for a reader who got this far.
            Services     — the ask, once everything above has earned it.

            Capabilities sits AFTER Background on purpose: the banner is the
            list of organisations from the experience data directly above it,
            so it reads as a summing-up rather than as a promise the page
            then has to keep.

            This is also the print order. The @media print block in
            globals.css turns this same run of sections into a paged CV —
            see PrintCvButton.tsx. Nothing below is print-only markup for
            its own sake: every `hidden print:block` in these sections is
            detail the screen deliberately withholds (job bullets, the
            campus list, the project index) and paper has room for. */}
        <Hero />
        <Background />
        <Capabilities />
        <Wall />
        <About />
        <Services />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
