import { hand } from "../handFont";

// Note B · a handwritten note with an Excalidraw-style arrow curving up
// from the bottom-left into B2. The arrow follows the words, so a longer
// translation pushes it right rather than running into it; its height
// (the note box's) is what carries the tip over B2's bottom edge. The
// stroke is drawn twice, the second pass a hair off the first, the way a
// quick pen line doubles back on itself.
export default function BuiltThisNote({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none flex items-end gap-[2px] ${className}`}>
      <p className={`${hand.className} mb-[-2px] -rotate-[5deg] whitespace-nowrap text-[22px] font-bold leading-none`}>
        {text}
      </p>
      <svg
        viewBox="112 2 94 70"
        className="h-full w-auto shrink-0 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path strokeWidth="2.2" d="M120 64c14 1 32-3 47-13 13-9 22-21 29-36 1-2 2-5 3-7" />
        <path strokeWidth="1.1" opacity=".55" d="M121 66c15-1 33-5 47-15 12-9 21-22 28-36 2-3 2-5 3-8" />
        {/* the head: two strokes back from the tip */}
        <path strokeWidth="2.2" d="M199 8c-6 3-11 5-17 9M199 8c1 7 1 13 0 19" />
      </svg>
    </div>
  );
}
