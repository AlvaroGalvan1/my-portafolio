import type { FrameData } from "./frames/registry";

// Named tile shapes, so sizes read as intent ("this is a poster") rather
// than as two magic numbers. The Wall is 2 rows tall, so `rowSpan: 2` means
// full height. Mix these deliberately — a gallery wall reads as curated
// when sizes vary and as wallpaper when they don't.
export const SHAPE = {
  /** Small landscape — one column, half height. The quiet default. */
  small: { colSpan: 1, rowSpan: 1 },
  /** Tall portrait poster — one column, full height. */
  portrait: { colSpan: 1, rowSpan: 2 },
  /** Wide landscape poster — two columns, half height. */
  landscape: { colSpan: 2, rowSpan: 1 },
  /** Statement piece — two columns, full height. Use sparingly. */
  statement: { colSpan: 2, rowSpan: 2 },
  /** The big one — three columns, full height. One or two on the whole Wall. */
  hero: { colSpan: 3, rowSpan: 2 },
} as const;

// Every book on the Wall is the same tile: one column, half height, at a
// 0.66 ratio — the proportions of a real trade paperback, so the covers sit
// in the row like books on a shelf rather than as crops of different sizes.
// Books are the one category here that *should* look uniform; varying them
// would read as accident rather than curation.
const BOOK_SHAPE = { colSpan: 1, rowSpan: 1, aspectRatio: 0.66 } as const;

