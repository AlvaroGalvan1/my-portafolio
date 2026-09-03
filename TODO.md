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
| Sunglasses/kitchen portrait, **full resolution** | `public/gallery/portraits/` | ⬜ waiting — see note |

> **Note on the portrait:** the file you have
> (`~/Downloads/IMG 2476 from Google Photos.jpg`) is a **293 × 220 px, 28 KB
> thumbnail**, not the original — Google Photos hands out a preview unless
> you explicitly download the full file. Too small for anything here: even
> the smallest Wall tile is `26vw` (≈375 px on a laptop, ≈665 px on a large
> monitor, double that on retina). Re-download the original from Google
> Photos (⋯ → Download) or pull it off your phone, then it's usable.

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
- [ ] **Where the sunglasses portrait goes.** You liked a reference style:
      full-bleed photo, big display type over it in two colours (brand +
      white), text sitting in the photo's empty space. Three candidate homes,
      pending the full-res file above:
  - **Wall tile (recommended)** — as a `post` tile with a caption, the same
    treatment as "Un logro colectivo". The busy kitchen background and the
    shades are the *point* here, not a problem to design around.
  - **About section lede** — the About overhaul already puts Bio full-width;
    a portrait could anchor that column. Needs the least resolution.
  - **Hero background** — closest to the reference, and `Hero.tsx` already
    does the exact type treatment (white display type, maroon stroke,
    bottom-left) over a flat orange field, so it's a backdrop swap. But
    this photo fights it: the background is busy right where the name sits
    (needs a ~50–60% maroon/orange scrim to keep the type readable), and
    the mirrored shades hide the eye contact that makes the reference land.
    A photo shot for the job — clean background, subject offset, empty
    space for the name — would serve the Hero better.

### Accounts / config only you can create
- [ ] **Formspree endpoint** so the contact form reaches your inbox. The
      code is already wired and waiting: sign up at formspree.io, point a
      form at `alvaroemiliogalvansandoval@gmail.com`, confirm the address
      from their email, then set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in
      `.env.local` locally and in Vercel for production, and redeploy.
      Full steps are in `.env.example`. Until then the form falls back to
      opening the visitor's own mail client, prefilled.
- [ ] **Enable Web Analytics** in the Vercel dashboard (Project → Analytics
      → Enable). The code side is in READY TO BUILD below, but it collects
      nothing until this toggle is on. Free on the Hobby plan, though the
      included event allowance is capped — check the current limit on the
      pricing page if you start firing a lot of custom events.

---

## 🟡 READY TO BUILD — unblocked, just needs doing

Roughly in order of how much the site gains per hour spent.

- [ ] **Friends' pins on "My Journey".** Everything else on the map is
      done (see below) — this group is data-only: add entries to
      `src/content/places.ts` with `group: "friends"` and the legend row
      appears on its own. **Needs names + cities from you.**
- [ ] **LANDFIRE tile context.** `LandfireFrame.tsx` shows a live map and a
      link, with no explanation of what LANDFIRE is for someone who's never
      heard of it. Logo is now in the repo (`public/logos/landfire.png`) —
      just needs the copy and the layout.
- [ ] **Visitor analytics.** Who visits, what they click, where from.
      Recommended: **Vercel Web Analytics** — you're already hosting there,
      so it's the least-effort option that actually works:
      1. `npm i @vercel/analytics`
      2. Render `<Analytics />` in `src/app/layout.tsx` (inside `<body>`)
      3. Turn Web Analytics on for the project in the Vercel dashboard
      No cookies, no consent banner, no PII — so nothing to add to a privacy
      policy. *Check `node_modules/next/dist/docs/` for the current App
      Router integration before writing the code — this is Next 16.3.3 and
      the setup may differ from older guides (see `AGENTS.md`).*

      Out of the box that gives page views, unique visitors, top pages,
      referrers, country, and device/browser. The interesting part is
      **custom events** (`track("name", { ...props })`) — worth wiring on:
  - Wall tile opened in the lightbox, with the tile `id` as a prop —
    *the most useful signal on the whole site*: it tells you which pieces
    people actually care about, which should drive what goes on the Wall
    next and what gets cut
  - "Download CV" click (`About.tsx`)
  - Contact modal opened, and separately, form actually submitted — the gap
    between those two numbers is the real conversion story
  - Outbound clicks: the three footer socials, LANDFIRE's official viewer,
    book links, the LinkedIn post links
  - How far people scroll the Wall before giving up (fire an event at a
    couple of depth milestones rather than continuously)

      Keep the event names in one small module rather than inline string
      literals scattered across components — typos in event names fail
      silently and you won't notice for weeks.
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
- **About layout overhaul** done: Bio runs full-width and unboxed with its
  first paragraph set as a lede, remaining paragraphs in two columns, and
  Experience + Skills split 2:1 below a rule.
- **"My Journey" is the CV education section as a map.** 9 campuses across
  8 countries, grouped by institution (Minerva / UWC / UAA) with each
  institution's own logo as the pin and in the legend. Popups are CV
  entries: institution, city, address, credential, dates, one line of
  substance. Headline counts above the map are derived from the data, so
  they cannot go stale.
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
