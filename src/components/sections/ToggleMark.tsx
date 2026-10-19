// The +/– beside a section heading that folds. Driven by the enclosing
// <details>' open state through a Tailwind group, so it needs no JS. A
// named group where the section nests other <details> (Faq), so the inner
// questions opening don't flip the section's mark.
export default function ToggleMark({ group }: { group?: "faq" }) {
  const closed = group === "faq" ? "group-open/faq:hidden" : "group-open:hidden";
  const open = group === "faq" ? "group-open/faq:flex" : "group-open:flex";
  return (
    <span
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-maroon font-[family-name:var(--font-display)] text-2xl leading-none text-brand-maroon"
    >
      <span className={closed}>+</span>
      <span className={`hidden ${open}`}>–</span>
    </span>
  );
}
