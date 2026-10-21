import type { Locale } from "@/content/i18n";
import Icon from "@/components/ui/Icon";
import { areasContent } from "./areas.content";

export default function Areas({ lang }: { lang: Locale }) {
  const copy = areasContent[lang];
  const areas = [
    {
      name: copy.grid,
      icon: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    },
    {
      name: copy.fire,
      icon: <path d="M12 2c.5 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5.5.5 2 1.5 3 2.5 3.5.5-3-.5-6 0-9z" />,
    },
    {
      name: copy.data,
      icon: (
        <>
          <circle cx="12" cy="12" r="3" />
          <circle cx="4" cy="5" r="2" />
          <circle cx="20" cy="5" r="2" />
          <circle cx="12" cy="21" r="2" />
          <path d="M5.5 6.5 9.8 10M18.5 6.5 14.2 10M12 15v4" />
        </>
      ),
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-16">
      <ul className="mx-auto grid max-w-3xl grid-cols-3 gap-2 sm:gap-8">
        {areas.map(({ name, icon }) => (
          <li
            key={name}
            className="flex flex-col items-center gap-3 text-center font-sans text-sm font-bold text-brand-maroon sm:text-xl"
          >
            <Icon className="h-10 w-10 text-brand-maroon sm:h-14 sm:w-14">{icon}</Icon>
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
