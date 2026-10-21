"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import type { Locale } from "@/content/i18n";
import { stepsContent } from "./steps.content";

// One placeholder visual per step: a chat bubble, a compass, a wrench, a
// loop. Replace with real art in a design pass.
const VISUALS = [
  <path key="talk" d="M4 5h16v11H9l-5 4z" />,
  <g key="explore">
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </g>,
  <path key="build" d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z" />,
  <g key="test">
    <path d="M20 12a8 8 0 1 1-2.3-5.7" />
    <path d="M20 4v4h-4" />
  </g>,
];

const AUTO_MS = 4500;

// The active step changes three ways: tap or click a step, move focus to
// it, or just wait; it advances by itself until the visitor takes over,
// and never moves by itself under reduced motion. The titles are always
// shown; only the little visual follows the active step.
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
                {on && (
                  <div aria-hidden className="mb-2 ml-10 flex h-16 w-24 items-center justify-center rounded-lg bg-white/10 text-brand-orange">
                    <Icon className="h-9 w-9">{VISUALS[i]}</Icon>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
