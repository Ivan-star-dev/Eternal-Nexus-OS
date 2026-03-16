// ═══════════════════════════════════════════════════════════════
// WorkerBridge: abstrai comunicação com LTTB Worker
//
// Responsabilidades:
//   1. Lifecycle do worker (init, terminate, restart)
//   2. Request/response com timeout
//   3. Frame budget monitoring no main thread
//   4. Fallback síncrono se worker indisponível
//   5. Métricas de round-trip (post → result → state update)
// ═══════════════════════════════════════════════════════════════

import type { StreamingPoint } from "../streaming/realtime-pipeline";

export interface WorkerBridgeConfig {
  /** Budget total: worker + serialização + setState. Default: 16 */
  totalFrameBudgetMs: number;
  /** Budget alocado ao worker. Default: 12 */
  workerBudgetMs: number;
  /** Timeout para resposta do worker. Default: 5000ms */
  workerTimeoutMs: number;
  /** Tentar reiniciar worker após crash? Default: true */
  autoRestart: boolean;
}

export interface ProcessRequest {
  data: StreamingPoint[];
  targetSize: number;
  yKeys: string[];
  multiSeries: boolean;
}

export interface ProcessResult {
  data: StreamingPoint[];
  stats: {
    inputSize: number;
    outputSize: number;
    durationMs: number;
    breakdown?: {
      conversionMs: number;
      lttbMs: number;
      resultBuildMs: number;
    };
    adaptive: boolean;
    effectiveTarget: number;
    requestedTarget?: number;
    p90Ms?: number;
    roundTripMs?: number;
    serializationMs?: number;
    fallback?: boolean;
  };
}

interface PendingRequest {
  resolve: (result: ProcessResult) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
  sentAt: number;
}

export type FrameBudgetWarning = {
  phase: "worker" | "serialization" | "total";
  budgetMs: number;
  actualMs: number;
  recommendation: string;
};

export class WorkerBridge {
  private worker: Worker | null = null;
  private config: WorkerBridgeConfig;
  private pending = new Map<string, PendingRequest>();
  private requestCounter = 0;
  private ready = false;
  private crashed = false;

  // Métricas de round-trip
  private roundTripHistory: number[] = [];
  private serializationHistory: number[] = [];
  private readonly HISTORY_SIZE = 20;

  private onWarning: ((w: FrameBudgetWarning) => void) | null = null;

  constructor(config?: Partial<WorkerBridgeConfig>) {
    this.config = {
      totalFrameBudgetMs: config?.totalFrameBudgetMs ?? 16,
      workerBudgetMs: config?.workerBudgetMs ?? 12,
      workerTimeoutMs: config?.workerTimeoutMs ?? 5000,
      autoRestart: config?.autoRestart ?? true,
    };
  }

