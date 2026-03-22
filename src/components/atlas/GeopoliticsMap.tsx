/**
 * GeopoliticsMap — MapLibre GL JS shell component (Pilar 3 · Atlas Bus Integration)
 *
 * Sacred Flow: Tribunal → Atlas → Index → News
 * This component reads from the Atlas layer (useNexusState) and renders
 * Tribunal verdict events as map overlays with Framer Motion boundary pulses.
 *
 * Map engine: MapLibre GL JS
 * NOTE: maplibre-gl is not yet installed. Install with:
 *   npm install maplibre-gl
 *   npm install --save-dev @types/maplibre-gl   (if types are not bundled)
 *
 * PMTiles: pmtiles is not yet installed. Install with:
 *   npm install pmtiles
 * Once installed, remove the TODO below and uncomment the protocol registration block.
 */

// TODO: uncomment once `maplibre-gl` is installed
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";

// TODO: uncomment once `pmtiles` is installed
// import { Protocol } from "pmtiles";

import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNexusState } from "@/hooks/useNexusState";
import type { TribunalVerdict, RealtimeDataPoint } from "@/types/index";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Minimal GeoJSON Feature shape used here so that @types/geojson is not
 * required as a dependency. When maplibre-gl is installed its bundled types
 * will expose the full GeoJSON namespace; until then this local alias keeps
 * the component self-contained.
 */
export type GeoJSONFeature = {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: unknown;
  } | null;
  properties: Record<string, unknown> | null;
  id?: string | number;
};

