import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Wall from "@/components/sections/Wall";
import About from "@/components/sections/About";
import Journey from "@/components/sections/Journey";
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
        {/* Hero carries the name AND the bio now — one card that opens as
            you scroll, which is what the separate yellow Intro section
            below it used to do standing still. */}
        <Hero />
        <Wall />
        {/* Journey ahead of About: the map is the other half of the work, so
            it reads with the Wall, and the skills/CV panel is the evidence
            that closes the page rather than interrupting it. */}
        <Journey />
        <About />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
