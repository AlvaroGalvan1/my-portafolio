"use client";

import type { ComponentType } from "react";
import { FRAME_REGISTRY, type FrameData } from "./frames/registry";
import type { FrameCellProps } from "./frames/base";
import type { LightboxContent } from "./Lightbox";

// Generic dispatcher: looks up `frame.type` in the registry and renders
// that frame kind's own cell component. This file never needs to change
// when a new frame kind is added — see frames/registry.tsx.
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
  return <Component frame={frame} onOpenLightbox={onOpenLightbox} onFail={onFail} />;
}
