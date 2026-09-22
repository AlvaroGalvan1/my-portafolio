import { say, type Phrase } from "./i18n";

export type Job = {
  role: Phrase;
  /** The organisation, and only the organisation. The engagement type used
   *  to be glued on here ("Gridware · Contract") because one line rendered
   *  both; they are separate fields now, because the layout shows company,
   *  role and dates as three separate things. */
  org: string;
  /** What the company does, in one full sentence. PRINT ONLY: on paper a
   *  recruiter wants the company placed properly. On screen the headline
   *  and its details carry the entry. */
  what: Phrase;
  /** The entry's headline: a short label for the kind of work, set in the
   *  display face, then one line on what it did. "Camera Network
   *  Intelligence" / "Siting wildfire cameras with terrain algorithms
   *  instead of guesswork." The label is what a skimming reader
   *  remembers; the line is what makes it true. */
  headline: { label: Phrase; line: Phrase };
  /** Behind the entry's Expand control: the problem, the tools, and what
   *  changed. Three short lines, always in that order, so a reader who
   *  opens one entry knows where to look in the next. */
  details: { problem: Phrase; tech: Phrase; impact: Phrase };
  /** One or two results, set large on screen. Figures from the CV only;
   *  a number here has to be one I can defend in an interview. */
  stats: { value: Phrase; label: Phrase }[];
  /** The tools, as short chips under the headline. */
  stack: string[];
  /** How it was actually done — three or four. PRINT ONLY: on paper they
   *  sit under the role they were used on, which is where a skill is
   *  evidence rather than a claim. On screen they were a red all-caps
   *  line per entry that wrapped, and Skills sits two inches below saying
   *  the same words.
   *
   *  Methods, not tools. "Network theory" belongs here; "Python" belongs
   *  in skills.ts with the rest of the toolkit. The test: could two people
   *  solve this the same way in different languages? Then it is a method. */
  methods: Phrase[];
  dates: Phrase;
  location: Phrase;
  /** Achievement lines. Some roles read better as prose — those set
   *  `summary` instead and leave this empty. */
  bullets: Phrase[];
  /** A paragraph in place of (or above) the bullets, for a role whose point
   *  is one piece of work rather than a list of them. Rendered before the
   *  bullets when both are present. */
  summary?: Phrase;
  /** PRINT ONLY. One line of scale or method: where the headline says what
   *  the work was, this says how much or by what means — the numbers a
   *  reader wants before they believe it. On paper there is room; on
   *  screen it was the line that turned a four-line entry into six. */
  scope?: Phrase;
  /** Company mark. These aren't in any open icon set, so they're local
   *  files — drop each at the path below (SVG preferred, PNG fine) and it
   *  appears. */
  logoSrc?: string;
  /** Two or three letters, drawn in the display face, for an organisation
   *  whose mark isn't here yet. Every row gets a plate either way: a column
   *  where two of five entries have a logo and three have a blank square
   *  looks broken, where five lettermarks look like a set. */
  lettermark: string;
  /** The company's own site. The company NAME is the link, not the mark:
   *  one link per row, on the words, where a reader expects it.
   *
   *  Only set where the address has actually been checked. Fuego.Earth is
   *  missing for that reason rather than by oversight — see its entry — and
   *  a row without one simply renders its name as text. A dead link on a CV
   *  is worse than no link, because the reader finds out by clicking. */
  href?: string;
};

