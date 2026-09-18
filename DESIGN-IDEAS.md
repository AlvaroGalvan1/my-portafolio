# Design ideas — the dump

**Nothing in this file is approved and nothing in it is built.** It is the
place ideas go when they are good but not now, so they stop being
re-invented from scratch every few weeks. Pick one and it becomes a task in
`TODO.md`; strike one and write why, so nobody proposes it again.

Read `PURPOSE.md` first. An idea that serves none of the three purposes is
interesting and does not belong, however good it is.

---

# The Background section

## The brief, as given

> We're doing this layout instead of scrolling because it's creative, but
> also because the map takes too much space and it expands in a weird way.
> Any chance this all fits here? We can play with the shapes, moving
> Experience above, so it looks irregular.

## The diagnosis, measured

### 1. The map has no shape of its own

It is `flex-1` inside a stretched card, so its height is whatever is left
over once the other column has been matched. Measured at 1440 wide, it
renders **317px tall at 900 viewport height and 429px at 800** — it gets
*shorter as the window gets taller*, because the thing it is balancing
against grew. Its aspect ratio swings between roughly 2:1 and 1.4:1 with
no input from anybody.

That is the "expands in a weird way", and it is not a bug — it is the
layout asking the map to solve a problem that is not the map's. A map is a
view of the world. Its frame should be chosen. Right now it is a remainder.

It has a second cost that is easy to miss: `minZoomForContainer` derives
the map's zoom floor from the container's larger side, so an arbitrary
frame produces an arbitrary minimum zoom. The journey now runs from Oaxaca
to San Francisco the long way round, and whether the whole route is
visible depends on a number nobody chose.

### 2. The two columns already balance — without the map

This is the surprise in the measurements, and it reframes the whole
problem. Intrinsic heights, map collapsed to zero:

| Viewport | Education + Skills | Experience | Difference |
|---|---|---|---|
| 1280×800 | 1209 | 1208 | **1px** |
| 1440×900 | 1096 | 1097 | **1px** |
| 1728×1117 | 941 | 941 | **0px** |
| 1920×1080 | 914 | 914 | **0px** |
| 2560×1440 | 834 | 834 | **0px** |

The left column and the right column are the same height at every width,
to the pixel, by accident. The content is already perfectly balanced. The
map is the only thing unbalancing it — and the `flex-1` trick, the 40svh
floor, the tuning from 62svh to 52svh, and the full-width closing bar were
all machinery built to hide that one fact.

**Remove the map from that column and the alignment problem does not exist.**

### 3. "Does it all fit in one screen?" — no, not on a laptop

Budget is viewport height minus the sticky nav, minus the section heading
and the closing bar. What is left for the cards, and what would be left
for a map if the three cards had to fit one screen:

| Viewport | Room for cards | Experience card | Room left for the map |
|---|---|---|---|
| 1280×800 | 412 | 1208 | **−797** |
| 1440×900 | 512 | 1097 | **−584** |
| 1728×1117 | 729 | 941 | **−212** |
| 1920×1080 | 692 | 914 | **−222** |
| 2560×1440 | 1052 | 834 | **+218** |

Only a 2560-wide display fits it, and even there the map gets 218px — a
letterbox strip. On a 16" MacBook it is 212px short **with the map deleted
entirely**. Moving Experience up (the "irregular shapes" idea) was tested
by setting its margin to zero for these measurements: it is not the
blocker. The blocker is that four job entries and three skill rows are
about 900px of text and a laptop has about 700px to put them in.

So: one screen is achievable **only** if either the map leaves this
section, or two of the three cards do.

---

## The directions, ranked

Ranked by `(fixes the diagnosis above) × (survives the next content change)`,
then by effort.

### D1. The map gets its own full-width band — **recommended**

Lift the map out of Education and give it the full page width, as its own
band between the hero and Background (or immediately under the Background
heading). Education keeps the four logos and the printed campus list.

*Why it is first:* it answers all three findings at once. The map gets a
frame chosen for a world map instead of a leftover; a full-width band is
the only shape in which a route from Mexico to Korea to Argentina is
actually legible; and the two text columns then balance to the pixel on
their own, which deletes the `flex-1` machinery, the svh tuning and
possibly the closing bar with it.

It also promotes the best thing in the section. The journey player is
currently a small yellow button in a toolbar above a half-column map. Full
width, it is the section's headline interaction.

