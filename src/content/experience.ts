export type Job = {
  role: string;
  /** The organisation, and only the organisation. The engagement type used
   *  to be glued on here ("Gridware · Contract") because one line rendered
   *  both; they are separate fields now, because the layout shows company,
   *  role and dates as three separate things. */
  org: string;
  /** What the company does, in one line, for a reader who has never heard
   *  of it. Four org names that mean nothing are four rows of nothing: the
   *  role says what I did, this says what it was for. */
  what: string;
  dates: string;
  location: string;
  /** Achievement lines. Some roles read better as prose — those set
   *  `summary` instead and leave this empty. */
  bullets: string[];
  /** A paragraph in place of (or above) the bullets, for a role whose point
   *  is one piece of work rather than a list of them. Rendered before the
   *  bullets when both are present. */
  summary?: string;
  /** The one line the page shows. Not a compressed bullet — a different
   *  register entirely: what the job was FOR, in language someone outside
   *  the field can picture. The bullets stay in the CV, where a reader has
   *  already decided they want the detail; this is what earns that.
   *
   *  Write it as the answer to "what changed because you were there", never
   *  as a list of tools. If it mentions a library it is a bullet, not a
   *  takeaway. */
  takeaway: string;
  /** One line of scale or method under the takeaway. Where the takeaway
   *  says what changed, this says how much or by what means — the numbers a
   *  reader wants before they believe the sentence above it. */
  scope?: string;
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
   *  Only set where the address has actually been checked. Two of these
   *  four are missing for that reason rather than by oversight — see the
   *  entries — and a row without one simply renders its name as text. A
   *  dead link on a CV is worse than no link, because the reader finds out
   *  by clicking. */
  href?: string;
};

// Every job, including ones still being filled in.
const allJobs: Job[] = [
  {
    role: "Geospatial Analyst",
    org: "Pano AI",
    what: "Early wildfire detection, from a network of mountaintop cameras watching for smoke.",
    href: "https://www.pano.ai",
    logoSrc: "/logos/pano-ai.svg",
    dates: "Jun 2025 – Present",
    location: "San Francisco Bay Area · On-site",
    lettermark: "PA",
    takeaway:
      "Where a wildfire camera should stand, and what it can actually see from up there, worked out from the terrain instead of guessed at.",
    scope:
      "Viewshed and coverage scoring in Python, wired into the ArcGIS workflows the siting calls are made in.",
    bullets: [
      "Built end-to-end Python tools (Shapely, GeoPandas, NumPy, SciPy) for viewshed analysis, coverage scoring, and site prioritization",
      "Integrated ArcGIS workflows with custom algorithms to analyze detection performance and camera placement",
      "Architected a modular, object-oriented framework for maintainable geospatial workflows",
    ],
  },
  {
    role: "Geospatial Data Engineer",
    org: "Hyticos",
    // Written from my own summary of the work rather than from the
    // company's own description. Worth replacing with their line.
    what: "A team in Hyderabad working on fire potential without the resources to assess it themselves.",
    // TODO: no address found. hyticos.com does not resolve; if there is a
    // site, a LinkedIn page or a repo, put it here and the name links.
    logoSrc: "/logos/hyticos.svg",
    dates: "Feb 2026 – Jun 2026",
    location: "Hyderabad, India",
    lettermark: "HY",
    takeaway:
      "A team with no way to judge fire risk now has one that updates itself.",
    scope:
      "A fire-index map weighted by analytic hierarchy process, with the weights argued out with the people who rely on the result.",
    // Prose rather than bullets: this role was one sustained piece of work,
    // and splitting it into three achievement lines would pad it.
    summary:
      "Built a continuously updating fire-index map for a team without the resources to assess fire potential on their own, using AHP (analytic hierarchy process) to weight the factors feeding the index — shaped throughout by conversations with the people who would end up relying on it.",
    bullets: [],
  },
  {
    role: "Geospatial Frontend Engineer",
    org: "Fuego.Earth",
    what: "A public wildfire-spread simulation platform, physics-based, running on satellite imagery.",
    // TODO: fuego.earth returns 404 at the root, with or without www. Put
    // the live address here and the name links.
    logoSrc: "/logos/fuego-earth.svg",
    dates: "2025 – 2026",
    location: "San Francisco, CA",
    lettermark: "FE",
    takeaway:
      "Physics-grade fire simulation, made legible to people who will never read the physics.",
    scope:
      "A public React and D3 frontend over 1,000+ spread simulations a day, with the simulated perimeters checked against what the satellites saw.",
    bullets: [
      "Built the public frontend (React, D3) for a wildfire-spread simulation platform, making physics-based fire modeling and multi-source satellite imagery (Copernicus, Sentinel, LANDFIRE) usable by non-specialist audiences",
      "Redesigned fire-progression visuals from static maps to color-graded, isochronic views and video sequences, applying cartographic best practices to make risk legible at a glance",
      "Worked with engineers to deploy the platform publicly and support continuous iteration, processing over 1,000 fire-spread simulations daily",
      "Validated simulated fire perimeters against satellite-observed data, ensuring public-facing outputs held up against ground truth",
    ],
  },
  {
    role: "Data Analyst",
    org: "Gridware",
    what: "Monitoring hardware for electrical distribution grids, watching the lines for faults in real time.",
    href: "https://www.gridware.io",
    logoSrc: "/logos/gridware.svg",
    dates: "May 2023 – Dec 2024",
    location: "San Francisco, California · Hybrid",
    lettermark: "GW",
    takeaway:
      "Faults on the electrical grid found in the data before they were found in the field.",
    scope:
      "Live monitoring of distribution-grid streams, with the diagnosis in the hands of the crews the same day.",
    bullets: [
      "Real-time monitoring and analysis of electrical distribution grid data streams",
      "Investigated and diagnosed faults using statistical analysis to reduce response times",
      "Generated real-time and daily reports for utility management and preventive maintenance",
    ],
  },
];

// What the Experience column renders. Same "never show what isn't there" rule the
// gallery and OrgLogo follow: a job whose fields are still TODO placeholders
// would otherwise publish the word "TODO" to anyone reading the site, which
// is worse than the row simply not being there yet. Fill the entry in and it
// appears on its own — no other change needed.
const isPlaceholder = (job: Job) =>
  job.role.startsWith("TODO") || job.dates.startsWith("TODO");

export const experience: Job[] = allJobs.filter((job) => !isPlaceholder(job));
