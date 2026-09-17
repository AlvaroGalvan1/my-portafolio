import type { ComponentType } from "react";
import type { FrameCellProps } from "./base";
import { ImageFrameCell, type ImageFrameData } from "./ImageFrame";
import { ImageSetFrameCell, type ImageSetFrameData } from "./ImageSetFrame";
import { VideoFrameCell, type VideoFrameData } from "./VideoFrame";
import { LinkFrameCell, type LinkFrameData } from "./LinkFrame";
import { PostFrameCell, type PostFrameData } from "./PostFrame";
import {
  CellularAutomataFrameCell,
  type CellularAutomataFrameData,
} from "./CellularAutomataFrame";
import { EmbedFrameCell, type EmbedFrameData } from "./EmbedFrame";
import { LandfireFrameCell, type LandfireFrameData } from "./LandfireFrame";
import { PlaceholderFrameCell, type PlaceholderFrameData } from "./PlaceholderFrame";
import { FireFrameCell, type FireFrameData } from "./FireFrame";
import { YouTubeFrameCell, type YouTubeFrameData } from "./YouTubeFrame";

// The one place that has to know about every frame kind. To add a new kind:
// 1. Create `frames/YourFrame.tsx` exporting a `YourFrameData` type (extend
//    `FrameBase`, give it a unique `type` literal) and a `YourFrameCell`
//    component (`FrameCellProps<YourFrameData> -> JSX`).
// 2. Add its type to the `FrameData` union and its component to
//    `FRAME_REGISTRY` below.
// Nothing else — not `FrameCell.tsx`, not `HorizontalGallery.tsx` — needs
// to change.
export type FrameData =
  | ImageFrameData
  | ImageSetFrameData
  | VideoFrameData
  | LinkFrameData
  | PostFrameData
  | CellularAutomataFrameData
  | EmbedFrameData
  | LandfireFrameData
  | PlaceholderFrameData
  | FireFrameData
  | YouTubeFrameData;

export const FRAME_REGISTRY: {
  [K in FrameData["type"]]: ComponentType<FrameCellProps<Extract<FrameData, { type: K }>>>;
} = {
  image: ImageFrameCell,
  imageSet: ImageSetFrameCell,
  video: VideoFrameCell,
  link: LinkFrameCell,
  post: PostFrameCell,
  cellularAutomata: CellularAutomataFrameCell,
  embed: EmbedFrameCell,
  landfire: LandfireFrameCell,
  placeholder: PlaceholderFrameCell,
  fire: FireFrameCell,
  youtube: YouTubeFrameCell,
};
