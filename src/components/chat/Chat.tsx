import Button from "@/components/ui/Button";
import type { Locale } from "@/content/i18n";
import { CALENDLY_URL } from "@/content/socials";
import { chatContent } from "./chat.content";

export default function Chat({ lang }: { lang: Locale }) {
  const copy = chatContent[lang];
  return (
    <div className="flex flex-col justify-between gap-6 rounded-2xl bg-brand-cream p-6 text-brand-maroon">
      <div>
        <p className="font-[family-name:var(--font-display)] text-2xl leading-tight">{copy.question}</p>
        <p className="mt-2 font-sans text-base font-semibold">{copy.note}</p>
      </div>
      <div>
        <Button href={CALENDLY_URL}>{copy.book}</Button>
      </div>
    </div>
  );
}
