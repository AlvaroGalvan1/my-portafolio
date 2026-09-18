import type { Locale } from "./i18n";

// Every string the page says that isn't content.
//
// The split against `content/` is deliberate and worth keeping: content is
// what the site is ABOUT (jobs, places, services, pieces on the Wall) and
// lives with its data, bilingual field by bilingual field. This file is
// what the site SAYS AROUND that content — button labels, headings, form
// placeholders, the words a screen reader hears. Those have no data of
// their own to live next to, and a hundred of them scattered through
// twenty components is how half a page ends up untranslated.
//
// `es` is typed as `UiStrings`, so a key added to `en` and forgotten in
// `es` fails the build rather than rendering English inside a Spanish page.
// That check is the entire reason this is TypeScript and not JSON.

const en = {
  nav: {
    home: "Home",
    background: "Background",
    wall: "My Wall",
    // The bar's one action, and the page's primary. It used to be "Work
    // with me" pointing at a section further down; it now says the thing
    // it does and opens the contact panel directly, which is one fewer
    // scroll between deciding and doing.
    cta: "Let's work together",
    // The same action, in the words that fit a 390px bar. The full label
    // plus three section links plus a language toggle overflowed the right
    // edge of a phone — the button was literally cut in half by the
    // viewport. Shortened rather than hidden: the one thing this bar is
    // for does not get to disappear on the device most people read it on.
    ctaShort: "Let's talk",
    language: "Language",
  },

  hero: {
    aboutMe: "About me",
    aboutYou: "About you",
    // ── The invitation on the artwork ───────────────────────────────
    // The question is the button. Three versions were tried and the first
    // two both failed the same way: "About you" alone says nothing about
    // what pressing it does, and a three-line paragraph explaining it is
    // an explanation where a hook belongs.
    //
    // The prior art all does the same thing, which is to promise the
    // reader a fact about themselves they do not have: neal.fun's Life
    // Stats ("what has happened to you since you were born"), webkay
    // ("what every browser knows about you"), The Pudding's climate twin
    // ("your city, but hotter"). None of them describes its mechanism on
    // the button. All of them ask a question the reader cannot answer.
    //
    // So does this one. It also happens to be the honest description of a
    // panel whose best line is relational — "you are standing at the
    // height of Maastricht, where I studied" — which is The Pudding's
    // trick rather than a readout's.
    aboutYouHook: "Where are you, really?",
    aboutYouOpen: "Find out",
    yourClock: "Your clock",
    backdrop: "Backdrop",
    // Paper only. See the print block in globals.css.
    reachMe: "Reach me at",
  },

  aboutYou: {
    title: "About you",
    subtitle: "The ground under whoever is reading",
    close: "Close",
    intro:
      "Give me your coordinates and I will tell you the height of the ground under you, which city in my life sits at that same height, what the air is doing, and how fast the planet is carrying you east.",
    denied:
      "No coordinates, which is a perfectly good answer. Here is the same readout for my own street instead.",
    error:
      "Open-Meteo did not answer. It is a free service, so try again in a moment.",
    locate: "Locate me",
    locating: "Asking your browser",
    reading: "Reading the ground",
    useFallback: "Use {place}",
    myStreet: "my street",
    you: "you",
    clear: "Clear",
    privacy:
      "Coordinates go to open-meteo.com for the lookup and nowhere else. They are not stored, logged, or sent to this site.",
    units: "Units",
    metric: "Metric",
    imperial: "Imperial",
    aboveSeaLevel: "above sea level, which is about the height of",
    toTheMetre: ", to the metre.",
    apart: ", {gap} apart.",
    groups: {
      ground: "Your ground",
      air: "Your air, right now",
      day: "Your day",
      planet: "Your planet",
    },
    stat: {
      coordinates: "Coordinates",
      inDegrees: "In degrees",
      utm: "UTM square",
      fix: "Fix",
      temperature: "Temperature",
      feelsLike: "Feels like",
      humidity: "Humidity",
      wind: "Wind",
      cloud: "Cloud",
      pressure: "Pressure",
      sky: "Sky",
      airQuality: "Air quality",
      fineParticles: "Fine particles",
      sunrise: "Sunrise",
      sunset: "Sunset",
      daylight: "Daylight",
      solarNoon: "Solar noon",
      rightNow: "Right now",
      peakUv: "Peak UV today",
      spinSpeed: "Spin speed",
      toEquator: "To the equator",
      toOaxaca: "To Oaxaca",
      nearestMine: "Nearest place I have been",
      antipode: "Straight down and out",
    },
    daytime: "Daytime",
    night: "Night",
    east: "east",
    // WMO code groups, from stats.ts.
    sky: {
      clear: "Clear",
      cloud: "Cloud",
      fog: "Fog",
      drizzle: "Drizzle",
      rain: "Rain",
      snow: "Snow",
      showers: "Showers",
      snowShowers: "Snow showers",
      thunderstorm: "Thunderstorm",
    },
    aqi: {
      good: "Good",
      moderate: "Moderate",
      sensitive: "Unhealthy for sensitive groups",
      unhealthy: "Unhealthy",
      veryUnhealthy: "Very unhealthy",
      hazardous: "Hazardous",
    },
  },

  background: {
    heading: "Background",
    education: "Education",
    experience: "Experience",
    ports: "ports",
    cities: "cities",
    itinerary: "The itinerary ↗",
    // The map's play control. It says what you get and how long it takes:
    // "Play my journey" said neither, and a reader deciding whether to
    // press something wants to know it costs ten seconds.
    playJourney: "The story in 10 seconds",
    stopJourney: "Stop",
    fullCv: {
      before: "The bullets, the tools and the dates in full are in the ",
      link: "CV below",
      after: ", in both flavours.",
    },
    newTab: " (opens in a new tab)",
  },

  wall: {
    heading: "My Wall",
    skip: "Skip the Wall",
    note: "A collection of my own projects alongside work I admire in the wildfire and climate-adaptation space.",
    whatsThis: "What's on this wall?",
    scrollHint: "My Wall — scroll sideways to browse",
    readOriginal: "Read the original ↗",
  },

  skills: {
    // "Skills". Not "Four roles, one kind of question", which is what
    // stood here and was a headline pretending to be a section name — the
    // card sits beside one called Experience, and a reader scanning for
    // where the tools are should find the word they are looking for.
    heading: "Skills",
    // The line beside the download, in the display face.
    //
    // It said "All of it, on two pages." and that was a claim about a
    // document nobody had counted: the CV is generated from this page by
    // the @media print block, so its length depends on how much content
    // the sections are carrying that week. A number in this position is a
    // promise to a reader deciding whether to open the file, and it would
    // have started being wrong the moment a fifth role was added.
    cvLede: "All of it, on paper.",
    downloadPdf: "Download my CV",
  },

  testimonials: {
    // "People I've worked with", not "Testimonials". The second is a
    // marketing-page word and it primes a reader to discount whatever is
    // under it; the first is a description of who is about to speak.
    heading: "People I've worked with",
  },

  services: {
    heading: "Work with me",
    lede: "I build geospatial tools for wildfire and climate problems. Scrappy enough to start from scratch, structured enough to hand it off clean. Independent or alongside your team.",
    book: "Book a 30-minute call ↗",
    brief: "or send a brief instead",
  },

  contact: {
    heading: "Get In Touch",
    close: "Close",
    book: "Book 30 minutes ↗",
    preferDirect: "Prefer to chat directly?",
    emailMeAt: "Email me at",
    name: "Name",
    email: "Your email",
    subject: "Subject",
    message: "Message",
    send: "Send",
    sending: "Sending…",
    sent: "Sent — thanks, I'll reply soon.",
    openedClient:
      "Opened your email client with this filled in — hit send there to reach me.",
    failed:
      "Something went wrong — try the email link above instead.",
    defaultSubject: "Portfolio contact",
  },

  footer: {
    heading: "What this site is for",
  },

  credit: {
    after: "After ",
    footage: "Footage: ",
    posted: "Posted by ",
  },
};

