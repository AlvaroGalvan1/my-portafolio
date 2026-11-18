import { createElement } from "react";
import type { AgentId } from "./agents.content";

// A1–A3 are the owner's own characters, one per project, each a single
// dependency-free custom element: <fuego-agent>, <hunter-agent>,
// <dwayne-agent>. The sources live in each repo's portfolio/ folder
// (branch claude/quirky-hawking-k9s8iz) and are copied as they are into
// public/wall/agents/; AgentsTable loads them.
//
// All three share one 480×480 stage with the feet on y = 425, so the feet
// sit 88.5% of the way down the box. They hop by themselves on hover and
// click.
export const FEET = 425 / 480;

export const AGENT_SCRIPTS: Record<AgentId, string> = {
  fuego: "/wall/agents/fuego-agent.js",
  hunter: "/wall/agents/hunter-agent.js",
  dwayne: "/wall/agents/dwayne-agent.js",
};

export default function Character({ id }: { id: AgentId }) {
  return createElement(`${id}-agent`, { className: "block h-full w-full" });
}
