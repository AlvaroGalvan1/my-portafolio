# Portfolio TODO

See `GLOSSARY.md` for what the words mean (Wall, Frame, Loop, Guardrail…).
For what's already shipped, see `git log` — this file is only what's left.

## How to use this list

The page has four sections, and the list is split the same way, in page
order: **The Top** → **The Wall** → **Experience** → **My Journey**. Two
threads cut across all four (Credits, Analytics) and get their own sections
at the end.

Every task is written to stand alone. Each has a **Prompt** you can copy
straight into a fresh conversation without explaining any background — it
names its own files and its own constraints. Nothing here depends on you having read
anything above it.

Each task is tagged with what it needs:

| Tag | Meaning |
|---|---|
| 🟢 **GO** | Fully specified. Copy the prompt, run it, done. |
| 🟣 **DESIGN** | Needs back-and-forth first — research, options, your taste. Budget a conversation, not a command. |
| 🔴 **YOU** | Blocked on a file or a fact only you have. |

---

# 📥 FILE DROPS

Drop the file at the exact path and it appears on its own — no code change.
A missing file renders as a hidden tile, never a broken box. Run
`npm run check:assets` any time to see what's still missing.

| What | Exact path | Status |
|---|---|---|
| **Satanizar el Fuego slides (6)** | `public/gallery/satanizar/` — see filenames below | ⬜ **this is the folder you asked about** |
| Gallery slot images (20) | `public/gallery/slots/` — each slot tile shows its own path on the Wall | ⬜ waiting |
| Fuego.Earth logo | `public/logos/fuego-earth.svg` | ⬜ waiting |
| Sunglasses/kitchen portrait, **full resolution** | `public/gallery/portraits/sunglasses.jpg` | ⬜ waiting — see [T2](#t2) |

### Satanizar el Fuego — the six filenames

Put them in **`public/gallery/satanizar/`**, named exactly:

```
public/gallery/satanizar/01-cover.jpg
public/gallery/satanizar/02-que-significa.jpg
public/gallery/satanizar/03-por-que-lo-hacemos.jpg
public/gallery/satanizar/04-por-que-dejarlo.jpg
public/gallery/satanizar/05-que-podemos-hacer.jpg
public/gallery/satanizar/06-bibliografia.jpg
```

The tile is already wired in `data.ts` and credited to *Diana Soto,
"Gestión Integral del Fuego en el mundo", Sept. 2025*. Names must match
character for character — `.jpg`, not `.jpeg`. Drop all six and the tile
turns on by itself.

**✅ No longer waiting:** the two LinkedIn videos are in
(`prairie-dog.mp4`, `leopard-gecko.mp4`) and wired. They now need titles
and credits instead — see [W2](#w2).

---

# 1️⃣ THE TOP — `Hero.tsx`

Currently: your name huge in white over flat orange, location line, two
buttons. Nothing else.

<a id="t1"></a>
## T1 🟣 Move the intro line up here, revealed on click

The line that should greet people first is currently buried as the first
paragraph of About:

> Hola! Soy Álvaro de Oaxaca 🌍 I'm passionate about using technology to
> help society adapt to a changing planet. My work lives at the intersection
> of GeoAI, satellite data, and people — especially wildfire modeling and
> the energy transition.

You want it at the top, and you want it to *appear* when you click
something rather than sit there statically.

**This one needs a design conversation, not a command.** Three things to
settle before any code, roughly in order:

1. **What's the trigger?** A word in the name that's clickable, a small
   marker, the location dot that's already there, the whole hero? The
   trigger has to read as clickable without a button's worth of chrome, or
   nobody clicks it and the line is never seen.
2. **What's the reveal?** Slide down, type on, panel over the orange, name
   moves aside. This is where the reference-hunting goes — worth looking at
   how other portfolio sites handle a hidden intro, then picking.
3. **What happens for people who don't click?** If the line is genuinely
   the most important sentence on the site, hiding it entirely behind an
   interaction is a real cost. Options: reveal automatically after a beat,
   show a truncated version, or accept it as a reward for the curious.

Also to decide: does the line stay in About as well, or move out entirely?

> **Prompt:** *Read `src/components/sections/Hero.tsx`,
> `src/components/sections/About.tsx` and `src/content/profile.ts`. I want
> the first bio paragraph ("Hola! Soy Álvaro de Oaxaca…") moved from About
> to the Hero, where it's hidden until the visitor clicks something. Before
> writing code: research how other portfolio and personal sites handle a
> click-to-reveal intro line, show me 3–4 distinct approaches with a
> description of each interaction, and recommend one. Then we'll decide the
> trigger, the animation, and whether the line stays in About too.*

<a id="t2"></a>
## T2 🔴🟣 The portrait, in the style you liked

**Blocked on the file.** The version you have
(`~/Downloads/IMG 2476 from Google Photos.jpg`) is a **293 × 220 px, 28 KB
thumbnail** — Google Photos hands out a preview unless you explicitly
download the original. Too small for anything on this site: the *smallest*
Wall tile is 26vw, roughly 375 px on a laptop and 665 px on a large
monitor, doubled again on a retina screen. Re-download the full file
(Google Photos → ⋯ → Download) or pull it off your phone, and put it at
`public/gallery/portraits/sunglasses.jpg`.

**The treatment you're after**, from the reference you showed: a full-bleed
photo running edge to edge, with big display type sitting *over* it in the
photo's empty space, split across two colours — part in the brand red, part
in white. Subject offset to one side, type in the gap the subject leaves.

Your Hero already does most of that: `Hero.tsx` sets your name in the
display font, white with a maroon stroke, anchored bottom-left. The change
is the backdrop — flat orange becomes the photo. Two problems specific to
*this* photo, both solvable but worth naming:

- **The background is busy** exactly where the type goes — fruit bowl,
  jars, striped wall. The reference gets away with clean type because the
  wall behind it is empty. Fix: a brand-coloured scrim over the photo at
  roughly 50–60%, which keeps the orange/maroon identity while flattening
  the clutter enough for white type to hold.
- **The sunglasses hide your eyes.** In the reference, the eye contact is
  what makes it land. Mirrored shades read fun, not "front door of a
  portfolio". Not a blocker — a taste call you should make deliberately.

If the Hero version doesn't convince once it's on screen, the fallback is
the Wall, where the fruit and the shades are the point rather than
something to design around.

> **Prompt:** *The file `public/gallery/portraits/sunglasses.jpg` is now in
> place. Read `src/components/sections/Hero.tsx`. Replace the flat orange
> background with this photo, full-bleed, keeping the existing display-type
> treatment for my name (white, maroon stroke, bottom-left). Add a
> brand-coloured scrim over the photo — start around 55% — so the type
> stays readable over the busy kitchen background, and tune it until the
> name reads cleanly at both mobile and desktop widths. Keep the location
> line and both buttons. Show me the result before committing.*

---

# 2️⃣ THE WALL — `src/components/gallery/`

<a id="w1"></a>
## W1 🟣 Credit strategy — do this before W2 and W4

**The one you flagged as important, and the one that should go first**,
because W2 and W4 both write credit data and shouldn't be written twice.

**The goal, in your words:** anyone looking at a piece on the Wall should
be able to get from it to the person or agency who made it — LANDFIRE, the
person who posted it on LinkedIn, the photographer — easily.

**What exists today is two half-systems that don't know about each other:**

- `source: { handle, href }` → renders as a small `@handle` in the tile
  corner, **only on hover**, and only links to a homepage. Used by the
  books, Distill, and LANDFIRE.
- `credit: "free text string"` → a plain sentence with no link, shown
  **only inside the lightbox**. Used by the Satanizar deck.

So some pieces credit on the tile, some in the lightbox, some in neither,
the shapes differ, and hover-only means credit is invisible on a phone —
where there is no hover at all. That last point is the real bug: on mobile,
most of the Wall is currently uncredited.

**The proposal to react to:** collapse both into one structured field, so
every tile is credited the same way and it's impossible to add a piece
without saying where it came from.

```ts
credit: {
  who: "Diana Soto",                    // person or organisation
  relation: "author",                   // author | data | photo | posted | mine
  href: "https://linkedin.com/in/…",    // straight to them, not a homepage
  context: "Gestión Integral del Fuego en el mundo, Sept. 2025",  // optional
}
```

Points to settle with you:

- **Is `relation` the right vocabulary?** "Data from LANDFIRE" and "Posted
  by Diana Soto" and "Photo by X" are genuinely different relationships and
  flattening them to one word loses that.
- **Where does it show?** Recommendation: tile corner *always visible*
  (not hover) at small size, plus the full credit in the lightbox. You
  liked how "Un logro colectivo" reads — that's the lightbox layout, so the
  lightbox half is already close.
- **Does `mine` render at all?** Your own work probably shouldn't carry a
  byline, but the field should still be required so nothing slips through
  uncredited by accident.
- **Enforcement:** make `credit` non-optional in the `FrameBase` type, so
  TypeScript refuses to build a tile without one. That's what stops this
  drifting again in six months.

> **Prompt:** *Read `src/components/gallery/frames/base.ts`,
> `frames/shared.tsx`, `frames/registry.tsx`, `data.ts`, and the lightbox
> component. The Wall currently has two overlapping attribution mechanisms:
> a hover-only `source: {handle, href}` byline on the tile, and a free-text
> `credit` string shown only in the lightbox. I want one credit system:
> structured, required by the type system so no tile can ship uncredited,
> always visible on the tile (not hover-only — it's invisible on mobile
> today), and linking straight to the creator rather than a homepage.
> Propose the data shape and the two render treatments (tile + lightbox)
> before writing code. Then migrate every existing entry in `data.ts` to
> it. The lightbox treatment should follow how the "Un logro colectivo"
> post already reads.*

<a id="w2"></a>
## W2 🔴🟢 Fix the two video tiles — titles and credits

Both LinkedIn videos are in the repo and on the Wall, but:

- **`prairie-dog`** has a literal `TODO: real title` comment and no credit.
  The code notes it's a clip from a **Nature Conservancy Colorado** post,
  so it is *not* your footage and needs attribution before it's live.
- **`leopard-gecko`** — needs the same check. Yours, or someone else's?

🔴 **From you:** a real title for each, and for anything not yours, the
name + link of whoever made it. Then it's a 🟢 five-minute edit.

Best done right after W1, so the credits get written in the new shape once.

> **Prompt:** *In `src/components/gallery/data.ts`, the `prairie-dog` and
> `leopard-gecko` video entries need real titles and proper attribution —
> prairie-dog is a Nature Conservancy Colorado clip, not my footage. Set
> the titles to [TITLES] and the credits to [CREDITS]. Use the credit
> system as it stands after W1.*

<a id="w3"></a>
## W3 🟣 Post-style tiles — the treatment you like, applied wider

`type: "post"` (see `PostFrame.tsx`) is the "Un logro colectivo" tile: the
photo on the Wall, and clicking opens a lightbox with the photo, the full
text, the credit, and a link out to where it lives. You want more tiles
carrying story this way instead of being bare images.

**The layout already exists and works — what's missing is the words.** This
is a writing task disguised as a code task. It can't be batch-executed;
it needs a pass per tile with you.

🔴 **From you:** for each tile you want converted, the body copy and the
link out. Realistically one sitting where we go tile by tile.

**Exception, as you said: videos keep no sidecard.** `VideoFrame.tsx` opens
straight to the video at full size with sound, and that stays.

> **Prompt:** *Read `src/components/gallery/frames/PostFrame.tsx` and
> `data.ts`. I want to convert these tiles to `type: "post"` so they open
> with body text like the graduation post does: [LIST TILES]. Go one at a
> time — show me the current entry, ask me for the body copy and the link
> out, then write it. Do not convert any video tile.*

<a id="w4"></a>
## W4 🟢 LANDFIRE tile — say what LANDFIRE actually is

`LandfireFrame.tsx` renders a live vegetation-cover map and a link to the
official viewer, with zero explanation. Someone who's never heard of
LANDFIRE sees a green map of the US and moves on. The logo is already in
the repo at `public/logos/landfire.png` — it just needs the copy and a
layout that fits it in without covering the map.

Fully unblocked; the only open question is how much text, which is easier
to answer looking at it than in the abstract.

> **Prompt:** *Read `src/components/gallery/frames/LandfireFrame.tsx`. The
> tile shows a live LANDFIRE vegetation-cover map with no context for
> anyone who doesn't already know what LANDFIRE is. Add the logo
> (`public/logos/landfire.png`) and a short explanation of what LANDFIRE is
> and why this layer matters for wildfire work. Keep the live map the main
> event — the text should not cover it. Propose two layout options before
> implementing.*

<a id="w5"></a>
## W5 🔴 The 20 empty slots — fill or cut

`data.ts` ends with twenty `placeholder` tiles rendering as dashed outlines
so the Wall's shape is visible. They're honest scaffolding, but twenty
empty boxes is a lot of empty on a live site.

🔴 **Decide:** fill them (drop images at the paths each slot shows), or cut
the count down to however many pieces you actually have coming.

---

# 3️⃣ EXPERIENCE — `About.tsx` *(currently "About")*

<a id="e1"></a>
## E1 🟢 Rename the section

You want "About" to become "Experience" or similar. Small, but it touches
four places and should be done in one commit: the `<h2>` in `About.tsx`,
the nav link label and `#about` anchor in `Nav.tsx`, the section `id`, and
the filename itself if you want it to match.

Worth deciding the name first — if T1 moves the bio up to the Hero, this
section becomes purely Experience + Skills, and "Experience" is exactly
right. If the bio stays, "About" still fits better. **So do T1 first, or
decide the name knowing T1 is coming.**

> **Prompt:** *Rename the About section to "Experience" throughout:
> the heading in `src/components/sections/About.tsx`, the nav label and
> anchor in `Nav.tsx` (`#about` → `#experience`), the section `id`, and
> rename the file to `Experience.tsx`, updating the import in
> `src/app/page.tsx`. Check nothing else links to `#about`.*

<a id="e2"></a>
## E2 🔴 Hyticos — three missing fields

**Mostly done.** Fuego.Earth is written up in full and live. Hyticos has its
work described (the AHP fire-index map), but is still missing three things,
and they're not things to invent on a portfolio:

- **Role title**
- **Dates**
- **Location**

Until those land, the placeholder filter at the bottom of `experience.ts`
keeps the whole entry off the site — so nothing broken is showing, it's
just absent. Give me the three fields and it appears on its own.

Still waiting on the logo too: `public/logos/hyticos.svg`.

> **Prompt:** *In `src/content/experience.ts`, the Hyticos entry has its
> `summary` written but `role`, `dates` and `location` are still `TODO:`
> placeholders, which keeps it filtered off the site. Set them to
> [ROLE], [DATES], [LOCATION]. Then check it renders in the Experience
> section and sits in the right chronological position among the other
> jobs.*

<a id="e3"></a>
## E3 🟣 The tuned-CV problem

The thing you raised, and it's a genuinely interesting one worth its own
conversation:

> You send different CVs tuned to different roles. Someone reads a tuned CV,
> comes to the site, and finds an experience section that reads differently
> — broader, or emphasising other things. The gap between the two is
> awkward at best and looks inconsistent at worst.

No obvious right answer, so this is a discussion, not a task. The shapes it
could take, roughly from least to most work:

1. **Make the site the superset.** The site shows everything; each CV is a
   subset of it. The gap stops being a contradiction and becomes "the CV is
   the short version" — which is what a reader assumes anyway.
2. **Reframe by outcome rather than by role.** Write bullets around what
   changed because of the work rather than the tools used, so the same text
   reads as relevant to a GIS role and a climate-policy role without being
   rewritten for either.
3. **Let the visitor pick the lens.** A toggle — "I'm here about GeoAI /
   climate / data" — that re-emphasises which bullets show. Genuinely
   useful, real design and content work, and risks feeling gimmicky if
   done lightly.
4. **Per-application links.** A URL like `?role=geoai` that tunes the page
   to match the CV you sent. Most precise, most machinery, and easy to
   forget to maintain.

There's also the related thing you mentioned earlier and never specified:
**extra content per experience** beyond the bullets. Worth folding into the
same conversation, since both are "how much does each job say, and to
whom".

> **Prompt:** *I send CVs tuned to different roles, and I'm worried about
> the gap between a tuned CV and what my portfolio's experience section
> says. Read `src/content/experience.ts` and
> `src/components/sections/About.tsx`. Walk me through the options for
> handling this — superset, outcome-framed bullets, a visitor-selectable
> lens, per-application URLs — with the real tradeoffs of each, then
> recommend one. I also want more content per job than bullets; factor that
> in. Don't write code until we've settled the approach.*

---

# 4️⃣ MY JOURNEY — `Journey.tsx`, `src/components/map/`

<a id="j1"></a>
## J1 🟢 Move the headline numbers

`Journey.tsx` currently opens with three big numbers in a row — campuses,
countries, institutions — above the map. You want the "8 countries" out of
that row, and whatever survives placed somewhere better.

The row has a real problem: three display-size numbers stacked above a map
compete with the map for the eye, and they're the least interesting thing
in the section — the pins are the content. Options, needing one decision
from you:

- **Cut the row entirely**, and let the map speak. Cleanest.
- **Keep one number**, woven into the intro line as a sentence rather than
  standing as a stat — *"Nine campuses, eight countries, one degree."*
- **Move them onto the map** as a small overlay in a corner, so they label
  the thing they describe instead of sitting above it.

All three are derived from `places.ts` and stay accurate automatically.

> **Prompt:** *Read `src/components/sections/Journey.tsx` and
> `src/content/places.ts`. The three headline stats (campuses, countries,
> institutions) sit in a row above the map and compete with it. Remove the
> row. Show me two alternatives: one where the numbers become part of the
> intro sentence, and one where a single number overlays a corner of the
> map. Keep them derived from `places.ts` so they can't go stale.*

<a id="j2"></a>
## J2 🔴 Friends' pins

The map, legend, and grouping all work — this group is data-only. Add
entries to `src/content/places.ts` with `group: "friends"` and the legend
row appears by itself.

🔴 **From you:** names and cities. Also worth thinking about whether you
want friends' names public on a site recruiters read.

Two smaller map ideas from earlier, still open: a **"What is UWC" marker**
with an info popup, for the many readers who won't know the acronym.

---

# 📊 ANALYTICS — the good place to start

Genuinely the best first task on this list: small, self-contained, touches
almost nothing, and every other decision here gets easier once you can see
what people actually click. Do it before the design work, so the design
work has data.

<a id="n1"></a>
## N1 🟢 Install and turn on

Three steps: `npm i @vercel/analytics`, render `<Analytics />` inside
`<body>` in `src/app/layout.tsx`, then enable Web Analytics in the Vercel
dashboard (Project → Analytics → Enable — 🔴 only you can do that part; it
collects nothing until the toggle is on).

No cookies, no consent banner, no PII, so nothing to add to a privacy
policy. Out of the box: page views, unique visitors, top pages, referrers,
country, device/browser.

⚠️ This project is on **Next 16.3.3**, and `AGENTS.md` is explicit that
published guides may be stale for this version — check
`node_modules/next/dist/docs/` for the current App Router integration
before writing the code.

> **Prompt:** *Add Vercel Web Analytics to this project. Install
> `@vercel/analytics` and render `<Analytics />` in
> `src/app/layout.tsx`. This is Next 16.3.3 — per `AGENTS.md`, check
> `node_modules/next/dist/docs/` for the current App Router integration
> before writing anything, rather than following a remembered guide.*

<a id="n2"></a>
## N2 🟢 Custom click events

Where the real value is. Do it as its own task after N1 is deployed and
confirmed working.

- **Wall tile opened, with the tile `id` as a property** — *the single most
  useful number on this site.* It tells you which pieces earn their place
  and which should be cut, which directly answers W5 and W3.
- **"Download CV" clicked** (`About.tsx`)
- **Contact modal opened**, and separately, **form actually submitted** —
  the gap between those two is the real conversion story
- **Outbound clicks** — the three footer socials, LANDFIRE's viewer, book
  links, LinkedIn post links
- **Wall scroll depth** — how far people get before giving up. Fire at two
  or three milestones, not continuously.

Keep event names in one small module, not as inline strings across
components: a mistyped event name doesn't error, it just silently never
appears in the dashboard, and you won't notice for weeks.

> **Prompt:** *Vercel Web Analytics is live on this project. Add custom
> event tracking. Create one module holding every event name as a typed
> constant — no inline string literals in components. Track: a Wall tile
> opened in the lightbox with the tile id as a property; the Download CV
> click; the contact modal opening and the form submitting as two separate
> events; outbound clicks on the footer socials and external tile links;
> and Wall scroll depth at two or three milestones. Read
> `src/components/gallery/HorizontalGallery.tsx`,
> `src/components/sections/About.tsx`, `Footer.tsx`, and
> `src/components/contact/` first.*

---

# 🧭 Suggested order

Rough sequence, given what unblocks what:

1. **N1 + N2 — analytics.** Small, isolated, and starts collecting data
   while everything else is still being decided.
2. **W1 — credit strategy.** Blocks W2 and W3; doing it after them means
   writing every credit twice.
3. **W2, W4, J1, E1** — the small unblocked ones, any order.
5. **T1 — the click-to-reveal intro.** Design conversation. Settle it
   before E1's rename, since it decides whether the section is still
   "About".
6. **T2 — the portrait**, once the full-res file exists.
7. **E3 — the tuned-CV question.** The most open-ended thing here, and the
   one that benefits most from having analytics data first.

---

# 📎 Reference

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
- `src/components/map/` — `BaseMap.tsx` + `baseLayers.ts` + `MapLegend.tsx`.
- `src/components/contact/` — `ContactModal.tsx` + `ContactTrigger.tsx`.
- `src/components/sections/` — one file per page section, composed in
  `src/app/page.tsx`.
- `src/content/` — text as data, separate from components.
- `src/app/api/landfire-tile/` — proxy for LANDFIRE map tiles (works around
  a browser block; see the file's comment).
