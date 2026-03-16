import { useState, useEffect, useCallback, useRef } from "react";
import { getWorkerManager } from "@/lib/downsampling/workerManager";

interface WorkerStatus {
  phase: "idle" | "processing" | "merging" | "done" | "error";
  percent: number;
  usedFallback: boolean;
  error: string | null;
  stats: {
    originalSize: number;
    resultSize: number;
    reductionRatio: number;
    processingTimeMs: number;
    chunksProcessed: number;
    retriesUsed: number;
  } | null;
}

export function useWorkerDownsample<T = any>(
  rawData: T[],
  options: {
    targetSize?: number;
    yKeys?: string[];
    enabled?: boolean;
  } = {}
) {
  const {
    targetSize = 200,
    yKeys = ["drilling", "eiaProgress", "conductivity"],
    enabled = true,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [status, setStatus] = useState<WorkerStatus>({
    phase: "idle",
    percent: 0,
    usedFallback: false,
    error: null,
    stats: null,
  });

  const managerRef = useRef(getWorkerManager({
    requestTimeoutMs: 30_000,
    circuitBreakerThreshold: 3,
    onFallbackUsed: () => setStatus((s) => ({ ...s, usedFallback: true })),
  }));

  const process = useCallback(async () => {
    if (!enabled || !rawData || rawData.length === 0) {
      setData([]);
      return;
    }

    // Small datasets don't need worker
    if (rawData.length <= targetSize) {
      setData([...rawData]);
      setStatus({ phase: "done", percent: 100, usedFallback: false, error: null, stats: { originalSize: rawData.length, resultSize: rawData.length, reductionRatio: 0, processingTimeMs: 0, chunksProcessed: 0, retriesUsed: 0 } });
      return;
    }

    setStatus((s) => ({ ...s, phase: "processing", percent: 0, error: null }));

    try {
      const result = await managerRef.current.process(rawData as any[], {
        targetSize,
        yKeys,
        onProgress: (p: any) => setStatus((s) => ({ ...s, phase: p.phase, percent: p.percent })),
      });

      setData(result.data as T[]);
      setStatus({
        phase: "done",
        percent: 100,
        usedFallback: result.usedFallback,
        error: null,
        stats: result.stats,
      });
    } catch (err: any) {
      setStatus((s) => ({ ...s, phase: "error", error: err?.message || String(err) }));
    }
  }, [rawData, targetSize, yKeys, enabled]);

  useEffect(() => { process(); }, [process]);

  return { data, status, retry: process };
}
