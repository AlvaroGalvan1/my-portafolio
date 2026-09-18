"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FrameCell from "./FrameCell";
import Lightbox, { type LightboxContent } from "./Lightbox";
import { localizeGallery } from "./data";
import type { FrameData } from "./frames/registry";
import { reportAssetIssue } from "./reportAssetIssue";
import type { Locale } from "@/content/i18n";
import type { UiStrings } from "@/content/ui";
import { Z } from "@/lib/layers";

export type { FrameData } from "./frames/registry";

// The Wall is a natively horizontally-scrollable strip — trackpad
// side-swipe, shift+wheel, drag, or arrow keys all work. It does NOT hijack
// vertical page scroll into sideways panning (that read as
// counterintuitive) — the page scrolls normally past it.
//
// Sideways scrolling isn't a habit most visitors have, so the affordances
// matter more than usual. In order of how much work they do:
//   1. Edge fades — content dissolving at both edges is the oldest signal
//      in the book for "this continues past what you can see."
//   2. Edge zones — hovering near a side pans the Wall, faster the closer
//      to the edge you get. See EdgeZone at the bottom of this file.
//   3. Drag-to-pan with a grab cursor — the cursor change on hover
//      advertises the interaction before the visitor commits to it.
//   4. A real scrollbar, styled rather than hidden — hiding it is a common
//      mistake that removes the one native signal people already read.
// Row height, in svh rather than vh. Mobile browsers measure `vh` against
// the viewport with the URL bar *hidden*, so a vh-sized element is taller
// than the screen on arrival and resizes the moment the bar collapses —
// which, on a page whose rows are sized this way, reflows the whole Wall
// mid-scroll. `svh` is the small viewport: the one that is actually
// visible on load, and which never changes.
//
// 18 and three rows, where it was 36 and two. Every piece is half as tall
// and half as wide as it was — a quarter of the area — so they read as
// postcards and prints stuck to a wall rather than as posters hung in a
// row. The Wall itself only lost a quarter of its height, because the
// extra row takes most of it back.
const ROW_H_VH = 18;
const ROWS = 3;
// Width of one column track lives in CSS as `--wall-col` on `.wall-scroller`
// (see globals.css) rather than here, because it has to change with the
// viewport. `--wall-tile-max` caps every tile to just under the viewport.
//
// The space between pieces, horizontally and vertically. `tileWidth` and
// `tileHeight` add it back for every track and row a tile spans, so a
// 2-row piece lines up with two 1-row pieces stacked beside it.
// 0.5rem, down from 1 and from 2.5 before that: the pieces should read as
// one wall of things pinned edge to edge, a collection that grows, rather
// than as separate prints each with its own air.
const GAP_REM = 0.5;

// How wide one tile is. Two cases:
//   - A piece with a real-world shape (a map print, a book cover) states an
//     `aspectRatio`; its width follows from the height it occupies, so it
//     keeps its true proportions instead of being cropped to a cell.
//   - Everything else fills the column track(s) its colSpan covers.
function tileHeight(item: { rowSpan: number }) {
  return `calc(${ROW_H_VH * item.rowSpan}svh + ${(item.rowSpan - 1) * GAP_REM}rem)`;
}

function tileWidth(item: FrameData) {
  if (item.aspectRatio) {
    return `calc(${tileHeight(item)} * ${item.aspectRatio})`;
  }
  return `min(calc(${item.colSpan} * var(--wall-col) + ${
    (item.colSpan - 1) * GAP_REM
  }rem), var(--wall-tile-max))`;
}

