"use client";

import { SITE_NAME } from "@/content/site";

// "Download fun CV" — the page itself, printed.
//
// There is no PDF generated anywhere and that's the point: the CV and the
// site are the same document, so they can't drift. The @media print block in
// globals.css is the second half of this button — it drops the nav, the
// video, the map and the horizontal Wall, brings out the bullets and the
// campus list that the screen hides, and lays the rest out as pages. What
// the visitor gets from their browser's "Save as PDF" is a real CV.
//
// window.print(), not a link to a file. Every browser's print dialog offers
// "Save as PDF" as a destination, which means this works with no dependency,
// no server rendering step, and nothing to keep in sync.
export default function PrintCvButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        // The print dialog seeds the filename from document.title, so a page
        // titled "Álvaro Galván — GeoAI…" would save as exactly that. Swap
        // it for the CV's name, print, then put the page's own title back.
        //
        // The restore can't wait for the dialog to close: `print()` blocks
        // in some browsers and returns immediately in others, and there is
        // no reliable "printing finished" event. `afterprint` is that event
        // where it exists, and the timeout is the fallback for where it
        // doesn't — restoring early is harmless, since the dialog has
        // already taken the title by then.
        const pageTitle = document.title;
        const restore = () => {
          document.title = pageTitle;
          window.removeEventListener("afterprint", restore);
        };

        document.title = `${SITE_NAME} — CV`;
        window.addEventListener("afterprint", restore);
        window.setTimeout(restore, 1000);
        window.print();
      }}
      className={className}
    >
      Download fun CV
    </button>
  );
}
