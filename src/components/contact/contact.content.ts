import type { Locale } from "@/content/i18n";

// Copy for this section, en + es.
export const contactContent: Record<Locale, {
  name: string;
  email: string;
  problem: string;
  send: string;
  subject: string;
  fallback: string;
}> = {
  en: {
    name: "Name",
    email: "Email",
    problem: "What's the problem?",
    send: "Send",
    subject: "Project inquiry",
    fallback: "Nothing opened? Write to",
  },
  es: {
    name: "Nombre",
    email: "Correo",
    problem: "¿Cuál es el problema?",
    send: "Enviar",
    subject: "Consulta de proyecto",
    fallback: "¿No se abrió nada? Escribe a",
  },
};
