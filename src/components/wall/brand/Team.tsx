import Image from "next/image";
import type { TeamMember } from "./brand.content";

// B3 · the Fuego team, as fuego.earth/about lists it (see TEAM in
// brand.content.ts), with a link to that page.
export default function Team({
  title,
  members,
  about,
  className = "",
}: {
  title: string;
  about: { href: string; label: string };
  className?: string;
  members: (Omit<TeamMember, "area"> & { area: string })[];
}) {
  return (
    <section
      aria-label={title}
      className={`w-full rounded-[14px] bg-brand-cream/95 px-[9%] py-[8%] text-brand-maroon shadow-[0_2px_4px_rgba(90,20,0,.18),0_14px_28px_-12px_rgba(90,20,0,.5)] ring-1 ring-black/5 ${className}`}
    >
      <h3 className="mb-[9%] flex items-center gap-1.5 text-[8.5px] font-semibold uppercase leading-none tracking-[0.14em] opacity-70">
        <span aria-hidden className="flex -space-x-[5px]">
          {members.map((m) => (
            <i key={m.name} className="block size-[7px] rounded-full bg-brand-orange ring-1 ring-brand-cream" />
          ))}
        </span>
        {title}
      </h3>
      <ul className="flex flex-col gap-[0.4rem]">
        {members.map((m) => (
          <li key={m.name} className="flex items-center gap-2">
            {m.photoSrc ? (
              <Image
                src={m.photoSrc}
                alt=""
                width={56}
                height={56}
                className="size-[22px] shrink-0 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <span
                aria-hidden
                className="grid size-[22px] shrink-0 place-items-center rounded-full bg-brand-maroon text-[9px] font-semibold tracking-wide text-brand-cream ring-2 ring-white"
              >
                {m.initials}
              </span>
            )}
            <span className="flex min-w-0 flex-col gap-[3px]">
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold leading-[1.1] hover:underline"
              >
                {m.name}
              </a>
              <span className="text-[9px] leading-[1.15] opacity-75">{m.area}</span>
            </span>
          </li>
        ))}
      </ul>
      <a
        href={about.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-[9%] block text-[9px] font-semibold tracking-wide underline-offset-2 hover:underline"
      >
        {about.label} ↗
      </a>
    </section>
  );
}
