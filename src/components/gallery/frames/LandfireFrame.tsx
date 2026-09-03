"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { FrameBase, FrameCellProps } from "./base";
import { TileLabel } from "./shared";
import { SATELLITE_LAYER } from "@/components/map/baseLayers";
import { Z } from "@/lib/layers";

export type LandfireFrameData = FrameBase & {
  type: "landfire";
};

// LANDFIRE's own viewer (landfire.gov/viewer) sends X-Frame-Options:
// SAMEORIGIN — it refuses to be iframed from any other domain, confirmed
// via `curl -sI https://www.landfire.gov/viewer/`. But the *data* behind it
// is a public WMS service with no such restriction, so instead of iframing
// their app we draw the real vegetation-cover layer ourselves on our own
// map — live LANDFIRE data, not a screenshot of their UI. Requests go
// through our own `/api/landfire-tile` proxy rather than straight to
// LANDFIRE's GeoServer — see that route for why (Chromium blocks the direct
// response outright).
const WMS_URL = "/api/landfire-tile";
const WMS_LAYER = "LF2024_EVC_CONUS"; // Existing Vegetation Cover, CONUS, 2024
const CONUS_BOUNDS: [[number, number], [number, number]] = [
  [22.7, -128.4],
  [52.5, -64.9],
];
// A tile layer that never loads (WMS outage, network block) fails silently
// — Leaflet just shows blank tiles, no thrown error. Past this many failed
// tile requests, assume the service is down and hide the tile (via
// `onFail`) rather than leave a mysteriously blank map on the page.
const TILE_ERROR_THRESHOLD = 6;

export function LandfireFrameCell({ frame, onFail }: FrameCellProps<LandfireFrameData>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    let errorCount = 0;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false, // don't hijack page scroll on hover
        maxBounds: L.latLngBounds(CONUS_BOUNDS),
        maxBoundsViscosity: 1,
      });
      map.fitBounds(CONUS_BOUNDS);
      map.setMinZoom(map.getZoom());

      L.tileLayer(SATELLITE_LAYER.url, {
        attribution: SATELLITE_LAYER.attribution,
        maxZoom: SATELLITE_LAYER.maxZoom,
      }).addTo(map);

      const wms = L.tileLayer
        .wms(WMS_URL, {
          layers: WMS_LAYER,
          format: "image/png",
          transparent: true,
          version: "1.3.0",
          opacity: 0.75,
        })
        .addTo(map);

      wms.on("tileerror", () => {
        errorCount += 1;
        if (errorCount > TILE_ERROR_THRESHOLD) {
          onFail(`LANDFIRE WMS tiles failed to load repeatedly (${errorCount} tile errors)`);
        }
      });

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Map is created once on mount; onFail is read at that point via
    // closure and doesn't need to re-trigger setup on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full bg-neutral-950">
      <div ref={containerRef} className="h-full w-full" />
      <TileLabel title={frame.title} />
      <a
        href="https://www.landfire.gov/viewer/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: Z.CARD_OVERLAY_CONTROL }}
        className="absolute right-2 top-2 border-2 border-white/40 bg-black/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80 transition-colors hover:border-white hover:text-white"
      >
        Open official viewer ↗
      </a>
    </div>
  );
}
