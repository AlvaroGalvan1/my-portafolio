import ContactTrigger from "@/components/contact/ContactTrigger";
import { profile } from "@/content/profile";
import { Z } from "@/lib/layers";

// Name first and big — it's the only thing here that has to land. The one
// line under it is the place, which doubles as the jump to the map where
// that place is pinned. The credential lines that used to sit here (tagline
// + subtitle) are gone: the About section already says all of it, and
// stacked qualifiers directly under a name read as a résumé header rather
// than an entrance.
export default function Hero() {
  return (
    // Bottom-left, not centred: the name sits on a baseline like painted
    // signage rather than floating in the middle of the field, and the open
    // space above gives the display type room to be loud.
    <section
      id="home"
      className="relative flex min-h-[90svh] flex-col justify-end overflow-hidden bg-brand-orange px-6 py-20 sm:px-16"
    >
      <div style={{ zIndex: Z.CARD_CONTENT }}>
        {/* Sized off the viewport rather than a fixed scale, so the name
            tracks the column at any width — poster behaviour, held back
            from filling it. 5.2vw leaves the two lines ending well short of
            the right edge, which reads as a deliberate measure rather than
            type strained to fit; the 7.5rem cap stops it growing past that
            on a wide monitor.
            Below `sm` the same fit would shrink the name to ~22px, so the
            rule flips to a floor of 2rem and the type stays large. Two
            lines at every width now that each line is a single word — the
            `sm` nowrap is what guarantees it stays that way if a longer
            line is ever put back. */}
        <h1
          className="text-signpainted font-[family-name:var(--font-display)] text-[clamp(2rem,10.5vw,2.75rem)] leading-[0.95] text-white sm:text-[clamp(1rem,5.2vw,7.5rem)]"
          style={{
            ["--shadow-color" as string]: "var(--color-brand-maroon)",
            WebkitTextStroke: "1.5px var(--color-brand-maroon)",
          }}
        >
          {profile.nameLines.map((line) => (
            <span key={line} className="block sm:whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>

        {/* Set below the name at the scale the tagline used to run at, so the
            hero keeps its typographic rhythm — big display line, small
            letterspaced line — with the place in the slot the credentials
            vacated. Plain text for now: the map section is a world map, not
            a view of the Mission, so pointing this at it would promise
            something it doesn't deliver. Give it a destination and it
            becomes a link. */}
        <p className="mt-8 inline-flex items-center gap-3 font-sans text-sm font-semibold uppercase tracking-[0.3em] text-brand-maroon">
          <span className="location-dot" aria-hidden />
          {profile.location.label}
        </p>

        {/* Stacked full-width on a phone: side by side, the two labels are
            different lengths and wrap at 375px, which left them ragged. */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <a
            href="#wall"
            className="border-2 border-brand-maroon bg-brand-maroon px-6 py-3 text-center font-sans font-semibold text-brand-cream hover:bg-transparent hover:text-brand-maroon sm:w-auto"
          >
            View My Wall
          </a>
          <ContactTrigger className="border-2 border-white bg-white px-6 py-3 text-center font-sans font-semibold text-brand-maroon hover:bg-transparent hover:text-white sm:w-auto">
            Contact Me
          </ContactTrigger>
        </div>
      </div>
    </section>
  );
}