// Covers are hotlinked from Open Library's cover API rather than copied
// into public/ — cover IDs come from openlibrary.org/search.json, and the
// domain is allowlisted in next.config.ts. `work` is the OL work key
// (e.g. "OL59863W"): the edition-independent page for the title.
function book({
  id,
  title,
  author,
  work,
  coverId,
}: {
  id: string;
  title: string;
  author: string;
  work: string;
  coverId: number;
}) {
  return {
    id,
    title,
    type: "link",
    href: `https://openlibrary.org/works/${work}`,
    thumbnailSrc: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`,
    linkLabel: `${author} ↗`,
    ...BOOK_SHAPE,
    source: { handle: "openlibrary", href: "https://openlibrary.org/" },
  } as const;
}

// The actual pieces in the Wall. Sizes come from SHAPE above — pick the one
// that suits the piece. Order here = left-to-right order on the Wall.
//
// `source` puts a small "@handle" byline in the tile corner linking to
// whoever the work belongs to — use it instead of a separate credits list.
//
// See TODO.md for the asset checklist (which files still need to be dropped
// under public/) and frames/registry.tsx for how to add a whole new frame
// *kind*. A tile whose file is missing simply doesn't render — it's safe to
// wire entries up before the asset exists.
export const galleryItems: FrameData[] = [
  {
    id: "prairie-dog",
    // TODO: real title — this is the prairie dog clip from the Nature
    // Conservancy Colorado post, so it isn't your footage. It needs a
    // `source` handle crediting them before this goes live.
    title: "Prairie Dog",
    type: "video",
    src: "/gallery/prairie-dog.mp4",
    ...SHAPE.landscape,
    aspectRatio: 640 / 480, // 4:3 — keeps the frame uncropped
  },
  {
    id: "i-have-a-mission",
    title: "I have a Mission",
    type: "youtube",
    videoId: "nwXOzVZqSVc",
    ...SHAPE.landscape,
    aspectRatio: 16 / 9,
  },
  {
    id: "life",
    title: "Cellular Automaton (Conway's Life)",
    type: "cellularAutomata",
    ...SHAPE.small,
  },
  {
    id: "connie-chan",
    title: "Connie Chan Campaign",
    type: "image",
    src: "/gallery/connie-chan.jpg",
    alt: "Connie Chan campaign material",
    ...SHAPE.small,
  },
  {
    id: "pepe-mujica",
    title: "Pepe Mujica",
    type: "image",
    src: "/gallery/pepe-mujica.jpg",
    alt: "Pepe Mujica",
    ...SHAPE.portrait,
  },
  // The four Mexico/Oaxaca maps, each hung as its own framed piece rather
  // than combined into one tile. All are 2048×1448 (A-series landscape), so
  // each carries `aspectRatio: 1.414` and keeps its true proportions instead
  // of being cropped to fill a grid cell.
  ...[
    { id: "map-rivers-mexico", title: "The Rivers of Mexico", src: "/gallery/maps/river_mexico.jpeg" },
    { id: "map-rivers-oaxaca", title: "The Rivers of Oaxaca", src: "/gallery/maps/river_oaxaca.jpeg" },
    { id: "map-soils-mexico", title: "Soils of Mexico", src: "/gallery/maps/soil_mexico.jpeg" },
    { id: "map-soils-oaxaca", title: "Soils of Oaxaca", src: "/gallery/maps/soil_oaxaca.jpeg" },
  ].map((m) => ({
    id: m.id,
    title: m.title,
    type: "image" as const,
    src: m.src,
    alt: m.title,
    caption: m.title,
    colSpan: 1 as const,
    rowSpan: 1 as const,
    aspectRatio: 1.414,
  })),
  {
    id: "leopard-gecko",
    title: "Leopard Gecko", // TODO: real title
    type: "video",
    src: "/gallery/leopard-gecko.mp4",
    ...SHAPE.landscape,
    aspectRatio: 958 / 538, // 16:9 — keeps the frame uncropped
  },
  {
    id: "satanizar-el-fuego",
    title: "Satanizar el Fuego",
    type: "imageSet",
    ...SHAPE.landscape,
    credit: "Gestión Integral del Fuego en el mundo — Diana Soto, Sept. 2025",
    images: [
      { src: "/gallery/satanizar/01-cover.jpg", alt: "Satanizar el fuego — cover" },
      { src: "/gallery/satanizar/02-que-significa.jpg", alt: "¿Qué significa satanizar el fuego?" },
      { src: "/gallery/satanizar/03-por-que-lo-hacemos.jpg", alt: "¿Por qué lo hacemos?" },
      { src: "/gallery/satanizar/04-por-que-dejarlo.jpg", alt: "¿Por qué debemos dejar de hacerlo?" },
      { src: "/gallery/satanizar/05-que-podemos-hacer.jpg", alt: "Gestión del fuego — ¿Qué podemos hacer?" },
      { src: "/gallery/satanizar/06-bibliografia.jpg", alt: "Bibliografía — Gestión del fuego" },
    ],
  },
  {
    id: "mamdani",
    title: "Mamdani",
    type: "image",
    src: "/gallery/mamdani.jpg",
    alt: "Mamdani",
    ...SHAPE.small,
  },
  {
    id: "growing-ca",
    title: "Wildfire Spread — drag to ignite",
    type: "fire",
    href: "https://distill.pub/2020/growing-ca/",
    linkLabel: "Read on Distill ↗",
    ...SHAPE.landscape,
    source: { handle: "distill", href: "https://distill.pub/" },
  },
  {
    id: "landfire-viewer",
    title: "LANDFIRE Vegetation Cover, 2024 (live)",
    type: "landfire",
    ...SHAPE.hero,
    source: { handle: "landfire", href: "https://www.landfire.gov/" },
  },
  // ── Shelf ─────────────────────────────────────────────────────────────
  // Kept adjacent so they read as a run of spines. Add the next one with
  // book({...}) and it lands at the same size as the rest by construction.
  book({
    id: "how-to-do-nothing",
    title: "How to Do Nothing",
    author: "Jenny Odell",
    work: "OL20078135W",
    coverId: 8750439,
  }),
  book({
    id: "this-changes-everything",
    title: "This Changes Everything",
    author: "Naomi Klein",
    work: "OL17062332W",
    coverId: 7306100,
  }),
  book({
    id: "the-dispossessed",
    title: "The Dispossessed",
    author: "Ursula K. Le Guin",
    work: "OL59863W",
    coverId: 6979680,
  }),
  {
    id: "papers",
    title: "Papers",
    type: "link",
    href: "/papers", // TODO: point at a real PDF/paper index once one exists
    linkLabel: "Read ↗",
    ...SHAPE.small,
  },

  // ── Open slots ────────────────────────────────────────────────────────
  // Twenty reserved spots for pieces still to come, shown as visible dashed
  // outlines so the Wall's shape is legible now. Each names the shape it's
  // holding, so you can match a piece to a slot (or change the slot's shape
  // to suit the piece).
  //
  // To fill one: drop the file at the path shown on the slot, then change
  // that entry's `type` from "placeholder" to "image" and give it
  // `src`/`alt` (plus a `source` if it's someone else's work).
  //
  // The rhythm below is deliberate — tall/wide/small alternating with two
  // big moments — so the Wall reads like a hung gallery rather than a grid.
  ...(
    [
      "portrait", "small", "small", "landscape",
      "statement", "portrait", "small", "small",
      "landscape", "hero", "portrait", "landscape",
      "small", "small", "statement", "portrait",
      "landscape", "small", "small", "portrait",
    ] as const
  ).map((shape, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      id: `slot-${n}`,
      title: n,
      type: "placeholder",
      slot: `slots/${shape}-${n}.jpg`,
      shapeName: shape,
      ...SHAPE[shape],
    } as const;
  }),
];
