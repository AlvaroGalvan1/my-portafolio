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
      {/* The four sections were flat siblings of the nav and the footer,
          which left the page with no main landmark at all — nothing for
          assistive tech to jump to, and nothing marking where the chrome
          stops and the content starts. The contact overlay stays outside:
          it covers the page rather than being part of it. */}
      <main>
        <Hero />
        <Wall />
        <About />
        <Journey />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
