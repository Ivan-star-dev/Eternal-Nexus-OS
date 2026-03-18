// sacred-flow: Atlas — GeopoliticsMap (Task C2)
// MapLibre GL React shell with PMTiles serverless registrar and
// Dark Glassmorphism visual DNA (Task U1).
// Breadcrumb: NEXUS / ATLAS / GEOPOLITICS

import { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { registerPMTilesProtocol, WORLD_ADMIN_PMTILES_URL } from '@/lib/geo/pmtiles';
import { buildNexusMapStyle } from '@/lib/geo/nexus-map-style';
import { bus } from '@/lib/events/bus';
import { RealtimeDataPoint, TribunalVerdict } from '@/types';

// Register pmtiles:// once at module level (idempotent)
registerPMTilesProtocol();

interface GeopoliticsMapProps {
  /** Override the default world admin PMTiles source */
  pmtilesUrl?: string;
  /** Initial map center [lng, lat] */
  center?: [number, number];
  /** Initial zoom level */
  zoom?: number;
  className?: string;
}

/**
 * GeopoliticsMap — MapLibre GL shell wired into the Nexus event bus.
 *
 * • Emits `atlas:data` bus events when geopolitical features are clicked.
 * • Subscribes to `tribunal:verdict` to highlight affected regions.
 * • Dark Glassmorphism style — neon borders, no labels, near-black base.
 */
export function GeopoliticsMap({
  pmtilesUrl = WORLD_ADMIN_PMTILES_URL,
  center = [0, 20],
  zoom = 2,
  className,
}: GeopoliticsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const hoveredFeatureId = useRef<string | number | null>(null);

  const initMap = useCallback(() => {
    if (!containerRef.current) return;

    const style = buildNexusMapStyle(pmtilesUrl);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style,
      center,
      zoom,
      maxZoom: 12,
      minZoom: 1,
      canvasContextAttributes: { antialias: true },
      // Disable default controls — Atlas has its own toolbar
      attributionControl: false,
    });

    // Accessibility attribution (minimal)
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right',
    );

    map.on('load', () => {
      // ── Hover interaction for country fill ──
      map.on('mousemove', 'country-fill-hover', (e) => {
        if (!e.features?.length) return;
        const featureId = e.features[0].id;
        if (hoveredFeatureId.current !== null) {
          map.setFeatureState(
            { source: 'world', sourceLayer: 'ne_10m_admin_0_countries', id: hoveredFeatureId.current },
            { hover: false },
          );
        }
        hoveredFeatureId.current = featureId ?? null;
        if (featureId !== undefined) {
          map.setFeatureState(
            { source: 'world', sourceLayer: 'ne_10m_admin_0_countries', id: featureId },
            { hover: true },
          );
        }
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'country-fill-hover', () => {
        if (hoveredFeatureId.current !== null) {
          map.setFeatureState(
            { source: 'world', sourceLayer: 'ne_10m_admin_0_countries', id: hoveredFeatureId.current },
            { hover: false },
          );
        }
        hoveredFeatureId.current = null;
        map.getCanvas().style.cursor = '';
      });

      // ── Click → emit atlas:data event into Nexus bus ──
      map.on('click', 'country-fill-hover', (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0];
        const props = feature.properties as Record<string, unknown>;

        const dataPoint: RealtimeDataPoint = {
          source: 'geopolitics',
          value: Number(props['conflictLevel'] ?? 0),
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
          timestamp: Date.now(),
          severity: Number(props['conflictLevel'] ?? 0),
          label: String(props['NAME'] ?? props['name'] ?? 'Unknown'),
          category: 'country-click',
        };

        bus.emit('atlas:data', dataPoint, `geo:click:${props['ISO_A3'] ?? e.lngLat}`);
      });
    });

    mapRef.current = map;
  }, [pmtilesUrl, center, zoom]);

  useEffect(() => {
    initMap();

    // Subscribe to tribunal:verdict events — fly-to affected region if verdict carries geo coordinates.
    // TribunalVerdict may be extended with optional lat/lng in the future; guard defensively.
    const unsub = bus.on<TribunalVerdict>('tribunal:verdict', (event) => {
      const map = mapRef.current;
      if (!map) return;
      const payload = event.payload as TribunalVerdict & { lat?: number; lng?: number };
      if (typeof payload.lat === 'number' && typeof payload.lng === 'number') {
        map.flyTo({ center: [payload.lng, payload.lat], zoom: 4, speed: 1.2, curve: 1.4 });
      }
    });

    return () => {
      unsub();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initMap]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', background: '#020409' }}
      aria-label="Eternal Nexus Geopolitics Map"
      role="img"
    />
  );
}
