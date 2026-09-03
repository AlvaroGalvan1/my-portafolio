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
//
// The credit names the author, not Open Library. Open Library hosts the
// cover JPEG; it didn't write the book, and a byline reading "@openlibrary"
// on The Dispossessed credits the wrong party entirely. Hotlinking their
// cover API is an asset courtesy, not an authorship claim — the link out
// goes to the OL work page either way, which is the acknowledgement that
// actually matters to them.
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
    credit: {
      who: author,
      relation: "author",
      href: `https://openlibrary.org/works/${work}`,
    },
  } as const;
}

// The actual pieces in the Wall. Sizes come from SHAPE above — pick the one
// that suits the piece. Order here = left-to-right order on the Wall.
//
// Every piece carries a `credit` saying who made it — see credit.ts for the
// shape and what each `relation` means. Use `relation: "mine"` for your own
// work: it renders no byline, but it still has to be stated, so nothing
// ships uncredited by accident.
//
// See TODO.md for the asset checklist (which files still need to be dropped
// under public/) and frames/registry.tsx for how to add a whole new frame
// *kind*. A tile whose file is missing simply doesn't render — it's safe to
// wire entries up before the asset exists.
const allItems: FrameData[] = [
  {
    id: "prairie-dog",
    // TODO: real title (see TODO.md W2). The credit is settled.
    title: "Prairie Dog",
    type: "video",
    // Not my footage. A video opens straight to the clip with no sidecard,
    // so the tile's credit badge is the only place attribution can live —
    // which is exactly why it can't be hover-only.
    credit: {
      who: "Fernando Boza & Tyler Smith / The Nature Conservancy",
      relation: "footage",
      href: "https://www.nature.org/en-us/about-us/where-we-work/united-states/colorado/",
      context: "Trail camera at TNC's eastern Colorado preserve",
    },
    src: "/gallery/prairie-dog.mp4",
    ...SHAPE.landscape,
    aspectRatio: 640 / 480, // 4:3 — keeps the frame uncropped
  },
  {
    id: "i-have-a-mission",
    title: "I have a Mission",
    type: "youtube",
    credit: { who: "Álvaro Galván", relation: "mine" },
    videoId: "nwXOzVZqSVc",
    ...SHAPE.landscape,
    aspectRatio: 16 / 9,
  },
  {
    id: "life",
    title: "Cellular Automaton (Conway's Life)",
    type: "cellularAutomata",
    // My implementation, his rules. No href — Conway died in 2020 and has
    // no page that is his; a Wikipedia link would credit the encyclopedia's
    // editors, not him. This is the case `href: optional` exists for.
    credit: { who: "John Conway", relation: "after", context: "Game of Life, 1970" },
    ...SHAPE.small,
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
    credit: { who: "Álvaro Galván", relation: "mine" as const },
  })),
  {
    id: "leopard-gecko",
    title: "Leopard Gecko", // TODO: real title
    type: "video",
    // Whose footage this is hasn't been established yet, and the prairie dog
    // next to it turned out not to be mine — so assuming is not safe. The
    // TODO credit keeps it off the live Wall (see the filter at the bottom)
    // rather than publishing someone's video with no name on it. Name the
    // creator and it appears on its own.
    credit: { who: "TODO: whose footage?", relation: "footage" },
    src: "/gallery/leopard-gecko.mp4",
    ...SHAPE.landscape,
    aspectRatio: 958 / 538, // 16:9 — keeps the frame uncropped
  },
  {
    id: "satanizar-el-fuego",
    title: "Satanizar el Fuego",
    type: "imageSet",
    ...SHAPE.landscape,
    credit: {
      who: "Diana Guadalupe Soto Erazo",
      relation: "author",
      href: "https://www.linkedin.com/in/diana-guadalupe-soto-erazo-a7177b4a",
      context: "Gestión Integral del Fuego en el mundo, Sept. 2025",
    },
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
    id: "growing-ca",
    title: "Wildfire Spread — drag to ignite",
    type: "fire",
    href: "https://distill.pub/2020/growing-ca/",
    linkLabel: "Read on Distill ↗",
    ...SHAPE.landscape,
    // Mine, built after their article — not their work. "@distill" read as
    // though Distill made this tile, which is the misattribution `after`
    // exists to fix. Now possible at all because FrameCell renders the
    // credit outside FireFrame's wrapping <a>.
    credit: {
      who: "Mordvintsev, Randazzo, Niklasson & Levin",
      relation: "after",
      href: "https://distill.pub/2020/growing-ca/",
      context: "Growing Neural Cellular Automata, Distill, 2020",
    },
  },
  {
    id: "landfire-viewer",
    title: "LANDFIRE Vegetation Cover, 2024 (live)",
    type: "landfire",
    ...SHAPE.hero,
    credit: {
      who: "LANDFIRE",
      relation: "data",
      href: "https://www.landfire.gov/",
      context: "Existing Vegetation Cover, 2024",
    },
  },
  {
    id: "graduacion",
    title: "Un logro colectivo",
    type: "post",
    src: "/gallery/portraits/graduation.jpeg",
    alt: "Álvaro at his university graduation.",
    credit: { who: "Álvaro Galván", relation: "mine" },
    // Kept in the original Spanish — it was written to family, and
    // translating it would be writing a different post. `bodyLang` tells a
    // screen reader to switch voice for it.
    bodyLang: "es",
    body: [
      "En Latinoamérica la educación superior representa un logro colectivo y familiar, ¡y quiero agradecer a toda mi familia por acompañarme en este proceso! 🇲🇽",
      "Hace siete años dejé mi casa para viajar y conocer el mundo. Tuve la oportunidad de ver lugares hermosos, conocer personas increíbles y apreciar la diversidad cultural de muchas partes del planeta. Este proceso me ayudó a ampliar mis horizontes y a comprender que el amor que sentimos es universal.",
      "A mis tíos y tías que me apoyaron con dinero y ropa para mi primer viaje al extranjero; a mis abuelos (incluida Bechis), que me regalaron mi primera laptop y nunca escatimaron en el amor y los regalos que me mandaban; a mi papá y a mi mamá, que me dieron la fuerza y el coraje para salir a caminar el mundo: ¡muchas gracias! Comparto plenamente este logro con ustedes. No se me ocurre un acto de amor más auténtico que darle alas a tu hijo para que vea el mundo, aunque eso signifique que viva lejos de ti.",
      "Los pienso, los extraño y los amo. Mi corazón vive con ustedes. ¡¡¡A celebrar!!! 🇮🇳🇳🇱🚢🇺🇸🇰🇷🇩🇪🇦🇷🇹🇼",
    ],
    href: "https://lnkd.in/p/gD2DuH3m",
    linkLabel: "Read on LinkedIn ↗",
    ...SHAPE.landscape,
    aspectRatio: 2048 / 1365, // the photo's own 3:2 — uncropped, no cut heads
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
    credit: { who: "Álvaro Galván", relation: "mine" },
    ...SHAPE.small,
  },

  // No open slots. Twenty dashed placeholders held the Wall's shape while it
  // was being built, but twenty empty boxes is the first thing a visitor
  // would have counted. The `placeholder` frame kind stays registered — add
  // one back with `{ id, title, type: "placeholder", slot, shapeName,
  // ...SHAPE.x }` if the Wall ever needs scaffolding again.
];

// What the Wall actually renders. Same rule as experience.ts: a piece whose
// credit is still a TODO would publish someone else's work under no name at
// all, which is worse than the tile not being there yet. Fill the credit in
// and it appears on its own — no other change needed.
const isUncredited = (item: FrameData) => item.credit?.who.startsWith("TODO") ?? false;

export const galleryItems: FrameData[] = allItems.filter((item) => !isUncredited(item));
