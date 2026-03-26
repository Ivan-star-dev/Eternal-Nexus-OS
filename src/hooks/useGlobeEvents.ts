/**
 * useGlobeEvents — V5-EVENT-STREAM-001
 *
 * Subscribes to the GlobeEventBus and maintains a list of currently-active
 * events. Events are expired after their TTL elapses.
 *
 * Optionally seeds the bus with USGS earthquake data on mount.
 */

import { useState, useEffect, useRef } from 'react';
import { globeEventBus, type GlobeEvent } from '@/lib/eventBus';
import { fetchRecentEarthquakes } from '@/lib/earthquakeData';

interface UseGlobeEventsOptions {
  /** Seed bus with real USGS earthquake data on mount (default: true) */
  seedEarthquakes?: boolean;
  /** Run the demo simulation — fires synthetic events (default: false) */
  simulate?: boolean;
  /** Simulation interval in ms (default: 3200) */
  simulationInterval?: number;
  /** Max active pulses on screen simultaneously (default: 8) */
  maxActive?: number;
}

export function useGlobeEvents(opts: UseGlobeEventsOptions = {}) {
  const {
    seedEarthquakes = true,
    simulate = false,
    simulationInterval = 3200,
    maxActive = 8,
  } = opts;

  const [activeEvents, setActiveEvents] = useState<GlobeEvent[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ── Subscribe to bus ────────────────────────────────────────────────────

  useEffect(() => {
    const unsub = globeEventBus.subscribe((event) => {
      setActiveEvents((prev) => {
        // Deduplicate by id
        const next = prev.filter((e) => e.id !== event.id);
        // Cap at maxActive — drop oldest
        const capped = next.length >= maxActive ? next.slice(-(maxActive - 1)) : next;
        return [...capped, event];
      });

      // Schedule TTL expiry
      const timer = setTimeout(() => {
        setActiveEvents((prev) => prev.filter((e) => e.id !== event.id));
        timersRef.current.delete(event.id);
      }, event.ttl);

      // Cancel previous timer for same id (idempotent emit)
      const existing = timersRef.current.get(event.id);
      if (existing) clearTimeout(existing);
      timersRef.current.set(event.id, timer);
    });

    return () => {
      unsub();
      // Clean up all TTL timers
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, [maxActive]);

  // ── Seed with real earthquake data ──────────────────────────────────────

  useEffect(() => {
    if (!seedEarthquakes) return;
    let cancelled = false;

    fetchRecentEarthquakes().then((quakes) => {
      if (cancelled) return;
      // Stagger emissions so they don't all fire at once
      quakes.slice(0, 6).forEach((eq, i) => {
        setTimeout(() => {
          if (!cancelled) globeEventBus.emit(globeEventBus.fromEarthquake(eq));
        }, i * 600);
      });
    });

    return () => { cancelled = true; };
  }, [seedEarthquakes]);

  // ── Optional simulation ─────────────────────────────────────────────────

  useEffect(() => {
    if (!simulate) return;
    const stop = globeEventBus.startSimulation(simulationInterval);
    return stop;
  }, [simulate, simulationInterval]);

  return { activeEvents };
}
