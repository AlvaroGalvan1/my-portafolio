/** A key word in brand orange. Orange marks takeaways and nothing else. */
export default function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-brand-orange">{children}</span>;
}
