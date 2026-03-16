// ═══════════════════════════════════════════════════════════════
// PipelineOrchestrator: connects FSM + Bridge + Heartbeat
//
// The FSM decides WHAT to do (state transitions).
// The Orchestrator executes HOW to do it (create worker, probe, etc.).
//
// Responsibilities:
//   - Route requests to worker or fallback based on FSM state
//   - Create/restart workers via UPlotTransferBridge
//   - Send probes when FSM transitions to PROBING
//   - Connect heartbeat events to FSM
// ═══════════════════════════════════════════════════════════════

import { ReactiveWorkerFSM, type FSMEvent } from "@/lib/state/reactive-worker-fsm";
import { UPlotTransferBridge } from "@/lib/bridges/uplot-transfer-bridge";
import { createHeartbeat, type HeartbeatMonitor } from "@/lib/heartbeat/lightweight-heartbeat";

type UPlotData = (number[] | Float64Array)[];
type FallbackFn = (
  data: Record<string, number>[],
  targetSize: number
) => UPlotData;

interface OrchestratorConfig {
  workerUrl: URL;
  xKey: string;
  yKeys: string[];
  timeoutMs: number;
  heartbeatIntervalMs: number;
  heartbeatTimeoutMs: number;
  heartbeatMaxMissed: number;
  fallbackFn: FallbackFn;
}

const DEFAULT_ORCHESTRATOR_CONFIG: Partial<OrchestratorConfig> = {
  timeoutMs: 3000,
  heartbeatIntervalMs: 5000,
  heartbeatTimeoutMs: 2000,
  heartbeatMaxMissed: 3,
};

export class PipelineOrchestrator {
  private fsm: ReactiveWorkerFSM;
  private bridge: UPlotTransferBridge | null = null;
  private heartbeat: HeartbeatMonitor | null = null;
  private config: OrchestratorConfig;
  private cleanups: (() => void)[] = [];

  constructor(config: OrchestratorConfig) {
    this.config = { ...DEFAULT_ORCHESTRATOR_CONFIG, ...config } as OrchestratorConfig;
    this.fsm = new ReactiveWorkerFSM();
    this.registerSideEffects();
  }

  getFSM(): ReactiveWorkerFSM {
    return this.fsm;
  }

  async init(): Promise<void> {
    await this.createBridge();
  }

  // ═══════════════════════════════════════
  // Side Effects: react to FSM transitions
  // ═══════════════════════════════════════

  private registerSideEffects(): void {
    const unsub = this.fsm.registerEffect((_ctx, event) => {
      if (event.type === "RESTART_INITIATED") {
        this.handleRestart();
      }
      if (event.type === "PROBE_SENT") {
        this.handleProbe();
      }
    });
    this.cleanups.push(unsub);
  }

  // ═══════════════════════════════════════
  // Request Routing
  // ═══════════════════════════════════════

  async process(
    data: Record<string, number>[],
    targetSize: number
  ): Promise<UPlotData> {
    const ctx = this.fsm.getContext();

    this.fsm.send({ type: "REQUEST_SENT" });

    if (ctx.activeSource === "fallback" || !this.bridge) {
      try {
        const result = this.config.fallbackFn(data, targetSize);
        this.fsm.send({ type: "REQUEST_SUCCESS", latencyMs: 0 });
        return result;
      } catch (err) {
        this.fsm.send({ type: "REQUEST_TIMEOUT", afterMs: 0 });
        throw err;
      }
    }

    const start = performance.now();

    try {
      const result = await this.bridge.processObjects(data, targetSize);
      const latencyMs = performance.now() - start;

      this.fsm.send({ type: "REQUEST_SUCCESS", latencyMs });
      this.heartbeat?.notifyActivity();

      return result;
    } catch (err) {
      const elapsedMs = performance.now() - start;
      this.fsm.send({ type: "REQUEST_TIMEOUT", afterMs: elapsedMs });

      // Safety net: use fallback
      return this.config.fallbackFn(data, targetSize);
    }
  }

  // ═══════════════════════════════════════
  // Worker Lifecycle
  // ═══════════════════════════════════════

  private async createBridge(): Promise<void> {
    this.bridge?.terminate();
    this.heartbeat?.stop();

    const bridge = new UPlotTransferBridge({
      workerUrl: this.config.workerUrl,
      timeoutMs: this.config.timeoutMs,
      xKey: this.config.xKey,
      yKeys: this.config.yKeys,
      onFallback: (_reason) => {
        this.fsm.send({
          type: "REQUEST_TIMEOUT",
          afterMs: this.config.timeoutMs,
        });
      },
    });

    try {
      await bridge.init();
      this.bridge = bridge;

      // Note: heartbeat creation requires access to the underlying Worker.
      // UPlotTransferBridge currently encapsulates the worker.
      // To enable heartbeat, bridge would need a getWorker() accessor,
      // or heartbeat would be integrated inside the bridge itself.

    } catch (err) {
      this.fsm.send({ type: "WORKER_CRASH", error: String(err) });
    }
  }

  private async handleRestart(): Promise<void> {
    try {
      await this.createBridge();
      this.fsm.send({ type: "RESTART_SUCCESS" });
    } catch {
      this.fsm.send({
        type: "RESTART_FAILURE",
        error: "Bridge creation failed",
      });
    }
  }

  private async handleProbe(): Promise<void> {
    if (!this.bridge) {
      this.fsm.send({ type: "PROBE_FAILURE" });
      return;
    }

    const start = performance.now();
    try {
      // Probe with minimal dataset
      const probeData = [
        { timestamp: Date.now(), value: 1 },
        { timestamp: Date.now() + 100, value: 2 },
      ];
      await this.bridge.processObjects(probeData, 2);
      const latencyMs = performance.now() - start;
      this.fsm.send({ type: "PROBE_SUCCESS", latencyMs });
    } catch {
      this.fsm.send({ type: "PROBE_FAILURE" });
    }
  }

  // ═══════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════

  destroy(): void {
    this.heartbeat?.stop();
    this.bridge?.terminate();
    this.fsm.destroy();
    for (const fn of this.cleanups) fn();
    this.cleanups = [];
  }
}