// Pack one copy of the Wall into stacks: each stack is a column of pieces
// whose rowSpans add up to at most ROWS.
//
// ── Keeping the pieces edge to edge ───────────────────────────────────
// A stack is as wide as its widest piece, so a narrow piece under a wide
// one leaves a hole beside it, and a stack that runs out of pieces leaves
// a hole under it. Both read as the Wall falling apart. Two rules close
// them:
//
//   1. Choosing. Each stack still starts with the next piece in line, so
//      the order in data.ts is the order the Wall reads in. What goes
//      UNDER it is the piece from anywhere later in the queue whose width
//      is closest — the 16:9 videos end up together, the map sheets
//      together, the book covers together. A piece more than MAX_MISMATCH
//      row-heights off is not taken at all: a stack with a spare row can
//      stretch a shapeless piece into it, but a hole beside a mismatched
//      piece cannot be filled by anything.
//   2. Stretching, at render time. A piece with no real-world shape (no
//      `aspectRatio`) fills its stack's width, and takes any rows its
//      stack has left over. Pieces WITH a shape — photos, maps, covers —
//      are never stretched, because that is the whole point of stating
//      one: they are shown uncropped.
//
// Widths are compared in row heights, with one column track taken as
// COL_IN_ROWS of them. That is the desktop ratio (a 12.5vw track against
// an 18svh row on a 16:10 screen); it only has to rank candidates, not
// measure them, so one ratio for every screen is enough.
//
// This used to be CSS grid's `grid-flow-col-dense`, and with two rows that
// was fine. With three and a mix of 1- and 2-row pieces, dense packing
// back-fills holes in one copy with pieces from the next, so the three
// copies of the loop stop being identical and the rewind below jumps
// visibly. Packing one copy here and repeating the result makes them
// identical by construction.
const COL_IN_ROWS = 1.1;
const MAX_MISMATCH = 0.5;
const SHAPELESS_COST = 0.2;

function widthInRows(item: FrameData) {
  const rows = Math.min(item.rowSpan, ROWS);
  return item.aspectRatio ? rows * item.aspectRatio : item.colSpan * COL_IN_ROWS;
}

function packStacks(items: FrameData[]): FrameData[][] {
  const queue = [...items];
  const stacks: FrameData[][] = [];
  while (queue.length > 0) {
    const first = queue.shift()!;
    const stack: FrameData[] = [first];
    let width = widthInRows(first);
    let left = ROWS - Math.min(first.rowSpan, ROWS);
    while (left > 0) {
      let best = -1;
      let bestCost = Infinity;
      for (let i = 0; i < queue.length; i++) {
        const candidate = queue[i];
        if (Math.min(candidate.rowSpan, ROWS) > left) continue;
        const w = widthInRows(candidate);
        // A shaped piece costs its gap either way. A shapeless one
        // narrower than the stack stretches to fit, so it costs only a
        // small flat SHAPELESS_COST — enough that a shaped piece that
        // matches well is taken first, because the shapeless one can fit
        // under almost anything and the shaped one can't.
        const cost = candidate.aspectRatio
          ? Math.abs(w - width)
          : SHAPELESS_COST + Math.max(0, w - width);
        if (cost <= MAX_MISMATCH && cost < bestCost) {
          best = i;
          bestCost = cost;
        }
      }
      if (best === -1) break;
      const [item] = queue.splice(best, 1);
      stack.push(item);
      width = Math.max(width, widthInRows(item));
      left -= Math.min(item.rowSpan, ROWS);
    }
    stacks.push(stack);
  }
  return mergeShortStacks(stacks);
}

// The end of the queue is where the leftovers land: the last few pieces
// fall into stacks of their own, each with rows to spare. Fold a later
// short stack into an earlier one whenever it fits, choosing the one
// closest in width, so the tail of the Wall is as tight as the rest.
function mergeShortStacks(stacks: FrameData[][]): FrameData[][] {
  const rowsOf = (stack: FrameData[]) =>
    stack.reduce((sum, item) => sum + Math.min(item.rowSpan, ROWS), 0);
  const widthOf = (stack: FrameData[]) => Math.max(...stack.map(widthInRows));
  const out = stacks.map((stack) => [...stack]);
  for (let i = 0; i < out.length; i++) {
    while (rowsOf(out[i]) < ROWS) {
      const room = ROWS - rowsOf(out[i]);
      let best = -1;
      let bestCost = Infinity;
      for (let j = i + 1; j < out.length; j++) {
        if (rowsOf(out[j]) > room) continue;
        const cost = Math.abs(widthOf(out[j]) - widthOf(out[i]));
        if (cost < bestCost) {
          best = j;
          bestCost = cost;
        }
      }
      if (best === -1) break;
      out[i].push(...out[best]);
      out.splice(best, 1);
    }
  }
  return out;
}

