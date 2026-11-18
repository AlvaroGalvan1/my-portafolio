import Slot from "../Slot";
import type { Locale } from "@/content/i18n";

// B · Agents. Three characters standing on the ground: Fuego, Hunter,
// Dwayne. Physics (pick up, throw, drop) comes later.
const AGENTS = [
  { id: "B1", name: "Fuego" },
  { id: "B2", name: "Hunter" },
  { id: "B3", name: "Dwayne" },
];

export default function AgentsSection({ locale: _locale }: { locale: Locale }) {
  return (
    <div className="relative h-full">
      <div className="absolute inset-x-[8%] bottom-[30%] flex items-end justify-around">
        {AGENTS.map((agent) => (
          <Slot
            key={agent.id}
            id={agent.id}
            label={agent.name}
            rounded="rounded-t-full"
            className="h-[min(9rem,22vh)] w-[min(5rem,12vh)]"
          />
        ))}
      </div>
      {/* The ground the agents stand on. */}
      <div className="absolute inset-x-[8%] bottom-[30%] h-0.5 bg-current opacity-80" />
    </div>
  );
}
