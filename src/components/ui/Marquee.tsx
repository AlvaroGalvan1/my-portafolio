/** A slow sideways loop that pauses on hover and keyboard focus and sits
 *  still under reduced motion (see `.marquee` in globals.css). The children
 *  are rendered twice so the loop has no seam; the second copy is hidden
 *  from assistive tech and can't be tabbed to. Stays a Server Component:
 *  the pausing is CSS (`:hover`, `:focus-within`), so it needs no JS. */
export default function Marquee({
  children,
  label,
  seconds = 60,
}: {
  children: React.ReactNode;
  label: string;
  /** Time for one full loop. Higher is slower. */
  seconds?: number;
}) {
  return (
    <div
      className="marquee"
      role="region"
      aria-label={label}
      style={{ "--marquee-duration": `${seconds}s` } as React.CSSProperties}
    >
      <div className="marquee-track">
        <div className="marquee-group">{children}</div>
        <div className="marquee-group" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