// Every job, including ones still being filled in.
const allJobs: Job[] = [
  {
    role: { en: "Geospatial Analyst", es: "Analista Geoespacial" },
    org: "Pano AI",
    headline: {
      label: { en: "Camera Network Intelligence", es: "Inteligencia para redes de cámaras" },
      line: {
        en: "Siting wildfire cameras with terrain algorithms instead of guesswork.",
        es: "Ubicar cámaras contra incendios con algoritmos de terreno, no a ojo.",
      },
    },
    details: {
      problem: {
        en: "Manual terrain checks left blind spots across camera coverage networks.",
        es: "Las revisiones manuales del terreno dejaban puntos ciegos en la cobertura de las redes de cámaras.",
      },
      tech: {
        en: "Python (GeoPandas, Shapely, SciPy), custom viewshed algorithms, ArcGIS integration.",
        es: "Python (GeoPandas, Shapely, SciPy), algoritmos propios de cuencas visuales, integración con ArcGIS.",
      },
      impact: {
        en: "Replaced manual estimation with automated scoring to maximize camera coverage.",
        es: "Reemplacé la estimación manual con una puntuación automatizada para maximizar la cobertura de las cámaras.",
      },
    },
    stats: [
      { value: "1,000+", label: { en: "critical assets ranked by camera coverage", es: "activos críticos clasificados por cobertura de cámaras" } },
      { value: "0 to 40%", label: { en: "of high-risk zones with measured coverage", es: "de zonas de alto riesgo con cobertura medida" } },
    ],
    stack: ["Python", "GeoPandas", "Rasterio", "Shapely", "SciPy", "ArcGIS"],
    methods: [
      { en: "Viewshed analysis", es: "Análisis de cuencas visuales" },
      { en: "Network coverage", es: "Cobertura de red" },
      { en: "Risk scoring", es: "Puntuación de riesgo" },
      { en: "Asset prioritization", es: "Priorización de activos" },
    ],
    what: {
      en: "Early wildfire detection, from a network of mountaintop cameras watching for smoke.",
      es: "Detección temprana de incendios con una red de cámaras en cerros y montañas que vigilan el humo.",
    },
    href: "https://www.pano.ai",
    logoSrc: "/logos/pano-ai.svg",
    dates: { en: "Jun 2025 – Present", es: "Jun 2025 – Actualidad" },
    location: {
      en: "San Francisco Bay Area · On-site",
      es: "Área de la Bahía de San Francisco · Presencial",
    },
    lettermark: "PA",
    scope: {
      en: "Viewshed and coverage scoring in Python, wired into the ArcGIS workflows the siting calls are made in.",
      es: "Análisis de cuencas visuales y puntuación de cobertura en Python, conectado a los flujos de ArcGIS donde se deciden las ubicaciones.",
    },
    bullets: [
      {
        en: "Built end-to-end Python tools (Shapely, GeoPandas, NumPy, SciPy) for viewshed analysis, coverage scoring, and site prioritization",
        es: "Construí herramientas de Python de punta a punta (Shapely, GeoPandas, NumPy, SciPy) para análisis de cuencas visuales, puntuación de cobertura y priorización de sitios",
      },
      {
        en: "Integrated ArcGIS workflows with custom algorithms to analyze detection performance and camera placement",
        es: "Integré flujos de ArcGIS con algoritmos propios para analizar el desempeño de detección y la colocación de cámaras",
      },
      {
        en: "Architected a modular, object-oriented framework for maintainable geospatial workflows",
        es: "Diseñé un marco modular y orientado a objetos para flujos geoespaciales mantenibles",
      },
    ],
  },
  {
    role: { en: "Geospatial Data Engineer", es: "Ingeniero de Datos Geoespaciales" },
    org: "Hyticos",
    headline: {
      label: { en: "Community-Driven Risk", es: "Riesgo desde la comunidad" },
      line: {
        en: "Self-updating fire maps built for local tiger reserve teams.",
        es: "Mapas de riesgo de incendio que se actualizan solos, hechos para los equipos de las reservas de tigres.",
      },
    },
    details: {
      problem: {
        en: "Reserve teams lacked software tools to track seasonal fire risks on their own.",
        es: "Los equipos de las reservas no tenían cómo dar seguimiento por su cuenta al riesgo de incendio de cada temporada.",
      },
      tech: {
        en: "Python, Analytic Hierarchy Process (AHP) weighting, Sentinel-2 satellite data.",
        es: "Python, ponderación por Proceso Analítico Jerárquico (AHP), datos satelitales de Sentinel-2.",
      },
      impact: {
        en: "Delivered an automated fire index map that updates daily based on field input.",
        es: "Entregué un mapa de índice de incendio que se actualiza solo, todos los días, con información de campo.",
      },
    },
    stats: [
      { value: { en: "Daily", es: "A diario" }, label: { en: "fire-risk updates for tiger reserve teams", es: "actualizaciones de riesgo de incendio para las reservas" } },
    ],
    stack: ["Python", "Sentinel-2", "AHP", "Field data"],
    methods: [
      { en: "Multi-source fusion", es: "Fusión de múltiples fuentes" },
      { en: "AHP weighting", es: "Ponderación AHP" },
      { en: "Automated pipelines", es: "Flujos automatizados" },
      { en: "Field validation", es: "Validación en campo" },
    ],
    // The first version of this line said "a team in Hyderabad working on
    // fire potential", which described the project rather than the
    // organisation, because the organisation could not be checked. It can
    // now: HYTICOS is the Hyderabad Tiger Conservation Society, and the
    // fire-index work is legible the moment that is on the page. Forest
    // fire is a threat to the habitat they exist to protect.
    what: {
      en: "A grassroots non-profit conserving tigers and the forests they live in, across Telangana's reserves.",
      es: "Una organización civil de base que conserva tigres y los bosques donde viven, en las reservas de Telangana.",
    },
    href: "https://www.hyticos.in/",
    logoSrc: "/logos/hyticos.png",
    dates: { en: "Feb 2026 – Jun 2026", es: "Feb 2026 – Jun 2026" },
    location: { en: "Hyderabad, India", es: "Hyderabad, India" },
    lettermark: "HY",
    scope: {
      en: "A fire-index map weighted by analytic hierarchy process, with the weights argued out with the people who rely on the result.",
      es: "Un mapa de índice de incendio ponderado por proceso analítico jerárquico, con los pesos discutidos con quienes dependen del resultado.",
    },
    // Prose rather than bullets: this role was one sustained piece of work,
    // and splitting it into three achievement lines would pad it.
    summary: {
      en: "Built a continuously updating fire-index map for a team without the resources to assess fire potential on their own, using AHP (analytic hierarchy process) to weight the factors feeding the index, and shaped it throughout with the people who would end up relying on it.",
      es: "Construí un mapa de índice de incendio en actualización continua para un equipo sin recursos para evaluar el potencial de fuego por su cuenta, usando AHP (proceso analítico jerárquico) para ponderar los factores del índice. Lo diseñé de principio a fin junto con las personas que iban a depender de él.",
    },
    bullets: [],
  },
  {
    role: { en: "Geospatial Full-Stack Engineer", es: "Ingeniero Geoespacial Full-Stack" },
    org: "Fuego.Earth",
    headline: {
      label: { en: "Full-Stack Simulation", es: "Simulación full-stack" },
      line: {
        en: "Connecting 5+ APIs to run and display live fire-spread models.",
        es: "Más de 5 APIs conectadas para correr y mostrar en vivo modelos de propagación de incendios.",
      },
    },
    details: {
      problem: {
        en: "Fire spread models were locked in raw data formats that field teams couldn't use.",
        es: "Los modelos de propagación solo existían en formatos de datos crudos que los equipos de campo no podían usar.",
      },
      tech: {
        en: "React, D3.js, Python, 5 external APIs (Copernicus, LANDFIRE, Sentinel-2).",
        es: "React, D3.js, Python, 5 APIs externas (Copernicus, LANDFIRE, Sentinel-2).",
      },
      impact: {
        en: "Built a modular backend runner and UI processing 1,000+ daily simulation runs.",
        es: "Construí un backend modular y una interfaz que procesan más de 1,000 simulaciones al día.",
      },
    },
    stats: [
      { value: "1,000+", label: { en: "fire-spread simulations a day", es: "simulaciones de propagación al día" } },
      { value: "5+", label: { en: "data APIs connected", es: "APIs de datos conectadas" } },
    ],
    stack: ["React", "D3.js", "Python", "Docker", "LANDFIRE", "ERA5", "Copernicus"],
    methods: [
      { en: "Cloud infrastructure", es: "Infraestructura en la nube" },
      { en: "Full stack", es: "Full stack" },
      { en: "Satellite imagery", es: "Imágenes satelitales" },
      { en: "Cartographic design", es: "Diseño cartográfico" },
    ],
    what: {
      en: "A public wildfire-spread simulation platform, physics-based, running on satellite imagery.",
      es: "Una plataforma pública de simulación de propagación de incendios, basada en física, que corre sobre imágenes satelitales.",
    },
    // TODO: fuego.earth returns 404 at the root, with or without www. Put
    // the live address here and the name links.
    logoSrc: "/logos/fuego-earth.svg",
    dates: { en: "Sep 2025 – Apr 2026", es: "Sep 2025 – Abr 2026" },
    location: { en: "San Francisco, CA", es: "San Francisco, California" },
    lettermark: "FE",
    scope: {
      en: "A public React and D3 frontend over 1,000+ spread simulations a day, with the simulated perimeters checked against what the satellites saw.",
      es: "Un frontend público en React y D3 sobre más de 1,000 simulaciones de propagación al día, con los perímetros simulados contrastados contra lo que vieron los satélites.",
    },
    bullets: [
      {
        en: "Built the public frontend (React, D3) for a wildfire-spread simulation platform, making physics-based fire modeling and multi-source satellite imagery (Copernicus, Sentinel, LANDFIRE) usable by non-specialist audiences",
        es: "Construí el frontend público (React, D3) de una plataforma de simulación de propagación de incendios, volviendo usable para públicos no especializados el modelado físico del fuego y las imágenes satelitales de varias fuentes (Copernicus, Sentinel, LANDFIRE)",
      },
      {
        en: "Redesigned fire-progression visuals from static maps to color-graded, isochronic views and video sequences, applying cartographic best practices to make risk legible at a glance",
        es: "Rediseñé las visuales de avance del fuego, de mapas estáticos a vistas isócronas con gradación de color y secuencias de video, aplicando buenas prácticas cartográficas para que el riesgo se lea de un vistazo",
      },
      {
        en: "Worked with engineers to deploy the platform publicly and support continuous iteration, processing over 1,000 fire-spread simulations daily",
        es: "Trabajé con el equipo de ingeniería para desplegar la plataforma públicamente y sostener la iteración continua, procesando más de 1,000 simulaciones de propagación al día",
      },
      {
        en: "Validated simulated fire perimeters against satellite-observed data, ensuring public-facing outputs held up against ground truth",
        es: "Validé los perímetros simulados contra datos observados por satélite, asegurando que lo que se publicaba aguantara frente a la realidad en campo",
      },
    ],
  },
  {
    role: { en: "Data Analyst", es: "Analista de Datos" },
    org: "Gridware",
    headline: {
      label: { en: "Early Fault Detection", es: "Detección temprana de fallas" },
      line: {
        en: "Catching electrical grid failures in data before outages happen.",
        es: "Detectar fallas de la red eléctrica en los datos antes de que haya apagones.",
      },
    },
    details: {
      problem: {
        en: "Power line damage was only caught after physical blackouts or fires occurred.",
        es: "El daño en las líneas solo se detectaba después de apagones o incendios.",
      },
      tech: {
        en: "Python, Pandas, streaming time-series data analysis.",
        es: "Python, Pandas, análisis de series de tiempo en streaming.",
      },
      impact: {
        en: "Flagged line anomalies early so crews could repair grid issues before blackouts hit.",
        es: "Detecté anomalías en las líneas a tiempo para que las cuadrillas repararan antes de un apagón.",
      },
    },
    stats: [
      { value: "2,000+", label: { en: "grid anomaly alerts investigated", es: "alertas de anomalías en la red investigadas" } },
      { value: "100+", label: { en: "critical events escalated to on-call", es: "eventos críticos escalados a guardia" } },
    ],
    stack: ["Python", "Pandas", "Grafana", "Time series"],
    methods: [
      { en: "Sensor data", es: "Datos de sensores" },
      { en: "Statistical diagnosis", es: "Diagnóstico estadístico" },
      { en: "Real-time monitoring", es: "Monitoreo en tiempo real" },
    ],
    what: {
      en: "Monitoring hardware for electrical distribution grids, watching the lines for faults in real time.",
      es: "Hardware de monitoreo para redes de distribución eléctrica, vigilando las líneas en busca de fallas en tiempo real.",
    },
    href: "https://www.gridware.io",
    logoSrc: "/logos/gridware.svg",
    dates: { en: "May 2023 – Dec 2024", es: "May 2023 – Dic 2024" },
    location: {
      en: "San Francisco, California · Hybrid",
      es: "San Francisco, California · Híbrido",
    },
    lettermark: "GW",
    scope: {
      en: "Live monitoring of distribution-grid streams, with the diagnosis in the hands of the crews the same day.",
      es: "Monitoreo en vivo de los flujos de la red de distribución, con el diagnóstico en manos de las cuadrillas el mismo día.",
    },
    bullets: [
      {
        en: "Real-time monitoring and analysis of electrical distribution grid data streams",
        es: "Monitoreo y análisis en tiempo real de los flujos de datos de la red de distribución eléctrica",
      },
      {
        en: "Investigated and diagnosed faults using statistical analysis to reduce response times",
        es: "Investigué y diagnostiqué fallas con análisis estadístico para reducir los tiempos de respuesta",
      },
      {
        en: "Generated real-time and daily reports for utility management and preventive maintenance",
        es: "Generé reportes en tiempo real y diarios para la gestión de la empresa eléctrica y el mantenimiento preventivo",
      },
    ],
  },
];

// What the Experience column renders. Same "never show what isn't there" rule the
// gallery and OrgLogo follow: a job whose fields are still TODO placeholders
// would otherwise publish the word "TODO" to anyone reading the site, which
// is worse than the row simply not being there yet. Fill the entry in and it
// appears on its own — no other change needed.
// Reads the English side on purpose: a half-filled entry is filled in
// English first (that's the language the CV is drafted in), so checking
// only `es` would let a job whose Spanish is still a placeholder publish
// the word TODO to a Spanish reader. `say` with the default locale is the
// same string either way for a bare string, which is what a TODO always is.
const isPlaceholder = (job: Job) =>
  say(job.role, "en").startsWith("TODO") || say(job.dates, "en").startsWith("TODO");

export const experience: Job[] = allJobs.filter((job) => !isPlaceholder(job));
