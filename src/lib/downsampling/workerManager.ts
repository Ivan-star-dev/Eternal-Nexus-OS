// ═══════════════════════════════════════════════════════════════
// WorkerManager: Lifecycle + Circuit Breaker + Fallback
//
// - Timeout per request
// - Heartbeat to detect dead worker
// - Circuit breaker: disables worker after N consecutive failures
// - Auto-fallback to main thread LTTB
// - Auto-restart after crash
// ═══════════════════════════════════════════════════════════════

import { lttbMultiSeries } from "./lttb";

type WorkerState = "idle" | "busy" | "dead" | "circuit_open";

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
  onProgress?: (progress: any) => void;
}

interface WorkerManagerOptions {
  requestTimeoutMs?: number;
  heartbeatIntervalMs?: number;
  circuitBreakerThreshold?: number;
  circuitBreakerResetMs?: number;
  onFallbackUsed?: () => void;
}

export class LTTBWorkerManager {
  private worker: Worker | null = null;
  private state: WorkerState = "idle";
  private pending = new Map<string, PendingRequest>();
  private consecutiveFailures = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private lastPongAt = 0;
  private counter = 0;

  private readonly opts: Required<WorkerManagerOptions>;

  constructor(options: WorkerManagerOptions = {}) {
    this.opts = {
      requestTimeoutMs: options.requestTimeoutMs ?? 30_000,
      heartbeatIntervalMs: options.heartbeatIntervalMs ?? 5_000,
      circuitBreakerThreshold: options.circuitBreakerThreshold ?? 3,
      circuitBreakerResetMs: options.circuitBreakerResetMs ?? 60_000,
      onFallbackUsed: options.onFallbackUsed ?? (() => {}),
    };
    this.initWorker();
  }

  private initWorker(): void {
    try {
      this.worker = new Worker(
        new URL("./lttb.worker.ts", import.meta.url),
        { type: "module" }
      );
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = this.handleError.bind(this);
      this.state = "idle";
      this.consecutiveFailures = 0;
      this.startHeartbeat();
    } catch {
      this.state = "dead";
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.lastPongAt = Date.now();
    this.heartbeatTimer = setInterval(() => {
      if (!this.worker || this.state === "dead" || this.state === "circuit_open") return;
      if (Date.now() - this.lastPongAt > this.opts.heartbeatIntervalMs * 3) {
        this.handleDeath("No heartbeat response");
        return;
      }
      this.worker.postMessage({ type: "ping" });
    }, this.opts.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
  }

  private handleError(event: ErrorEvent): void {
    this.recordFailure();
    for (const [id, p] of this.pending) {
      clearTimeout(p.timeoutId);
      p.reject(new Error(`Worker error: ${event.message}`));
      this.pending.delete(id);
    }
    this.restart();
  }

  private handleDeath(reason: string): void {
    this.state = "dead";
    this.stopHeartbeat();
    for (const [id, p] of this.pending) {
      clearTimeout(p.timeoutId);
      p.reject(new Error(`Worker dead: ${reason}`));
      this.pending.delete(id);
    }
    this.recordFailure();
    this.restart();
  }

  private restart(): void {
    if (this.worker) { try { this.worker.terminate(); } catch {} this.worker = null; }
    if (this.state === "circuit_open") return;
    setTimeout(() => this.initWorker(), 1000);
  }

  private recordFailure(): void {
    this.consecutiveFailures++;
    if (this.consecutiveFailures >= this.opts.circuitBreakerThreshold) {
      this.state = "circuit_open";
      this.stopHeartbeat();
      setTimeout(() => {
        this.consecutiveFailures = 0;
        this.state = "dead";
        this.restart();
      }, this.opts.circuitBreakerResetMs);
    }
  }

  private handleMessage(event: MessageEvent): void {
    const msg = event.data;
    if (msg.type === "pong") { this.lastPongAt = msg.timestamp; return; }
    if (msg.type === "ready") { this.state = "idle"; return; }
    if (msg.type === "progress") {
      this.pending.get(msg.requestId)?.onProgress?.(msg.progress);
      return;
    }

    const p = this.pending.get(msg.requestId);
    if (!p) return;
    clearTimeout(p.timeoutId);
    this.pending.delete(msg.requestId);

    if (msg.type === "result") {
      this.consecutiveFailures = 0;
      this.state = "idle";
      p.resolve({ data: msg.data, stats: msg.stats, usedFallback: false });
    } else if (msg.type === "error") {
      this.recordFailure();
      this.state = "idle";
      p.reject(new Error(msg.error.message));
    }
  }

  private isAvailable(): boolean {
    return this.state !== "circuit_open" && this.state !== "dead" && !!this.worker;
  }

  async process(
    data: any[],
    options: { targetSize: number; yKeys: string[]; chunkSize?: number; onProgress?: (p: any) => void }
  ): Promise<{ data: any[]; stats: any; usedFallback: boolean }> {
    if (this.isAvailable()) {
      try {
        return await this.processViaWorker(data, options);
      } catch {
        // Fall through to main thread
      }
    }
    return this.fallback(data, options);
  }

  private processViaWorker(data: any[], options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = `req_${++this.counter}_${Date.now()}`;
      const timeoutId = setTimeout(() => {
        this.pending.delete(requestId);
        this.worker?.postMessage({ type: "abort", requestId });
        this.recordFailure();
        reject(new Error(`Worker timeout (${this.opts.requestTimeoutMs}ms)`));
      }, this.opts.requestTimeoutMs);

      this.pending.set(requestId, { resolve, reject, timeoutId, onProgress: options.onProgress });
      this.state = "busy";

      this.worker!.postMessage({
        type: "process",
        requestId,
        payload: { data, targetSize: options.targetSize, yKeys: options.yKeys, chunkSize: options.chunkSize },
      });
    });
  }

  private fallback(data: any[], options: any): Promise<any> {
    this.opts.onFallbackUsed();
    const result = lttbMultiSeries(
      data,
      options.targetSize,
      options.yKeys.map((key: string) => ({ key, accessor: (p: any) => Number(p[key]) || 0 }))
    );
    return Promise.resolve({
      data: result.data,
      stats: { ...result, chunksProcessed: 1, retriesUsed: 0 },
      usedFallback: true,
    });
  }

  getStatus() {
    return {
      state: this.state,
      pending: this.pending.size,
      failures: this.consecutiveFailures,
      circuitOpen: this.state === "circuit_open",
    };
  }

  destroy(): void {
    this.stopHeartbeat();
    for (const [, p] of this.pending) { clearTimeout(p.timeoutId); p.reject(new Error("Destroyed")); }
    this.pending.clear();
    if (this.worker) { this.worker.terminate(); this.worker = null; }
    this.state = "dead";
  }
}

// Singleton
let instance: LTTBWorkerManager | null = null;
export function getWorkerManager(opts?: WorkerManagerOptions): LTTBWorkerManager {
  if (!instance) instance = new LTTBWorkerManager(opts);
  return instance;
}
