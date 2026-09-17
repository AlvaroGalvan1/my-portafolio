# Portfolio TODO

See `PURPOSE.md` for what the site is FOR — three northstars, and the test
to run before adding anything to this list. See `GLOSSARY.md` for what the
words mean (Wall, Frame, Loop, Guardrail…).
For what's already shipped, see `git log` — this file is only what's left.

## How to use this list

The page has four sections, and the list is split the same way, in page
order: **The Top** → **The Wall** → **About** → **My Journey**. One thread
cuts across all four (Analytics) and gets its own section at the end.

Every task is written to stand alone. Each has a **Prompt** you can copy
straight into a fresh conversation without explaining any background — it
names its own files and its own constraints. Nothing here depends on you
having read anything above it.

Each task is tagged with what it needs:

| Tag | Meaning |
|---|---|
| 🟢 **GO** | Fully specified. Copy the prompt, run it, done. |
| 🟣 **DESIGN** | Needs back-and-forth first — research, options, your taste. Budget a conversation, not a command. |
| 🔴 **YOU** | Blocked on a file or a fact only you have. |

---

# 🚀 BEFORE YOU PUBLISH

The short list. Everything else in this file is improvement; these are the
things that are either **broken** or **collect nothing until you flip a
switch**. Nothing here is more than a few minutes of work, but three of
them only you can do.

