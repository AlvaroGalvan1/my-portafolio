import AgentsTable from "./AgentsTable";
import { AGENTS, AGENT_STRINGS } from "./agents.content";
import { say, type Locale } from "@/content/i18n";

// A · Agents. Three characters standing on a plain tabletop: A1 Fuego,
// A2 Hunter, A3 Dwayne. Click one and it says what it does. Physics (pick
// up, throw, drop) comes later; the characters are placeholders for the
// owner's own (see Characters.tsx).
export default function AgentsSection({ locale }: { locale: Locale }) {
  return (
    <AgentsTable
      agents={AGENTS.map((a) => ({ id: a.id, name: a.name, tag: say(a.tag, locale), does: say(a.does, locale) }))}
      hint={say(AGENT_STRINGS.hint, locale)}
      close={say(AGENT_STRINGS.close, locale)}
    />
  );
}
