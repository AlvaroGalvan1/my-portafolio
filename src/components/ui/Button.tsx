import Link from "next/link";

type Variant = "primary" | "quiet";

// Two looks, never an arrow: the spec's "Rules for every page" bans them,
// so the component has no slot where one could be added by habit.
const BASE =
  "inline-flex min-h-11 items-center justify-center font-sans text-base font-semibold transition-colors";

const VARIANTS: Record<Variant, string> = {
  primary:
    "rounded-lg bg-brand-maroon px-6 py-3 text-brand-cream shadow-[0_10px_24px_-12px_rgba(122,23,16,.6)] hover:bg-[#5e110c]",
  quiet:
    "px-1 text-brand-maroon underline decoration-brand-orange decoration-2 underline-offset-4 hover:text-brand-red",
};

type Props = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & (
  | { href: string; onClick?: never; type?: never }
  | { href?: never; onClick?: () => void; type?: "button" | "submit" }
);

/** A link when it has an `href`, a `<button>` when it doesn't. Both get the
 *  same 44px minimum height so the tap target is the same on a phone. */
export default function Button({
  variant = "primary",
  className = "",
  children,
  href,
  onClick,
  type = "button",
}: Props) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  if (href === undefined) {
    return (
      <button type={type} onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  // Next's Link is for routes; anything leaving the site (Calendly, mailto,
  // the CV) is a plain anchor.
  if (/^(https?:|mailto:)/.test(href) || href.endsWith(".pdf")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
