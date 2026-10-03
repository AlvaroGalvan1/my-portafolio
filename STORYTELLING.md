# How we tell a project's story

One method for both sites. Fuego.Earth and this portfolio tell the same
stories: **there is a fire problem, and here is how it got solved.** The
difference is the narrator and the door at the end, not the story.

|              | Fuego.Earth                          | This portfolio                          |
|--------------|--------------------------------------|-----------------------------------------|
| Narrator     | "We", the team                        | "I", what I did on it                   |
| Reader       | Crews, NGOs, communities, volunteers  | Collaborators, commissioners, hiring    |
| The door     | "Tell us your fire problem"           | "Let's work together"                   |

Write the facts and pick the visuals once. Each site then tells it in its own
voice. If the two sites disagree on a fact, one of them is wrong (see
"Facts to align" at the end).

Read `PURPOSE.md` first. A story serves purpose 1 (to be known) and ends on
purpose 3 (to start things).

---

## 1. The spine: five beats

Every project, big or small, is told in these five beats, in this order.

| Beat | Question it answers | In one line | Visual |
|---|---|---|---|
| **1. Stakes** | What could burn, and who cares? | A place, a person, an animal | A real photograph |
| **2. Snag** | Why didn't the existing tools work? | One concrete reason, not "it was hard" | A documentary photo, or the old way |
| **3. Move** | What was built? | Verb + outcome. This is the headline. | How it works: a diagram or animation in house style |
| **4. Proof** | How do we know it works? | One or two numbers you can defend | The real output, on a real map |
| **5. Door** | What can the reader do now? | Try it, read more, get in touch | A live link or embed |

The headline is always beat 3, the move. It is the takeaway. The snag is
the best *opening line* of the story, but it is not the headline. Example:
"Fire in India isn't fire in the US" opens the risk map story; the headline
is "Fire risk maps for places with little fire data."

A quick test is And, But, Therefore: *Tiger reserves need to know where fire
will start, **and** fire maps exist, **but** they need US data India doesn't
have, **therefore** we built one on free satellite data that local experts
weigh.* If the sentence doesn't hold up, the story isn't ready.

## 2. Two depths: the card and the story

**The card** shows enough for the reader to decide whether to click. Read in
five seconds:

- one picture, the largest thing on the card (beat 4, or a collage of 1, 2
  and 4)
- name, status and place, as a mono label
- the headline (beat 3)
- one or two sentences: snag, then move
- one or two links: the story, and the live thing

Nothing else. No step lists, no stack chips, no paragraph headings. If a
card needs those, the picture isn't doing its job.

**The story page** walks all five beats, one per screen, each with its own
visual. It closes on the door. Around 300 words in total.

On Fuego.Earth: `/portfolio/<slug>`. On this portfolio: a case page per
project, linked from its Experience row and its Wall tile.

## 3. Visual rules

- **Real over invented.** Real photos for the stakes, real map imagery under
  the output. When the output itself is illustrated, say "Illustration" on
  it. Never draw a fake result over a real place without that label.
- **One picture per beat.** A beat with no picture is a wall of text. A beat
  with three pictures is a gallery.
- **Show the mechanism.** Beat 3 is a diagram of how it works (layers
  stacking, a viewshed fanning out, a signal crossing a line), not a
  screenshot of the UI.
- **Fast motion.** An animation makes its point in about two seconds. It
  plays when it comes into view and never needs a click.
- **Credit everything.** Photographer, licence, source link, on the story
  page. USGS imagery is public domain. Wikimedia photos are usually
  CC BY-SA. Company screenshots need the company's OK.

## 4. Voice

- Plain sentences, past tense for what was done and present tense for what
  it does.
- One idea per sentence. Name the specific thing (LANDFIRE, ERA5, Sentinel)
  instead of "data".
- Don't use these: "seamlessly", "leverage", "empower", "not just X, but Y",
  rhetorical questions, triplets for rhythm, a colon before a big reveal.
- Every number must be one you can defend in an interview (the same rule
  `experience.ts` already uses).
- Both languages: every line has an `es` version on this site.

---

## 5. The stories

### Fuego Simulator: done on fuego.earth

1. **Stakes:** a town at the foot of fire-prone hills.
2. **Snag:** open fire models existed, but each read data in its own format
   and none ran out of the box.
3. **Move:** *A wildfire simulator anyone can run.*
4. **Proof:** hour-by-hour perimeters on real imagery. Two models: Cell2Fire
   and FARSITE. LANDFIRE, HRRR and ERA5 inputs.
5. **Door:** platform.fuego.earth

Visual: `FireProgression` on fuego.earth (USGS imagery of the Santa Barbara
foothills, illustrated fire). Next: replace it with a real run.

### Fuego Risk Map, with Hyticos: done on fuego.earth/portfolio/risk-map

1. **Stakes:** tigers in Telangana's forests (photo).
2. **Snag:** no LANDFIRE in India, and most fires start near villages and
   roads (photo of a burned roadside).
3. **Move:** *Fire risk maps for places with little fire data.*
4. **Proof:** open layers stacking into one map; ten factors ranked with
   AHP; the finished map.
5. **Door:** the risk map; "tell us your fire problem".

### Pano AI: to write

1. **Stakes:** smoke from a new fire, unseen because no camera could see
   that valley. *Photo: a ridge-top camera tower or a smoke plume in hills
   (check Pano's press kit, or Wikimedia).*
2. **Snag:** camera sites were checked by hand, which left blind spots
   nobody had measured.
3. **Move (draft):** *Placing wildfire cameras where they can see the most.*
4. **Proof:** a viewshed map, showing what a camera on a peak can and can't
   see across real terrain. Coverage of high-risk zones went from
   unmeasured to 40%, with 1,000+ critical assets ranked.
   *Visual: compute a viewshed ourselves from public USGS 3DEP elevation,
   for a made-up camera, so no company data is shown.*
5. **Door:** talk to me about siting and coverage problems.

### Gridware: to write

1. **Stakes:** power lines, which can start fires when they fail. *Photo:
   distribution lines through dry grass (Wikimedia).*
2. **Snag:** line damage was only found after an outage or a fire.
3. **Move (draft):** *Catching grid faults in the data before the lights go out.*
4. **Proof:** a sensor trace with an anomaly flagged before the failure,
   drawn on a map of the line. 2,000+ alerts investigated, 100+ critical
   events escalated.
   *Visual: an illustrated signal, not real customer data.*
5. **Door:** talk to me about monitoring and early warning.

---

## 6. Facts to align before publishing

The two sites currently say different things about the same work. Settle
each one, then use the same wording on both.

- **Hyticos map status.** `experience.ts` says it "updates daily based on
  field input". The Fuego site says "In progress", and the platform shows
  "Demo mode".
- **Fuego simulation volume.** `experience.ts` says "1,000+ fire-spread
  simulations a day" and "5+ data APIs". The Fuego site claims neither.
  Keep them only if you can show where they come from.
- **Fuego's snag.** `experience.ts` says the models were "locked in raw data
  formats that field teams couldn't use". The Fuego site says "we couldn't
  get a single one running". Pick one; the second is the stronger story.
- **Hyticos data.** `experience.ts` says Sentinel-2. The Fuego site says
  Sentinel, Copernicus and OpenStreetMap, with 10 factors.
