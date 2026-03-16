import { useMemo, useRef, useState, useCallback } from "react";
import {
  lttbMultiSeries,
  lttbChunkedWithRetry,
  type LTTBResult,
} from "@/lib/downsampling/lttb";

// ── Types ────────────────────────────────────────────

export interface DownsampleStats {
  originalSize: number;
  resultSize: number;
  reductionRatio: number;
  processingTimeMs: number;
}

interface UseDownsampledOptions<T> {
  /** Max points for the chart. Default: 150 */
  targetSize?: number;
  /** Y accessors to preserve peaks across all series */
  yAccessors: { key: string; accessor: (p: T) => number }[];
  /** X accessor. Default: array index */
  x?: (p: T, i: number) => number;
  /** Use chunked processing for datasets > this threshold. Default: 50000 */
  chunkedThreshold?: number;
}

// ── Hook ─────────────────────────────────────────────

export function useDownsampledData<T>(
  rawData: T[],
  options: UseDownsampledOptions<T>
) {
  const {
    targetSize = 150,
    yAccessors,
    x,
    chunkedThreshold = 50_000,
  } = options;

  const [stats, setStats] = useState<DownsampleStats>({
    originalSize: 0,
    resultSize: 0,
    reductionRatio: 0,
    processingTimeMs: 0,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(100);
  const prevRef = useRef<{ data: T[]; result: T[] }>({ data: [], result: [] });

  // Synchronous path for normal datasets
  const syncResult = useMemo(() => {
    if (rawData === prevRef.current.data) return prevRef.current.result;
    if (rawData.length > chunkedThreshold) return null; // defer to async

    const r = lttbMultiSeries(rawData, targetSize, yAccessors, x);
    setStats({
      originalSize: r.originalSize,
      resultSize: r.resultSize,
      reductionRatio: r.reductionRatio,
      processingTimeMs: r.processingTimeMs,
    });
    prevRef.current = { data: rawData, result: r.data };
    return r.data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, targetSize]);

  // Async path for massive datasets
  const [asyncResult, setAsyncResult] = useState<T[]>([]);

  const processLargeDataset = useCallback(async () => {
    if (rawData.length <= chunkedThreshold) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const r = await lttbChunkedWithRetry(rawData, {
        targetSize,
        yAccessors,
        x,
        onProgress: setProgress,
      });

      setAsyncResult(r.data);
      setStats({
        originalSize: r.originalSize,
        resultSize: r.resultSize,
        reductionRatio: r.reductionRatio,
        processingTimeMs: r.processingTimeMs,
      });
    } catch (err) {
      console.error("[useDownsampledData] chunked processing failed:", err);
      // Fallback: naive slice
      setAsyncResult(rawData.slice(0, targetSize));
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, targetSize, chunkedThreshold]);

  // Auto-trigger async processing
  useMemo(() => {
    if (rawData.length > chunkedThreshold) {
      processLargeDataset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData]);

  return {
    data: syncResult ?? asyncResult,
    stats,
    isProcessing,
    progress,
  };
}
