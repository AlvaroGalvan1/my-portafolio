import HorizontalGallery from "@/components/gallery/HorizontalGallery";
import { galleryItems } from "@/components/gallery/data";

// A horizontally-scrollable, looping wall of pieces — sits inline in the
// normal page flow (no scroll hijacking). See src/components/gallery/ for
// the implementation and src/components/gallery/data.ts for the pieces.
export default function Resources() {
  return (
    <section id="resources">
      <h2 className="bg-[#8f1c14] px-6 pt-16 pb-6 font-[family-name:var(--font-display)] text-4xl text-white sm:px-16">
        Resources
      </h2>
      <HorizontalGallery items={galleryItems} />
    </section>
  );
}
