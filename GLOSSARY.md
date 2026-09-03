# Glossary

Plain-language names for things we talk about, mapped to where they live in
the code. Use these terms and we'll both know exactly what we mean.

## Projects gallery ("the Wall")

- **Wall** — the horizontal-scrolling Projects section. Code:
  `src/components/gallery/HorizontalGallery.tsx`.
- **Frame** / **Tile** — one card on the Wall (a photo, a video, the live
  LANDFIRE map, etc). Each has a `type` (see below). Code:
  `src/components/gallery/frames/`.
- **Loop** — the Wall scrolls sideways natively (trackpad swipe, shift+wheel,
  or drag) and wraps around — scroll far enough either direction and the
  same tiles come back around, rather than hitting a dead end. It starts at
  a random point in the loop on each page load.
- **Edge zone** — the strip along each side of the Wall. Move the pointer
  into it and it warms orange and the Wall starts drifting; push further
  toward the edge and it speeds up. There's no button to click — the
  control is the area itself.
- **Shape** — a named tile size (`small`, `portrait`, `landscape`,
  `statement`, `hero`), set per piece in `data.ts`. Mixing them is what
  makes the Wall read as a hung gallery rather than a grid.
- **Aspect ratio** — for a piece with a fixed real shape (a book cover, a
  map print), set `aspectRatio` and the tile takes exactly that shape
  instead of filling its cell. Give it enough `colSpan` for that width to
  fit, or it gets clipped to the track.
- **Slot** — a reserved empty spot on the Wall, drawn as a dashed outline
  naming its shape and the file path that would fill it. Distinct from a
  *broken* tile, which hides itself.
- **Frame type** — what kind of tile it is: `image`, `imageSet` (cycles
  through several images on click), `video`, `link` (opens a URL in a new
  tab), `embed` (a live external page in an iframe), `landfire` (the live
  vegetation-cover map), `cellularAutomata`, `credits`.
- **The list** — `src/components/gallery/data.ts`. This is the one file you
  edit to add/reorder/resize tiles. Order in the file = left-to-right order
  on the Wall.
- **Lightbox** — the full-size popup that opens when you click an `image` or
  `video` tile. Code: `src/components/gallery/Lightbox.tsx`.
- **Guardrail** — if a tile's file is missing or a live data source goes
  down, the tile disappears from the Wall entirely (not a broken/empty box)
  and it's logged to the browser console as `[gallery:hidden] ...` so it's
  easy to find and fix later.
- **Credits tile** — the card at the end of the Wall listing attribution for
  everything on it.

## Map section

- **Base map** — the underlying map imagery style (Streets / Satellite /
  Terrain / Dark), switchable from the toolbar above the map. Code:
  `src/components/map/BaseMap.tsx`, `baseLayers.ts`.
- **LANDFIRE frame** — the Wall tile showing a real, live vegetation-cover
  layer from LANDFIRE (a US government wildfire-data service), drawn on our
  own map rather than embedding their website (their site blocks that).
  Code: `src/components/gallery/frames/LandfireFrame.tsx`.

## Page structure

- **Section** — one full-width block of the page: Hero (top, name/photo),
  Projects (the Wall), About, Map, Footer. Each is its own file in
  `src/components/sections/`, assembled in `src/app/page.tsx`.
- **Content files** — text (`src/content/profile.ts`,
  `src/content/experience.ts`) kept separate from the components that
  display it, so copy changes don't require touching component code.

## Where things go

See `TODO.md` for the current checklist of what's pending and exactly which
`public/` path each asset needs to land at.
