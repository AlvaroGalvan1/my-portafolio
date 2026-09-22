"use client";

import { useRef, useState, type KeyboardEvent } from "react";

export type PickerItem = {
  quote: string;
  name: string;
  role: string;
  relation: string;
  org?: string;
  project?: string;
  href?: string;
  photoSrc?: string;
  placeholder?: boolean;
};

// People down one side, the chosen quote large on the other. A tab list,
// because that is what it is: one panel, several people who can fill it.
// Arrow keys move between names, as they do in any tab list.
export default function TestimonialsPicker({
  items,
  strings,
}: {
  items: PickerItem[];
  strings: { verify: string; project: string; placeholder: string };
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = items[active];

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const initials = (name: string) =>
    name
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
      <div
        role="tablist"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 sm:-mx-16 sm:px-16 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {items.map((item, i) => {
          const on = i === active;
          return (
            <button
              key={`${item.name}-${i}`}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`testimonial-tab-${i}`}
              aria-selected={on}
              aria-controls="testimonial-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`flex min-w-[15rem] shrink-0 items-center gap-3 border-2 p-3 text-left transition-colors lg:min-w-0 ${
                on
                  ? "border-brand-maroon bg-brand-maroon text-brand-cream shadow-[4px_4px_0_var(--color-brand-yellow)]"
                  : "border-brand-maroon/15 bg-white text-brand-maroon hover:border-brand-maroon/50"
              }`}
            >
              {item.photoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.photoSrc} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
              ) : (
                <span
                  aria-hidden
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-sm ${
                    on ? "bg-brand-yellow text-brand-maroon" : "bg-brand-cream text-brand-maroon"
                  }`}
                >
                  {initials(item.name)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate font-sans text-sm font-semibold">{item.name}</span>
                <span className={`block truncate font-sans text-xs ${on ? "text-brand-cream/75" : "text-neutral-500"}`}>
                  {item.role}
                  {item.org ? `, ${item.org}` : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <figure
        id="testimonial-panel"
        role="tabpanel"
        aria-labelledby={`testimonial-tab-${active}`}
        className="relative border-2 border-brand-maroon bg-white p-6 sm:p-8"
      >
        {current.placeholder && (
          <span className="eyebrow absolute right-4 top-4 bg-brand-yellow px-2 py-1 text-brand-maroon">
            {strings.placeholder}
          </span>
        )}
        <span aria-hidden className="block font-[family-name:var(--font-display)] text-6xl leading-none text-brand-red">
          &ldquo;
        </span>
        <blockquote className="-mt-4 font-sans text-xl leading-relaxed text-brand-maroon sm:text-2xl">
          {current.quote}
        </blockquote>
        <figcaption className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t-2 border-brand-maroon/10 pt-4">
          <div>
            <p className="font-sans text-base font-bold text-brand-maroon">{current.name}</p>
            <p className="font-sans text-sm text-neutral-600">
              {current.role}
              {current.org ? `, ${current.org}` : ""}
            </p>
            <p className="eyebrow mt-1 text-brand-red">{current.relation}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {current.project && (
              <span className="border border-brand-maroon/25 px-2 py-1 font-sans text-xs text-brand-maroon">
                {strings.project}: {current.project}
              </span>
            )}
            {current.href && (
              <a
                href={current.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-semibold text-brand-maroon underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red"
              >
                {strings.verify}
              </a>
            )}
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
