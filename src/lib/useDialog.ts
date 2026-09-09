"use client";

import { useEffect, useRef } from "react";

// What a browser gives you for free with <dialog showModal()> and what this
// page's two overlays — the Wall's lightbox and the contact form — were
// doing without: Escape to close, focus moved in on open and put back on
// close, Tab kept inside, and the page behind held still.
//
// The page behind not holding still was the visible one: opening a lightbox
// over the Wall and scrolling scrolled the *page*, so closing it left the
// visitor somewhere else entirely. The rest is only visible to a keyboard —
// Tab from the last field of the contact form used to walk out of the panel
// and into the nav links behind it, still hidden under the overlay.
//
// Not <dialog> itself: both overlays are already positioned, layered through
// Z, and animated as plain elements, and top-layer promotion would take them
// out of that system for behaviour that is a dozen lines to write here.
//
// Returns a ref to put on the element that *is* the dialog — the panel, not
// the backdrop.

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "iframe",
  "video[controls]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  // Both callers pass `onClose` as an inline closure, so it's a new function
  // on every parent render. Held in a ref it can stay out of the effect's
  // dependencies — as a dependency the effect would tear down and set up on
  // every render of the parent, which means re-grabbing focus and flickering
  // the scroll lock while the dialog just sits there open.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    if (!node) return;

    // Whatever was focused when this opened — the tile, the Contact button —
    // so focus can go back there rather than to the top of the document.
    const opener = document.activeElement as HTMLElement | null;

    // Everything currently laid out and focusable inside the dialog. Recomputed
    // per keystroke rather than cached: the lightbox's post pane swaps its
    // thumbnails, and the contact form grows a status line after sending.
    const focusable = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );

    // Focus the first control if there is one, otherwise the panel itself —
    // which is why callers give it tabIndex={-1}. Landing on the panel means
    // a screen reader announces the dialog's own label before its contents.
    (focusable()[0] ?? node).focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      // Wrapping in both directions. The `active === node` case catches the
      // shift+Tab that comes straight after opening, when focus is still on
      // the panel and there is nothing before it to go back to.
      if (e.shiftKey && (active === first || active === node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Scroll lock. The padding compensates for the scrollbar the lock
    // removes — without it the whole page jumps sideways by ~15px on a
    // desktop the moment an overlay opens.
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      opener?.focus?.();
    };
  }, [open]);

  return ref;
}
