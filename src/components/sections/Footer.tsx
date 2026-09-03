import { socials } from "@/content/socials";

// Just the marks, in white, at the very bottom — no boxes, no labels, no
// copyright line. At the end of the page there's nothing left to say, so
// the three glyphs carry it alone; anything framing them would be louder
// than what it framed. They dim to 70% at rest and come up to full white
// on hover, which is the whole interaction.
export default function Footer() {
  return (
    <footer className="bg-brand-maroon px-6 py-12 sm:px-16">
      <div className="flex items-center justify-center gap-8">
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            title={s.name}
            // -m-3 p-3 keeps a 44px tap target around a 24px glyph without
            // the padding pushing the marks apart visually.
            className="-m-3 p-3 text-white/70 transition-colors hover:text-white focus-visible:text-white"
          >
            <svg
              role="img"
              aria-hidden
              viewBox={s.viewBox ?? "0 0 24 24"}
              className="h-6 w-6"
              fill="currentColor"
            >
              <path d={s.path} />
            </svg>
          </a>
        ))}
      </div>
    </footer>
  );
}