// The rows a stack leaves empty go to its first shapeless piece. Returns the
// rowSpan each piece is drawn at.
function drawnRows(stack: FrameData[]): number[] {
  const rows = stack.map((item) => Math.min(item.rowSpan, ROWS));
  const spare = ROWS - rows.reduce((a, b) => a + b, 0);
  const grow = stack.findIndex((item) => !item.aspectRatio);
  if (spare > 0 && grow !== -1) rows[grow] += spare;
  return rows;
}

export default function HorizontalGallery({
  items,
  locale,
  strings,
}: {
  items: FrameData[];
  locale: Locale;
  strings: UiStrings["wall"];
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<LightboxContent | null>(null);
  // The hint below the heading, and whether it's been earned out. Sideways
  // scrolling is the one interaction on this page nobody arrives expecting,
  // so it gets said in words once — and then never again, because a hint
  // that stays after you've done the thing is just noise.
  const [hinted, setHinted] = useState(false);
  // Tiles whose content failed to load — filtered out of the grid entirely
  // (not shown as an empty/broken box). A frame reports itself broken via
  // `onFail`, which also logs why through reportAssetIssue.
  const [brokenIds, setBrokenIds] = useState<Set<string>>(new Set());
  // Localised here rather than in the frames below: eleven frame kinds
  // each take `title: string`, and the alternative was threading a locale
  // through every one of them. See `localizeGallery` in data.ts.
  const visibleItems = useMemo(
    () => localizeGallery(items, locale).filter((item) => !brokenIds.has(item.id)),
    [items, locale, brokenIds],
  );
  const stacks = useMemo(() => packStacks(visibleItems), [visibleItems]);
  const loopStacks = stacks.length > 0 ? [...stacks, ...stacks, ...stacks] : [];

  // Looping: three back-to-back copies, and the scroll position quietly
  // rewinds by one copy-width whenever it strays into the first or third —
  // so scrolling either way cycles rather than hitting a dead end. Each
  // load starts at a random point in the loop.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || visibleItems.length === 0) return;

    const setWidth = row.scrollWidth / 3;
    row.scrollLeft = setWidth + Math.random() * setWidth;

    const onScroll = () => {
      if (row.scrollLeft < setWidth * 0.5) row.scrollLeft += setWidth;
      else if (row.scrollLeft > setWidth * 1.5) row.scrollLeft -= setWidth;
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => row.removeEventListener("scroll", onScroll);
  }, [visibleItems.length]);

  // Drag-to-pan. `moved` gates the click that follows a drag, so releasing
  // after a pan doesn't also open the tile underneath.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    let down = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = row.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) {
        moved = true;
        setHinted(true);
      }
      if (moved) {
        row.scrollLeft = startScroll - dx;
        row.setPointerCapture(e.pointerId);
      }
    };
    const onPointerUp = () => {
      down = false;
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    row.addEventListener("pointerdown", onPointerDown);
    row.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    row.addEventListener("click", onClickCapture, { capture: true });
    return () => {
      row.removeEventListener("pointerdown", onPointerDown);
      row.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      row.removeEventListener("click", onClickCapture, { capture: true });
    };
  }, [visibleItems.length]);

  // Edge-zone panning. The *area* near each edge is the control, not a
  // button in it: moving the pointer into the zone tints it and starts the
  // Wall drifting, and pushing further toward the edge speeds it up. This
  // is the map/video-timeline "edge pressure" idiom — the input is where
  // you are, so there's nothing to aim at or click, and the speed is under
  // continuous control instead of quantised into steps.
  //
  // Speed lives in a ref and the rAF loop reads it, so pointer movement
  // never triggers a React re-render — the tint is written straight to the
  // DOM node too (see EdgeZone).
  const speedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const runLoop = () => {
    if (rafRef.current !== null) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const row = rowRef.current;
      // px/second scaled by elapsed time, so the speed is the same on a
      // 60Hz and a 120Hz display.
      if (row && speedRef.current !== 0) row.scrollLeft += speedRef.current * dt;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const stopLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    speedRef.current = 0;
  };

  useEffect(() => stopLoop, []);

  // Slowest at the zone's inner boundary, fastest right at the edge.
  const MIN_SPEED = 90;
  const MAX_SPEED = 1900;

  const setPan = (direction: -1 | 1, intensity: number) => {
    speedRef.current = direction * (MIN_SPEED + intensity * (MAX_SPEED - MIN_SPEED));
    setHinted(true);
    runLoop();
  };

  return (
    // `flex-1` and centred: the Wall section is one screen tall (see
    // Wall.tsx), and the pieces sit in the middle of whatever the heading
    // leaves rather than hard under it with the slack below.
    <div className="relative flex flex-1 flex-col justify-center bg-brand-brick pt-4 pb-10">
      {/* Set bold in the sans face rather than in the display one: it has to
          carry across a red field at small size, and Bungee — the display
          face — only ships at one weight and reads as a second heading
          under "My Wall" rather than as an instruction.

          Right-aligned, with the arrow trailing and drifting toward the
          right edge zone. The arrow is the actual instruction: it ends up
          about 64px from the edge, which on `sm` and up is already inside
          that zone, so following it to read it starts the Wall moving. It
          fades rather than disappearing, so cause and effect land in the
          same moment.

          The wording splits by input: the edge zones below are pointer-only
          (`sm:block`), and telling a phone to move its mouse is telling it
          nothing — so touch gets the gesture it actually has, and no arrow
          pointing at a zone that isn't there. */}
      <p
        aria-hidden={hinted}
        className={`mb-2 flex items-center justify-end gap-3 px-6 font-sans text-sm font-bold tracking-wide text-white transition-opacity duration-700 sm:px-16 sm:text-base ${
          hinted ? "opacity-0" : "opacity-95"
        }`}
      >
        <span className="sm:hidden">Swipe — the wall keeps going.</span>
        <span className="hidden sm:inline">
          Put your mouse here and the wall starts moving.
        </span>
        <span aria-hidden className="hint-arrow hidden text-xl leading-none sm:inline">
          →
        </span>
      </p>

      <EdgeZone side="left" onPan={setPan} onLeave={stopLoop} />
      <EdgeZone side="right" onPan={setPan} onLeave={stopLoop} />

      {/* No side padding, unlike the heading and the hint above it: the row
          runs the full width of the screen and the pieces are cut off by
          the window rather than by a margin, which is what makes the brick
          read as a wall that continues past the frame instead of a panel
          inset on the page.

          It also makes the loop arithmetic exact. `setWidth` above is
          `scrollWidth / 3`, and a scroll container's scrollWidth includes
          its padding — so horizontal padding here would make every rewind
          drift. For the same reason each stack carries its own trailing
          margin instead of the row having a `gap`: n-1 gaps across three
          copies don't divide by three, n margins do.

          Vertical padding is fine, and keeps the shadows from being
          clipped: a scroller clips on both axes. */}
      <div
        ref={rowRef}
        tabIndex={0}
        role="region"
        aria-label={strings.scrollHint}
        className="wall-scroller flex cursor-grab items-center overflow-x-auto pt-4 pb-6 will-change-scroll active:cursor-grabbing"
      >
        {loopStacks.map((stack, s) => {
          const rows = drawnRows(stack);
          return (
          <div
            key={s}
            className="flex shrink-0 flex-col items-stretch justify-center"
            style={{
              gap: `${GAP_REM}rem`,
              marginRight: `${GAP_REM}rem`,
              height: `calc(${ROWS * ROW_H_VH}svh + ${(ROWS - 1) * GAP_REM}rem)`,
            }}
          >
            {stack.map((item, i) => (
              <div
                key={item.id}
                // Shaped pieces keep their exact size, centred in the stack.
                // Shapeless ones take the stack's width (a minimum, so the
                // stack still grows to fit them) and their drawn rows.
                style={
                  item.aspectRatio
                    ? { width: tileWidth(item), height: tileHeight(item), alignSelf: "center" }
                    : { minWidth: tileWidth(item), height: tileHeight({ ...item, rowSpan: rows[i] }) }
                }
                // The frame turns yellow under the pointer, and under
                // keyboard focus anywhere inside it — yellow because that is
                // already the page's "this responds" colour, on the nav and
                // in the edge zones. `focus-within` rather than `focus`:
                // what actually takes focus is the button or link inside the
                // tile, and the frame is what has to show it.
                //
                // Square to the page. The pieces were tilted and taped for
                // one pass, and it read as a costume; the variety in sizes
                // and the stacks already keep the Wall from looking like a
                // grid. The cream border is the white margin of a print.
                className="group relative shrink-0 overflow-hidden border-4 border-brand-cream bg-black shadow-[2px_4px_8px_rgba(0,0,0,0.45)] transition-colors duration-150 hover:border-brand-yellow focus-within:border-brand-yellow"
              >
                <FrameCell
                  frame={item}
                  onOpenLightbox={setLightbox}
                  onFail={(detail) => {
                    reportAssetIssue({ id: item.id, title: item.title, type: item.type, detail });
                    setBrokenIds((prev) => new Set(prev).add(item.id));
                  }}
                />
              </div>
            ))}
          </div>
          );
        })}
      </div>

      <Lightbox
        content={lightbox}
        onClose={() => setLightbox(null)}
        locale={locale}
        readOriginal={strings.readOriginal}
      />
    </div>
  );
}

