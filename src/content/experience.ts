export type Job = {
  role: string;
  org: string;
  dates: string;
  location: string;
  /** Achievement lines. Some roles read better as prose — those set
   *  `summary` instead and leave this empty. */
  bullets: string[];
  /** A paragraph in place of (or above) the bullets, for a role whose point
   *  is one piece of work rather than a list of them. Rendered before the
   *  bullets when both are present. */
  summary?: string;
  /** Company mark. These aren't in any open icon set, so they're local
   *  files — drop each at the path below (SVG preferred, PNG fine) and it
   *  appears; until then the row just shows the text, no broken image. */
  logoSrc?: string;
};

// Every job, including ones still being filled in.
const allJobs: Job[] = [
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
    // Volunteer sits in `org` rather than in the role title, matching
    // "Gridware · Contract" — the engagement type is a fact about the
    // relationship, not part of what the job was called.
    role: "Geospatial Data Engineer",
    org: "Hyticos · Volunteer",
    logoSrc: "/logos/hyticos.svg",
    dates: "Feb 2026 – Jun 2026",
    location: "Hyderabad, India",
    // Prose rather than bullets: this role was one sustained piece of work,
    // and splitting it into three achievement lines would pad it.
    summary:
      "Built a continuously updating fire-index map for a team without the resources to assess fire potential on their own, using AHP (analytic hierarchy process) to weight the factors feeding the index — shaped throughout by conversations with the people who would end up relying on it.",
    bullets: [],
  },
  {
    role: "Geospatial Frontend Engineer",
    org: "Fuego.Earth",
    logoSrc: "/logos/fuego-earth.svg",
    dates: "2025 – 2026",
    location: "San Francisco, CA",
    bullets: [
      "Built the public frontend (React, D3) for a wildfire-spread simulation platform, making physics-based fire modeling and multi-source satellite imagery (Copernicus, Sentinel, LANDFIRE) usable by non-specialist audiences",
      "Redesigned fire-progression visuals from static maps to color-graded, isochronic views and video sequences, applying cartographic best practices to make risk legible at a glance",
      "Worked with engineers to deploy the platform publicly and support continuous iteration, processing over 1,000 fire-spread simulations daily",
      "Validated simulated fire perimeters against satellite-observed data, ensuring public-facing outputs held up against ground truth",
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
];

// What About actually renders. Same "never show what isn't there" rule the
// gallery and OrgLogo follow: a job whose fields are still TODO placeholders
// would otherwise publish the word "TODO" to anyone reading the site, which
// is worse than the row simply not being there yet. Fill the entry in and it
// appears on its own — no other change needed.
const isPlaceholder = (job: Job) =>
  job.role.startsWith("TODO") || job.dates.startsWith("TODO");

export const experience: Job[] = allJobs.filter((job) => !isPlaceholder(job));
