// sacred-flow: Atlas → Geopolitics — MapLibre React container
// Task C2 + U1 — Dark Glassmorphism "Eternal Nexus" map shell
// Tribunal data layer: verdicts flow into GeoJSON markers on the map

import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { registerPMTilesProtocol } from '@/lib/geo/pmtiles';
import { useNexusState } from '@/hooks/useNexusState';
import type { TribunalVerdict } from '@/types';

// ── Register pmtiles:// protocol once at module load ──
registerPMTilesProtocol();

// ── Eternal Nexus verdict colour palette ──
const VERDICT_COLORS: Record<TribunalVerdict['verdict'], string> = {
  approved:      '#22ffaa',  // neon teal — pass
  rejected:      '#ff4444',  // crimson  — fail
  'needs-review': '#ffaa22', // amber    — pending
};

// ── Eternal Nexus Dark Glassmorphism style (Task U1) ──
// Inline style JSON — dark navy background, neon-border outlines,
// superfluous labels suppressed, glowing political borders.
const NEXUS_DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: 'Eternal Nexus — Dark Glassmorphism',
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    'nexus-base': {
      type: 'vector',
      tiles: ['https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf'],
      maxzoom: 6,
      minzoom: 0,
      attribution: '© MapLibre | © OpenStreetMap contributors',
    },
  },
  layers: [
    // ── Canvas ──
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#02020a' },
    },
    // ── Ocean / water ──
    {
      id: 'water',
      type: 'fill',
      source: 'nexus-base',
      'source-layer': 'water',
      paint: { 'fill-color': '#050d1a', 'fill-opacity': 0.95 },
    },
    // ── Land mass ──
    {
      id: 'landcover',
      type: 'fill',
      source: 'nexus-base',
      'source-layer': 'land',
      paint: { 'fill-color': '#080e1c', 'fill-opacity': 1 },
    },
    // ── Country fills — very subtle so borders pop ──
    {
      id: 'countries-fill',
      type: 'fill',
      source: 'nexus-base',
      'source-layer': 'countries',
      paint: {
        'fill-color': '#090e20',
        'fill-opacity': 0.7,
        'fill-outline-color': 'transparent',
      },
    },
    // ── Country borders — neon glow (outer halo) ──
    {
      id: 'countries-border-halo',
      type: 'line',
      source: 'nexus-base',
      'source-layer': 'countries',
      paint: {
        'line-color': '#00ffcc',
        'line-width': 3,
        'line-blur': 6,
        'line-opacity': 0.25,
      },
    },
    // ── Country borders — neon glow (inner line) ──
    {
      id: 'countries-border',
      type: 'line',
      source: 'nexus-base',
      'source-layer': 'countries',
      paint: {
        'line-color': '#00ffcc',
        'line-width': 0.8,
        'line-opacity': 0.6,
      },
    },
    // ── Coastlines ──
    {
      id: 'coastline',
      type: 'line',
      source: 'nexus-base',
      'source-layer': 'coastline',
      paint: {
        'line-color': '#0ef',
        'line-width': 0.5,
        'line-opacity': 0.4,
      },
    },
    // Capital/city labels intentionally omitted (Task U1: hide noise labels)
  ],
};

// ── GeoJSON helpers ──
function verdictsToGeoJSON(
  verdicts: TribunalVerdict[],
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  // Assign approximate geo coordinates per verdict topic using a deterministic
  // seed so the same verdict always renders at the same position.
  return {
    type: 'FeatureCollection',
    features: verdicts.map((v) => {
      // Lightweight seeded position — keeps Atlas consequence deterministic
      const seed = hashCode(v.id);
      const lat = (seed % 161) - 80;   // -80..80 (avoids extreme poles)
      const lng = ((seed >> 7) % 361) - 180; // -180..180
      return {
        type: 'Feature',
        id: v.id,
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          id:         v.id,
          topic:      v.topic,
          verdict:    v.verdict,
          confidence: v.confidence,
          timestamp:  v.timestamp,
          color:      VERDICT_COLORS[v.verdict],
        },
      };
    }),
  };
}

/** Deterministic numeric hash of a string (djb2 variant). */
function hashCode(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0; // keep unsigned 32-bit
  }
  return h;
}

// ── Tribunal layer IDs ──
const VERDICT_SOURCE = 'tribunal-verdicts';
const VERDICT_HALO_LAYER = 'tribunal-halo';
const VERDICT_CIRCLE_LAYER = 'tribunal-circles';
const VERDICT_LABEL_LAYER = 'tribunal-labels';

// ── Props ──
export interface GeopoliticsMapProps {
  /** Optional CSS className for the outer wrapper. */
  className?: string;
  /** Initial centre [lng, lat]. Defaults to [0, 20]. */
  center?: [number, number];
  /** Initial zoom level. Defaults to 1.8. */
  zoom?: number;
  /** Callback fired when the user clicks a verdict marker. */
  onVerdictClick?: (verdict: TribunalVerdict) => void;
}