  // ═══════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(
          new URL("./lttb.worker.ts", import.meta.url),
          { type: "module" }
        );

        const initTimeout = setTimeout(() => {
          reject(new Error("Worker init timeout"));
        }, 5000);

        this.worker.onmessage = (event) => {
          const msg = event.data;
          // Worker sends { type: "ready" } on load
          if (msg.type === "ready" || (msg.type === "status" && msg.payload?.ready)) {
            clearTimeout(initTimeout);
            this.ready = true;
            this.crashed = false;

            // Switch to production handler
            this.worker!.onmessage = (e) => this.handleMessage(e);
            resolve();
            return;
          }
          this.handleMessage(event);
        };

        this.worker.onerror = (err) => {
          console.error("[WorkerBridge] Worker error:", err);
          this.crashed = true;
          this.ready = false;

          for (const [, pending] of this.pending) {
            clearTimeout(pending.timer);
            pending.reject(new Error("Worker crashed"));
          }
          this.pending.clear();

          if (this.config.autoRestart) {
            setTimeout(() => this.init().catch(() => {}), 1000);
          }
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.ready = false;
    }
    for (const [, pending] of this.pending) {
      clearTimeout(pending.timer);
      pending.reject(new Error("Worker terminated"));
    }
    this.pending.clear();
  }

  setWarningHandler(handler: (w: FrameBudgetWarning) => void): void {
    this.onWarning = handler;
  }

  // ═══════════════════════════════════════
  // Request / Response
  // ═══════════════════════════════════════

  async process(request: ProcessRequest): Promise<ProcessResult> {
    // No downsampling needed
    if (request.data.length <= request.targetSize) {
      return {
        data: request.data,
        stats: {
          inputSize: request.data.length,
          outputSize: request.data.length,
          durationMs: 0,
          adaptive: false,
          effectiveTarget: request.targetSize,
        },
      };
    }

    // Worker available
    if (this.ready && this.worker && !this.crashed) {
      return this.processViaWorker(request);
    }

    // Fallback: uniform sampling
    return this.processSync(request);
  }

  private processViaWorker(request: ProcessRequest): Promise<ProcessResult> {
    return new Promise((resolve, reject) => {
      const requestId = `req_${++this.requestCounter}`;
      const sentAt = performance.now();

      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        console.warn(`[WorkerBridge] Timeout ${requestId} (${this.config.workerTimeoutMs}ms)`);
        resolve(this.processSync(request));
      }, this.config.workerTimeoutMs);

      this.pending.set(requestId, { resolve, reject, timer, sentAt });

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

  private handleMessage(event: MessageEvent): void {
    const msg = event.data;
    if (msg.type !== "result") return;

    const pending = this.pending.get(msg.requestId);
    if (!pending) return;

    clearTimeout(pending.timer);
    this.pending.delete(msg.requestId);

    const roundTripMs = performance.now() - pending.sentAt;
    const workerMs = msg.stats?.durationMs ?? msg.stats?.processingTimeMs ?? 0;
    const serializationMs = roundTripMs - workerMs;

    this.recordMetric(this.roundTripHistory, roundTripMs);
    this.recordMetric(this.serializationHistory, serializationMs);

    this.checkBudget(workerMs, serializationMs, roundTripMs);

    pending.resolve({
      data: msg.data,
      stats: {
        inputSize: msg.stats?.originalSize ?? 0,
        outputSize: msg.stats?.resultSize ?? 0,
        durationMs: workerMs,
        adaptive: false,
        effectiveTarget: msg.stats?.resultSize ?? 0,
        roundTripMs: Math.round(roundTripMs * 100) / 100,
        serializationMs: Math.round(serializationMs * 100) / 100,
      },
    });
  }

  // ═══════════════════════════════════════
  // Frame Budget Monitoring
  // ═══════════════════════════════════════

  private checkBudget(workerMs: number, serializationMs: number, totalMs: number): void {
    if (!this.onWarning) return;

    if (workerMs > this.config.workerBudgetMs) {
      this.onWarning({
        phase: "worker",
        budgetMs: this.config.workerBudgetMs,
        actualMs: workerMs,
        recommendation: `Worker LTTB: ${workerMs.toFixed(1)}ms (budget: ${this.config.workerBudgetMs}ms). Reduza viewportSize.`,
      });
    }

    if (serializationMs > 4) {
      this.onWarning({
        phase: "serialization",
        budgetMs: 4,
        actualMs: serializationMs,
        recommendation: `Serialização postMessage: ${serializationMs.toFixed(1)}ms. Considere Transferable ArrayBuffers.`,
      });
    }

    if (totalMs > this.config.totalFrameBudgetMs) {
      this.onWarning({
        phase: "total",
        budgetMs: this.config.totalFrameBudgetMs,
        actualMs: totalMs,
        recommendation: `Round-trip: ${totalMs.toFixed(1)}ms. Frame drop provável.`,
      });
    }
  }

  // ═══════════════════════════════════════
  // Fallback síncrono
  // ═══════════════════════════════════════

  private processSync(request: ProcessRequest): ProcessResult {
    const { data, targetSize } = request;
    const step = Math.ceil(data.length / targetSize);
    const result: StreamingPoint[] = [];

    for (let i = 0; i < data.length; i += step) {
      result.push(data[i]);
    }

    if (result.length > 0 && result[result.length - 1] !== data[data.length - 1]) {
      result.push(data[data.length - 1]);
    }

    return {
      data: result,
      stats: {
        inputSize: data.length,
        outputSize: result.length,
        durationMs: 0,
        adaptive: false,
        effectiveTarget: targetSize,
        fallback: true,
      },
    };
  }

  // ═══════════════════════════════════════
  // Métricas
  // ═══════════════════════════════════════

  private recordMetric(history: number[], value: number): void {
    history.push(value);
    if (history.length > this.HISTORY_SIZE) history.shift();
  }

  getPerformanceStats() {
    return {
      roundTrip: this.percentiles(this.roundTripHistory),
      serialization: this.percentiles(this.serializationHistory),
      workerReady: this.ready,
      workerCrashed: this.crashed,
      pendingRequests: this.pending.size,
    };
  }

  private percentiles(arr: number[]) {
    if (arr.length === 0) return { p50: 0, p90: 0, p99: 0, avg: 0 };
    const sorted = [...arr].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    return {
      p50: Math.round(sorted[Math.floor(sorted.length * 0.5)] * 100) / 100,
      p90: Math.round(sorted[Math.floor(sorted.length * 0.9)] * 100) / 100,
      p99: Math.round(sorted[Math.floor(sorted.length * 0.99)] * 100) / 100,
      avg: Math.round((sum / sorted.length) * 100) / 100,
    };
  }
}