*Cost:* Background stops being self-contained — "my journey" becomes a
band, not a card. And a full-width map is a tall object; it needs a fixed,
modest aspect (16:9 or shorter) or it re-creates the original complaint at
a larger scale.

*Effort:* medium. Move `<BaseMap>`, choose an aspect, re-check the zoom
floor, re-check print (the map is already `print:hidden` with a text
fallback, so paper is unaffected).

### D2. Give the map a fixed aspect ratio and accept ragged columns

The one-line version of D1. Replace `lg:flex-1 lg:min-h-[34svh]` with
`aspect-[4/3]` or `aspect-video`. The map has a deliberate shape at every
size; the columns stop being level; the closing bar absorbs the raggedness
the way it already does.

*Why it is worth listing separately:* it is a single line, it can ship this
afternoon, and it fixes the thing that was actually complained about. It
does not fix the map being too small to hold the journey.

*Cost:* the columns go back to ending unevenly — between 15px and 330px
apart depending on the window.

*Effort:* one line. **Available now if wanted.**

### D3. The map collapses until asked for

A short band (~180px) by default, showing the pins and nothing else, with
"Play my journey" expanding it to a proper frame for the duration. Answers
"the map takes too much space" literally: it takes none until a reader
wants it.

*Cost:* the map is the most on-brand object on the site and this hides it.
A geospatial portfolio that opens with a collapsed map is being modest
about the wrong thing.

*Effort:* small-medium. Needs an expand animation that does not fight
Leaflet's `invalidateSize`.

### D4. One card, three tabs

Education | Experience | Skills as a segmented control over a single
fixed-height panel. Guarantees one screen at every size, forever, and
gives the map a stable frame.

*Cost:* it hides two thirds of the content behind a click, on a page whose
job is to be skimmed by someone deciding whether to reply. Print is
unaffected (the @media print block renders from the same data regardless of
which tab is showing), so the CV does not suffer — but the screen reader
of a hiring manager in a hurry does.

*Effort:* medium. Needs real tab semantics — `role="tablist"`, arrow keys,
and the panel labelled by its tab.

### D5. Horizontal deck, like the Wall

Three panels that pan sideways, reusing the pattern the Wall already
establishes.

*Cost:* two horizontal scrollers on one page dilutes the Wall's identity,
which is the one place on this site where sideways movement means
something.

*Effort:* medium. The `HorizontalGallery` machinery is not reusable as-is.

---

## Smaller improvements, independent of the above

Each of these stands alone and none of them depends on picking a direction.

- **S1. A timeline spine on Experience.** Four dates in four datelines do
  not add up to a shape. A thin vertical rule down the left of the entries,
  with a tick per role, would let a reader see "four roles, 2023 → 2026" in
  one glance instead of reading four lines to assemble it.
- **S2. Hierarchy between the three cards.** Education, Experience and
  Skills are the same cream rectangle at the same weight. Experience is the
  most important thing in the section and looks identical to a logo row.
  One card on white, or Experience given the wider column, would say so.
- **S3. The four questions could be larger.** They are the best copy on the
  page and they run at 1.3rem in a half-width column. In a wider Experience
  column they could carry the section the way the name carries the hero.
- **S4. The logo row is unlabelled.** Four marks with no names is elegant
  and a stranger cannot tell UWC from UAA. The alt text carries it for
  screen readers; sighted readers get nothing unless they open a pin. A
  `title`, or names on hover, would cost nothing.
- **S5. The stagger is an arbitrary 160px.** `lg:mt-40` was chosen because
  it looked right. If the columns stop needing to be level (D1/D2), the
  stagger could be tied to something real — the height of the logo row, or
  the heading — so it survives a redesign.
- **S6. Three cream cards on orange is a lot of cream.** The palette has
  white available and the section never uses it.

---

## Open questions

- **Is one screen actually the goal here?** The hero earns `100svh` because
  it is a poster with six lines on it. Background is a CV: four roles,
  nine campuses, sixteen tools. The measurements say one screen costs
  either the map or two of the three cards. It may be that this section
  simply *is* two screens, and the thing to fix is that it currently reads
  as an accident rather than as two deliberate screens.
- **Where does the journey belong?** It is the strongest interaction on the
  site and it is buried in a toolbar. If it moved (D1), does Background
  still need a map at all, or do the four logos and the printed campus list
  carry Education on their own?
- **What breaks the pixel-perfect column balance?** It is currently a
  coincidence, not a constraint. A fifth role or a fourth skill row ends
  it. Any direction picked above should not depend on it holding.
