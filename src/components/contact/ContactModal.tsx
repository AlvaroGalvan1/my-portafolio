"use client";

import { useEffect, useState } from "react";
import { CONTACT_OPEN_EVENT } from "./ContactTrigger";
import { Z } from "@/lib/layers";
import { useDialog } from "@/lib/useDialog";
import { socials, CALENDLY_URL, CONTACT_EMAIL } from "@/content/socials";
import type { UiStrings } from "@/content/ui";

// Where submissions go. Set NEXT_PUBLIC_FORMSPREE_ENDPOINT (see .env.example
// for how to get one) and messages land in your inbox without the visitor
// leaving the page. It's an env var rather than a constant so the endpoint
// can be set per-environment — and rotated if it ever gets abused — without
// a code change.
//
// Unset, the form still works: it hands the message to the visitor's own
// email client, prefilled, and they hit send there. That's the fallback,
// not the plan — it loses anyone without a configured mail client.
//
// NEXT_PUBLIC_ is required: this runs in the browser. That's fine here —
// a Formspree form ID is a public endpoint by design, the same way a
// mailto: address is.
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "opened-email-client" | "error";

export default function ContactModal({ strings }: { strings: UiStrings["contact"] }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(CONTACT_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(CONTACT_OPEN_EVENT, handleOpen);
  }, []);

  // Escape, focus in and back out, Tab containment and the scroll lock all
  // come from here — see lib/useDialog.ts. Called before the early return
  // below, as every hook has to be.
  const dialogRef = useDialog(open, () => setOpen(false));

  if (!open) return null;

  const mailtoHref = `mailto:${CONTACT_EMAIL}${
    fields.subject || fields.message
      ? `?subject=${encodeURIComponent(fields.subject || strings.defaultSubject)}&body=${encodeURIComponent(
          `${fields.message}${fields.name ? `\n\n— ${fields.name}` : ""}${
            fields.email ? ` <${fields.email}>` : ""
          }`,
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
        // `email` is the one field name Formspree treats specially: it sets
        // the notification's reply-to, so hitting reply in your inbox
        // answers the sender rather than Formspree.
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          subject: fields.subject || strings.defaultSubject,
          message: fields.message,
        }),
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
      {/* The cream panel is the dialog; the element above it is only the
          backdrop. Named by the heading inside it rather than by a duplicate
          aria-label, so the two can never drift apart. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-heading"
        tabIndex={-1}
        className="relative max-h-[90svh] w-full max-w-2xl overflow-y-auto border-4 border-brand-maroon bg-brand-cream p-10 font-sans focus:outline-none sm:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={strings.close}
          className="absolute right-5 top-5 text-3xl font-bold text-brand-maroon"
        >
          &times;
        </button>

        <h2
          id="contact-heading"
          className="font-[family-name:var(--font-display)] text-4xl text-brand-red sm:text-5xl"
        >
          {strings.heading}
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
            {strings.book}
          </a>

          <div className="flex items-center gap-2">
            {socials.filter((s) => !s.footerOnly).map((s) => (
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
          {strings.preferDirect}{" "}
          <a
            href={mailtoHref}
            className="font-semibold underline underline-offset-2 break-all"
          >
            {strings.emailMeAt} {CONTACT_EMAIL}
          </a>
          .
        </p>

        {/* Every field carries a real <label>, visually hidden. The design
            wants four unadorned boxes and gets to keep them, but a
            placeholder is not a label: it disappears the moment you type, so
            a half-filled form loses the only clue to what each box was, and
            it's the accessible name of last resort — some screen readers
            skip it, and none of them treat it as a name that persists.
            `sr-only` keeps them in the accessibility tree and out of the
            layout.

            The autoComplete values are what let a browser fill name and
            email from the visitor's own profile in one gesture, which is
            most of the reason a contact form gets finished at all. */}
        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <label htmlFor="contact-name" className="sr-only">
            {strings.name}
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder={strings.name}
            required
            value={fields.name}
            onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
            className="border-2 border-brand-maroon bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500"
          />
          {/* Required, and required for a reason: without a return address
              a submission arrives as a message you can read and can't
              answer. Formspree also reads this field by name to set the
              notification's reply-to. */}
          <label htmlFor="contact-email" className="sr-only">
            {strings.email}
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder={strings.email}
            required
            value={fields.email}
            onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
            className="border-2 border-brand-maroon bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500"
          />
          <label htmlFor="contact-subject" className="sr-only">
            {strings.subject}
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            placeholder={strings.subject}
            value={fields.subject}
            onChange={(e) => setFields((f) => ({ ...f, subject: e.target.value }))}
            className="border-2 border-brand-maroon bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500"
          />
          <label htmlFor="contact-message" className="sr-only">
            {strings.message}
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder={strings.message}
            rows={6}
            required
            value={fields.message}
            onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
            className="border-2 border-brand-maroon bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="border-2 border-brand-red bg-brand-red px-6 py-3 font-semibold text-white hover:bg-transparent hover:text-brand-red disabled:opacity-60"
          >
            {status === "sending" ? strings.sending : strings.send}
          </button>
          {status === "sent" && (
            <p className="text-sm font-semibold text-brand-maroon">{strings.sent}</p>
          )}
          {status === "opened-email-client" && (
            <p className="text-sm font-semibold text-brand-maroon">
              {strings.openedClient}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm font-semibold text-brand-red">{strings.failed}</p>
          )}
        </form>
      </div>
    </div>
  );
}
