"use client";

import { useEffect, useState } from "react";
import Character from "./Characters";
import type { AgentId } from "./agents.content";

type Agent = { id: AgentId; name: string; tag: string; does: string };

// A1–A3 standing on the tabletop. Clicking one opens a speech bubble with
// what it does; clicking it again, another one, the table or Esc closes it.
// No physics yet: picking up, throwing and dropping come later.
export default function AgentsTable({ agents, hint, close }: { agents: Agent[]; hint: string; close: string }) {
  const [open, setOpen] = useState<AgentId | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative h-80 sm:h-full" onClick={() => setOpen(null)}>
      <p className="absolute right-4 top-0 text-[10px] uppercase tracking-[0.16em] opacity-45">{hint}</p>

      <ul className="absolute inset-x-[8%] bottom-[16%] z-[1] flex items-end justify-around">
        {agents.map((agent, i) => {
          const isOpen = open === agent.id;
          // The outer two open their bubble inward, so it never runs off the table.
          const side = i === 0 ? "left-0" : i === agents.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2";
          const tail = i === 0 ? "left-[1.6rem]" : i === agents.length - 1 ? "right-[1.6rem]" : "left-1/2 -translate-x-1/2";
          return (
            <li key={agent.id} className="relative flex flex-col items-center">
              {isOpen && (
                <div
                  id={`agent-${agent.id}-says`}
                  role="status"
                  className={`absolute bottom-[calc(100%+10px)] ${side} z-10 w-[min(15rem,62vw)] rounded-2xl border-2 border-[#1c1c1c] bg-white px-3.5 py-3 text-left shadow-[3px_3px_0_#1c1c1c] motion-safe:animate-[agent-pop_.18s_ease-out]`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="font-[family-name:var(--font-display)] text-sm">{agent.name}</span>
                    <span className="text-[9px] uppercase tracking-[0.14em] opacity-55">{agent.tag}</span>
                  </div>
                  <p className="text-[12px] leading-snug">{agent.does}</p>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    aria-label={close}
                    className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full border-2 border-[#1c1c1c] bg-white text-[11px] leading-none"
                  >
                    ×
                  </button>
                  {/* The bubble's tail, pointing down at the speaker. */}
                  <span
                    aria-hidden
                    className={`absolute -bottom-[9px] ${tail} size-4 rotate-45 border-b-2 border-r-2 border-[#1c1c1c] bg-white`}
                  />
                </div>
              )}
              <button
                type="button"
                aria-expanded={isOpen}
                aria-describedby={isOpen ? `agent-${agent.id}-says` : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen(isOpen ? null : agent.id);
                }}
                className={`h-[min(7.5rem,19vh)] origin-bottom rounded-lg outline-none transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[#1c1c1c] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4f1ec] motion-reduce:transition-none ${
                  isOpen ? "-translate-y-1 scale-105" : "hover:-translate-y-1 hover:-rotate-2"
                }`}
              >
                <Character id={agent.id} />
                <span className="sr-only">{agent.name}</span>
              </button>
              <span className="mt-2 text-[11px] font-semibold tracking-wide">{agent.name}</span>
            </li>
          );
        })}
      </ul>
      {/* The edge of the table the agents stand on. */}
      <div className="pointer-events-none absolute inset-x-[6%] bottom-[calc(16%+1.55rem)] -z-0 h-0.5 rounded-full bg-current opacity-80" />
    </div>
  );
}