| # | What | Who |
|---|---|---|
| 1 | **The Papers tile 404s** — see [W8](#w8). The only dead link on the site. | 🔴 you decide, 🟢 I change it |
| 2 | **The contact form has no backend.** Unset, it falls back to opening the visitor's mail client prefilled — which works, but loses anyone without one configured. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (see `.env.example`, it's a 5-minute free signup) in **Vercel → Settings → Environment Variables**, then **redeploy** — `NEXT_PUBLIC_` vars are baked in at build time, so an existing deployment won't pick it up. | 🔴 you |
| 3 | **Vercel Web Analytics is installed but collects nothing** until it's switched on at **Project → Analytics → Enable**. | 🔴 you |
| 4 | **The custom domain**, if one is coming. `SITE_URL` in `src/content/site.ts` falls back to the `.vercel.app` URL, which is what social cards will unfurl with. Set `NEXT_PUBLIC_SITE_URL` and it follows. Fine to publish without. | 🔴 you |
| 5 | **[N2](#n2) — custom click events.** Not a blocker, but worth doing *before* launch rather than after: it's the difference between knowing which tiles people open from day one and starting that clock a month late. | 🟢 me |

**What is *not* blocking:** the portrait ([T2](#t2)), the leopard gecko
([W2](#w2)) and anything else with a `TODO:` credit simply don't render —
the guardrails keep unfinished pieces off the page rather than showing them
half-built. The site is publishable with all of them outstanding.

---

# 📥 FILE DROPS

Drop the file at the exact path and it appears on its own — no code change.
A missing file renders as a hidden tile, never a broken box. Run
`npm run check:assets` any time to see what's still missing — **it is
currently clean**; everything below is a file nothing references yet.

| What | Exact path | Status |
|---|---|---|
| Portrait, **full resolution**, background removed | `public/gallery/portraits/sunglasses.png` | ⬜ waiting — see [T2](#t2) |
| Fuego.Earth logo | `public/logos/fuego-earth.svg` | ⬜ waiting |
| Hyticos logo | `public/logos/hyticos.svg` | ⬜ waiting |

The logos are only referenced from `src/content/experience.ts`, which
currently renders nowhere — see [E4](#e4). They're worth having anyway.

### Where a deck's files go

**Both decks are in and live.** Satanizar el Fuego (6 slides) is at
`public/gallery/satanizar/`, and *Cuando la plataforma me diga cuándo
quemar* (8 pages) at `public/gallery/abuelos-y-plataforma/`. Both are
credited to Diana Guadalupe Soto Erazo, and the second one also names
Pablo, Jeanneth and Diana for the drawings.

For the next one: **one folder per deck under `public/gallery/`**, and
drop the files under the names `data.ts` lists for that deck.

**If it's a PDF**, hand me the PDF rather than exporting pages yourself —
Ghostscript is on this machine and renders the pages straight into the
folder:

```
gs -q -dNOPAUSE -dBATCH -dSAFER -dUsePDFPageSize \
   -sDEVICE=jpeg -r150 -dJPEGQ=82 \
   -dTextAlphaBits=4 -dGraphicsAlphaBits=4 \
   -sOutputFile=p%d.jpeg <file>.pdf
```

150dpi and quality 82 put an 8-page deck at about 2.4 MB, which is the
right trade for slides that get read up close.

Two things that make dropping files forgiving:

- **A partial drop works.** A deck probes its slides on load and shows the
  ones that exist, so three of eight renders as a three-page deck rather
  than the tile vanishing.
- **`npm run check:assets` lists what's still missing** by name, any time.

The one part that isn't drag-and-drop is the `data.ts` entry naming the
slides and the credit. Tell me the folder and the creator and I'll wire it.

The Satanizar deck's tags, from the original post, for whenever we write
copy for it:

```
#NoSatanicemosElFuego #ManejoIntegralDelFuego #GestiónAmbiental
#CambioClimático #ConocimientoAncestral #IncendiosForestales
#CuencaAmazonica
```

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
   moves aside.
3. **What happens for people who don't click?** If the line is genuinely
   the most important sentence on the site, hiding it entirely behind an
   interaction is a real cost. Options: reveal automatically after a beat,
   show a truncated version, or accept it as a reward for the curious.

Do this **with [T2](#t2)**, not before it — a click-to-reveal designed over
flat orange is a different thing from one designed over a photograph, and
the photo is the bigger change of the two.

> **Prompt:** *Read `src/components/sections/Hero.tsx`,
> `src/components/sections/About.tsx` and `src/content/profile.ts`. I want
> the first bio paragraph ("Hola! Soy Álvaro de Oaxaca…") moved from About
> to the Hero, where it's hidden until the visitor clicks something. Before
> writing code: research how other portfolio and personal sites handle a
> click-to-reveal intro line, show me 3–4 distinct approaches with a
> description of each interaction, and recommend one. Then we'll decide the
> trigger, the animation, and whether the line stays in About too.*

<a id="t2"></a>
## T2 🔴🟣 The portrait at the top, cut out of its background

**Still blocked on the file, and it's the same blocker as last time.**
The version in `~/Downloads/IMG 2476 from Google Photos.jpg` is *still* a
**293 × 220 px, 28 KB thumbnail** — Google Photos hands out a preview
unless you explicitly download the original. It is too small for anything
on this page: the hero runs full-bleed, so even a phone needs ~800 px wide
and a laptop wants 2000+.

**How to get the real one:** Google Photos → open the photo → ⋯ menu →
**Download** (not right-click-save, which saves the preview). Or AirDrop it
off your phone, which gives you the untouched original.

**What you said you want this time**, which is a change from the last
description: the portrait at the top **with no background** — you cut out,
sitting on the brand colour, rather than a full-bleed photo with a scrim
over it. That's a better fit for this particular photo, because the busy
kitchen behind you was the whole problem with the full-bleed version.

Two consequences worth knowing before you cut it out:

- **Cutout means PNG, not JPG.** A JPEG can't hold transparency. Save it as
  `public/gallery/portraits/sunglasses.png`. `profile.png` at the repo root
  is already a background-removed PNG — same treatment.
- **The edges do the work.** Hair and the sunglasses' rim are where a bad
  cutout shows. Photoshop / Photos' own "remove background" / remove.bg all
  work; check the result on both the orange *and* the maroon, since a white
  halo is invisible on one and obvious on the other.

Still an open taste call, unchanged: **the sunglasses hide your eyes.** In
the reference you liked, the eye contact is what makes it land.

🟣 **The design half is the part you're gathering references for in Google
Stitch** — bring those back and we'll do the layout against them rather
than guessing. The questions the references need to answer: does the name
sit over you or beside you, which side you stand on, and whether the
buttons and location line stay where they are.

> **Prompt:** *The file `public/gallery/portraits/sunglasses.png` is now in
> place — a background-removed cutout with transparency. Read
> `src/components/sections/Hero.tsx`. Put me in the hero next to the name,
> keeping the existing display-type treatment (white, maroon stroke) and the
> brand background rather than a photo backdrop. Here are the layout
> references I collected: [PASTE]. Match the one I've marked, keep the
> location line and both buttons, and show me the result at mobile and
> desktop widths before committing.*

---

# 2️⃣ THE WALL — `src/components/gallery/`

<a id="w8"></a>
## W8 🔴🟢 The Papers tile points at a 404 — **publish blocker**

`data.ts` has a tile titled "Papers" whose `href` is `/papers`. That route
does not exist; clicking it on the live site returns a 404. It's the only
dead link on the site, and the only thing in this file that is genuinely
broken rather than merely unfinished.

🔴 **Pick one** and it's a one-line change:

1. **Cut the tile.** Nothing else references it, and the Wall doesn't miss
   a tile that was a placeholder for something that doesn't exist yet.
2. **Point it at a real destination** — a Google Scholar profile, an ORCID
   page, a PDF in `public/papers/` (the folder exists and is empty).
3. **Build a real `/papers` index page.** Most work, only worth it if
   there's more than one thing to list.

> **Prompt:** *In `src/components/gallery/data.ts`, the `papers` tile links
> to `/papers`, which 404s. [Delete the tile / point it at URL]. Check
> nothing else references it.*

<a id="w7"></a>
## W7 🔴 The platform essay — two things still missing

*Cuando la plataforma me diga cuándo quemar* is live on the Wall: eight
pages rendered from Diana's PDF, ‹ › to flip, credited to her with the
illustrators named.

Not a publish blocker — the credit links to her profile, which is the part
that matters. Two things would finish it:

1. **The post's permalink and date.** The Satanizar tile reads "Gestión
   Integral del Fuego en el mundo, Sept. 2025"; this one has no such line.
   The post is here:
   <https://www.linkedin.com/posts/diana-guadalupe-soto-erazo-a7177b4a_entre-mis-abuelos-y-la-plataforma-activity-7494073346297339905-J_-6>
2. **Whether it should carry the post's words.** A tile can hold a slide
   set *and* body text (that's what the map tiles do), so this could open
   with Diana's framing beside the pages instead of the pages alone.

<a id="w2"></a>
## W2 🔴 Leopard gecko — whose clip is it?

Down to one tile. The prairie dog is sorted: real title, and credited to
Fernando Boza & Tyler Smith / The Nature Conservancy.

`leopard-gecko` still carries `credit: { who: "TODO: whose footage?" }`,
which keeps it off the live Wall entirely — the filter at the bottom of
`data.ts` drops any tile whose credit starts with "TODO" rather than
publishing someone's video with no name on it. It also still has a
filename for a title.

🔴 **From you:** yours or someone else's, a name and link if it's theirs,
and a real title. Then it's a two-minute edit and it appears.

> **Prompt:** *In `src/components/gallery/data.ts`, the `leopard-gecko`
> entry has a placeholder credit that keeps it filtered off the Wall, and
> "Leopard Gecko" as a title. It's [MINE / X's footage, at LINK]. Set the
> title to [TITLE] and write the credit in the existing `Credit` shape from
> `credit.ts`.*

<a id="w3"></a>
## W3 🟣 More post-style tiles

`type: "post"` is the treatment you like: the image on the Wall, and
clicking opens a lightbox with the image, the full text, the credit, and a
link out. Three tiles use it now — the graduation post, the rivers maps and
the soils maps.

**The layout exists and works — what's missing is the words.** This is a
writing task disguised as a code task. It can't be batch-executed; it needs
a pass per tile with you.

🔴 **From you:** for each tile you want converted, the body copy and the
link out. Realistically one sitting where we go tile by tile.

Candidates as the Wall stands: the YouTube "I have a Mission" video, the
Conway's Life tile, and the Satanizar deck once its slides land.

**Exception, as you said: videos keep no sidecard.** `VideoFrame.tsx` opens
straight to the video at full size with sound, and that stays.

> **Prompt:** *Read `src/components/gallery/frames/PostFrame.tsx` and
> `data.ts`. I want to convert these tiles to `type: "post"` so they open
> with body text like the graduation and map posts do: [LIST TILES]. Go one
> at a time — show me the current entry, ask me for the body copy and the
> link out, then write it. Do not convert any video tile.*

<a id="w6"></a>
## W6 🔴🟢 The two LinkedIn permalinks for the map posts

The rivers and soils maps now carry the text you wrote for them on
LinkedIn, and open as posts. What they don't have is a **link back to the
original post** — the graduation tile has one ("Read on LinkedIn ↗") and
these two don't, so the lightbox just ends after the last paragraph.

`href` is optional on a post now, so nothing is broken — the button simply
doesn't render. But a post with no way back to where it was published is
the one thing missing from those two tiles.

🔴 **From you:** the two LinkedIn URLs. On LinkedIn: open the post → ⋯ →
*Copy link to post*.

> **Prompt:** *In `src/components/gallery/data.ts`, the `map-rivers` and
> `map-soils` post entries have a TODO where their LinkedIn permalink
> should be. Set `href` on map-rivers to [URL] and on map-soils to [URL],
> with `linkLabel: "Read on LinkedIn ↗"` to match the graduation post.*

---

# 3️⃣ ABOUT — `About.tsx`

The section is now: the bio, then one cream panel holding Skills and the
CV download. The transcribed job history is gone — you called it cluttered,
and the CV says it better.

<a id="e4"></a>
## E4 🟣 `experience.ts` renders nowhere now — decide what that means

**New, and a direct consequence of deleting the on-page CV.**
`src/content/experience.ts` is complete and correct — four jobs, Hyticos
included, all fields filled — and **nothing on the site reads it.**
`OrgLogo.tsx` is likewise now unused.

That's fine as a deliberate state, but it should be a decision rather than
a leftover. Three ways it goes:

1. **Leave it.** The data stays as the source for the CV and for whatever
   comes next; the site says who you are and the PDF says where you worked.
   Zero work, and defensible.
2. **Bring back something much lighter** — a single line per job (org, role,
   years) with no bullets, no logos, no location. Three lines instead of
   forty, which was the actual complaint.
3. **Delete `experience.ts` and `OrgLogo.tsx`.** Cleanest repo, and the one
   that's hard to undo. Only if you're sure the history never comes back to
   the page.

Worth settling alongside [E3](#e3) — they're the same question asked twice.

> **Prompt:** *`src/content/experience.ts` and
> `src/components/sections/OrgLogo.tsx` are no longer read by anything since
> the job history came off the About section. Show me what option 2 would
> look like — one compact line per job, no bullets or logos — as a diff
> against the current `About.tsx`, so I can compare it against just leaving
> the section as it is.*

<a id="e1"></a>
## E1 🟢 Does the section still want renaming?

The old plan was "About" → "Experience". **That's now backwards**: with the
job history gone, the section is the bio plus skills, which is exactly what
"About" means. Renaming it to "Experience" would name it after the one
thing it no longer contains.

So: 🟢 do nothing, unless [T1](#t1) moves the bio to the hero — at which
point the section is *only* skills and a CV button, and wants a different
name again (and probably a different shape).

Parked here rather than deleted so it gets revisited after T1 lands.

<a id="e3"></a>
## E3 🟣 The tuned-CV problem

The thing you raised, and it's a genuinely interesting one worth its own
conversation:

> You send different CVs tuned to different roles. Someone reads a tuned CV,
> comes to the site, and finds an experience section that reads differently
> — broader, or emphasising other things. The gap between the two is
> awkward at best and looks inconsistent at worst.

**Deleting the on-page history changed this problem rather than solving
it.** There's now no contradiction to spot, because the site says nothing
about the jobs at all — but the CV is also no longer the *short* version of
anything, it's the only version. Whatever the reader was sent is the whole
story.

The shapes it could take, roughly from least to most work:

1. **The site is the superset.** Needs some history back on the page —
   see [E4](#e4) option 2.
2. **Reframe by outcome rather than by role.** Bullets about what changed
   because of the work rather than the tools used, so the same text reads
   as relevant to a GIS role and a climate-policy role.
3. **Let the visitor pick the lens.** A toggle — "I'm here about GeoAI /
   climate / data" — that re-emphasises what shows. Real design and content
   work, and risks feeling gimmicky if done lightly.
4. **Per-application links.** A URL like `?role=geoai` that tunes the page
   to match the CV you sent. Most precise, most machinery, easiest to
   forget to maintain.

Best done after [N2](#n2), so there's data on whether anyone clicks
Download CV at all.

> **Prompt:** *I send CVs tuned to different roles, and I'm worried about
> the gap between a tuned CV and what my site says. The job history is
> currently not on the site at all — only a Download CV button. Read
> `src/content/experience.ts` and `src/components/sections/About.tsx`, and
> walk me through the options — superset, outcome-framed bullets, a
> visitor-selectable lens, per-application URLs — with the real tradeoffs of
> each, then recommend one. Don't write code until we've settled it.*

---

# 4️⃣ MY JOURNEY — `Journey.tsx`, `src/components/map/`

<a id="j2"></a>
## J2 🔴 Friends' pins, and a "What is UWC" marker

The map, legend, and grouping all work — this group is data-only. Add
entries to `src/content/places.ts` with `group: "friends"` and the legend
row appears by itself.

🔴 **From you:** names and cities. Also worth thinking about whether you
want friends' names public on a site recruiters read.

Still open from earlier: a **"What is UWC" marker** with an info popup, for
the many readers who won't know the acronym.

---

# 📊 ANALYTICS

<a id="n2"></a>
## N2 🟢 Custom click events

Vercel Web Analytics is installed and rendering (`<Analytics />` in
`layout.tsx`). Page views, referrers and countries are already coming in
— assuming the dashboard toggle is on (Project → Analytics → Enable; 🔴
only you can do that part).

What's left is the part with the real value:

- **Wall tile opened, with the tile `id` as a property** — *the single most
  useful number on this site.* It tells you which pieces earn their place
  and which should be cut, which is what [W3](#w3) needs to know.
- **"Download CV" clicked** (`About.tsx`) — now the *only* route to your job
  history, so this number matters more than it did.
- **Contact modal opened**, and separately, **form actually submitted** —
  the gap between those two is the real conversion story.
- **Outbound clicks** — the three footer socials, LANDFIRE's viewer, the
  credit-badge links, LinkedIn post links.
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

1. **The publish checklist above**, in order. That's the launch.
2. **[W6](#w6) + [W2](#w2)** — two facts from you, five minutes of edits,
   and both tiles are finished.
3. **[T2](#t2) + [T1](#t1) together** — the hero. The biggest visible change
   left, and the one you're gathering references for.
4. **[E4](#e4), then [E3](#e3)** — what happens to the job history, decided
   once.
5. **[W3](#w3)** — a writing sitting, tile by tile, informed by which tiles
   the analytics say people actually open.

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

A third, narrower one: any tile whose `credit.who` starts with "TODO" is
filtered out of `data.ts` before it reaches the Wall, and the same rule
applies to `role`/`dates` in `experience.ts`. Uncredited work doesn't ship.

## Module structure

Split by feature so pieces can be worked on without touching shared files:

- `src/components/gallery/` — the Wall.
  - `HorizontalGallery.tsx` — the looping horizontal scroller, its edge-zone
    panning, and the one-time hint line above it.
  - `data.ts` — the actual pieces. **Edit this file to add/reorder/resize
    tiles — no need to touch any component.**
  - `credit.ts` — the one attribution shape. Every tile carries one; the
    type system won't build without it.
  - `frames/` — one file per tile *kind*; `frames/registry.tsx` documents
    how to add a new kind. `ImageSetFrame.tsx` is the deck: ‹ › page
    controls, click-anywhere to advance, and slides that haven't been
    dropped yet are skipped rather than taking the tile down.
  - `Lightbox.tsx` — every kind of "opened" tile: image, video, YouTube, and
    the post layout (photo or photo-set on one side, words on the other).
  - `reportAssetIssue.ts` — the single place failures get logged.
- `src/components/map/` — `BaseMap.tsx` + `baseLayers.ts` + `MapLegend.tsx`.
- `src/components/contact/` — `ContactModal.tsx` + `ContactTrigger.tsx`.
- `src/components/sections/` — one file per page section, composed in
  `src/app/page.tsx`.
- `src/content/` — text as data, separate from components. Note that
  `experience.ts` is currently read by nothing — see [E4](#e4).
- `src/app/api/landfire-tile/` — proxy for LANDFIRE map tiles (works around
  a browser block; see the file's comment).