// ═══════════════════════════════════════════════════════════
// GeopoliticsMap — MapLibre GL React container
// ═══════════════════════════════════════════════════════════
export default function GeopoliticsMap({
  className = '',
  center = [0, 20],
  zoom = 1.8,
  onVerdictClick,
}: GeopoliticsMapProps) {
  const containerRef      = useRef<HTMLDivElement>(null);
  const mapRef            = useRef<maplibregl.Map | null>(null);
  const popupRef          = useRef<maplibregl.Popup | null>(null);
  // Stable refs so initial-mount effect never needs to re-run on prop changes
  const centerRef         = useRef(center);
  const zoomRef           = useRef(zoom);
  const onVerdictClickRef = useRef(onVerdictClick);

  // Keep callback ref up-to-date without triggering re-mount
  useEffect(() => { onVerdictClickRef.current = onVerdictClick; }, [onVerdictClick]);

  const { verdicts } = useNexusState();

  // ── Bootstrap map once ──
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container:          containerRef.current,
      style:              NEXUS_DARK_STYLE,
      center:             centerRef.current,
      zoom:               zoomRef.current,
      attributionControl: false,
      logoPosition:       'bottom-left',
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right',
    );
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right',
    );

    map.on('load', () => {
      // ── Add Tribunal verdict source (empty initially) ──
      map.addSource(VERDICT_SOURCE, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      // ── Verdict glow halo ──
      map.addLayer({
        id:     VERDICT_HALO_LAYER,
        type:   'circle',
        source: VERDICT_SOURCE,
        paint: {
          'circle-radius':  ['interpolate', ['linear'], ['zoom'], 1, 12, 6, 24],
          'circle-color':   ['get', 'color'],
          'circle-blur':    1.0,
          'circle-opacity': 0.25,
        },
      });

      // ── Verdict core circle ──
      map.addLayer({
        id:     VERDICT_CIRCLE_LAYER,
        type:   'circle',
        source: VERDICT_SOURCE,
        paint: {
          'circle-radius':       ['interpolate', ['linear'], ['zoom'], 1, 4, 6, 8],
          'circle-color':        ['get', 'color'],
          'circle-stroke-color': '#000',
          'circle-stroke-width': 1,
          'circle-opacity':      0.9,
        },
      });

      // ── Verdict confidence label ──
      map.addLayer({
        id:      VERDICT_LABEL_LAYER,
        type:    'symbol',
        source:  VERDICT_SOURCE,
        minzoom: 3,
        layout: {
          'text-field': ['concat', ['get', 'topic'], '\n',
            ['concat', ['to-string', ['round', ['*', ['get', 'confidence'], 100]]], '%']],
          'text-size':      9,
          'text-offset':    [0, 1.6],
          'text-anchor':    'top',
          'text-font':      ['Open Sans Regular'],
          'text-max-width': 10,
        },
        paint: {
          'text-color':      '#aaffee',
          'text-halo-color': '#000',
          'text-halo-width': 1,
          'text-opacity':    0.85,
        },
      });

      // ── Click handler on verdict circles ──
      map.on('click', VERDICT_CIRCLE_LAYER, (e) => {
        if (!e.features?.length) return;
        // MapLibre serialises GeoJSON properties — numbers stay numbers
        const raw = e.features[0].properties ?? {};
        const id         = typeof raw.id         === 'string' ? raw.id         : '';
        const topic      = typeof raw.topic      === 'string' ? raw.topic      : '';
        const verdict    = typeof raw.verdict    === 'string' ? raw.verdict    : '';
        const confidence = typeof raw.confidence === 'number' ? raw.confidence : 0;
        const timestamp  = typeof raw.timestamp  === 'number' ? raw.timestamp  : 0;
        const color      = typeof raw.color      === 'string' ? raw.color      : '#ffffff';

        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({
          closeButton:  true,
          closeOnClick: false,
          className:    'nexus-popup',
          maxWidth:     '240px',
        })
          .setLngLat(e.lngLat)
          .setHTML(
            `<div style="font-family:monospace;font-size:0.65rem;color:#aaffee">` +
            `<div style="color:${color};font-weight:700;margin-bottom:4px">${verdict.toUpperCase()}</div>` +
            `<div style="color:#fff;margin-bottom:2px">${topic}</div>` +
            `<div style="opacity:0.7">confidence: ${Math.round(confidence * 100)}%</div>` +
            `</div>`,
          )
          .addTo(map);

        onVerdictClickRef.current?.({
          id,
          topic,
          verdict: verdict as TribunalVerdict['verdict'],
          confidence,
          timestamp,
          judges:     [],
          reasoning:  '',
          flowTarget: 'atlas',
        });
      });

      map.on('mouseenter', VERDICT_CIRCLE_LAYER, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', VERDICT_CIRCLE_LAYER, () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []); // intentionally empty — map is bootstrapped once per mount

  // ── Sync Tribunal verdicts into the GeoJSON source ──
  const syncVerdicts = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource(VERDICT_SOURCE) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;
    source.setData(verdictsToGeoJSON(verdicts));
  }, [verdicts]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.isStyleLoaded()) {
      syncVerdicts();
    } else {
      map.once('load', syncVerdicts);
    }
  }, [syncVerdicts]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: '#02020a' }}
    >
      {/* MapLibre canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* HUD overlay — glassmorphism panel */}
      <div
        className="pointer-events-none absolute bottom-4 left-4 z-10 rounded border border-white/10 px-3 py-2 text-[0.5rem] font-mono tracking-widest"
        style={{
          background: 'rgba(2, 2, 10, 0.65)',
          backdropFilter: 'blur(8px)',
          color: '#00ffcc',
        }}
      >
        <div className="mb-1 opacity-60">TRIBUNAL LAYER · ATLAS</div>
        <div className="flex gap-3">
          <span style={{ color: VERDICT_COLORS.approved }}>■ APPROVED</span>
          <span style={{ color: VERDICT_COLORS.rejected }}>■ REJECTED</span>
          <span style={{ color: VERDICT_COLORS['needs-review'] }}>■ REVIEW</span>
        </div>
      </div>
    </div>
  );
}
