import type { Phrase } from "@/content/i18n";

// A · Agents. What each one says when clicked: the basics only, from each
// project's own README. Their full personalities come after v1.
export type AgentId = "fuego" | "hunter" | "dwayne";

export const AGENTS: { id: AgentId; slot: string; name: string; tag: Phrase; does: Phrase }[] = [
  {
    id: "fuego",
    slot: "A1",
    name: "Fuego",
    tag: { en: "Wildfire", es: "Incendios" },
    does: {
      en: "I simulate wildfires: how a fire spreads, and where the land is likely to burn.",
      es: "Simulo incendios: cómo se propaga el fuego y dónde es probable que queme.",
    },
  },
  {
    id: "hunter",
    slot: "A2",
    name: "Hunter",
    tag: { en: "Jobs", es: "Empleo" },
    does: {
      en: "I find jobs that fit you, walk you through each one, and learn from every application.",
      es: "Encuentro trabajos a tu medida, te guío en cada uno y aprendo de cada solicitud.",
    },
  },
  {
    id: "dwayne",
    slot: "A3",
    name: "Dwayne",
    tag: { en: "Power grid", es: "Red eléctrica" },
    does: {
      en: "I study power-grid feeders on a local, sandboxed machine, and every step I take is checked.",
      es: "Estudio redes eléctricas de distribución en una máquina local y aislada, y cada paso se verifica.",
    },
  },
];

export const AGENT_STRINGS = {
  hint: { en: "Tap one", es: "Toca uno" } as Phrase,
  close: { en: "Close", es: "Cerrar" } as Phrase,
};
