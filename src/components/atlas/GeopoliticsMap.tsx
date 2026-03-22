/**
 * GeopoliticsMap — MapLibre GL JS shell component (Pilar 2 · Structure)
 *
 * Map engine: MapLibre GL JS
 * NOTE: maplibre-gl is not yet installed. Install with:
 *   npm install maplibre-gl
 *   npm install --save-dev @types/maplibre-gl   (if types are not bundled)
 *
 * PMTiles: pmtiles is not yet installed. Install with:
 *   npm install pmtiles
 * Once installed, remove the TODO below and uncomment the protocol registration block.
 *
 * TODO: wire to Tribunal data layer when T-002 (Nervous System spine) lands
 */

// TODO: uncomment once `maplibre-gl` is installed
// import maplibregl from "maplibre-gl";
// import "maplibre-gl/dist/maplibre-gl.css";

// TODO: uncomment once `pmtiles` is installed
// import { Protocol } from "pmtiles";

import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GeopoliticsMapProps {
  /** Optional Tailwind / CSS class applied to the outer container. */
  className?: string;
  /**
   * Called when the user clicks a GeoJSON feature on the map.
   * Receives the raw GeoJSON Feature object from MapLibre.
   */
  onFeatureClick?: (feature: GeoJSON.Feature) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * GeopoliticsMap renders a full-container MapLibre GL JS map with a dark
 * glassmorphism shell. It is intentionally a thin shell — data layers are
 * added by child systems once the Nervous System bus (T-002) is available.
 */
export function GeopoliticsMap({ className = "", onFeatureClick }: GeopoliticsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
    //     onFeatureClick(features[0] as unknown as GeoJSON.Feature);
    //   }
    // };
    // map.on("click", handleClick);

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

  // -------------------------------------------------------------------------
  // TODO: wire to Tribunal data layer when T-002 (Nervous System spine) lands
  //
  // Once T-002 is merged, subscribe to the bus here, e.g.:
  //   const tribunalData = useTribunalLayer(); // hook provided by T-002
  //   // then push features into the MapLibre source via map.getSource(...).setData(...)
  // -------------------------------------------------------------------------

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
    </div>
  );
}

export default GeopoliticsMap;
