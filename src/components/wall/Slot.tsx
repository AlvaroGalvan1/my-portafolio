// A placeholder for one piece of the layout: a dashed outline with its
// label (A1, C5, …). Every section starts as these; each is replaced by
// the real piece when that section is built.
export default function Slot({
  id,
  label,
  className = "",
  rounded = "rounded-md",
}: {
  id: string;
  label?: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      data-slot={id}
      className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed border-brand-cream/60 text-center text-brand-cream ${rounded} ${className}`}
    >
      <span className="font-[family-name:var(--font-display)] text-lg leading-none">{id}</span>
      {label && <span className="px-2 text-[11px] leading-tight text-brand-cream/70">{label}</span>}
    </div>
  );
}
