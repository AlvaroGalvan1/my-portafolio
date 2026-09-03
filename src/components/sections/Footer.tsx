import { socials } from "@/content/socials";
import { profile } from "@/content/profile";

// The socials also live in the contact modal, but that's behind a click —
// this is the copy anyone scrolling to the bottom actually sees, which is
// where people look for them. Same source list either way, so the two can't
// drift apart.
export default function Footer() {
  return (
    <footer className="bg-brand-maroon px-6 py-12 font-sans text-sm text-brand-cream sm:px-16">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <p className="order-2 text-brand-cream/70 sm:order-1">
          © {new Date().getFullYear()} {profile.nameLines.join(" ")}
        </p>

        <div className="order-1 flex items-center gap-3 sm:order-2">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              title={s.name}
              className="flex h-11 w-11 items-center justify-center border-2 border-brand-cream/30 text-brand-cream transition-colors hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-maroon"
            >
              <svg
                role="img"
                aria-hidden
                viewBox={s.viewBox ?? "0 0 24 24"}
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
