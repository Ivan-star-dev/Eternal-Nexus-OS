// sacred flow — GeopoliticsMap.tsx
// Task C2: MapLibre GL React shell with PMTiles serverless source.
// Task U1: Eternal Nexus Dark Glassmorphism visual DNA applied via
//          nexus-map-style.ts (glowing teal borders, deep navy bg).
//
// Architecture:
//   useEffect mounts a MapLibre Map into a ref container.
//   registerPMTilesProtocol() is called once before any map source is added.
//   All layers are added in the map's "load" event using ALL_NEXUS_LAYERS.
//   Cleanup removes the map instance on component unmount.

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { registerPMTilesProtocol } from "@/lib/geo/pmtiles";
import {
  nexusMapStyle,
  ALL_NEXUS_LAYERS,
} from "@/lib/geo/nexus-map-style";

// ── Public demo PMTiles archive (Natural Earth vector data, no auth needed) ──
const PMTILES_URL =
  "pmtiles://https://r2-public.protomaps.com/protomaps-sample-datasets/ne_110m.pmtiles";

interface GeopoliticsMapProps {
  /** Tailwind / CSS class forwarded to the outer wrapper */
  className?: string;
  /** Initial longitude (default: 10) */
  centerLng?: number;
  /** Initial latitude (default: 20) */
  centerLat?: number;
  /** Initial zoom level (default: 1.8) */
  zoom?: number;
}

/**
 * GeopoliticsMap — MapLibre GL shell with PMTiles serverless vector tiles
 * and the Eternal Nexus Dark Glassmorphism style (Task C2 + U1).
 */
export default function GeopoliticsMap({
  className = "",
  centerLng = 10,
  centerLat = 20,
  zoom = 1.8,
}: GeopoliticsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Register PMTiles protocol once globally (idempotent)
    registerPMTilesProtocol();

    const map = new MapLibreMap({
      container: containerRef.current,
      style: nexusMapStyle,
      center: [centerLng, centerLat],
      zoom,
      // Disable rotation / pitch for a clean 2-D geopolitical view
      pitchWithRotate: false,
      touchPitch: false,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      try {
        // Add the PMTiles vector source
        map.addSource("nexus-geo", {
          type: "vector",
          url: PMTILES_URL,
        });

        // Apply all Eternal Nexus layers in render order
        for (const layer of ALL_NEXUS_LAYERS) {
          map.addLayer(layer as Parameters<typeof map.addLayer>[0]);
        }

        setIsLoaded(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setLoadError(msg);
      }
    });

    map.on("error", (e) => {
      // Surface tile-load errors in dev; suppress in prod to avoid noise
      if (import.meta.env.DEV) {
        console.warn("[GeopoliticsMap] map error:", e.error);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setIsLoaded(false);
    };
    // Props changes are intentionally ignored after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-border/30 ${className}`}
      style={{ minHeight: 320 }}
    >
      {/* MapLibre canvas mount point */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading skeleton — visible until tiles arrive */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[hsl(216_55%_3%/0.9)] z-10 pointer-events-none">
          <span className="font-mono text-[0.6rem] tracking-[0.18em] text-teal animate-pulse">
            LOADING MAP GRID…
          </span>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[hsl(216_55%_3%/0.9)] z-10 pointer-events-none">
          <span className="font-mono text-[0.6rem] tracking-[0.12em] text-destructive">
            MAP UNAVAILABLE
          </span>
        </div>
      )}

      {/* Glassmorphism scanline overlay (VISUAL_DNA — classified feel) */}
      <div
        className="absolute inset-0 pointer-events-none z-20 scanlines opacity-10"
        aria-hidden={true}
      />

      {/* Vignette overlay (depth + focus) */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, hsl(216 55% 3% / 0.6) 100%)",
        }}
        aria-hidden={true}
      />

      {/* Breadcrumb stamp (VISUAL_DNA — folder path) */}
      {isLoaded && (
        <div className="absolute top-2 left-2 z-30 font-mono text-[0.45rem] tracking-[0.14em] text-muted-foreground/60 pointer-events-none select-none">
          NEXUS / GEOPOLITICS / MAP GRID
        </div>
      )}
    </div>
  );
}
