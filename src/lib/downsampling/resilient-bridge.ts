// ═══════════════════════════════════════════════════════════════
// ResilientBridge: WorkerBridge + FallbackManager + Recovery
//
// Request lifecycle:
//   1. Send to worker
//   2. Response in time → use worker result
//   3. Timeout → cancel pending → FallbackManager on main thread
//   4. Too many timeouts → "degraded mode" → schedule restart
//   5. After restart → probe request → if OK, back to normal
// ═══════════════════════════════════════════════════════════════

import { FallbackManager } from "./fallback-strategies";

type StreamingPoint = Record<string, number>;

export type OperationMode = "normal" | "degraded" | "worker-dead";

export interface ResilientBridgeConfig {
  requestTimeoutMs: number;
  maxConsecutiveTimeouts: number;
  restartBaseDelayMs: number;
  maxRestartAttempts: number;
  fallbackBudgetMs: number;
  probeSize: number;
  yKeys: string[];
}

interface RequestHandle {
  resolve: (result: ProcessedResult) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
  sentAt: number;
  payload: ProcessRequest;
}

interface ProcessRequest {
  data: StreamingPoint[];
  targetSize: number;
  yKeys: string[];
  multiSeries: boolean;
}

export interface ProcessedResult {
  data: StreamingPoint[];
  source: "worker" | "fallback";
  strategy?: string;
  durationMs: number;
  quality: number;
}

export class ResilientBridge {
  private worker: Worker | null = null;
  private config: Required<ResilientBridgeConfig>;
  private fallback: FallbackManager<StreamingPoint>;
  private pending = new Map<string, RequestHandle>();
  private requestCounter = 0;

  // Health state
  private mode: OperationMode = "normal";
  private consecutiveTimeouts = 0;
  private restartAttempts = 0;
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  private workerReady = false;

  // Metrics
  private totalRequests = 0;
  private workerSuccesses = 0;
  private fallbackExecutions = 0;
  private workerTimeouts = 0;

  // Callbacks
  private onModeChange: ((mode: OperationMode) => void) | null = null;

  constructor(config?: Partial<ResilientBridgeConfig>) {
    this.config = {
      requestTimeoutMs: config?.requestTimeoutMs ?? 3000,
      maxConsecutiveTimeouts: config?.maxConsecutiveTimeouts ?? 3,
      restartBaseDelayMs: config?.restartBaseDelayMs ?? 1000,
      maxRestartAttempts: config?.maxRestartAttempts ?? 5,
      fallbackBudgetMs: config?.fallbackBudgetMs ?? 8,
      probeSize: config?.probeSize ?? 100,
      yKeys: config?.yKeys ?? ["value"],
    };

    this.fallback = new FallbackManager({
      fallbackBudgetMs: this.config.fallbackBudgetMs,
      yKeys: this.config.yKeys,
    });
  }

  setModeChangeHandler(handler: (mode: OperationMode) => void): void {
    this.onModeChange = handler;
  }

  // ═══════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════

  async init(): Promise<void> {
    try {
      await this.createWorker();
      this.setMode("normal");
    } catch {
      console.warn("[ResilientBridge] Worker init failed, operating in degraded mode");
      this.setMode("degraded");
    }
  }

  private createWorker(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(
          new URL("./lttb.worker.ts", import.meta.url),
          { type: "module" }
        );

        const initTimeout = setTimeout(() => {
          reject(new Error("Worker init timeout"));
        }, 5000);

        const onFirstMessage = (event: MessageEvent) => {
          const msg = event.data;
          if (msg.type === "ready" || (msg.type === "status" && msg.payload?.ready)) {
            clearTimeout(initTimeout);
            this.workerReady = true;
            this.worker!.onmessage = (e) => this.handleWorkerMessage(e);
            resolve();
          }
        };

        this.worker.onmessage = onFirstMessage;
        this.worker.onerror = (err) => {
          clearTimeout(initTimeout);
          console.error("[ResilientBridge] Worker error:", err);
          this.handleWorkerCrash();
          reject(err);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  terminate(): void {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }

    for (const [, handle] of this.pending) {
      clearTimeout(handle.timer);
      handle.reject(new Error("Bridge terminated"));
    }
    this.pending.clear();

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.workerReady = false;
    this.setMode("worker-dead");
  }

  // ═══════════════════════════════════════
  // Process
  // ═══════════════════════════════════════

  async process(request: ProcessRequest): Promise<ProcessedResult> {
    this.totalRequests++;

    if (request.data.length <= request.targetSize) {
      return { data: request.data, source: "worker", durationMs: 0, quality: 1.0 };
    }

    if (this.mode === "normal" && this.workerReady && this.worker) {
      try {
        return await this.processViaWorker(request);
      } catch {
        return this.processViaFallback(request);
      }
    }

    return this.processViaFallback(request);
  }

  private processViaWorker(request: ProcessRequest): Promise<ProcessedResult> {
    return new Promise((resolve, reject) => {
      const requestId = `req_${++this.requestCounter}`;
      const sentAt = performance.now();

      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        this.handleTimeout(request, resolve);
      }, this.config.requestTimeoutMs);

      this.pending.set(requestId, { resolve, reject, timer, sentAt, payload: request });

      this.worker!.postMessage({
        type: "process",
        requestId,
        payload: {
          data: request.data,
          targetSize: request.targetSize,
          yKeys: request.yKeys,
          multiSeries: request.multiSeries,
        },
      });
    });
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const msg = event.data;
    if (msg.type !== "result") return;

    const handle = this.pending.get(msg.requestId);
    if (!handle) return;

    clearTimeout(handle.timer);
    this.pending.delete(msg.requestId);

    this.consecutiveTimeouts = 0;
    this.workerSuccesses++;

