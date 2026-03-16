// ═══════════════════════════════════════════════════════════════
// useUPlotWithWorker: React hook integrating uPlot with
// ResilientBridge for zero-copy canvas rendering.
//
// Pipeline: rawData → ResilientBridge (worker) → uPlot.setData()
//
// When uPlot is available, bypasses React reconciliation entirely.
// For Recharts fallback: returns converted data via onData callback.
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from "react";
import type { ResilientBridge, ProcessedResult } from "@/lib/downsampling/resilient-bridge";

interface UPlotInstance {
  setData: (data: (number | null)[][]) => void;
  destroy: () => void;
}

/**
 * Hook that processes data through the ResilientBridge and
 * updates a uPlot instance directly (no React state needed).
 *
 * For Recharts fallback: returns converted data via onData callback.
 */
export function useUPlotWithWorker(
  bridge: ResilientBridge | null,
  rawData: Record<string, number>[],
  yKeys: string[],
  options: {
    targetSize?: number;
    onData?: (data: (number | null)[][], result: ProcessedResult) => void;
  } = {}
) {
  const { targetSize = 1000, onData } = options;
  const chartRef = useRef<UPlotInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const latestDataRef = useRef(rawData);
  const processingRef = useRef(false);
  const prevDataRef = useRef<(number | null)[][] | null>(null);

  latestDataRef.current = rawData;

  const processAndUpdate = useCallback(async () => {
    if (!bridge || rawData.length === 0 || processingRef.current) return;

    processingRef.current = true;

    try {
      const result = await bridge.process({
        data: rawData,
        targetSize,
        yKeys,
        multiSeries: yKeys.length > 1,
      });

      // Stale check: data may have changed during async processing
      if (latestDataRef.current !== rawData) return;

      const uplotData = convertToUPlotFormat(result.data, yKeys);

      // Direct uPlot update (zero React overhead)
      if (chartRef.current) {
        chartRef.current.setData(uplotData);
      }

      // Track previous data for potential buffer recycling
      prevDataRef.current = uplotData;

      // Callback for external consumers (e.g. Recharts fallback)
      onData?.(uplotData, result);
    } catch (err) {
      console.error("[useUPlotWithWorker] Processing failed:", err);
    } finally {
      processingRef.current = false;
    }
  }, [bridge, rawData, targetSize, yKeys, onData]);

  useEffect(() => {
    processAndUpdate();
  }, [processAndUpdate]);

  return { containerRef, chartRef };
}

/**
 * Convert object-based data to uPlot format.
 * uPlot expects: [timestamps[], series1[], series2[], ...]
 * Timestamps must be in Unix seconds.
 */
export function convertToUPlotFormat(
  data: Record<string, number>[],
  yKeys: string[]
): (number | null)[][] {
  const n = data.length;
  const timestamps = new Array<number>(n);
  const series: (number | null)[][] = yKeys.map(() => new Array(n));

  for (let i = 0; i < n; i++) {
    timestamps[i] = (data[i].timestamp ?? 0) / 1000;
    for (let s = 0; s < yKeys.length; s++) {
      series[s][i] = data[i][yKeys[s]] ?? null;
    }
  }

  return [timestamps, ...series];
}
