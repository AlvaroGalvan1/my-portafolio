# Portfolio TODO

See `GLOSSARY.md` for what the words mean (Wall, Frame, Loop, Guardrail…).

Organised by **who is blocked**, not by section — the question that matters
when picking up this list is "can I start this, or am I waiting on Álvaro?"

---

## 🔴 BLOCKED ON YOU — nothing can proceed until these land

### File drops
Drop the file at the exact path and the tile/logo appears on its own.
Nothing shows a broken box in the meantime (see Guardrails). Run
`npm run check:assets` any time to see what's still missing.

| What | Path | Status |
|---|---|---|
| Satanizar el Fuego slides (6) | `public/gallery/satanizar/01-cover.jpg` … `06-bibliografia.jpg` | ⬜ waiting |
| LinkedIn video 1 | `public/gallery/video-1.mp4` | ⬜ not wired yet — see note |
| LinkedIn video 2 | `public/gallery/video-2.mp4` | ⬜ not wired yet — see note |
| Gallery slots (20) | `public/gallery/slots/` — each slot tile shows its own path | ⬜ waiting |
| Fuego.Earth logo | `public/logos/fuego-earth.svg` | ⬜ waiting — not scrapeable, see below |

> **Note on the LinkedIn videos:** unlike the rows above, these are *not*
> referenced in `data.ts` yet, so dropping the files alone does nothing.
> They need a decision first (which shape on the Wall, what title/caption),
> then a `data.ts` entry. Say the word and they get wired.

### Information only you have
- [ ] **Hyticos job entry** — `experience.ts` has a placeholder with
      `role: "TODO: role"`, `dates: "TODO: dates"`, `location: "TODO"` and
      no bullets. Needs the real role, dates, location and 2–3 bullets.
      *This currently renders on the live site as literal "TODO: role"
      text* — worth fixing or removing soon.
- [ ] **Fuego.Earth job entry** — not in `experience.ts` at all yet. Needs
      role, dates, location, bullets (+ the logo above).
- [ ] **Oaxaca map credits** — the four river/soil maps carry
      `TODO: source credit`. Who made them / what data source?
- [ ] **Per-experience extra content** — you wanted more than bullets per
      job; specifics never decided.
- [ ] **"ALSO…"** — you got cut off mid-sentence a while back listing more
      things for the Wall. What was the rest?

### Accounts / config only you can create
- [ ] **Formspree endpoint** so the contact form reaches your inbox. The
      code is already wired and waiting: sign up at formspree.io, point a
      form at `alvaroemiliogalvansandoval@gmail.com`, confirm the address
      from their email, then set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in
      `.env.local` locally and in Vercel for production, and redeploy.
      Full steps are in `.env.example`. Until then the form falls back to
      opening the visitor's own mail client, prefilled.

---

## 🟡 READY TO BUILD — unblocked, just needs doing

Roughly in order of how much the site gains per hour spent.

- [ ] **About layout overhaul.** Currently three equal boxed columns, which
      reads uniform and boxy. Target: Bio full-width up top as plain
      typography (a lede, no card background); Experience + Skills split
      below it, Experience wider.
- [ ] **"My Journey" pins.** The map is live and empty. All the addresses
      are known except one:
  - UAA — Aguascalientes, Mexico (Planet Central)
  - UWC Mahindra — India *(exact campus coordinates still needed —
    geocodable from the name, worth you confirming)*
  - UWC Maastricht — Netherlands
  - Minerva University — SF (16 Turk St) · Seoul (Shinheungno 26-gil,
    Yongsan-gu, 04337) · Berlin (Boxhagener Straße 73, Friedrichshain,
    10245) · Buenos Aires/Retiro (Esmeralda 920, 9th floor) · Taipei
    (No. 81 Jingfeng St, Wenshan District, 11687) · Hyderabad (Survey
    No. 09, Kondapur, Whitefields, Telangana 500084)
  - [ ] Pins for where friends are
  - [ ] "What is UWC" marker with an info popup
  - [ ] Legend / layer toggle once there are several pin groups
- [ ] **LANDFIRE tile context.** `LandfireFrame.tsx` shows a live map and a
      link, with no explanation of what LANDFIRE is for someone who's never
      heard of it. Logo is now in the repo (`public/logos/landfire.png`) —
      just needs the copy and the layout.
- [ ] **Post-style layout on more tiles.** `type: "post"` (see
      `PostFrame.tsx`) opens a lightbox with photo + body text + link out.
      You want this treatment applied more widely so tiles carry story
      rather than being bare images. **Needs body copy per tile from you —
      the layout exists, the words don't.**
      **Exception: videos keep no sidecard** — `VideoFrame.tsx` opens
      straight to the video full-size with sound, and that stays.

---

## ✅ DONE

- Hero name scaled back down; location reads "Mission District, San Francisco"
- Socials point at the real GitHub / Instagram / LinkedIn profiles
- Footer is three white social marks, nothing else
- "Resources" renamed **My Wall**, with an ⓘ note explaining what's on it
- "Map" renamed **My Journey**, now in the nav and anchored at `#journey`
- Map stripped to a satellite base layer; the 4-way layer picker is gone
- Books share one tile format (`book()` in `data.ts`) — How to Do Nothing,
  This Changes Everything, The Dispossessed
- Graduation post ("Un logro colectivo") on the Wall as the first `post` tile
- Contact form: personal email, required reply-to field, Formspree-ready
- Company logos scraped and committed: **Pano AI**, **Gridware**, **LANDFIRE**
- Skills: added Google Earth Engine, PostGIS, Remote Sensing
- `profile.ts` dead `skills` array deleted (`skills.ts` is the one source)
- Résumé PDF in place at `public/cv.pdf`
- Hero portrait in place (background removed)
- Oaxaca maps (4) in place

**Dropped from scope:** Connie Chan / Pepe Mujica / Mamdani photos (entries
removed from `data.ts`), Papers/PDFs (`public/papers/`).

---

## Guardrails (how failure is handled)

Two layers, so nothing broken is ever *shown*:
1. **Build time** — `npm run check:assets` (runs automatically before
   `dev`/`build`) lists referenced files missing from `public/`. Warns
   only, never blocks: wiring a tile before its file exists is normal.
2. **Runtime** — a tile whose image/video/data fails to load removes itself
   from the Wall entirely and logs `[gallery:hidden] …` to the browser
   console with the reason. Open devtools and filter for `gallery:hidden`
   to see what's currently hidden and why.

## Module structure

Split by feature so pieces can be worked on without touching shared files:

- `src/components/gallery/` — the Wall.
  - `HorizontalGallery.tsx` — the looping horizontal scroller.
  - `data.ts` — the actual pieces. **Edit this file to add/reorder/resize
    tiles — no need to touch any component.**
  - `frames/` — one file per tile *kind*; `frames/registry.tsx` documents
    how to add a new kind.
  - `reportAssetIssue.ts` — the single place failures get logged.
- `src/components/map/` — `BaseMap.tsx` + `baseLayers.ts`.
- `src/components/contact/` — `ContactModal.tsx` + `ContactTrigger.tsx`.
- `src/components/sections/` — one file per page section, composed in
  `src/app/page.tsx`.
- `src/content/` — text as data, separate from components.
- `src/app/api/landfire-tile/` — proxy for LANDFIRE map tiles (works around
  a browser block; see the file's comment).
