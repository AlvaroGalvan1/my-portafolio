"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { SATELLITE_LAYER } from "./baseLayers";

declare module "leaflet" {
  interface MapOptions {
    gestureHandling?: boolean;
  }
}

let gestureHandlingRegistered = false;

// Web Mercator is only defined up to ~85.05°N/S — this is the exact square
// the world projects to, so bounding to it (instead of the poles) means the
// "does the world fill the box" math below stays correct.
const WORLD_LAT = 85.0511;

function worldBounds(L: typeof import("leaflet")) {
  return L.latLngBounds([-WORLD_LAT, -180], [WORLD_LAT, 180]);
}

// The zoom level at which one copy of the world (a 256 * 2^zoom square)
// covers the container in both dimensions — the floor for how far out you
// can zoom. Below this, panning would either wrap into a second copy of
// the map or expose gray space past the edge; capping here rules out both.
function minZoomForContainer(el: HTMLElement) {
  const size = Math.max(el.clientWidth, el.clientHeight, 1);
  return Math.max(2, Math.ceil(Math.log2(size / 256)));
}

// TODO: add layers here — places lived, friends' locations, a "What is UWC" marker + popup
export default function BaseMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    let observer: ResizeObserver | null = null;

    (async () => {
      const L = await import("leaflet");
      // The plugin's UMD build reads the global `L` at module-evaluation
      // time (it's written for a <script> include, not a bundler), so it
      // has to be on window before we import it.
      (window as unknown as { L: typeof L }).L = L;
      const { GestureHandling } = await import("leaflet-gesture-handling");

      if (cancelled || !containerRef.current || mapRef.current) return;

      if (!gestureHandlingRegistered) {
        L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        gestureHandlingRegistered = true;
      }

      const bounds = worldBounds(L);
      const minZoom = minZoomForContainer(containerRef.current);

      const map = L.map(containerRef.current, {
        minZoom,
        maxBounds: bounds,
        maxBoundsViscosity: 1,
        // Scroll to zoom only while Ctrl/Cmd is held (or two-finger drag
        // on touch) so hovering the map doesn't hijack the page's normal
        // scroll — a short on-map hint explains the gesture on first try.
        gestureHandling: true,
        // Opens on the whole world, zoomed out as far as the no-repeat cap
        // allows.
      }).setView([20, 0], minZoom);

      L.tileLayer(SATELLITE_LAYER.url, {
        attribution: SATELLITE_LAYER.attribution,
        maxZoom: SATELLITE_LAYER.maxZoom,
        noWrap: true,
        bounds,
      }).addTo(map);

      mapRef.current = map;

      const resize = () => {
        if (!containerRef.current || !mapRef.current) return;
        const z = minZoomForContainer(containerRef.current);
        mapRef.current.setMinZoom(z);
        if (mapRef.current.getZoom() < z) mapRef.current.setZoom(z);
      };
      observer = new ResizeObserver(resize);
      observer.observe(containerRef.current);
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
