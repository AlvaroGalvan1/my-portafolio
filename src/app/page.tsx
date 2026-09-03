import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Resources from "@/components/sections/Resources";
import About from "@/components/sections/About";
import MapSection from "@/components/sections/MapSection";
import Footer from "@/components/sections/Footer";
import ContactModal from "@/components/contact/ContactModal";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Resources />
      <About />
      <MapSection />
      <Footer />
      <ContactModal />
    </>
  );
}
