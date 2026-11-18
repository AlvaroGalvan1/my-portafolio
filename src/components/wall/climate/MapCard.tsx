import Image from "next/image";

// C1–C4: one QGIS sheet, framed like a small print with its caption under
// it. The sheets are 2048×1448 (A-series landscape), so the frame keeps
// that 1.414 ratio and nothing is cropped. A gentle lift on hover.
export default function MapCard({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="group m-0 flex min-w-0 flex-col gap-1">
      <div className="rounded-[5px] bg-white/80 p-[3px] shadow-[0_1px_2px_rgba(31,74,69,0.12)] ring-1 ring-[#1f4a45]/10 transition duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_14px_-4px_rgba(31,74,69,0.28)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <div className="relative aspect-[1.414] overflow-hidden rounded-[3px]">
          {/* Sized for the zoomed view too: the stage scales by 2. */}
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
        </div>
      </div>
      <figcaption className="truncate px-0.5 text-[10px] leading-tight tracking-wide opacity-80">{caption}</figcaption>
    </figure>
  );
}
