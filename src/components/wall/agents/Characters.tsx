import type { AgentId } from "./agents.content";

// Placeholder characters for A1–A3, drawn in the tabletop's one ink with one
// colour each. The owner is designing the real ones; when they land, each
// is a swap of one function here. viewBox 100×140, feet on the bottom edge.
const INK = "#1c1c1c";

function Eyes({ y = 62, gap = 14 }: { y?: number; gap?: number }) {
  return (
    <g fill={INK}>
      <circle cx={50 - gap} cy={y} r="4.2" />
      <circle cx={50 + gap} cy={y} r="4.2" />
      <circle cx={50 - gap + 1.4} cy={y - 1.4} r="1.3" fill="#fff" />
      <circle cx={50 + gap + 1.4} cy={y - 1.4} r="1.3" fill="#fff" />
    </g>
  );
}

function Feet({ color }: { color: string }) {
  return (
    <g fill={color} stroke={INK} strokeWidth="3">
      <rect x="30" y="126" width="14" height="11" rx="5.5" />
      <rect x="56" y="126" width="14" height="11" rx="5.5" />
    </g>
  );
}

function Fuego() {
  return (
    <>
      <Feet color="#f5821f" />
      {/* A flame: a teardrop with a flicker at the top. */}
      <path
        d="M50 8 C58 26 76 34 80 62 C84 92 70 128 50 128 C30 128 16 92 20 66 C23 48 34 44 36 30 C44 38 46 46 46 52 C50 40 52 24 50 8 Z"
        fill="#f5821f"
        stroke={INK}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path d="M50 74 C58 84 60 100 50 112 C40 100 42 84 50 74 Z" fill="#ffc93c" />
      <Eyes y={86} gap={12} />
      <path d="M44 98 Q50 103 56 98" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
    </>
  );
}

function Hunter() {
  return (
    <>
      <Feet color="#ffc93c" />
      {/* A round scout with a cap and a star on it. */}
      <rect x="18" y="40" width="64" height="88" rx="32" fill="#ffc93c" stroke={INK} strokeWidth="3.2" />
      <path d="M22 50 Q50 18 78 50 Z" fill={INK} />
      <path d="M70 48 L94 50" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path
        d="M50 27 l3 6.2 6.8 1 -4.9 4.8 1.2 6.8 -6.1 -3.2 -6.1 3.2 1.2 -6.8 -4.9 -4.8 6.8 -1 Z"
        fill="#ffc93c"
      />
      <Eyes y={72} />
      <path d="M42 90 Q50 96 58 90" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
    </>
  );
}

function Dwayne() {
  return (
    <>
      <Feet color="#8ec5ff" />
      {/* A box with an antenna that sparks: the power grid. */}
      <path d="M50 36 L50 22" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M53 4 L43 16 L51 16 L46 27 L58 13 L50 13 Z" fill="#ffc93c" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="16" y="36" width="68" height="92" rx="16" fill="#8ec5ff" stroke={INK} strokeWidth="3.2" />
      <rect x="27" y="50" width="46" height="34" rx="9" fill="#fff" stroke={INK} strokeWidth="2.6" />
      <Eyes y={67} gap={11} />
      <path d="M36 104 L44 98 L50 104 L56 98 L64 104" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const DRAW: Record<AgentId, () => React.ReactNode> = { fuego: Fuego, hunter: Hunter, dwayne: Dwayne };

export default function Character({ id }: { id: AgentId }) {
  const Draw = DRAW[id];
  return (
    <svg viewBox="0 0 100 140" aria-hidden className="block h-full w-auto overflow-visible">
      <Draw />
    </svg>
  );
}
