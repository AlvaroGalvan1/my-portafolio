type Props = {
  /** SVG children: paths, circles. Drawn in `currentColor`. */
  children: React.ReactNode;
  viewBox?: string;
  /** `line` is the stroked style for the section icons; `solid` fills the
   *  shapes, for brand marks. */
  variant?: "line" | "solid";
  /** Set when the icon stands alone; leave out when text sits beside it. */
  label?: string;
  className?: string;
};

/** Inline SVG that takes its colour from CSS (`text-brand-maroon`), stays
 *  sharp at any size, and costs no network request. */
export default function Icon({
  children,
  viewBox = "0 0 24 24",
  variant = "line",
  label,
  className = "h-6 w-6",
}: Props) {
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...(variant === "line"
        ? {
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.6,
            strokeLinecap: "round" as const,
            strokeLinejoin: "round" as const,
          }
        : { fill: "currentColor" })}
    >
      {children}
    </svg>
  );
}
