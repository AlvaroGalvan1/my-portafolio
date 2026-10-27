"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/content/i18n";
import { stepsContent } from "./steps.content";

const AUTO_MS = 4500;

// The active step changes three ways: tap or click a step, move focus to
// it, or just wait; it advances by itself until the visitor takes over,
// and never moves by itself under reduced motion. The titles are always
// shown; the number beside the active step lights up.
export default function Steps({ lang }: { lang: Locale }) {
  const copy = stepsContent[lang];
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % copy.steps.length), AUTO_MS);
    return () => clearInterval(id);
  }, [auto, copy.steps.length]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section className="px-4 pt-10 sm:px-16">
      <div className="mx-auto grid max-w-5xl gap-8 rounded-2xl bg-neutral-900 p-6 text-brand-cream sm:p-8 md:grid-cols-2">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase leading-tight sm:text-4xl">
            {copy.heading}
          </h1>
          <p className="mt-3 max-w-sm font-sans text-base text-brand-cream/80">{copy.line}</p>
        </div>
        <ol aria-label={copy.label} className="flex flex-col gap-1 font-sans">
          {copy.steps.map((title, i) => {
            const on = i === active;
            return (
              <li key={title}>
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onClick={() => pick(i)}
                  onFocus={() => pick(i)}
                  className={`flex min-h-11 w-full items-center gap-3 py-1.5 text-left text-base font-bold uppercase transition-colors ${
                    on ? "text-brand-cream" : "text-brand-cream/55 hover:text-brand-cream"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`grid size-7 flex-none place-items-center rounded-full border-2 text-xs ${
                      on ? "border-brand-orange bg-brand-orange text-neutral-900" : "border-brand-cream/30"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {title}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
