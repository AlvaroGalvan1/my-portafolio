"use client";

// Catches any render/runtime error thrown by page.tsx or below (a bad data
// entry, a third-party script failing, etc.) so a single broken section
// can't take down the whole page with a blank screen or the framework's
// default error page.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-cream px-6 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-brand-red">
        Something broke
      </h1>
      <p className="max-w-md text-brand-maroon">
        This part of the page hit an error. Try reloading — if it keeps
        happening, the underlying issue needs a fix, not a retry.
      </p>
      <button
        type="button"
        onClick={reset}
        className="border-2 border-brand-maroon px-4 py-2 font-medium uppercase tracking-wide text-brand-maroon transition-colors hover:bg-brand-maroon hover:text-brand-cream"
      >
        Try again
      </button>
    </div>
  );
}
