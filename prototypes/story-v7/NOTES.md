# Story v7: prototype and decisions so far

A throwaway, standalone prototype of the Portfolio 2.0 home story. It is not
wired into the Next.js app. Run it with the `prototypes` entry in
`.claude/launch.json` and open `http://localhost:4317/story-v7/`
(append `#snap` to skip scroll smoothing when taking screenshots).

Map images and logos are copies from `origin/v2.0` (`public/maps`,
`public/logos`); `logos/fuego.svg` is rendered from
`src/components/story/fuego-logo.ts`. The globe loads d3, topojson-client
and world-atlas from jsDelivr; bundle them for the real build.

None of the decisions below are in STORYTELLING.md or PURPOSE.md yet, and no
tickets exist for them. They should go there before code (see WORKFLOW).

## The story (home page)

- Hero: name, then the claim "I build software for wildfire."
- Map: a big light card inside the orange page (orange margins stay), photos
  in greyscale washed to paper, colour reserved for the fire.
- One fire, one place, one clock (DAY 1 14:02 → DAY 2), four steps. Each
  step is a logo plus a field name; the map is the evidence.
  1. Gridware: **Grid sensing** (a sensor flags a fault on a feeder)
  2. Pano AI: **Smoke detection** (camera fields of view lock on, bearings cross)
  3. FUEGO: **Fire simulation** (cell-based spread, arrival-time bands, wind NE)
  4. Hyticos: **Remote sensing** (zoom out, a satellite pass lights VIIRS-sized
     pixels where the same simulated fire is still burning)
  - Close: zoom out to the Earth, fire as a red dot in California,
    "Let's build a sustainable future together." No button.
- Short in-map labels per step only (Power line, Line sensor, Fault, Camera,
  Smoke, Ignition, Fire front, Satellite pass, Fire detections).
- Known gaps: steps 1 and 2 are weaker visuals than 3 and 4; phone widths
  not checked; the copy flag on "sustainable" (STORYTELLING voice rules).

## The rest of the site

- Home order: Hero → Story → Testimonials → How we work + Contact → Footer.
- **The Wall** keeps its name and moves to its own page: brand red
  background, one screen, no vertical scroll (tabs + horizontal gallery).
  Linked from the nav and a quiet "See the work →" after the story.
- **Testimonials**: right after the story; three cards in a row, one excerpt
  each in their exact words, photo, name, role and relation, "Read full"
  link. Excerpts: Jack Royero ("turn loosely defined problems into…"),
  Katie McQuillan ("learn quickly, take ownership…"), Sydney Davison
  ("very thoughtful and actively looks for opportunities…"). All three are
  Pano AI: ask someone from Gridware, FUEGO or Hyticos; tell the three
  their quote is excerpted (testimonials rule 3).
- **How we work** (proposed, not yet confirmed): the v1 Process steps cut to
  one line each, merged with Contact into one section, plus a link
  "Rates and engagement options →" to /pricing.
- **Contact strategy** (proposed): a quiet "Contact" in the nav; no button in
  the hero or the story close; one ask, "Let's build together", after How we
  work, with two doors: Book 30 minutes (Calendly) for projects,
  LinkedIn / CV for hiring, plus the email written out.
- **/pricing**: rates plus Services and the FAQ moved from the old home.
- Off the home page: Background (education map, experience rows), the
  footer's "What this site is for". Footer keeps email and socials.
- Next to settle: the footer.
