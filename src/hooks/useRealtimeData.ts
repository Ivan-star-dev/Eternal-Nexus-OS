// sacred-flow: Kronos — dados real-time clima/economia/geopolítica
// Feeds Atlas com data minuto a minuto — organismo VIVO não estático

import { useState, useEffect, useCallback, useRef } from 'react';
import type { RealtimeDataPoint } from '../types';

interface UseRealtimeDataOptions {
  sources?: RealtimeDataPoint['source'][];
  interval?: number;        // ms — default 60000 (1 min)
  enabled?: boolean;
}

interface RealtimeDataState {
  data: RealtimeDataPoint[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: number | null;
}

const DEFAULT_SOURCES: RealtimeDataPoint['source'][] = ['climate', 'economy', 'geopolitics', 'energy', 'migration'];

// sacred-flow: API endpoints — expandir com keys reais
const DATA_ENDPOINTS: Record<RealtimeDataPoint['source'], string> = {
  climate: '/api/data/climate',
  economy: '/api/data/economy',
  geopolitics: '/api/data/geopolitics',
  energy: '/api/data/energy',
  migration: '/api/data/migration',
};

export function useRealtimeData(options: UseRealtimeDataOptions = {}): RealtimeDataState & {
  refresh: () => void;
  addDataPoint: (point: RealtimeDataPoint) => void;
} {
  const {
    sources = DEFAULT_SOURCES,
    interval = 60000,
    enabled = true,
  } = options;

  const [state, setState] = useState<RealtimeDataState>({
    data: [],
    isLoading: false,
    error: null,
    lastUpdate: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const results = await Promise.allSettled(
        sources.map(async (source) => {
          const res = await fetch(DATA_ENDPOINTS[source]);
          if (!res.ok) throw new Error(`${source}: ${res.status}`);
          return res.json() as Promise<RealtimeDataPoint[]>;
        })
      );

      const allData: RealtimeDataPoint[] = [];
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          allData.push(...result.value);
        }
      });

      setState({
        data: allData,
        isLoading: false,
        error: null,
        lastUpdate: Date.now(),
      });
    } catch (err) {
      // sacred-flow: fallback — gera dados simulados para dev
      const simulated = generateSimulatedData(sources);
      setState({
        data: simulated,
        isLoading: false,
        error: 'Using simulated data — connect real APIs in production',
        lastUpdate: Date.now(),
      });
    }
  }, [sources, enabled]);

  const addDataPoint = useCallback((point: RealtimeDataPoint) => {
    setState(prev => ({
      ...prev,
      data: [...prev.data.slice(-999), point], // Keep last 1000
      lastUpdate: Date.now(),
    }));
  }, []);

  useEffect(() => {
    fetchData();
    if (enabled && interval > 0) {
      intervalRef.current = setInterval(fetchData, interval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, enabled, interval]);

  return { ...state, refresh: fetchData, addDataPoint };
}

// sacred-flow: simulated data para development — Atlas nunca fica vazio
function generateSimulatedData(sources: RealtimeDataPoint['source'][]): RealtimeDataPoint[] {
  const points: RealtimeDataPoint[] = [];
  const cities = [
    { lat: 14.93, lng: -23.51, name: 'Mindelo' },
    { lat: 52.37, lng: 4.89, name: 'Amsterdam' },
    { lat: 40.71, lng: -74.01, name: 'New York' },
    { lat: 35.68, lng: 139.69, name: 'Tokyo' },
    { lat: -33.87, lng: 151.21, name: 'Sydney' },
    { lat: 51.51, lng: -0.13, name: 'London' },
    { lat: 1.35, lng: 103.82, name: 'Singapore' },
    { lat: -22.91, lng: -43.17, name: 'Rio' },
  ];

  sources.forEach(source => {
    cities.forEach(city => {
      points.push({
        source,
        value: Math.random() * 100,
        lat: city.lat + (Math.random() - 0.5) * 2,
        lng: city.lng + (Math.random() - 0.5) * 2,
        timestamp: Date.now(),
        severity: Math.random(),
      });
    });
  });

  return points;
}

export default useRealtimeData;
