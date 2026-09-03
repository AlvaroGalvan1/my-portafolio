import ContactTrigger from "@/components/contact/ContactTrigger";
import { Z } from "@/lib/layers";

export default function Nav() {
  return (
    <nav
      style={{ zIndex: Z.NAV }}
      className="sticky top-0 flex items-center justify-between gap-3 bg-brand-maroon px-4 py-4 font-sans text-xs font-semibold uppercase tracking-wide text-brand-cream sm:gap-0 sm:px-16 sm:text-sm sm:tracking-widest"
    >
      <div className="flex gap-3 sm:gap-8">
        <a href="#home" className="hover:text-brand-yellow">
          Home
        </a>
        <a href="#resources" className="hover:text-brand-yellow">
          Resources
        </a>
        <a href="#about" className="hover:text-brand-yellow">
          About
        </a>
      </div>
      <ContactTrigger className="shrink-0 border-2 border-white bg-white px-3 py-1 text-brand-maroon hover:bg-transparent hover:text-white sm:px-4 sm:py-1.5">
        Contact
      </ContactTrigger>
    </nav>
  );
}
