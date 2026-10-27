"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import type { Locale } from "@/content/i18n";
import { CONTACT_EMAIL } from "@/content/socials";
import { contactContent } from "./contact.content";

const FIELD =
  "w-full rounded-lg border-2 border-brand-maroon/30 bg-white px-3 py-2.5 font-sans text-base text-brand-maroon focus:border-brand-maroon focus:outline-none";

// Until the sending decision is made (its own issue), Send hands the
// message to the visitor's mail app, filled in. That is the whole backend.
export default function Contact({ lang }: { lang: Locale }) {
  const copy = contactContent[lang];
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const problem = String(data.get("problem") ?? "");
    const body = `${problem}\n\n— ${name} <${email}>`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      copy.subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-brand-cream p-6 text-brand-maroon">
      <label className="flex flex-col gap-1.5 font-sans text-sm font-semibold">
        {copy.name}
        <input name="name" required autoComplete="name" className={FIELD} />
      </label>
      <label className="flex flex-col gap-1.5 font-sans text-sm font-semibold">
        {copy.email}
        <input name="email" type="email" required autoComplete="email" className={FIELD} />
      </label>
      <label className="flex flex-col gap-1.5 font-sans text-sm font-semibold">
        {copy.problem}
        <textarea name="problem" required rows={5} className={FIELD} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit">{copy.send}</Button>
        {sent && (
          <p className="font-sans text-sm">
            {copy.fallback}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
