// ═══════════════════════════════════════════════════════════════
// useRealtimeMetrics: Connects RealtimePipeline to React
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import {
  RealtimePipeline,
  type StreamingPoint,
  type PipelineState,
} from "@/lib/streaming/realtime-pipeline";

interface RealtimeStats {
  state: PipelineState;
  pointsReceived: number;
  pointsInViewport: number;
  wsLatencyMs: number | null;
  avgFlushMs: number;
  workerBusy: boolean;
  droppedPoints: number;
}

interface RealtimeMetricsOptions {
  wsUrl: string;
  yKeys?: string[];
  viewportSize?: number;
  windowMs?: number;
  autoStart?: boolean;
  parseMessage?: (raw: MessageEvent) => StreamingPoint | StreamingPoint[] | null;
}

export function useRealtimeMetrics(options: RealtimeMetricsOptions) {
  const {
    wsUrl,
    yKeys = ["value"],
    viewportSize = 500,
    windowMs = 30 * 60 * 1000,
    autoStart = true,
    parseMessage,
  } = options;

  const [data, setData] = useState<StreamingPoint[]>([]);
  const [stats, setStats] = useState<RealtimeStats>({
    state: "disconnected",
    pointsReceived: 0,
    pointsInViewport: 0,
    wsLatencyMs: null,
    avgFlushMs: 0,
    workerBusy: false,
    droppedPoints: 0,
  });

  const pipelineRef = useRef<RealtimePipeline | null>(null);

  useEffect(() => {
    const pipeline = new RealtimePipeline({
      wsUrl,
      yKeys,
      viewportSize,
      windowMs,
      parseMessage,
      flushIntervalMs: 500,
      flushThreshold: 500,
      bufferCapacity: 20_000,
      historyCapacity: 100_000,
    });

    pipelineRef.current = pipeline;

    const unsub = pipeline.subscribe((newData, pipelineStats) => {
      setData(newData);
      setStats({
        state: pipelineStats.state,
        pointsReceived: pipelineStats.pointsReceived,
        pointsInViewport: pipelineStats.pointsInViewport,
        wsLatencyMs: pipelineStats.wsLatencyMs,
        avgFlushMs: pipelineStats.avgFlushMs,
        workerBusy: pipelineStats.workerBusy,
        droppedPoints: pipelineStats.droppedPoints,
      });
    });

    if (autoStart) pipeline.start();

    return () => {
      unsub();
      pipeline.stop();
      pipelineRef.current = null;
    };
  }, [wsUrl]);

  const start = useCallback(() => pipelineRef.current?.start(), []);
  const stop = useCallback(() => pipelineRef.current?.stop(), []);
  const pause = useCallback(() => pipelineRef.current?.pause(), []);
  const resume = useCallback(() => pipelineRef.current?.resume(), []);

  return {
    data,
    stats,
    start,
    stop,
    pause,
    resume,
    isStreaming: stats.state === "streaming",
  };
}
