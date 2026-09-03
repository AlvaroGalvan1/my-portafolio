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
      className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden bg-brand-orange px-6 py-20 sm:px-16"
    >
      <div style={{ zIndex: Z.CARD_CONTENT }}>
        {/* Sized off the viewport rather than a fixed scale, so the name runs
            near the full width of the column at any size — poster
            behaviour. 7.6vw is the fit: this display face measures ~10.3em
            across "Galván Sandoval", so anything past ~8vw runs under the
            section's overflow clip.
            Below `sm` that same fit would shrink the name to ~32px, so the
            rule flips: the lines wrap to one word each and the type stays
            large. Two lines desktop, four stacked on a phone — both
            deliberate, which is why the nowrap is scoped to `sm`. */}
        <h1
          className="text-signpainted font-[family-name:var(--font-display)] text-[clamp(2.5rem,13.5vw,3.5rem)] leading-[0.95] text-white sm:text-[clamp(1rem,7.6vw,12rem)]"
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
            href="#resources"
            className="border-2 border-brand-maroon bg-brand-maroon px-6 py-3 text-center font-sans font-semibold text-brand-cream hover:bg-transparent hover:text-brand-maroon sm:w-auto"
          >
            View Resources
          </a>
          <ContactTrigger className="border-2 border-white bg-white px-6 py-3 text-center font-sans font-semibold text-brand-maroon hover:bg-transparent hover:text-white sm:w-auto">
            Contact Me
          </ContactTrigger>
        </div>
      </div>
    </section>
  );
}
