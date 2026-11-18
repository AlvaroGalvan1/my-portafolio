import type { CSSProperties } from "react";
import { MOTION_MAP, VIEW } from "./motionMap.geo";
import styles from "./motionMap.module.css";

// C5: a map where, for now, only the motion matters. At rest it is a
// quiet close-up of the coast; on hover or keyboard focus Oaxaca draws in
// and the camera pulls back to show Mexico around it; leaving reverses it.
// No data, legend or numbers on purpose: the content comes later. The
// Oaxaca shape is a placeholder (see motionMap.geo.ts).
//
// It is a Server Component: the paths are computed on the server and the
// motion is CSS (motionMap.module.css), so nothing here needs JavaScript.
export default function MotionMap({
  label,
  name,
  hint,
}: {
  label: string;
  name: string;
  hint: string;
}) {
  const { camera, mexico, neighbours, graticule, oaxaca } = MOTION_MAP;
  const cameraVars = {
    "--tx": `${camera.tx}px`,
    "--ty": `${camera.ty}px`,
    "--k": camera.k,
  } as CSSProperties;

  return (
    <div
      tabIndex={0}
      role="img"
      aria-label={label}
      className={`${styles.frame} relative h-full w-full overflow-hidden rounded-[inherit] bg-[#cfe4ef]`}
    >
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g className={styles.camera} style={cameraVars}>
          <path d={graticule} fill="none" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={0.6} className={styles.line} />
          <path d={neighbours} fill="#e2eee0" stroke="#a9c7bb" strokeWidth={0.5} className={styles.line} />
          <path d={mexico} fill="#f3f8ef" stroke="#6f9d8f" strokeWidth={0.8} strokeLinejoin="round" className={styles.line} />

          {/* Oaxaca, placeholder shape: a fill that fades in under an outline that
              traces itself. The outline scales with the camera (a dash with
              pathLength does not survive non-scaling-stroke), so it is drawn
              thin: bold while close in, fine once zoomed out. */}
          <path d={oaxaca} fill="#2f7d6b" fillOpacity={0.34} className={styles.oaxacaFill} />
          <path
            d={oaxaca}
            pathLength={1}
            fill="none"
            stroke="#2f7d6b"
            strokeWidth={0.8}
            strokeLinejoin="round"
            strokeLinecap="round"
            className={styles.oaxacaLine}
          />
        </g>
      </svg>

      <span
        className={`${styles.label} pointer-events-none absolute bottom-[8%] left-[6%] font-[family-name:var(--font-display)] text-[13px] leading-none text-[#1f4a45]`}
      >
        {name}
      </span>

      <span
        className={`${styles.hint} pointer-events-none absolute bottom-[6%] right-[5%] flex items-center gap-1.5 rounded-full bg-white/70 px-2 py-0.5 text-[10px] tracking-wide text-[#1f4a45]/80 shadow-sm`}
        aria-hidden="true"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2f7d6b]/60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2f7d6b]" />
        </span>
        {hint}
      </span>
    </div>
  );
}
