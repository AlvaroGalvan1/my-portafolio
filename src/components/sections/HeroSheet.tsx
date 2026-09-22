"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Z } from "@/lib/layers";
import { useDialog } from "@/lib/useDialog";

// The full-screen sheet the hero's plate opens: the header, the close, the
// maroon wash behind, and the focus handling, around whatever it holds.
// About you is the one sheet today; another plate would reuse this shell.
//
// Portalled to <body>, so a transform, filter or stacking context on any
// section it is opened from can never pin it to that section instead of
// the screen.
export default function HeroSheet({
  open,
  onClose,
  id,
  title,
  subtitle,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Prefix for the heading's id, which labels the dialog. */
  id: string;
  title: string;
  subtitle: string;
  closeLabel: string;
  children: ReactNode;
}) {
  // Escape, focus in and back out, Tab containment and the scroll lock all
  // come from here — see lib/useDialog.ts. Called before the early return
  // below, as every hook has to be.
  const dialogRef = useDialog(open, onClose);

  // `open` only turns true on a click, so `document` exists by then.
  if (!open) return null;

  return createPortal(
    <div
      style={{ zIndex: Z.MODAL }}
      className="fixed inset-0 bg-brand-maroon/85 px-0 py-0 sm:px-6 sm:py-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-heading`}
        tabIndex={-1}
        className="mx-auto flex h-full max-w-5xl flex-col border-brand-maroon bg-brand-cream focus:outline-none sm:border-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* The header stays put while the content scrolls under it: the
            close button on a full-screen overlay has to be reachable from
            anywhere, and "scroll back to the top to get out" is how a
            panel becomes a trap on a phone. */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b-2 border-brand-red/30 bg-brand-cream px-5 py-4 sm:px-8 sm:py-5">
          <div>
            <h2
              id={`${id}-heading`}
              className="font-[family-name:var(--font-display)] text-2xl text-brand-maroon sm:text-3xl"
            >
              {title}
            </h2>
            <p className="eyebrow mt-1 text-brand-red">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            title={closeLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-brand-maroon text-brand-maroon transition-colors hover:bg-brand-maroon hover:text-brand-cream"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