export interface GeopoliticsMapProps {
  /** Optional Tailwind / CSS class applied to the outer container. */
  className?: string;
  /**
   * Called when the user clicks a GeoJSON feature on the map.
   * Receives the raw GeoJSON Feature object from MapLibre.
   */
  onFeatureClick?: (feature: GeoJSONFeature) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derive a deterministic lat/lng for a TribunalVerdict overlay marker.
 * Until the Nervous System bus (T-002) provides explicit coordinates per
 * verdict, we map the topic string to a position so each verdict has a
 * stable, visually distinct location on the map.
 */
function verdictToLatLng(verdict: TribunalVerdict): { lat: number; lng: number } {
  // Simple hash of the verdict id → stable pseudo-random position
  let hash = 0;
  for (let i = 0; i < verdict.id.length; i++) {
    hash = (hash * 31 + verdict.id.charCodeAt(i)) >>> 0;
  }
  const lat = ((hash % 1800) / 10) - 90;   // -90 … +90
  const lng = (((hash >> 8) % 3600) / 10) - 180; // -180 … +180
  return { lat, lng };
}

/** Map a verdict outcome to a display colour. */
function verdictColor(verdict: TribunalVerdict["verdict"]): string {
  switch (verdict) {
    case "approved":      return "#22c55e"; // green-500
    case "rejected":      return "#ef4444"; // red-500
    case "needs-review":  return "#f59e0b"; // amber-500
    default:              return "#a0a0a0";
  }
}

/** Map a RealtimeDataPoint source to a display colour. */
function dataPointColor(source: RealtimeDataPoint["source"]): string {
  switch (source) {
    case "geopolitics": return "#00ffcc";
    case "climate":     return "#4a90e2";
    case "economy":     return "#f5c24a";
    case "energy":      return "#c026d3";
    case "migration":   return "#f97316";
    default:            return "#a0a0a0";
  }
}

// ---------------------------------------------------------------------------
// Overlay marker (boundary pulse animation)
// ---------------------------------------------------------------------------

interface OverlayMarkerProps {
  label: string;
  color: string;
  /** 0-1 severity / confidence used to size the marker */
  weight: number;
  /** Unique id — changing this triggers the entrance pulse animation */
  eventId: string;
}

/**
 * A positioned div overlay rendered on top of the map canvas.
 * Uses Framer Motion to pulse scale 1 → 1.15 → 1 on mount / new event.
 *
 * Positioning note: until MapLibre projects lat/lng to screen coordinates
 * we use a simple percentage-based CSS transform derived from the world
 * coordinates (good enough for the placeholder stage).
 */
function OverlayMarker({ label, color, weight, eventId }: OverlayMarkerProps) {
  const size = 8 + Math.round(weight * 12); // 8-20 px diameter

  return (
    <motion.div
      key={eventId}
      // Boundary pulse: scale 1 → 1.15 → 1, opacity flash, 0.3s
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.85] }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute flex items-center justify-center pointer-events-none"
      style={{ width: size, height: size }}
      title={label}
    >
      {/* Outer ring pulse */}
      <motion.span
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, opacity: 0.4 }}
      />
      {/* Core dot */}
      <span
        className="relative rounded-full"
        style={{
          width: size * 0.55,
          height: size * 0.55,
          backgroundColor: color,
          boxShadow: `0 0 ${size}px ${color}88`,
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * GeopoliticsMap renders a full-container MapLibre GL JS map with a dark
 * glassmorphism shell, wired to the Atlas event bus via useNexusState.
 *
 * Sacred Flow: Tribunal → Atlas (this component) → Index → News
 *
 * Data sources (Pilar 3 integration):
 *   - `verdicts`  — TribunalVerdict[] from the Nexus Nervous System
 *   - `atlasData` — RealtimeDataPoint[] (geopolitics source filtered)
 *
 * TODO (T-002 live subscription point):
 *   Once T-002 (Nervous System spine) is merged and exposes a dedicated
 *   `useTribunalLayer()` hook with WebSocket / SSE subscription, replace
 *   the `useNexusState()` call below with that hook. The marker rendering
 *   logic below is already structured to receive the same TribunalVerdict
 *   shape, so only the data-source line needs to change.
 *
 *   Example future wiring:
 *     const { verdicts, atlasData } = useTribunalLayer(); // T-002 hook
 */
export function GeopoliticsMap({ className = "", onFeatureClick }: GeopoliticsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Atlas bus subscription (via Nexus Nervous System) ─────────────────────
  // TODO (T-002 live subscription): replace with `useTribunalLayer()` once
  //   the Nervous System spine (T-002) lands. The shape is identical.
  const { verdicts, atlasData } = useNexusState();

  // Filter atlas data to geopolitics source for this layer
  const geoPoliticsDataPoints = useMemo(
    () => atlasData.filter((d) => d.source === "geopolitics"),
    [atlasData]
  );

  // Only show the 10 most recent verdicts targeting the Atlas layer
  const atlasBoundVerdicts = useMemo(
    () =>
      verdicts
        .filter((v) => v.flowTarget === "atlas")
        .slice(0, 10),
    [verdicts]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // ------------------------------------------------------------------
    // TODO: remove this guard and uncomment the MapLibre block below
    // once `maplibre-gl` (and optionally `pmtiles`) are installed.
    // ------------------------------------------------------------------
    console.info(
      "[GeopoliticsMap] maplibre-gl is not yet installed. " +
        "Run `npm install maplibre-gl` to activate the map engine."
    );

    // ------------------------------------------------------------------
    // MapLibre initialisation (uncomment after installing maplibre-gl)
    // ------------------------------------------------------------------
    // // 1. Register PMTiles protocol so tile URLs like "pmtiles://..." resolve
    // // TODO: uncomment once `pmtiles` is installed
    // const pmtilesProtocol = new Protocol();
    // maplibregl.addProtocol("pmtiles", pmtilesProtocol.tile);

    // // 2. Initialise the map
    // const map = new maplibregl.Map({
    //   container: containerRef.current,
    //   // Dark base style — swap for a PMTiles URL when available
    //   style: {
    //     version: 8,
    //     sources: {},
    //     layers: [
    //       {
    //         id: "background",
    //         type: "background",
    //         paint: { "background-color": "#0a0a0f" },
    //       },
    //     ],
    //   },
    //   center: [0, 20],
    //   zoom: 1.8,
    //   attributionControl: false,
    // });

    // // 3. Wire feature-click callback
    // const handleClick = (e: maplibregl.MapMouseEvent) => {
    //   if (!onFeatureClick) return;
    //   const features = map.queryRenderedFeatures(e.point);
    //   if (features.length > 0) {
    //     onFeatureClick(features[0] as unknown as GeoJSONFeature);
    //   }
    // };
    // map.on("click", handleClick);

    // // 4. Wire Atlas bus → MapLibre source (T-002 live subscription point)
    // // TODO (T-002): once `useTribunalLayer()` is available, call
    // //   map.getSource("tribunal-events")?.setData(buildGeoJSON(verdicts))
    // //   inside a useEffect that depends on `verdicts` — see the React layer
    // //   below for the overlay equivalent already implemented.

    // // Cleanup
    // return () => {
    //   map.off("click", handleClick);
    //   map.remove();
    //   // TODO: uncomment once `pmtiles` is installed
    //   // maplibregl.removeProtocol("pmtiles");
    // };

    // Placeholder cleanup (remove once MapLibre block above is uncommented)
    return undefined;
  }, [onFeatureClick]);

  // ── Simple lat/lng → CSS percentage projection ────────────────────────────
  // Used for React-layer overlays until MapLibre projects to screen coords.
  // lat: -90…+90  → top: 0%…100%  (north pole = 0%)
  // lng: -180…+180 → left: 0%…100%
  const latToTop  = (lat: number)  => `${((90 - lat)  / 180) * 100}%`;
  const lngToLeft = (lng: number)  => `${((lng + 180) / 360) * 100}%`;

  return (
    <div
      className={[
        // Dark glassmorphism container
        "relative overflow-hidden",
        "bg-black/80",
        "border border-white/10",
        "rounded-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Map canvas fills the container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Placeholder overlay — visible until maplibre-gl is installed */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none select-none"
        aria-hidden="true"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/20"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase">
          MapLibre — pending install
        </span>
      </div>

      {/* ── Atlas event overlays (Tribunal → Atlas layer) ─────────────────── */}
      {/* These React-layer markers pre-wire the Atlas bus integration.        */}
      {/* When maplibre-gl is installed, migrate to native MapLibre markers    */}
      {/* and use map.getSource("tribunal-events").setData(...) instead.       */}

      {/* Tribunal verdict markers */}
      <AnimatePresence>
        {atlasBoundVerdicts.map((verdict) => {
          const { lat, lng } = verdictToLatLng(verdict);
          return (
            <div
              key={verdict.id}
              className="absolute"
              style={{
                top: latToTop(lat),
                left: lngToLeft(lng),
                transform: "translate(-50%, -50%)",
              }}
            >
              <OverlayMarker
                eventId={verdict.id}
                label={`${verdict.topic} — ${verdict.verdict}`}
                color={verdictColor(verdict.verdict)}
                weight={verdict.confidence}
              />
            </div>
          );
        })}
      </AnimatePresence>

      {/* Geopolitics realtime data point markers */}
      <AnimatePresence>
        {geoPoliticsDataPoints.map((dp, idx) => {
          const key = `dp-${dp.source}-${dp.timestamp}-${idx}`;
          return (
            <div
              key={key}
              className="absolute"
              style={{
                top: latToTop(dp.lat),
                left: lngToLeft(dp.lng),
                transform: "translate(-50%, -50%)",
              }}
            >
              <OverlayMarker
                eventId={key}
                label={dp.label ?? `${dp.source} — ${dp.value.toFixed(1)}`}
                color={dataPointColor(dp.source)}
                weight={dp.severity}
              />
            </div>
          );
        })}
      </AnimatePresence>

      {/* Status badge — shows how many Atlas-bound events are active */}
      {(atlasBoundVerdicts.length > 0 || geoPoliticsDataPoints.length > 0) && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 border border-white/10 rounded px-2 py-1 pointer-events-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[9px] tracking-widest text-white/50 uppercase">
            {atlasBoundVerdicts.length + geoPoliticsDataPoints.length} events
          </span>
        </div>
      )}
    </div>
  );
}

export default GeopoliticsMap;
