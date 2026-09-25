import type { LightboxContent } from "../Lightbox";
import type { Credit } from "../credit";

// Which shelf of the Wall a piece sits on — see Wall.tsx for how these
// render as three separate rows, each with its own heading. Required for
// the same reason `credit` is: a piece with no section is a piece nobody
// decided where to put, and the three rows exist specifically to answer
// "is this Álvaro's?" without a visitor having to read every byline to
// find out.
export type WallSection =
  /** Built it. Rendered first — it's the point of the page. */
  | "featured"
  /** Read it. Book covers, via the `book()` helper in data.ts. */
  | "books"
  /** Someone else made it, and it's good enough to hang up anyway. */
  | "seen";

// Every frame kind extends this. Shared layout/attribution fields live
// here; whatever makes a frame *that kind* (its media, its behavior) lives
// in the frame's own file.
export type FrameBase = {
  id: string;
  title: string;
  section: WallSection;
  // Hand-picked per piece — how many tracks wide/tall it occupies in the
  // 2-row wall. 3-wide is for hero/showcase pieces (map, CA, a big reel).
  colSpan: 1 | 2 | 3;
  rowSpan: 1 | 2;
  // Width/height ratio. Set it when a piece has a fixed real-world shape
  // the grid's own column width would distort — a book cover, a poster.
  // The tile keeps its row height and takes exactly the width that ratio
  // implies, instead of filling the column. Leave unset for anything meant
  // to fill its cell (photos, video, maps).
  aspectRatio?: number;
  // Who made it. Required, deliberately: an uncredited tile should be a
  // type error, not something noticed six months later. Rendered once for
  // every tile by FrameCell (so no frame kind can forget it) and again in
  // full in the lightbox. Use `relation: "mine"` for your own work — it
  // renders no byline but still has to be stated. See credit.ts.
  credit: Credit;
};

// Props every frame's cell component receives. `onOpenLightbox` is the one
// piece of shared interaction a frame can opt into (image/video do; a live
// simulation or an embedded map wouldn't). `onFail` is how a frame reports
// that its own content isn't available (missing file, dead service) —
// calling it removes the tile from the wall entirely instead of leaving a
// broken/empty box on the page. See `reportAssetIssue.ts` for where that
// gets logged.
export type FrameCellProps<T> = {
  frame: T;
  onOpenLightbox: (content: LightboxContent) => void;
  onFail: (detail: string) => void;
};
