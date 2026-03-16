// ═══════════════════════════════════════════════════════════════
// DownsamplingService: public façade composing ResilientBridge
// + WorkerHealthMonitor + RecoveryStateMachine.
//
// The RSM provides the intelligence for mode transitions:
//   - ResilientBridge handles worker comms + fallback
//   - WorkerHealthMonitor handles heartbeat detection
//   - RecoveryStateMachine decides WHEN to trust the worker again
// ═══════════════════════════════════════════════════════════════

import { ResilientBridge, type ResilientBridgeConfig, type ProcessedResult } from "./resilient-bridge";
import { WorkerHealthMonitor, type HealthConfig, type WorkerHealthState } from "./worker-health";
import { RecoveryStateMachine, type RecoveryConfig, type RecoveryState, type RecoveryEvent } from "../recovery/recovery-state-machine";
import type { OperationMode } from "./resilient-bridge";

export type { ProcessedResult, OperationMode, WorkerHealthState, RecoveryState };

export interface DownsamplingServiceConfig {
  yKeys: string[];
  bridge?: Partial<ResilientBridgeConfig>;
  health?: Partial<HealthConfig>;
  recovery?: Partial<RecoveryConfig>;
  onHealthChange?: (state: WorkerHealthState) => void;
  onModeChange?: (mode: OperationMode) => void;
  onRecoveryTransition?: (from: RecoveryState, to: RecoveryState, reason: string) => void;
}

export class DownsamplingService {
  private bridge: ResilientBridge;
  private health: WorkerHealthMonitor;
  private recovery: RecoveryStateMachine;
  private initialized = false;

  constructor(config: DownsamplingServiceConfig) {
    // ── Recovery FSM ──
    this.recovery = new RecoveryStateMachine({
      ...config.recovery,
      onTransition: (from, to, reason) => {
        console.info(`[DownsamplingService] Recovery: ${from} → ${to} (${reason})`);
        config.onRecoveryTransition?.(from, to, reason);
      },
    });

    // ── ResilientBridge ──
    this.bridge = new ResilientBridge({
      ...config.bridge,
      yKeys: config.yKeys,
    });

    if (config.onModeChange) {
      this.bridge.setModeChangeHandler(config.onModeChange);
    }

    // ── WorkerHealthMonitor ──
    this.health = new WorkerHealthMonitor({
      ...config.health,
      onStateChange: (state) => {
        config.onHealthChange?.(state);

        // Feed health events into the recovery FSM
        if (state === "unresponsive" || state === "dead") {
          this.recovery.feed({
            type: "worker_crash",
            timestamp: Date.now(),
          });
        }
      },
      onRestartNeeded: async () => {
        await this.bridge.init();

        // Notify RSM that restart succeeded
        this.recovery.feed({
          type: "restart_success",
          timestamp: Date.now(),
        });

        return (this.bridge as any).worker as Worker;
      },
    });
  }

  async start(): Promise<void> {
    if (this.initialized) return;
    await this.bridge.init();
    this.initialized = true;
  }

  async downsample(
    data: Record<string, number>[],
    targetSize: number,
    yKeys: string[],
    multiSeries = false
  ): Promise<ProcessedResult> {
    const start = performance.now();

    const result = await this.bridge.process({ data, targetSize, yKeys, multiSeries });

    const latencyMs = performance.now() - start;

    // Feed the result into the recovery FSM for confidence tracking
    const event: RecoveryEvent = {
      type: result.source === "worker" ? "request_success" : "request_timeout",
      latencyMs,
      timestamp: Date.now(),
    };
    this.recovery.feed(event);

    return result;
  }

  getStatus() {
    return {
      bridge: this.bridge.getHealthReport(),
      health: this.health.getReport(),
      recovery: this.recovery.getReport(),
      mode: this.bridge.getMode(),
    };
  }

  destroy(): void {
    this.health.detach();
    this.bridge.terminate();
    this.initialized = false;
  }
}
