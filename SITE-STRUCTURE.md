# Site structure: Portfolio v2

The source of truth for what v2 is. If code and this file disagree, one of
them is wrong: fix it, or change this file on purpose in the same PR.

- **Visual skeleton (approved 2026-10-21):** `prototypes/v2-skeleton/index.html`.
  Open the file in a browser. It shows every page and the build plan.
- **Story prototype:** `prototypes/story-v7/` (run the `prototypes` entry in
  `.claude/launch.json`, then open `http://localhost:4317/story-v7/`).
- **Why the site exists:** `PURPOSE.md`. **How stories are told:** `STORYTELLING.md`.
- **How we work, and the v2 branches:** `WORKFLOW.md`.

## Rules for every page

- **Less text.** Use one line where v1 had a paragraph. Try a visual before a sentence.
- **Orange marks takeaways.** Highlight key words in brand orange (`--color-brand-orange`).
  Icons are maroon (`--color-brand-maroon`).
- **Buttons have no arrows.** "Let's build together", never "Let's build together →".
- **Logos, not names.** Show a company's logo (from `public/logos/`) instead of
  writing its name.
- **Two languages.** Every string has `en` and `es`.
- **Pages fade into each other** with React's `<ViewTransition>` (see
  `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`). Respect
  `prefers-reduced-motion`.

## Top bar and footer

- **Top bar:** "Álvaro Galván" on the left (links home), then on the right
  **Wall · About · Work with me**. Nothing else.
- **On Home**, the name starts hidden, because the hero already shows it. It
  fades into the bar once the hero scrolls away. Every other page shows it
  from the start.
- **Footer:** email, LinkedIn and GitHub as logos (no words, no CV; the CV is on
  About), then Pricing, FAQ, and the EN/ES switch.
  The site already picks the language from the browser (`src/proxy.ts`), so
  the switch only needs to live here.

## Pages

### Home `/`

1. **Hero.** The name, the line "I build software for wildfire."
   (es: "Construyo software para incendios forestales."), and a button
   "Let's build together" that links to `/work-with-me`. It is a link, not a modal.
2. **Story.** The story-v7 prototype: one fire, four steps, then a zoom out to the Earth.
3. **What I do.** Three items: **Grid Intelligence · Fire Tech · Data Fusion**.
   Each is a simple line icon (SVG, maroon) above its name: a bolt, a flame,
   and a network. No company names.
4. **Testimonials.** Short excerpts with key words in orange, the person's
   name, and their company's logo. Small cards that scroll slowly sideways,
   pause on hover, and stop under `prefers-reduced-motion`. More are coming,
   so adding one is a data change only.
5. **A "Work with me" button**, linking to `/work-with-me`.

### Work with me `/work-with-me`

1. **Steps panel.** This follows fuego.earth's partnership panel: a dark card
   with the heading **"Let's build your tool"** and one line on the left
   (draft: "You bring the problem and the data. I turn them into a tool your
   team uses."). The numbered steps are on the right: **Let's talk · Explore
   it together · Build it · Test and refine**. The active step shows a small
   visual instead of a sentence. The panel has no button.
2. **Form.** Name, Email, "What's the problem?", and a Send button. How it
   sends is decided in its own issue. Until then, it uses v1's fallback,
   which opens the visitor's mail app with the message filled in.
3. **Chat card**, next to the form: "Want to learn more, swap ideas, or just
   chat?" with "No project needed." under it, and a **"Book 30 minutes"**
   button that opens `CALENDLY_URL`.
4. **One line:** "Wondering about cost or timing? See [pricing] and
   [common questions]." Both are links.

### Pricing `/pricing`

Two boxes, nothing else:

- **$125 / hour**, labelled "My rate". This is the normal rate, not a maximum.
- **down to $0**: "NGOs and mission-driven work. I adjust."

The fixed-term and NGO tiers and the Services cards from v1 are gone.

### FAQ `/faq`

Four questions at most, from `content/faq.ts`. Proposed (confirm in review):

- How long do projects run?
- Remote or in person?
- Can I hire you for one small task?
- Who owns the code?

It ends with "Didn't find your answer? Ask me", linking to `/work-with-me`.

### Wall `/wall`

The v1 Wall, moved over as it is. A brand-red page that fits one screen,
with tabs and a horizontal gallery and no vertical scroll.

### About `/about`

A photo, two lines of bio, the journey map (`BaseMap`), and a CV download.
The v1 Experience rows are dropped, because the CV covers them.

## Code structure

```
src/
  app/[lang]/
    layout.tsx            Nav + Footer + <ViewTransition>, shared by every page
    page.tsx              Home
    work-with-me/page.tsx
    wall/page.tsx
    faq/page.tsx
    pricing/page.tsx
    about/page.tsx
  components/
    ui/                   shared pieces: Button, Icon, Highlight, Marquee
    shell/                Nav, Footer
    <section>/            one folder per section (areas/, testimonials/, steps/, …)
      Section.tsx
      section.content.ts  that section's copy, en + es
    story/  gallery/      kept from v2.0 and v1
```

- **One folder per section,** holding its component and its own copy file.
  Don't add new copy to `content/ui.ts`. Move strings out of it as their
  section moves.
- **Sections import from `ui/` and their own folder only,** never from each
  other. Deleting a section's folder should break exactly one import line,
  the one in its page.
- **Server Components by default.** Only the small interactive part gets
  `"use client"`, such as the marquee's pause or the active step.
- **Delete what you replace.** Each PR removes the v1 code it makes unused
  (`components/sections/*`, `ContactModal`, unused content). Git keeps history.

## Open

- How the form sends messages (its own decision issue).
- More testimonials, from Gridware, FUEGO or Hyticos.
