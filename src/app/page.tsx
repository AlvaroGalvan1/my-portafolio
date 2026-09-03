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
      <Hero />
      <Wall />
      <About />
      <Journey />
      <Footer />
      <ContactModal />
    </>
  );
}
