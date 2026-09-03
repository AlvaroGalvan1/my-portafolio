import type { LightboxContent } from "../Lightbox";

// Every frame kind extends this. Shared layout/attribution fields live
// here; whatever makes a frame *that kind* (its media, its behavior) lives
// in the frame's own file.
export type FrameBase = {
  id: string;
  title: string;
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
  // Attribution shown in the lightbox.
  credit?: string;
  // Small "@handle" byline shown in the tile's corner, linking to the
  // source's own landing page (e.g. @landfire -> landfire.gov). Preferred
  // over `credit` for anything with a real home on the web — it puts the
  // attribution on the piece itself rather than in a separate list.
  source?: { handle: string; href: string };
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