export type UiStrings = typeof en;

// Spanish. Written as Spanish, not as English with the words swapped: the
// register here is the same plain, direct one the English copy uses, and
// where a literal translation would be stiff ("Trabajemos juntos" rather
// than "Trabaja conmigo") the natural phrasing wins.
const es: UiStrings = {
  nav: {
    home: "Inicio",
    background: "Trayectoria",
    wall: "Mi Muro",
    cta: "Trabajemos juntos",
    ctaShort: "Hablemos",
    language: "Idioma",
  },

  hero: {
    aboutMe: "Sobre mí",
    aboutYou: "Sobre ti",
    aboutYouHook: "¿Dónde estás, en realidad?",
    aboutYouOpen: "Descúbrelo",
    yourClock: "Tu reloj",
    backdrop: "Fondo",
    reachMe: "Escríbeme a",
  },

  aboutYou: {
    title: "Sobre ti",
    subtitle: "El suelo bajo quien esté leyendo",
    close: "Cerrar",
    intro:
      "Dame tus coordenadas y te digo la altura del suelo bajo tus pies, qué ciudad de mi vida está a esa misma altura, qué está haciendo el aire, y a qué velocidad te lleva el planeta hacia el este.",
    denied:
      "Sin coordenadas, que es una respuesta perfectamente válida. Aquí va la misma lectura para mi propia calle.",
    error:
      "Open-Meteo no respondió. Es un servicio gratuito, así que inténtalo de nuevo en un momento.",
    locate: "Ubícame",
    locating: "Preguntando a tu navegador",
    reading: "Leyendo el terreno",
    useFallback: "Usar {place}",
    myStreet: "mi calle",
    you: "tú",
    clear: "Limpiar",
    privacy:
      "Las coordenadas van a open-meteo.com para la consulta y a ningún otro lado. No se guardan, no se registran, y no se envían a este sitio.",
    units: "Unidades",
    metric: "Métrico",
    imperial: "Imperial",
    aboveSeaLevel: "sobre el nivel del mar, más o menos la altura de",
    toTheMetre: ", al metro.",
    apart: ", con {gap} de diferencia.",
    groups: {
      ground: "Tu terreno",
      air: "Tu aire, ahora mismo",
      day: "Tu día",
      planet: "Tu planeta",
    },
    stat: {
      coordinates: "Coordenadas",
      inDegrees: "En grados",
      utm: "Cuadrícula UTM",
      fix: "Precisión",
      temperature: "Temperatura",
      feelsLike: "Sensación",
      humidity: "Humedad",
      wind: "Viento",
      cloud: "Nubosidad",
      pressure: "Presión",
      sky: "Cielo",
      airQuality: "Calidad del aire",
      fineParticles: "Partículas finas",
      sunrise: "Amanecer",
      sunset: "Atardecer",
      daylight: "Horas de luz",
      solarNoon: "Mediodía solar",
      rightNow: "Ahora mismo",
      peakUv: "UV máximo hoy",
      spinSpeed: "Velocidad de giro",
      toEquator: "Al ecuador",
      toOaxaca: "A Oaxaca",
      nearestMine: "El lugar mío más cercano",
      antipode: "Recto hacia abajo y al otro lado",
    },
    daytime: "De día",
    night: "De noche",
    east: "al este",
    sky: {
      clear: "Despejado",
      cloud: "Nublado",
      fog: "Niebla",
      drizzle: "Llovizna",
      rain: "Lluvia",
      snow: "Nieve",
      showers: "Chubascos",
      snowShowers: "Chubascos de nieve",
      thunderstorm: "Tormenta",
    },
    aqi: {
      good: "Buena",
      moderate: "Moderada",
      sensitive: "Dañina para grupos sensibles",
      unhealthy: "Dañina",
      veryUnhealthy: "Muy dañina",
      hazardous: "Peligrosa",
    },
  },

  background: {
    heading: "Trayectoria",
    education: "Formación",
    experience: "Experiencia",
    ports: "puertos",
    cities: "ciudades",
    itinerary: "El itinerario ↗",
    playJourney: "La historia en 10 segundos",
    stopJourney: "Detener",
    fullCv: {
      before: "Los detalles, las herramientas y las fechas completas están en el ",
      link: "CV de abajo",
      after: ", en los dos sabores.",
    },
    newTab: " (abre en una pestaña nueva)",
  },

  wall: {
    heading: "Mi Muro",
    skip: "Saltar el Muro",
    note: "Una colección de mis propios proyectos junto a trabajo que admiro en incendios forestales y adaptación climática.",
    whatsThis: "¿Qué hay en este muro?",
    scrollHint: "Mi Muro — desplázate de lado para navegar",
    readOriginal: "Leer el original ↗",
  },

  skills: {
    heading: "Herramientas",
    cvLede: "Todo, en papel.",
    downloadPdf: "Descarga mi CV",
  },

  testimonials: {
    heading: "Gente con la que he trabajado",
  },

  services: {
    heading: "Trabajemos juntos",
    lede: "Construyo herramientas geoespaciales para problemas de incendios y clima. Lo bastante ágil para empezar de cero, lo bastante ordenado para entregarlo limpio. Por mi cuenta o junto a tu equipo.",
    book: "Agenda 30 minutos ↗",
    brief: "o mándame un resumen del proyecto",
  },

  contact: {
    heading: "Hablemos",
    close: "Cerrar",
    book: "Agenda 30 minutos ↗",
    preferDirect: "¿Prefieres escribir directamente?",
    emailMeAt: "Escríbeme a",
    name: "Nombre",
    email: "Tu correo",
    subject: "Asunto",
    message: "Mensaje",
    send: "Enviar",
    sending: "Enviando…",
    sent: "Enviado — gracias, te respondo pronto.",
    openedClient:
      "Abrí tu cliente de correo con esto ya escrito — dale enviar ahí para que me llegue.",
    failed:
      "Algo salió mal — prueba con el enlace de correo de arriba.",
    defaultSubject: "Contacto desde el portafolio",
  },

  footer: {
    heading: "Para qué es este sitio",
  },

  credit: {
    after: "Según ",
    footage: "Material: ",
    posted: "Publicado por ",
  },
};

export const UI: Record<Locale, UiStrings> = { en, es };
