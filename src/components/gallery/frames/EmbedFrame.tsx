"use client";

import type { FrameBase, FrameCellProps } from "./base";
import { TileLabel } from "./shared";
import { Z } from "@/lib/layers";

export type EmbedFrameData = FrameBase & {
  type: "embed";
  src: string;
};

// Renders a live external page inside the tile via <iframe>. A blocked embed
// (X-Frame-Options/CSP frame-ancestors) fails silently — the iframe just
// shows a blank/error page with no JS-visible error — so there's no
// reliable way to detect that from here. Before using `embed`, check the
// target allows framing: `curl -sI <url> | grep -i x-frame`. If it sends
// `X-Frame-Options` or a restrictive `frame-ancestors`, use a `link` frame
// instead (LANDFIRE's viewer does this — see its `link` entry in data.ts).
//
// The "Open ↗" corner button is a permanent escape hatch regardless: even a
// successful embed can render broken/partial content the iframe itself
// won't report as an error.
export function EmbedFrameCell({ frame }: FrameCellProps<EmbedFrameData>) {
  return (
    <div className="absolute inset-0 h-full w-full bg-neutral-950">
      <iframe
        src={frame.src}
        title={frame.title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
        className="h-full w-full border-0"
      />
      <TileLabel title={frame.title} source={frame.source} />
      <a
        href={frame.src}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
        className="absolute right-2 top-2 border-2 border-white/40 bg-black/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80 transition-colors hover:border-white hover:text-white"
      >
        Open ↗
      </a>
    </div>
  );
}
