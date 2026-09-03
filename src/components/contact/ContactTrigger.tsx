"use client";

export const CONTACT_OPEN_EVENT = "contact:open";

export default function ContactTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONTACT_OPEN_EVENT))}
      className={className}
    >
      {children}
    </button>
  );
}