// A pressure-sensitive strip along one edge of the Wall. Resting state is
// just the fade that says "there's more this way"; entering it starts the
// drift, and pushing toward the outer edge accelerates. Nothing to click or
// aim at — the input is where the pointer is.
//
// The arrow carries the feedback on its own. A red wash used to come up
// under it, deepening with pointer depth, which read as the Wall flagging
// something rather than as a speed control — and it was a second signal for
// the one thing the arrow already says.
//
// The glyph is written straight to the DOM (a ref, not state) because this
// updates on every pointermove and a re-render per frame would be wasteful.
// Hidden below `sm` — touch has no hover, and swiping is already the
// natural gesture there.
function EdgeZone({
  side,
  onPan,
  onLeave,
}: {
  side: "left" | "right";
  onPan: (direction: -1 | 1, intensity: number) => void;
  onLeave: () => void;
}) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const zone = zoneRef.current;
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // 0 at the zone's inner boundary, 1 hard against the outer edge.
    const depth = side === "left" ? 1 - x / rect.width : x / rect.width;
    const clamped = Math.min(1, Math.max(0, depth));
    // Eased so the slow end has room — linear makes the first third feel
    // like it does nothing.
    const intensity = clamped ** 1.6;

    if (glyphRef.current) {
      glyphRef.current.style.opacity = String(0.35 + intensity * 0.65);
      glyphRef.current.style.transform = `translateX(${
        (side === "left" ? -1 : 1) * intensity * 10
      }px) scale(${1 + intensity * 0.45})`;
    }
    onPan(side === "left" ? -1 : 1, intensity);
  };

  const handleLeave = () => {
    if (glyphRef.current) {
      glyphRef.current.style.opacity = "0";
      glyphRef.current.style.transform = "translateX(0) scale(1)";
    }
    onLeave();
  };

  return (
    <div
      ref={zoneRef}
      aria-hidden
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
      className={`absolute inset-y-0 hidden w-24 sm:block lg:w-32 ${
        side === "left" ? "left-0" : "right-0"
      }`}
    >
      {/* Resting fade — always there, independent of hover. */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          side === "left"
            ? "bg-gradient-to-r from-brand-brick to-transparent"
            : "bg-gradient-to-l from-brand-brick to-transparent"
        }`}
      />
      <span
        ref={glyphRef}
        style={{ opacity: 0 }}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-3xl text-brand-yellow transition-opacity duration-100 ${
          side === "left" ? "left-5" : "right-5"
        }`}
      >
        {side === "left" ? "←" : "→"}
      </span>
    </div>
  );
}
