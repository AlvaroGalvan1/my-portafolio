"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The <footer> element, publishing its own height as `--footer-h` on the
// root. Services reads it so that the last yellow section and this one
// together are exactly one screen, whatever the footer happens to wrap to
// at this width. It can't be a constant the way `--nav-h` is: the three
// purposes stack below `sm` and reflow with the text, in both languages.
//
// Until this runs, `--footer-h` is unset and Services falls back to 0 —
// taller than it should be, never shorter, and invisible anyway because a
// reader arrives at the top of the page.
export default function MeasuredFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty("--footer-h", `${entry.borderBoxSize[0].blockSize}px`);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--footer-h");
    };
  }, []);

  return (
    <footer ref={ref} className={className}>
      {children}
    </footer>
  );
}
