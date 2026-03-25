/**
 * GlobeEventBus — V5-EVENT-STREAM-001
 *
 * Singleton pub/sub for real-world events that trigger visual reactions
 * on the GoldenAtlasScene globe surface.
 *
 * Event types:
 *   SEISMIC      — Earthquake / tectonic activity → expanding ring pulse
 *   NEWS         — Breaking news at a location    → hotspot glow burst
 *   ALERT        — Critical system alert          → red pulse ring
 *   PROJECT_UPDATE — Project status change        → gold beacon flash
 *   CLIMATE      — Climate data spike             → cyan diffuse pulse
 *
 * Sources that can feed this bus:
 *   - USGS earthquake feed (via fetchRecentEarthquakes)
 *   - Manual injection (testing / demo)
 *   - Future: Supabase realtime project_updates channel (V5-INFRA-SUPABASE-001)
 *   - Future: News API via SSE (V5-LIVE-DATA-001)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type GlobeEventType =
  | 'SEISMIC'
  | 'NEWS'
  | 'ALERT'
  | 'PROJECT_UPDATE'
  | 'CLIMATE';

export interface GlobeEvent {
  /** Unique id for deduplication */
  id: string;
  type: GlobeEventType;
  /** Geographic origin */
  lat: number;
  lon: number;
  /** 0–1 normalised intensity (controls ring size and opacity) */
  intensity: number;
  /** Short human-readable label */
  label: string;
  /** CSS/hex colour for the pulse ring */
  color: string;
  /** Unix timestamp ms */
  timestamp: number;
  /** How long (ms) the visual pulse should last */
  ttl: number;
}

export type GlobeEventCallback = (event: GlobeEvent) => void;

// ─── Colour map per type ─────────────────────────────────────────────────────

export const EVENT_COLORS: Record<GlobeEventType, string> = {
  SEISMIC:        '#ff6b35',
  NEWS:           '#ffd700',
  ALERT:          '#ff2244',
  PROJECT_UPDATE: '#f5c24a',
  CLIMATE:        '#22d3ee',
};

export const EVENT_TTL: Record<GlobeEventType, number> = {
  SEISMIC:        4000,
  NEWS:           3500,
  ALERT:          5000,
  PROJECT_UPDATE: 3000,
  CLIMATE:        4500,
};

// ─── Bus ─────────────────────────────────────────────────────────────────────

class GlobeEventBus {
  private listeners = new Set<GlobeEventCallback>();
  /** Circular buffer — last 30 events for late-subscribers */
  private history: GlobeEvent[] = [];
  private simulationTimer: ReturnType<typeof setInterval> | null = null;

  // ── Pub ──────────────────────────────────────────────────────────────────

  emit(event: GlobeEvent): void {
    this.history = [...this.history.slice(-29), event];
    this.listeners.forEach((cb) => {
      try { cb(event); } catch { /* isolate handler errors */ }
    });
  }

  // ── Sub ──────────────────────────────────────────────────────────────────

  /** Returns unsubscribe function */
  subscribe(cb: GlobeEventCallback): () => void {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  getHistory(): GlobeEvent[] {
    return [...this.history];
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Build a GlobeEvent from an earthquake point */
  fromEarthquake(eq: {
    id: string;
    mag: number;
    place: string;
    lat: number;
    lon: number;
    tsunami: boolean;
  }): GlobeEvent {
    const intensity = Math.min(1, Math.max(0, (eq.mag - 4) / 5)); // 4.0→0  9.0→1
    return {
      id: `eq-${eq.id}`,
      type: eq.tsunami ? 'ALERT' : 'SEISMIC',
      lat: eq.lat,
      lon: eq.lon,
      intensity,
      label: `M${eq.mag.toFixed(1)} — ${eq.place}`,
      color: eq.tsunami ? EVENT_COLORS.ALERT : EVENT_COLORS.SEISMIC,
      timestamp: Date.now(),
      ttl: eq.tsunami ? 6000 : EVENT_TTL.SEISMIC,
    };
  }

  /** Build a PROJECT_UPDATE event */
  fromProjectUpdate(opts: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    intensity?: number;
  }): GlobeEvent {
    return {
      id: `proj-${opts.id}-${Date.now()}`,
      type: 'PROJECT_UPDATE',
      lat: opts.lat,
      lon: opts.lon,
      intensity: opts.intensity ?? 0.6,
      label: opts.name,
      color: EVENT_COLORS.PROJECT_UPDATE,
      timestamp: Date.now(),
      ttl: EVENT_TTL.PROJECT_UPDATE,
    };
  }

  // ── Demo simulation ───────────────────────────────────────────────────────

  /**
   * Start emitting synthetic events at a given interval.
   * Used for demo/development until real data sources are wired.
   * Fires events across the geoProjects lat/lon footprint.
   */
  startSimulation(intervalMs = 3200): () => void {
    if (this.simulationTimer) return () => this.stopSimulation();

    const DEMO_LOCATIONS = [
      { lat: 14.95, lon: -24.35, name: 'Pico do Fogo' },
      { lat: 52.37, lon:   4.89, name: 'Delta Spine NL' },
      { lat: 41.39, lon:   2.17, name: 'Geocore Power' },
      { lat: 38.72, lon:  -9.14, name: 'Terra Lenta' },
      { lat: 48.85, lon:   2.35, name: 'Fusion Core' },
      { lat: 35.68, lon: 139.77, name: 'Chip Fold' },
      { lat: -22.9, lon: -43.17, name: 'NPI BR' },
      { lat: 40.71, lon: -74.01, name: 'NPI US' },
      { lat: 25.20, lon:  55.27, name: 'Dubai Hub' },
    ];
    const TYPES: GlobeEventType[] = ['SEISMIC', 'NEWS', 'PROJECT_UPDATE', 'CLIMATE'];

    let i = 0;
    this.simulationTimer = setInterval(() => {
      const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
      const type = TYPES[Math.floor(Math.random() * TYPES.length)];
      this.emit({
        id: `sim-${Date.now()}-${i}`,
        type,
        lat: loc.lat + (Math.random() - 0.5) * 4,
        lon: loc.lon + (Math.random() - 0.5) * 4,
        intensity: 0.3 + Math.random() * 0.7,
        label: loc.name,
        color: EVENT_COLORS[type],
        timestamp: Date.now(),
        ttl: EVENT_TTL[type],
      });
      i++;
    }, intervalMs);

    return () => this.stopSimulation();
  }

  stopSimulation(): void {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
  }
}

/** Singleton — import this everywhere */
export const globeEventBus = new GlobeEventBus();
