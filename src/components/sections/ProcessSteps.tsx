"use client";

import { useState } from "react";

export type Step = { title: string; body: string };

// The steps as a vertical rail: numbered dots on one line, the open step's
// body under its title, the rest showing their titles only. One open at a
// time, so the rail reads as "you are here" rather than a wall of copy.
// Each title is a button with aria-expanded: keyboard and screen readers
// get the same open/closed state the mouse does. Hover opens too, since
// on a pointer the rail is something to run your eye and cursor down.
export default function ProcessSteps({ steps }: { steps: Step[] }) {
  const [open, setOpen] = useState(0);

  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const on = i === open;
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0 sm:gap-7">
            {/* The rail between this dot and the next. */}
            {!last && (
              <span aria-hidden className="absolute left-[1.15rem] top-10 bottom-0 w-px bg-brand-cream/25" />
            )}
            <span
              aria-hidden
              className={`flex h-[2.3rem] w-[2.3rem] shrink-0 items-center justify-center rounded-full border-2 font-[family-name:var(--font-display)] text-base transition-colors ${
                on
                  ? "border-brand-orange bg-brand-orange text-brand-maroon"
                  : "border-brand-cream/30 text-brand-cream/60"
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <h3>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`process-step-${i}`}
                  onClick={() => setOpen(i)}
                  onMouseEnter={() => setOpen(i)}
                  className={`text-left font-[family-name:var(--font-display)] text-2xl uppercase leading-tight transition-colors sm:text-3xl ${
                    on ? "text-brand-cream" : "text-brand-cream/45 hover:text-brand-cream/75"
                  }`}
                >
                  {step.title}
                </button>
              </h3>
              <p
                id={`process-step-${i}`}
                hidden={!on}
                className="mt-2 max-w-md font-sans text-base leading-snug text-brand-cream/80"
              >
                {step.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
