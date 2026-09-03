# Portfolio TODO

See `GLOSSARY.md` for what the words mean (Wall, Frame, Loop, Guardrail…).

## ⬆️ WHERE TO DROP FILES

These folders exist and are ready — drop files in, and the matching tile
appears on the Wall automatically. Nothing shows a broken box in the
meantime: a tile whose file is missing simply doesn't render (see
"Guardrails" below).

| What | Put it here | Status |
|---|---|---|
| **LinkedIn video 1** | `public/gallery/video-1.mp4` | ⬜ waiting |
| **LinkedIn video 2** | `public/gallery/video-2.mp4` | ⬜ waiting |
| Maps — rivers + soils, Mexico + Oaxaca (4) | `public/gallery/maps/` | ✅ done |
| Company logos | `public/logos/pano-ai.svg`, `gridware.svg`, `hyticos.svg` | ⬜ waiting |
| Gallery slots (20) | `public/gallery/slots/` — each slot shows its own path | ⬜ waiting |
| Satanizar el Fuego slides (6) | `public/gallery/satanizar/01-cover.jpg` … `06-bibliografia.jpg` | ⬜ waiting |
| Connie Chan photo | `public/gallery/connie-chan.jpg` | ⬜ waiting |
| Pepe Mujica photo | `public/gallery/pepe-mujica.jpg` | ⬜ waiting |
| Mamdani photo | `public/gallery/mamdani.jpg` | ⬜ waiting |
| Resume PDF | `public/cv.pdf` | ⬜ waiting |
| Papers/PDFs | `public/papers/` | ⬜ waiting |
| Hero portrait | `public/profile.png` | ✅ done (background removed) |

Exact filenames matter — they're what `src/components/gallery/data.ts`
already points at. Run `npm run check:assets` any time to see what's still
missing.

## Gallery contents — the running list

**In and working:**
- ✅ Conway's Game of Life (live simulation)
- ✅ LANDFIRE 2024 Vegetation Cover (live map, satellite basemap)
- ✅ Growing Neural Cellular Automata (link → Distill)
- ✅ How to Do Nothing — Jenny Odell (cover art via Open Library)
- ✅ Credits tile

**Wired up, waiting only on the file drop** (see table above): the two
LinkedIn videos, the four Oaxaca maps, Satanizar el Fuego deck, Connie
Chan, Pepe Mujica, Mamdani.

**Still to decide / add:**
- [ ] `Papers` tile points at `/papers`, which doesn't exist yet — either
      build a real papers index page, drop PDFs in `public/papers/` and
      point at one, or split into one tile per paper.
- [ ] Credits entries for Connie Chan, Pepe Mujica, Mamdani, and the Oaxaca
      maps still say `TODO: source credit` — fill in real attribution.
- [ ] You mentioned "ALSO…" and got cut off — what else goes on the Wall?

## Guardrails (how failure is handled)

Two layers, so nothing broken is ever *shown*:
1. **Build time** — `npm run check:assets` (runs automatically before
   `dev`/`build`) lists referenced files missing from `public/`. Warns
   only, never blocks: wiring a tile before its file exists is normal.
2. **Runtime** — a tile whose image/video/data fails to load removes itself
   from the Wall entirely and logs `[gallery:hidden] …` to the browser
   console with the reason. Open devtools and filter for `gallery:hidden`
   to see what's currently hidden and why.

## Contact

- ✅ Nav "Contact" button is white; footer "Get in touch" removed.
- ✅ Modal has an "email me directly" mailto link, and the form falls back
  to opening the visitor's email client prefilled.
- [ ] **Wire the form to a real backend so messages land in your inbox
      without the visitor sending them.** Free option: sign up at
      formspree.io, create a form, paste its endpoint into
      `FORMSPREE_ENDPOINT` in `src/components/contact/ContactModal.tsx`.
      Until then, the mailto fallback handles it.
- [ ] Confirm the contact email — currently `alvagalv@uni.minerva.edu`
      (`CONTACT_EMAIL` in `ContactModal.tsx`). A .edu address won't outlive
      your enrollment; consider a personal address.
- [ ] Replace placeholder `SOCIALS` links (Instagram, LinkedIn, GitHub) —
      they're `your-handle` placeholders.

## Map section (`src/components/map/`)

Base map with a Streets/Satellite/Terrain/Dark switcher is live, bounded so
the world never repeats, zoom-out capped, ctrl/⌘+scroll to zoom (plain
scroll passes through to the page). To add:
- [ ] Pins for places you've lived.
- [ ] Pins for where friends are.
- [ ] A "What is UWC" marker with an info popup.
- [ ] A legend/toggle once there are several pin layers.

## Content (`src/content/`)

- [ ] `profile.ts` — the `skills` list was pulled from job bullet points as
      a placeholder; refine it into an actual skills list.

## Module structure

The codebase is split by feature so different pieces can be worked on
independently without touching shared files:

- `src/components/gallery/` — the Wall.
  - `HorizontalGallery.tsx` — the looping horizontal scroller.
  - `data.ts` — the actual pieces. **Edit this file to add/reorder/resize
    tiles — no need to touch any component.**
  - `frames/` — one file per tile *kind*; `frames/registry.tsx` documents
    how to add a new kind.
  - `reportAssetIssue.ts` — the single place failures get logged; swap in a
    real error-tracking service here later if you ever want one.
- `src/components/map/` — `BaseMap.tsx` + `baseLayers.ts` + `MapControls.tsx`.
- `src/components/contact/` — `ContactModal.tsx` + `ContactTrigger.tsx`.
- `src/components/sections/` — one file per page section, composed in
  `src/app/page.tsx`.
- `src/content/` — text as data, separate from components.
- `src/app/api/landfire-tile/` — proxy for LANDFIRE map tiles (works around
  a browser block; see the file's comment).
