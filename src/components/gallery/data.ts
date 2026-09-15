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
  /** The big one — three columns, full height. Unused as of the pass that
   *  settled the Wall at two uniform rows plus a single 2x2 accent: at the
   *  current scale a 3-track tile is most of the viewport wide. Kept as
   *  vocabulary, not as a recommendation. */
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
// A book is an `image`, not a `link`: clicking a cover enlarges the cover.
// It used to navigate to Open Library, which took the visitor off the site
// mid-Wall to a catalogue page that isn't the point — the point is what's
// on the shelf. Open Library is still reachable through the credit badge,
// which is the acknowledgement that actually matters to them.
//
// The credit names the author, not Open Library. Open Library hosts the
// cover JPEG; it didn't write the book, and a byline reading "@openlibrary"
// on The Dispossessed credits the wrong party entirely.
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
    type: "image",
    src: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`,
    alt: `${title} — ${author}`,
    // The caption is the one place the author's name is spelled out next to
    // the title; the tile itself stays a cover and nothing else.
    caption: `${title} — ${author}`,
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
    // Álvaro's own framing of the clip, from the post he shared it in —
    // "a one-man drama" is the line that makes it funny. "Prairie Dog" was
    // a filename, not a title.
    title: "A one-man drama",
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
  // The QGIS map series — two pieces, not four tiles. Each was published as
  // one post with one piece of writing covering a national sheet and an
  // Oaxaca sheet, so they hang as one framed piece each: the Wall shows the
  // national sheet, and clicking opens the writing with both sheets to flip
  // between. Four separate tiles read as four unrelated prints and left the
  // words off the site entirely.
  //
  // All the sheets are 2048×1448 (A-series landscape), hence
  // `aspectRatio: 1.414` — they keep their true proportions instead of
  // being cropped to fill a grid cell.
  {
    id: "map-rivers",
    title: "The Rivers of Mexico",
    type: "post",
    src: "/gallery/maps/river_mexico.jpeg",
    alt: "A map of Mexico's river network, drawn as fine branching lines.",
    images: [
      { src: "/gallery/maps/river_mexico.jpeg", alt: "The river network of Mexico." },
      { src: "/gallery/maps/river_oaxaca.jpeg", alt: "The river network of Oaxaca." },
    ],
    credit: { who: "Álvaro Galván", relation: "mine" },
    body: [
      "can't help but see veins—not on a body, but on the land. 🫀",
      "Rivers are the circulatory system of our planet—carving landscapes, sustaining life, and shaping human history. They don't just flow; they define. They nourish ecosystems, dictate settlements, and even draw the lines between nations.",
      "Take the Rio Grande: a natural border, a political divide, a lifeline for communities on both sides 🇲🇽 🇺🇸",
      "My latest map traces these vital arteries across Mexico, inspired by the work of Mashford Mahute. More than just geography, it's a reminder of how rivers silently sculpt our civilizations—past, present, and future.",
    ],
    // TODO: the LinkedIn permalink for this post, so the lightbox can link
    // out the way the graduation post does. Until then the words are here
    // and the button simply doesn't render.
    colSpan: 1,
    rowSpan: 1,
    aspectRatio: 1.414,
  },
  {
    id: "map-soils",
    title: "The Soils of Oaxaca",
    type: "post",
    // Oaxaca leads the set. The piece is titled "The Soils of Oaxaca" and
    // the words below are about Oaxaca, but the sheet on the tile — and the
    // first one the lightbox opened on — was the national map, so the tile
    // introduced itself with the wrong one of its two sheets. Mexico still
    // follows as the context for it.
    src: "/gallery/maps/soil_oaxaca.jpeg",
    alt: "A map of Oaxaca's soil profiles, shaded by soil type.",
    images: [
      { src: "/gallery/maps/soil_oaxaca.jpeg", alt: "Soil type profiles across Oaxaca." },
      { src: "/gallery/maps/soil_mexico.jpeg", alt: "Soil type profiles across Mexico." },
    ],
    credit: { who: "Álvaro Galván", relation: "mine" },
    body: [
      "I'm from Oaxaca, a beautiful state in southern Mexico known for its rich culture, stunning landscapes, and incredible biodiversity. To practice my QGIS skills and showcase my home's cultural and natural wonders, I've created a series of maps inspired by the work of Mashford Mahute.",
      "This map highlights Mexico's different soil type profiles, focusing on Oaxaca. Soil is the foundation of life; it supports agriculture, regulates water systems, stores carbon, and sustains ecosystems. In Oaxaca, the diversity of soil types reflects the region's unique geography.",
      "I hope this map helps others appreciate the beauty and complexity of Oaxaca's natural resources. It's a small way to stay connected to my home 🏡",
    ],
    // TODO: the LinkedIn permalink for this post — see map-rivers above.
    colSpan: 1,
    rowSpan: 1,
    aspectRatio: 1.414,
  },
  {
    id: "leopard-gecko",
    // TODO: real title, once it's known whose clip this is — the title and
    // the credit should be written in the same pass rather than guessing at
    // one now and correcting it later.
    title: "Leopard Gecko",
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
    // Diana's own title for the deck, emoji included — it's the name she
    // published it under, not a description of it.
    title: "Satanizar el Fuego 🔥",
    type: "imageSet",
    // The slides are 1920×1080, so `aspectRatio: 16/9` is doing real work:
    // without it the tile fills its cell at roughly 2.4:1 and `object-cover`
    // crops a quarter of every slide's height away, text included.
    //
    // Half height, not full. A deck at full height dominates the Wall, and
    // the reading happens by flipping through it up close rather than at a
    // glance — the tile's job is to say "there are six slides here", which
    // it does at this size.
    ...SHAPE.landscape,
    aspectRatio: 16 / 9,
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
    // Titled from its own cover page, not from the LinkedIn URL slug —
    // "entre mis abuelos y la plataforma" is the line the post opens with,
    // and the piece itself is called this.
    id: "cuando-la-plataforma",
    title: "Cuando la plataforma me diga cuándo quemar",
    type: "imageSet",
    // Rendered from Diana's PDF at 150dpi (US Letter landscape, 1650×1275),
    // hence the ratio — same reasoning as the Satanizar deck above.
    ...SHAPE.landscape,
    aspectRatio: 1650 / 1275,
    credit: {
      who: "Diana Guadalupe Soto Erazo",
      relation: "author",
      href: "https://www.linkedin.com/in/diana-guadalupe-soto-erazo-a7177b4a",
      // The drawings are signed by three people across the eight pages —
      // Pablo, Jeanneth and Diana — and they're half of what the piece is.
      // Naming only the writer would credit half the work.
      context: "Ilustraciones de Pablo, Jeanneth y Diana",
    },
    // Alt text in Spanish, like the Satanizar deck: the pages are Spanish,
    // and a screen reader announcing them should stay in the voice they're
    // written in. Each line describes its drawing and the line of the essay
    // that page turns on — a page of prose can't be transcribed into an
    // alt attribute, so it names what the page *is*.
    images: [
      { src: "/gallery/abuelos-y-plataforma/p1.jpeg", alt: "Portada — «Cuando la plataforma me diga cuándo quemar», de Diana Guadalupe Soto Erazo, sobre un cielo azul pintado a mano." },
      { src: "/gallery/abuelos-y-plataforma/p2.jpeg", alt: "Página 1 — «mis abuelos sabían cuándo quemar» y ahora «la plataforma dice cuándo quemar»; dibujo de un niño con sombrero bajo el sol." },
      { src: "/gallery/abuelos-y-plataforma/p3.jpeg", alt: "Página 2 — «Porque sin tejido social no vamos a ningún lado»; dibujo de un ala con corazones y la frase «¡Qué la vida se vuelva cada vez más linda!»." },
      { src: "/gallery/abuelos-y-plataforma/p4.jpeg", alt: "Página 3 — la prohibición, el aumento de costos y el incendio que llega después; dibujo de un colibrí frente a un rostro." },
      { src: "/gallery/abuelos-y-plataforma/p5.jpeg", alt: "Página 4 — «Miré el cielo. Sentí el viento. Toqué nuevamente la hierba»; dibujo de un pavo real." },
      { src: "/gallery/abuelos-y-plataforma/p6.jpeg", alt: "Página 5 — «No quiero escoger entre el conocimiento de mis abuelos y la ciencia. Quiero que vuelvan a encontrarse»; dibujo de un árbol florecido." },
      { src: "/gallery/abuelos-y-plataforma/p7.jpeg", alt: "Página 6 — «Que la plataforma advierta, pero que la comunidad comprenda, converse y decida»; dibujo de una raíz extendida." },
      { src: "/gallery/abuelos-y-plataforma/p8.jpeg", alt: "Fin — dibujo de una tormenta sobre una casa y una flor roja, con la frase «Se resiste con todo»." },
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
    // The one full-height piece on the Wall, and 2 tracks rather than 3.
    //
    // Everything else is half-height, so the two rows read as two clean
    // bands and this is the single break in them — which is what makes it a
    // focal point instead of one more size in the mix. It briefly had
    // company: Conway's Life was given full height too, on the theory that
    // interlocking rows look less like a grid. They don't look less like a
    // grid, they look unsorted, and with tiles this size that reads as
    // clutter. One accent, deliberately placed, is the version that reads
    // as arranged.
    //
    // At 3 tracks it also came to ~1160px on a laptop — a slab across four
    // fifths of the screen rather than a piece hung on a wall.
    ...SHAPE.statement,
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
const isUncredited = (item: FrameData) => item.credit.who.startsWith("TODO");

export const galleryItems: FrameData[] = allItems.filter((item) => !isUncredited(item));
