// ═══════════════════════════════════════════════════════════════
// useDownsampling: React hook exposing DownsamplingService
// with reactive mode, health, and recovery state.
// ═══════════════════════════════════════════════════════════════

import { useRef, useEffect, useState, useCallback } from "react";
import {
  DownsamplingService,
  type DownsamplingServiceConfig,
  type OperationMode,
  type WorkerHealthState,
  type RecoveryState,
  type ProcessedResult,
} from "@/lib/downsampling/index";

export interface DownsamplingStatus {
  mode: OperationMode;
  health: WorkerHealthState;
  recovery: RecoveryState;
  ready: boolean;
}

export function useDownsampling(config: Omit<DownsamplingServiceConfig, "onModeChange" | "onHealthChange" | "onRecoveryTransition">) {
  const serviceRef = useRef<DownsamplingService | null>(null);
  const [mode, setMode] = useState<OperationMode>("normal");
  const [health, setHealth] = useState<WorkerHealthState>("healthy");
  const [recovery, setRecovery] = useState<RecoveryState>("normal");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const service = new DownsamplingService({
      ...config,
      onModeChange: setMode,
      onHealthChange: setHealth,
      onRecoveryTransition: (_from, to) => setRecovery(to),
    });

    service.start().then(() => {
      serviceRef.current = service;
      setReady(true);
    });

    return () => {
      service.destroy();
      serviceRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downsample = useCallback(
    async (
      data: Record<string, number>[],
      targetSize: number
    ): Promise<ProcessedResult | null> => {
      if (!serviceRef.current) return null;
      return serviceRef.current.downsample(data, targetSize, config.yKeys, config.yKeys.length > 1);
    },
    [config.yKeys]
  );

  const getStatus = useCallback(() => {
    return serviceRef.current?.getStatus() ?? null;
  }, []);

  return {
    downsample,
    getStatus,
    status: { mode, health, recovery, ready } as DownsamplingStatus,
  };
}
