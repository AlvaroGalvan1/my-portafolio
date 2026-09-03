// THE LAYER HIERARCHY — the one place z-index is decided.
//
// Read top-to-bottom as "what covers what." Never hardcode a z-index in a
// component; import from here so conflicts are impossible to introduce by
// accident and the whole stacking order is visible on one screen.
//
// Values are spaced by 10 so something can be slipped between two levels
// later without renumbering everything.
export const Z = {
  /** Normal page content. Sits under everything else. */
  BASE: 0,

  /** Content raised within its own card/section — e.g. text over a
   *  background image, a link label over a thumbnail. Only ever competes
   *  with siblings inside the same card, never with the page chrome. */
  CARD_CONTENT: 10,

  /** A control pinned over media inside a card — the "Open ↗" button on an
   *  embed/map tile. Must clear Leaflet's own internal panes (which go up
   *  to ~700 *inside* a map container), hence the jump. */
  CARD_OVERLAY_CONTROL: 800,

  /** The sticky top nav. Above page content, below anything modal. */
  NAV: 1000,

  /** Full-screen overlays: the lightbox and the contact modal. These cover
   *  the nav deliberately — while one is open, it owns the screen. */
  MODAL: 2000,
} as const;