    const roundTripMs = performance.now() - handle.sentAt;

    handle.resolve({
      data: msg.data,
      source: "worker",
      durationMs: Math.round(roundTripMs * 100) / 100,
      quality: 1.0,
    });

    if (this.mode === "degraded") {
      console.info("[ResilientBridge] Worker recovered, returning to normal mode");
      this.setMode("normal");
    }
  }

  // ─── Timeout ───

  private handleTimeout(
    originalRequest: ProcessRequest,
    resolve: (result: ProcessedResult) => void
  ): void {
    this.consecutiveTimeouts++;
    this.workerTimeouts++;

    console.warn(
      `[ResilientBridge] Worker timeout #${this.consecutiveTimeouts} (${this.config.requestTimeoutMs}ms)`
    );

    resolve(this.processViaFallback(originalRequest));

    if (this.consecutiveTimeouts >= this.config.maxConsecutiveTimeouts) {
      console.error(
        `[ResilientBridge] ${this.consecutiveTimeouts} consecutive timeouts — declaring worker stuck`
      );
      this.handleWorkerStuck();
    }
  }

  // ─── Fallback ───

  private processViaFallback(request: ProcessRequest): ProcessedResult {
    this.fallbackExecutions++;
    const result = this.fallback.execute(request.data, request.targetSize);
    return {
      data: result.data,
      source: "fallback",
      strategy: result.strategy,
      durationMs: result.durationMs,
      quality: result.quality,
    };
  }

  // ═══════════════════════════════════════
  // Crash & Recovery
  // ═══════════════════════════════════════

  private handleWorkerCrash(): void {
    this.workerReady = false;

    for (const [, handle] of this.pending) {
      clearTimeout(handle.timer);
      handle.resolve(this.processViaFallback(handle.payload));
    }
    this.pending.clear();

    this.setMode("degraded");
    this.scheduleRestart();
  }

  private handleWorkerStuck(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.workerReady = false;
    }

    for (const [, handle] of this.pending) {
      clearTimeout(handle.timer);
      handle.resolve(this.processViaFallback(handle.payload));
    }
    this.pending.clear();

    this.consecutiveTimeouts = 0;
    this.setMode("degraded");
    this.scheduleRestart();
  }

  private scheduleRestart(): void {
    if (this.restartAttempts >= this.config.maxRestartAttempts) {
      console.error(
        `[ResilientBridge] Max ${this.config.maxRestartAttempts} restarts reached. Worker permanently disabled.`
      );
      this.setMode("worker-dead");
      return;
    }

    const delay = this.config.restartBaseDelayMs * Math.pow(2, this.restartAttempts);
    this.restartAttempts++;

    console.info(`[ResilientBridge] Restart #${this.restartAttempts} scheduled in ${delay}ms`);

    this.restartTimer = setTimeout(async () => {
      this.restartTimer = null;
      await this.attemptRestart();
    }, delay);
  }

  private async attemptRestart(): Promise<void> {
    console.info(`[ResilientBridge] Attempting restart #${this.restartAttempts}...`);

    try {
      await this.createWorker();

      // Probe: small request to validate worker
      const probeOk = await this.sendProbe();
      if (probeOk) {
        console.info("[ResilientBridge] Probe OK, worker recovered");
        this.restartAttempts = 0;
        this.consecutiveTimeouts = 0;
        this.setMode("normal");
      } else {
        throw new Error("Probe failed");
      }
    } catch (err) {
      console.warn(`[ResilientBridge] Restart #${this.restartAttempts} failed:`, err);
      this.scheduleRestart();
    }
  }

  private sendProbe(): Promise<boolean> {
    return new Promise((resolve) => {
      const probeTimeout = setTimeout(() => resolve(false), 2000);

      const probeData: StreamingPoint[] = [];
      for (let i = 0; i < this.config.probeSize; i++) {
        const point: StreamingPoint = {
          timestamp: Date.now() - (this.config.probeSize - i) * 1000,
        };
        for (const key of this.config.yKeys) {
          point[key] = Math.random() * 100;
        }
        probeData.push(point);
      }

      const probeId = `probe_${Date.now()}`;
      const originalHandler = this.worker!.onmessage;

      this.worker!.onmessage = (event: MessageEvent) => {
        if (event.data.type === "result" && event.data.requestId === probeId) {
          clearTimeout(probeTimeout);
          this.worker!.onmessage = originalHandler;
          resolve(true);
          return;
        }
        originalHandler?.call(this.worker, event);
      };

      this.worker!.postMessage({
        type: "process",
        requestId: probeId,
        payload: {
          data: probeData,
          targetSize: 20,
          yKeys: this.config.yKeys,
          multiSeries: false,
        },
      });
    });
  }

  // ═══════════════════════════════════════
  // State & Metrics
  // ═══════════════════════════════════════

  private setMode(mode: OperationMode): void {
    if (this.mode !== mode) {
      const prev = this.mode;
      this.mode = mode;
      console.info(`[ResilientBridge] Mode: ${prev} → ${mode}`);
      this.onModeChange?.(mode);
    }
  }

  getMode(): OperationMode { return this.mode; }

  getHealthReport() {
    return {
      mode: this.mode,
      workerReady: this.workerReady,
      consecutiveTimeouts: this.consecutiveTimeouts,
      restartAttempts: this.restartAttempts,
      maxRestartAttempts: this.config.maxRestartAttempts,
      stats: {
        totalRequests: this.totalRequests,
        workerSuccesses: this.workerSuccesses,
        fallbackExecutions: this.fallbackExecutions,
        workerTimeouts: this.workerTimeouts,
        workerSuccessRate: this.totalRequests > 0
          ? Math.round((this.workerSuccesses / this.totalRequests) * 100)
          : 100,
      },
    };
  }
}
