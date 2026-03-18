// sacred-flow: @copilot — GeopoliticsMap.tsx
// Task C2 + U1: MapLibre GL shell with PMTiles + Dark Glassmorphism visual DNA
// Tied to Tribunal data layer: verdict → neon border pulse
// Immutable: Tribunal → Atlas → Index → News

import { useEffect, useRef, useCallback } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import type { TribunalVerdict, RealtimeDataPoint } from '../../types';
import { nexusMapStyle } from '../../lib/geo/nexus-style';
import 'maplibre-gl/dist/maplibre-gl.css';

// ── PMTiles protocol — register once per module load ─────────────────────────
let _protocolRegistered = false;
function ensurePMTilesProtocol(): void {
  if (_protocolRegistered) return;
  const protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile.bind(protocol));
  _protocolRegistered = true;
}

// ── Types ────────────────────────────────────────────────────────────────────
export interface GeopoliticsMapProps {
  /** Tribunal verdicts — drives neon border intensity */
  verdicts?: TribunalVerdict[];
  /** Atlas realtime data (geopolitics source points) */
  atlasData?: RealtimeDataPoint[];
  /** Called when user clicks a country boundary */
  onCountryClick?: (countryCode: string, name: string) => void;
  /** CSS class override */
  className?: string;
  /** Initial centre (defaults to world view) */
  center?: [number, number];
  /** Initial zoom (defaults to 2) */
  zoom?: number;
}

// ── Glow opacity constants for verdict paint updates ─────────────────────────
const GLOW_BASE_OPACITY = 0.12;
const GLOW_CONFIDENCE_MULTIPLIER = 0.15;
const GLOW_CONFIDENCE_MAX_BOOST = 0.20;
const VERDICT_GLOW: Record<TribunalVerdict['verdict'], string> = {
  approved: '#FFB347',    // morabeza gold
  rejected: '#ff1744',    // neon crimson
  'needs-review': '#00e5ff', // neon cyan
};

/**
 * GeopoliticsMap — MapLibre GL React shell.
 *
 * Mounts a full-bleed dark glassmorphism map using the nexusMapStyle.
 * PMTiles protocol is registered on first render (idempotent).
 * Tribunal verdicts are translated to feature-state paint updates on country layers.
 */
export default function GeopoliticsMap({
  verdicts = [],
  atlasData = [],
  onCountryClick,
  className = '',
  center = [0, 20],
  zoom = 2,
}: GeopoliticsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  // ── Mount map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    ensurePMTilesProtocol();

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: nexusMapStyle,
      center,
      zoom,
      attributionControl: false,
      // Performance — disable unnecessary features
      fadeDuration: 200,
      pitchWithRotate: false,
      dragRotate: false,
      // Dark canvas matching void background
      canvasContextAttributes: { antialias: true },
    });

    // Minimal attribution — bottom-right, glass style
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    // Navigation controls (zoom +/-)
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    // ── Country click ──────────────────────────────────────────────────────
    if (onCountryClick) {
      map.on('click', 'boundaries-country', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const code = (feature.properties?.['iso_a2'] as string) ?? '';
        const name = (feature.properties?.['name'] as string) ?? '';
        onCountryClick(code, name);
      });

      map.on('mouseenter', 'boundaries-country', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'boundaries-country', () => {
        map.getCanvas().style.cursor = '';
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync verdicts → feature-state paint ──────────────────────────────────
  const applyVerdicts = useCallback(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || verdicts.length === 0) return;

    // Use only the most recent verdict (verdicts[0]) to drive the global glow style.
    // Multiple per-country verdicts would require feature-state keyed by country ID;
    // that upgrade can be done once Atlas country feature IDs are standardised.
    const dominant = verdicts[0];
    const color = VERDICT_GLOW[dominant.verdict];
    const opacity =
      GLOW_BASE_OPACITY +
      Math.min(dominant.confidence * GLOW_CONFIDENCE_MULTIPLIER, GLOW_CONFIDENCE_MAX_BOOST);

    try {
      map.setPaintProperty('boundaries-country-glow', 'line-color', color);
      map.setPaintProperty('boundaries-country-glow', 'line-opacity', opacity);
    } catch {
      // Layer may not be loaded yet — silently ignore
    }
  }, [verdicts]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.isStyleLoaded()) {
      applyVerdicts();
    } else {
      map.once('style.load', applyVerdicts);
    }
  }, [verdicts, applyVerdicts]);

  // ── Sync atlasData → geopolitics tension dots ─────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const geoPoliticsPoints = atlasData.filter((d) => d.source === 'geopolitics');
    if (geoPoliticsPoints.length === 0) return;

    const updateDots = () => {
      // Add/update a GeoJSON source for realtime tension points
      const sourceId = 'tribunal-realtime';
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: geoPoliticsPoints.map((d) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [d.lng, d.lat] },
          properties: {
            severity: d.severity,
            conflictLevel: d.conflictLevel ?? 0,
            value: d.value,
            label: d.label ?? '',
          },
        })),
      };

      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(sourceId, { type: 'geojson', data: geojson });

        // Outer glow halo
        map.addLayer({
          id: 'tribunal-tension-halo',
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['get', 'severity'], 0, 8, 1, 28],
            'circle-color': '#ff1744',
            'circle-opacity': ['interpolate', ['linear'], ['get', 'severity'], 0, 0.05, 1, 0.18],
            'circle-blur': 1.4,
          },
        });

        // Inner dot
        map.addLayer({
          id: 'tribunal-tension-dot',
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['get', 'severity'], 0, 3, 1, 8],
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'conflictLevel'],
              0, '#00e5ff',
              0.5, '#FFB347',
              1, '#ff1744',
            ],
            'circle-opacity': 0.85,
            'circle-stroke-color': 'rgba(255,255,255,0.15)',
            'circle-stroke-width': 0.5,
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateDots();
    } else {
      map.once('load', updateDots);
    }
  }, [atlasData]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative ${className}`}
      style={{
        // Glass panel outer frame — morabeza border
        outline: '1px solid rgba(255, 179, 71, 0.18)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#020408',
      }}
    >
      {/* Glassmorphism corner badge */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '8px',
          padding: '6px 12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '2px',
          color: '#00e5ff',
          textTransform: 'uppercase' as const,
        }}
      >
        ● ATLAS — GEOPOLITICS
      </div>

      {/* Sacred flow breadcrumb */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 12,
          zIndex: 10,
          pointerEvents: 'none',
          fontSize: '9px',
          color: 'rgba(255, 179, 71, 0.5)',
          fontFamily: 'Inter, system-ui, sans-serif',
          letterSpacing: '1px',
          textTransform: 'uppercase' as const,
        }}
      >
        NEXUS / ATLAS / GEOPOLITICS
      </div>

      {/* Live verdict indicator */}
      {verdicts.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 48,
            zIndex: 10,
            pointerEvents: 'none',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${VERDICT_GLOW[verdicts[0].verdict]}44`,
            borderRadius: '8px',
            padding: '6px 12px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '10px',
            color: VERDICT_GLOW[verdicts[0].verdict],
            letterSpacing: '1px',
            textTransform: 'uppercase' as const,
          }}
        >
          ⚡ TRIBUNAL — {verdicts[0].verdict.toUpperCase()}
        </div>
      )}
    </div>
  );
}
