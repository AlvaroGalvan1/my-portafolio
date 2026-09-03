"use client";

import { useEffect, useState } from "react";
import { CONTACT_OPEN_EVENT } from "./ContactTrigger";
import { Z } from "@/lib/layers";
import { socials, CALENDLY_URL } from "@/content/socials";

// Sign up free at formspree.io, create a form, and paste its endpoint here
// (looks like "https://formspree.io/f/xxxxabcd"). Until this is set, the
// form falls back to opening the visitor's email client instead — it still
// works today, it just needs them to hit send themselves rather than
// landing straight in your inbox.
const FORMSPREE_ENDPOINT = "";

// Public contact email — used for the "prefer to chat directly" link and
// as the mailto fallback below. A personal address on purpose: the Minerva
// .edu one won't outlive enrollment there, and this page should keep
// working after it stops resolving.
const CONTACT_EMAIL = "alvaroemiliogalvansandoval@gmail.com";

type Status = "idle" | "sending" | "sent" | "opened-email-client" | "error";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fields, setFields] = useState({ name: "", subject: "", message: "" });

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(CONTACT_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(CONTACT_OPEN_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  if (!open) return null;

  const mailtoHref = `mailto:${CONTACT_EMAIL}${
    fields.subject || fields.message
      ? `?subject=${encodeURIComponent(fields.subject || "Portfolio contact")}&body=${encodeURIComponent(
          `${fields.message}${fields.name ? `\n\n— ${fields.name}` : ""}`,
        )}`
      : ""
  }`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!FORMSPREE_ENDPOINT) {
      // No backend configured yet — the next best thing is handing this
      // straight to the visitor's own email client, prefilled.
      window.location.href = mailtoHref;
      setStatus("opened-email-client");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Form submission failed");
      setStatus("sent");
    } catch {
      // Backend hiccup — same fallback as having no endpoint at all.
      window.location.href = mailtoHref;
      setStatus("opened-email-client");
    }
  }

  return (
    <div
      style={{ zIndex: Z.MODAL }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border-4 border-brand-maroon bg-brand-cream p-10 font-sans sm:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-5 top-5 text-3xl font-bold text-brand-maroon"
        >
          &times;
        </button>

        <h2 className="font-[family-name:var(--font-display)] text-4xl text-brand-red sm:text-5xl">
          Get In Touch
        </h2>

        {/* Booking first: for most people "grab 30 minutes" is a lower bar
            than composing a message, so it leads. The socials sit beside it
            as icons rather than a second row of text buttons, so they read
            as secondary without being hidden. */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-brand-red bg-brand-red px-6 py-3 font-sans text-base font-semibold text-white transition-colors hover:bg-transparent hover:text-brand-red"
          >
            Book 30 minutes ↗
          </a>

          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                title={s.name}
                className="flex h-11 w-11 items-center justify-center border-2 border-brand-red/30 text-brand-red transition-colors hover:border-brand-red hover:bg-brand-red hover:text-brand-cream"
              >
                <svg
                  role="img"
                  aria-hidden
                  viewBox={s.viewBox ?? "0 0 24 24"}
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* The address is spelled out rather than hidden behind "email me":
            plenty of people would rather copy it into their own client than
            hand the page a click. Wraps at the `break-all` because the
            local part alone is 28 characters and overflowed on a phone. */}
        <p className="mt-4 text-sm text-brand-maroon">
          Prefer to chat directly?{" "}
          <a
            href={mailtoHref}
            className="font-semibold underline underline-offset-2 break-all"
          >
            Email me at {CONTACT_EMAIL}
          </a>
          .
        </p>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
            className="border-2 border-brand-maroon bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={fields.subject}
            onChange={(e) => setFields((f) => ({ ...f, subject: e.target.value }))}
            className="border-2 border-brand-maroon bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows={6}
            value={fields.message}
            onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
            className="border-2 border-brand-maroon bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="border-2 border-brand-red bg-brand-red px-6 py-3 font-semibold text-white hover:bg-transparent hover:text-brand-red disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
          {status === "sent" && (
            <p className="text-sm font-semibold text-brand-maroon">Sent — thanks, I&apos;ll reply soon.</p>
          )}
          {status === "opened-email-client" && (
            <p className="text-sm font-semibold text-brand-maroon">
              Opened your email client with this filled in — hit send there to reach me.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm font-semibold text-brand-red">
              Something went wrong — try the &quot;email me directly&quot; link above instead.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
