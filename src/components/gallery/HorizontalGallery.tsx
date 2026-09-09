"use client";

import { useEffect, useRef, useState } from "react";
import FrameCell from "./FrameCell";
import Lightbox, { type LightboxContent } from "./Lightbox";
import type { FrameData } from "./frames/registry";
import { reportAssetIssue } from "./reportAssetIssue";
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
const ROW_H_VH = 34;
// Width of one column track, for tiles that don't carry their own shape.
const COL_W_VW = 26;
const GAP_REM = 2;

// How wide one tile is. Two cases:
//   - A piece with a real-world shape (a map print, a book cover) states an
//     `aspectRatio`; its width follows from the height it occupies, so it
//     keeps its true proportions instead of being cropped to a cell.
//   - Everything else fills the column track(s) its colSpan covers.
// Both are explicit because the grid's columns are `min-content` — they
// size to the tiles, not the other way round.
function tileWidth(item: FrameData) {
  const heightVh = ROW_H_VH * item.rowSpan;
  const innerGaps = item.rowSpan - 1;
  if (item.aspectRatio) {
    return `calc((${heightVh}vh + ${innerGaps * GAP_REM}rem) * ${item.aspectRatio})`;
  }
  return `calc(${item.colSpan * COL_W_VW}vw + ${(item.colSpan - 1) * GAP_REM}rem)`;
}

export default function HorizontalGallery({ items }: { items: FrameData[] }) {
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
  const visibleItems = items.filter((item) => !brokenIds.has(item.id));
  const loopItems =
    visibleItems.length > 0 ? [...visibleItems, ...visibleItems, ...visibleItems] : [];

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
    <div className="relative bg-[#8f1c14] py-10">
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
        className={`mb-6 flex items-center justify-end gap-3 px-6 font-sans text-sm font-bold tracking-wide text-white transition-opacity duration-700 sm:px-16 sm:text-base ${
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

      <div
        ref={rowRef}
        tabIndex={0}
        role="region"
        aria-label="My Wall — scroll sideways to browse"
        className="wall-scroller grid cursor-grab grid-flow-col-dense gap-8 overflow-x-auto px-6 pb-4 will-change-scroll active:cursor-grabbing sm:px-16"
        style={{
          gridTemplateRows: `repeat(2, ${ROW_H_VH}vh)`,
          // Columns size to their content rather than to a fixed width, so
          // a tile carrying its own real-world proportions gets exactly the
          // width that shape needs — no clipping, no leftover track. Every
          // tile therefore states its width explicitly (see `tileWidth`).
          gridAutoColumns: "min-content",
        }}
      >
        {loopItems.map((item, i) => (
          <div
            key={`${item.id}__${i}`}
            style={{
              gridColumn: `span ${item.colSpan}`,
              gridRow: `span ${item.rowSpan}`,
              width: tileWidth(item),
            }}
            className="group relative overflow-hidden border-[3px] border-black bg-black shadow-[10px_10px_0_rgba(0,0,0,0.55)]"
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

      <Lightbox content={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}

// A pressure-sensitive strip along one edge of the Wall. Resting state is
// just the fade that says "there's more this way"; entering it warms the
// strip orange and starts the drift, and pushing toward the outer edge
// deepens the tint and accelerates. Nothing to click or aim at — the input
// is where the pointer is.
//
// Tint and glyph are written straight to the DOM (refs, not state) because
// this updates on every pointermove and a re-render per frame would be
// wasteful. Hidden below `sm` — touch has no hover, and swiping is already
// the natural gesture there.
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
  const tintRef = useRef<HTMLDivElement>(null);
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

    if (tintRef.current) tintRef.current.style.opacity = String(0.1 + intensity * 0.65);
    if (glyphRef.current) {
      glyphRef.current.style.opacity = String(0.35 + intensity * 0.65);
      glyphRef.current.style.transform = `translateX(${
        (side === "left" ? -1 : 1) * intensity * 10
      }px) scale(${1 + intensity * 0.45})`;
    }
    onPan(side === "left" ? -1 : 1, intensity);
  };

  const handleLeave = () => {
    if (tintRef.current) tintRef.current.style.opacity = "0";
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
            ? "bg-gradient-to-r from-[#8f1c14] to-transparent"
            : "bg-gradient-to-l from-[#8f1c14] to-transparent"
        }`}
      />
      {/* Warm-up tint — opacity driven by how deep the pointer is. */}
      <div
        ref={tintRef}
        style={{ opacity: 0 }}
        className={`pointer-events-none absolute inset-0 transition-opacity duration-100 ${
          side === "left"
            ? "bg-gradient-to-r from-brand-red to-transparent"
            : "bg-gradient-to-l from-brand-red to-transparent"
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
