export type Job = {
  role: string;
  org: string;
  dates: string;
  location: string;
  bullets: string[];
  /** Company mark. These aren't in any open icon set, so they're local
   *  files — drop each at the path below (SVG preferred, PNG fine) and it
   *  appears; until then the row just shows the text, no broken image. */
  logoSrc?: string;
};

export const experience: Job[] = [
  {
    role: "Geospatial Analyst",
    org: "Pano AI",
    logoSrc: "/logos/pano-ai.svg",
    dates: "Jun 2025 – Present",
    location: "San Francisco Bay Area · On-site",
    bullets: [
      "Built end-to-end Python tools (Shapely, GeoPandas, NumPy, SciPy) for viewshed analysis, coverage scoring, and site prioritization",
      "Integrated ArcGIS workflows with custom algorithms to analyze detection performance and camera placement",
      "Architected a modular, object-oriented framework for maintainable geospatial workflows",
    ],
  },
  {
    role: "Data Analyst",
    org: "Gridware · Contract",
    logoSrc: "/logos/gridware.svg",
    dates: "May 2023 – Dec 2024",
    location: "San Francisco, California · Hybrid",
    bullets: [
      "Real-time monitoring and analysis of electrical distribution grid data streams",
      "Investigated and diagnosed faults using statistical analysis to reduce response times",
      "Generated real-time and daily reports for utility management and preventive maintenance",
    ],
  },
  {
    // TODO: fill in real role, dates, location and bullets — I don't have
    // these, and inventing them on a portfolio isn't something to guess at.
    // Drop the logo at public/logos/hyticos.svg.
    role: "TODO: role",
    org: "Hyticos",
    logoSrc: "/logos/hyticos.svg",
    dates: "TODO: dates",
    location: "TODO: location",
    bullets: [],
  },
];
