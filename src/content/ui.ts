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
    pricing: "Pricing",
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
    about: "About",
    language: "Language",
  },

  hero: {
    // The left column's paragraph, under the name. It opens on the words
    // a recruiter searches for — geospatial, wildfire, climate risk — and
    // then says what working with me is like, so the ask never has to be
    // made in words: the reader is already picturing me on their team.
    pitch:
      "Geospatial engineer working on wildfire and climate risk. I turn satellite, terrain and sensor data into maps, models and tools that teams use every day. I can start a project from zero or join yours.",
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
    workedWith: "Worked with",
    aboutYouHook: "Where are you, really?",
    aboutYouOpen: "Find out",
    yourClock: "Your clock",
    backdrop: "Backdrop",
    // Paper only. See the print block in globals.css.
    reachMe: "Reach me at",
  },

  aboutYou: {
    title: "About you",
    subtitle: "Where you are in time and space",
    close: "Close",
    // A short statement before anything is asked for: what this is, why it
    // exists, and that nothing is kept.
    intro:
      "A location is two numbers, and those two numbers hold a surprising amount of time and space. This panel reads yours against public datasets: the terrain under you, the rock beneath it, the places people have written about nearby, where this moment falls in the day and the year, how today compares with the same day in 1950, and the sky right now. It is a small demonstration of how much can be read from a single point.",
    notCollected:
      "Nothing is collected. Your coordinates go straight from your browser to the public services below and never reach this site.",
    sourcesLabel: "Sources",
    sources:
      "Copernicus 90 m elevation model and ERA5 via Open-Meteo · Macrostrat geology · OpenStreetMap · Wikipedia",
    denied:
      "No coordinates, which is a perfectly good answer. Here is the same readout for my own street instead.",
    error:
      "The data services did not answer. They are free and public, so try again in a moment.",
    locate: "Locate me",
    locating: "Asking your browser",
    reading: "Reading the ground",
    useFallback: "Use {place}",
    myStreet: "my street",
    you: "you",
    clear: "Clear",
    privacy:
      "Your coordinates go only to Open-Meteo, Macrostrat, OpenStreetMap and Wikipedia, for these lookups. Nothing is stored or logged, and nothing reaches this site.",
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
      location: "Location",
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
      antipode: "Other side of the planet",
    },
    sections: {
      space: { title: "Space", note: "What the terrain, the rock and the map say about this point." },
      time: { title: "Time", note: "Where this moment falls in the day, the month, the year and the century." },
      air: { title: "Air", note: "The sky above you right now." },
    },
    terrain: {
      title: "Terrain",
      caption: "The 2 km around you, from a 90 m elevation model.",
      slope: "Slope",
      facing: "Facing",
      flat: "Flat",
      relief: "Relief",
      highest: "Highest point",
      grades: { gentle: "gentle", moderate: "moderate", steep: "steep", verySteep: "very steep" },
      away: "{d} {dir}",
      here: "right here",
    },
    bedrock: {
      title: "Rock under you",
      million: "million years",
      thousand: "thousand years",
      upTo: "Up to",
      from: "from the",
      none: "No mapped rock here. Most likely open water.",
      kinds: {
        sedimentary: "Sedimentary rock",
        volcanic: "Volcanic rock",
        plutonic: "Plutonic rock",
        metamorphic: "Metamorphic rock",
        igneous: "Igneous rock",
        other: "Rock",
      },
    },
    nearby: { title: "Nearby on Wikipedia", none: "No articles within 10 km." },
    clock: {
      title: "Your clock",
      ahead: "Your clock runs {n} min ahead of the sun.",
      behind: "Your clock runs {n} min behind the sun.",
      even: "Your clock matches the sun.",
    },
    moon: {
      title: "Moon",
      lit: "{n}% lit",
      phases: ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"],
    },
    then: {
      title: "This day in 1950",
      body: "The high here on this date in 1950 was {then}. Today's forecast high is {now}.",
      warmer: "{d} warmer",
      cooler: "{d} cooler",
      same: "About the same",
    },
    year: { title: "Your year", body: "Day {n} of {total}" },
    windFrom: "from",
    uvLevel: {
      low: "Low",
      moderate: "Moderate",
      high: "High",
      veryHigh: "Very high",
      extreme: "Extreme",
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
    experience: "Experience",
    ports: "ports",
    cities: "cities",
    itinerary: "The itinerary ↗",
    // The map's play control, still used on the About page. It says what
    // you get and how long it takes: a reader deciding whether to press
    // something wants to know the cost.
    playJourney: "Play the journey · 14s",
    stopJourney: "Stop",
    // How each leg was travelled: the key on the map, and the start of the
    // caption while a leg plays ("Flight · Oaxaca → Aguascalientes").
    flight: "Flight",
    sea: "By ship",
    fullCv: {
      before: "The bullets, the tools and the dates in full are in the ",
      link: "CV below",
      after: ", in both flavours.",
    },
    newTab: " (opens in a new tab)",
    // The control under each Experience headline, and the three labels it
    // reveals.
    expand: "Expand",
    collapse: "Collapse",
    problem: "Problem",
    tech: "Tech",
    impact: "Impact",
  },

  wall: {
    heading: "My Wall",
    skip: "Skip the Wall",
    // Under the title, visible, rather than behind an "i": it says what
    // the Wall is, and that it grows.
    note: "My own projects, pinned next to work I admire in wildfire and climate adaptation. I add to it as I go.",
    scrollHint: "My Wall — scroll sideways to browse",
    readOriginal: "Read the original ↗",
  },

  skills: {
    // "Skills". Not "Four roles, one kind of question", which is what
    // stood here and was a headline pretending to be a section name — the
    // card sits beside one called Experience, and a reader scanning for
    // where the tools are should find the word they are looking for.
    heading: "Skills",
    downloadPdf: "Download my CV",
    cvMeta: "One page · PDF · Sep 2026",
  },

  testimonials: {
    // "People I've worked with", not "Testimonials". The second is a
    // marketing-page word and it primes a reader to discount whatever is
    // under it; the first is a description of who is about to speak.
    heading: "People I've worked with",
    intro: "Pick a name to read what they said.",
    verify: "View profile",
    project: "Project",
    placeholder: "Placeholder",
  },

  services: {
    heading: "Work with me",
    lede: "I build end-to-end geospatial products for wildfire and climate work, from the first question to a tool running in production.",
    pipeline: "One person, the whole product",
    callBefore: "Rates, including NGO and pro bono options, are on the ",
    callLink: "pricing page",
    callAfter: ".",
    book: "Book a 30-minute call",
    brief: "or send a brief instead",
  },

  process: {
    heading: "Talk, plan, ship.",
    lede: "Every project moves through the same three steps, in this order.",
  },

  about: {
    metaTitle: "About",
    metaDescription:
      "Álvaro Galván: geospatial engineer from Oaxaca, working on wildfire and climate risk. Background, education and the journey that got him here.",
    eyebrow: "Who I am",
    heading: "About me",
    // Moved here from `background.educationNote` — it renders on this page
    // now, beside the photo, rather than sitting unused next to a map that
    // has since moved here too.
    scholarship:
      "I studied on scholarships the whole way, across seven countries, with classmates from more than 90 nationalities.",
    // The line that hands off to the map below: what it is, in one
    // sentence, before the reader scrolls to it.
    transition:
      "That's the map below: where I studied, and the ports a semester at sea stopped in along the way.",
    journeyHeading: "The journey",
  },

  faq: {
    heading: "FAQ",
  },

  pricing: {
    // The route's <title>, run through the layout's "%s — name" template.
    metaTitle: "Pricing",
    metaDescription:
      "Geospatial consulting: research, building and design. $65 USD/hour base rate, fixed-price projects, reduced rates for NGOs, and pro bono work for mission-aligned climate projects.",
    eyebrow: "Work with me",
    heading: "Pricing",
    lede: "Four ways to work together. Every project starts with a 30-minute call.",
    talkHeading: "Let's talk",
    talkBody:
      "Tell me what you're working on and we'll find the right fit.",
    book: "Book a 30-minute call",
    brief: "or send me a message",
  },

  contact: {
    heading: "Get In Touch",
    close: "Close",
    book: "Book 30 minutes",
    preferDirect: "Prefer to chat directly?",
    emailMeAt: "Email me at",
    name: "Name",
    email: "Your email",
    subject: "Subject",
    message: "Message",
    send: "Send",
    sending: "Sending…",
    sent: "Sent. Thanks, I'll reply soon.",
    openedClient:
      "Your email app opened with this message filled in. Hit send there to reach me.",
    failed:
      "Something went wrong. Try the email link above instead.",
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
    pricing: "Tarifas",
    cta: "Trabajemos juntos",
    ctaShort: "Hablemos",
    about: "Sobre mí",
    language: "Idioma",
  },

  hero: {
    pitch:
      "Soy ingeniero geoespacial y trabajo en riesgo de incendios forestales y riesgo climático. Convierto datos satelitales, de terreno y de sensores en mapas, modelos y herramientas que los equipos usan todos los días. Puedo arrancar un proyecto desde cero o sumarme al tuyo.",
    aboutYou: "Sobre ti",
    workedWith: "He trabajado con",
    aboutYouHook: "¿Dónde estás, en realidad?",
    aboutYouOpen: "Descúbrelo",
    yourClock: "Tu reloj",
    backdrop: "Fondo",
    reachMe: "Escríbeme a",
  },

  aboutYou: {
    title: "Sobre ti",
    subtitle: "Dónde estás en el tiempo y el espacio",
    close: "Cerrar",
    intro:
      "Una ubicación son dos números, y esos dos números guardan muchísimo tiempo y espacio. Este panel cruza la tuya con datos públicos: el terreno bajo tus pies, la roca que hay debajo, los lugares cercanos sobre los que alguien ha escrito, en qué punto del día y del año cae este momento, cómo se compara hoy con el mismo día de 1950 y cómo está el cielo ahora. Es una pequeña muestra de todo lo que se puede leer a partir de un solo punto.",
    notCollected:
      "No se recopila nada. Tus coordenadas van directo de tu navegador a los servicios públicos de abajo y nunca llegan a este sitio.",
    sourcesLabel: "Fuentes",
    sources:
      "Modelo de elevación Copernicus de 90 m y ERA5 vía Open-Meteo · Geología de Macrostrat · OpenStreetMap · Wikipedia",
    denied:
      "Sin coordenadas, y está perfecto. Te dejo los mismos datos, pero de mi calle.",
    error:
      "Los servicios de datos no respondieron. Son gratuitos y públicos, así que vuelve a intentarlo en un momento.",
    locate: "Ubícame",
    locating: "Preguntando a tu navegador",
    reading: "Leyendo el terreno",
    useFallback: "Usar {place}",
    myStreet: "mi calle",
    you: "tú",
    clear: "Limpiar",
    privacy:
      "Tus coordenadas solo se mandan a Open-Meteo, Macrostrat, OpenStreetMap y Wikipedia para estas consultas. No se guarda ni se registra nada, y nada llega a este sitio.",
    units: "Unidades",
    metric: "Métrico",
    imperial: "Imperial",
    aboveSeaLevel: "sobre el nivel del mar, más o menos la altura de",
    toTheMetre: ", al metro exacto.",
    apart: ", con {gap} de diferencia.",
    groups: {
      ground: "Tu terreno",
      air: "Tu aire, ahora mismo",
      day: "Tu día",
      planet: "Tu planeta",
    },
    stat: {
      location: "Ubicación",
      coordinates: "Coordenadas",
      inDegrees: "En grados",
      utm: "Cuadrícula UTM",
      fix: "Precisión",
      temperature: "Temperatura",
      feelsLike: "Sensación térmica",
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
      antipode: "Del otro lado del planeta",
    },
    sections: {
      space: { title: "Espacio", note: "Lo que el terreno, la roca y el mapa dicen de este punto." },
      time: { title: "Tiempo", note: "Dónde cae este momento en el día, el mes, el año y el siglo." },
      air: { title: "Aire", note: "El cielo sobre ti ahora mismo." },
    },
    terrain: {
      title: "Terreno",
      caption: "Los 2 km a tu alrededor, según un modelo de elevación de 90 m.",
      slope: "Pendiente",
      facing: "Orientación",
      flat: "Plano",
      relief: "Desnivel",
      highest: "Punto más alto",
      grades: { gentle: "suave", moderate: "moderada", steep: "fuerte", verySteep: "muy fuerte" },
      away: "a {d} al {dir}",
      here: "aquí mismo",
    },
    bedrock: {
      title: "La roca bajo tus pies",
      million: "millones de años",
      thousand: "mil años",
      upTo: "Hasta",
      from: "del",
      none: "No hay roca cartografiada aquí. Lo más probable es que sea agua.",
      kinds: {
        sedimentary: "Roca sedimentaria",
        volcanic: "Roca volcánica",
        plutonic: "Roca plutónica",
        metamorphic: "Roca metamórfica",
        igneous: "Roca ígnea",
        other: "Roca",
      },
    },
    nearby: { title: "Cerca de ti en Wikipedia", none: "No hay artículos a menos de 10 km." },
    clock: {
      title: "Tu reloj",
      ahead: "Tu reloj va {n} min adelantado respecto al sol.",
      behind: "Tu reloj va {n} min atrasado respecto al sol.",
      even: "Tu reloj coincide con el sol.",
    },
    moon: {
      title: "Luna",
      lit: "{n}% iluminada",
      phases: ["Luna nueva", "Luna creciente", "Cuarto creciente", "Gibosa creciente", "Luna llena", "Gibosa menguante", "Cuarto menguante", "Luna menguante"],
    },
    then: {
      title: "Este día en 1950",
      body: "La máxima aquí en esta fecha de 1950 fue de {then}. Para hoy se pronostica {now}.",
      warmer: "{d} más cálido",
      cooler: "{d} más fresco",
      same: "Casi igual",
    },
    year: { title: "Tu año", body: "Día {n} de {total}" },
    windFrom: "del",
    uvLevel: {
      low: "Bajo",
      moderate: "Moderado",
      high: "Alto",
      veryHigh: "Muy alto",
      extreme: "Extremo",
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
      unhealthy: "Dañina a la salud",
      veryUnhealthy: "Muy dañina a la salud",
      hazardous: "Peligrosa",
    },
  },

  background: {
    heading: "Trayectoria",
    experience: "Experiencia",
    ports: "puertos",
    cities: "ciudades",
    itinerary: "El itinerario ↗",
    playJourney: "Ver el recorrido · 14 s",
    stopJourney: "Detener",
    flight: "Vuelo",
    sea: "En barco",
    fullCv: {
      before: "Los detalles, las herramientas y las fechas completas están en el ",
      link: "CV de abajo",
      after: ", en sus dos versiones.",
    },
    newTab: " (abre en una pestaña nueva)",
    expand: "Ver más",
    collapse: "Ver menos",
    problem: "Problema",
    tech: "Tecnología",
    impact: "Impacto",
  },

  wall: {
    heading: "Mi Muro",
    skip: "Saltar el Muro",
    note: "Mis proyectos, junto a trabajos que admiro sobre incendios forestales y adaptación al cambio climático. Lo voy actualizando.",
    scrollHint: "Mi Muro: desliza hacia los lados para recorrerlo",
    readOriginal: "Leer el original ↗",
  },

  skills: {
    heading: "Herramientas",
    downloadPdf: "Descarga mi CV",
    cvMeta: "Una página · PDF · sep 2026",
  },

  testimonials: {
    heading: "Gente con la que he trabajado",
    intro: "Elige un nombre para leer lo que dijo.",
    verify: "Ver perfil",
    project: "Proyecto",
    placeholder: "Ejemplo",
  },

  services: {
    heading: "Trabajemos juntos",
    lede: "Construyo productos geoespaciales de principio a fin para incendios y clima, desde la primera pregunta hasta una herramienta en producción.",
    pipeline: "Una sola persona, el producto completo",
    callBefore: "Las tarifas, con opciones para ONG y pro bono, están en la ",
    callLink: "página de tarifas",
    callAfter: ".",
    book: "Agenda una llamada de 30 minutos",
    brief: "o mándame un resumen del proyecto",
  },

  process: {
    heading: "Hablamos, planeamos, entregamos.",
    lede: "Todo proyecto pasa por los mismos tres pasos, en este orden.",
  },

  about: {
    metaTitle: "Sobre mí",
    metaDescription:
      "Álvaro Galván: ingeniero geoespacial de Oaxaca, trabajando en riesgo de incendios forestales y clima. Trayectoria, formación y el recorrido que lo trajo hasta aquí.",
    eyebrow: "Quién soy",
    heading: "Sobre mí",
    scholarship:
      "Estudié con becas de principio a fin, en siete países y con compañeros de más de 90 nacionalidades.",
    transition:
      "Ese es el mapa de abajo: dónde estudié, y los puertos donde paró un semestre en barco por el camino.",
    journeyHeading: "El recorrido",
  },

  faq: {
    heading: "Preguntas frecuentes",
  },

  pricing: {
    metaTitle: "Tarifas",
    metaDescription:
      "Consultoría geoespacial: investigación, desarrollo y diseño. Tarifa base de 65 USD por hora, proyectos con precio cerrado, tarifas reducidas para ONG y trabajo pro bono para proyectos climáticos con los que comparto causa.",
    eyebrow: "Trabajemos juntos",
    heading: "Tarifas",
    lede: "Hay cuatro formas de trabajar juntos. Todo proyecto empieza con una llamada de 30 minutos.",
    talkHeading: "Hablemos",
    talkBody:
      "Cuéntame en qué estás trabajando y encontramos la mejor opción.",
    book: "Agenda una llamada de 30 minutos",
    brief: "o mándame un mensaje",
  },

  contact: {
    heading: "Hablemos",
    close: "Cerrar",
    book: "Agenda una llamada",
    preferDirect: "¿Prefieres escribir directamente?",
    emailMeAt: "Escríbeme a",
    name: "Nombre",
    email: "Tu correo",
    subject: "Asunto",
    message: "Mensaje",
    send: "Enviar",
    sending: "Enviando…",
    sent: "Enviado. Gracias, te contesto pronto.",
    openedClient:
      "Se abrió tu correo con el mensaje ya escrito. Solo dale enviar.",
    failed:
      "Algo salió mal. Mejor escríbeme al correo de arriba.",
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
