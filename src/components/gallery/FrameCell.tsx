"use client";

import type { ComponentType } from "react";
import { FRAME_REGISTRY, type FrameData } from "./frames/registry";
import type { FrameCellProps } from "./frames/base";
import type { LightboxContent } from "./Lightbox";
import { TileCredit } from "./frames/shared";

// Generic dispatcher: looks up `frame.type` in the registry and renders
// that frame kind's own cell component. This file never needs to change
// when a new frame kind is added — see frames/registry.tsx.
//
// The credit is rendered here rather than inside each frame, for two
// reasons: every tile gets one whether or not its frame remembered to ask
// for it, and the credit's link stays outside frames that wrap their whole
// body in a <button> (an <a> inside a <button> is invalid HTML).
export default function FrameCell({
  frame,
  onOpenLightbox,
  onFail,
}: {
  frame: FrameData;
  onOpenLightbox: (content: LightboxContent) => void;
  onFail: (detail: string) => void;
}) {
  const Component = FRAME_REGISTRY[frame.type] as ComponentType<FrameCellProps<FrameData>>;
  return (
    <>
      <Component frame={frame} onOpenLightbox={onOpenLightbox} onFail={onFail} />
      <TileCredit credit={frame.credit} />
    </>
  );
}
