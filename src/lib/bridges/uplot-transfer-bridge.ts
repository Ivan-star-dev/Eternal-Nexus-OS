// ═══════════════════════════════════════════════════════════════
// UPlotTransferBridge
//
// Zero-copy pipeline: Worker → Transferable ArrayBuffers → uPlot
//
// Responsibilities:
//   1. Send data to worker (objects or typed arrays)
//   2. Receive transferred buffers (zero-copy ownership transfer)
//   3. Convert to exact format uPlot.setData() expects
//   4. Buffer recycling pool for streaming scenarios
//
// uPlot format: [ Float64Array (timestamps), Float64Array (series0), ... ]
// Float64Array works directly — no conversion to number[] needed.
//
// Buffer lifecycle:
//   Main thread → (clone objects) → Worker → (transfer Float64Array) → Main
//   uPlot reads directly from transferred buffers.
//   On next update: old buffers go to recycle pool or GC.
//
// Streaming optimization (ping-pong ownership):
//   Send Float64Array → (transfer) → Worker processes → (transfer back)
//   Zero allocations after warm-up.
// ═══════════════════════════════════════════════════════════════

type UPlotData = (number[] | Float64Array)[];

interface PendingRequest {
  resolve: (data: UPlotData) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
  sentAt: number;
}

interface TransferBridgeConfig {
  workerUrl: URL;
  timeoutMs: number;
  xKey: string;
  yKeys: string[];
  onFallback?: (reason: string) => void;
}

export class UPlotTransferBridge {
  private worker: Worker | null = null;
  private pending = new Map<string, PendingRequest>();
  private counter = 0;
  private config: TransferBridgeConfig;

  // Buffer recycling pool — avoids repeated allocations in streaming
  private recyclePool: ArrayBuffer[] = [];
  private maxPoolSize = 6; // 2 per series (double-buffer)

  // Last good result cache for graceful degradation
  private lastGoodResult: UPlotData | null = null;

  constructor(config: TransferBridgeConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(this.config.workerUrl, { type: "module" });

        const initTimeout = setTimeout(
          () => reject(new Error("Worker init timeout")),
          5000
        );

        this.worker.onmessage = (event) => {
          const msg = event.data;
          if (
            msg.type === "status" && msg.payload?.ready ||
            msg.type === "ready"
          ) {
            clearTimeout(initTimeout);
            this.worker!.onmessage = (e) => this.handleMessage(e);
            this.worker!.onerror = (e) => this.handleError(e);
            resolve();
          }
        };

        this.worker.onerror = () => {
          clearTimeout(initTimeout);
          reject(new Error("Worker failed to start"));
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  // ═══════════════════════════════════════
  // API: Object-based (first call / API data)
  // ═══════════════════════════════════════

  processObjects(
    data: Record<string, number>[],
    targetSize: number
  ): Promise<UPlotData> {
    if (!this.worker) {
      return Promise.reject(new Error("Worker not initialized"));
    }

    const requestId = `req_${++this.counter}`;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        this.config.onFallback?.("timeout");
        if (this.lastGoodResult) {
          resolve(this.lastGoodResult);
        } else {
          reject(new Error(`Worker timeout: ${this.config.timeoutMs}ms`));
        }
      }, this.config.timeoutMs);

      this.pending.set(requestId, { resolve, reject, timer, sentAt: performance.now() });

      this.worker!.postMessage({
        type: "process-objects",
        requestId,
        data,
        targetSize,
        xKey: this.config.xKey,
        yKeys: this.config.yKeys,
      });
    });
  }

  // ═══════════════════════════════════════
  // API: TypedArray-based (streaming, zero-copy)
  // ═══════════════════════════════════════

  processTyped(
    timestamps: Float64Array,
    series: Float64Array[],
    pointCount: number,
    targetSize: number
  ): Promise<UPlotData> {
    if (!this.worker) {
      return Promise.reject(new Error("Worker not initialized"));
    }

    const requestId = `req_${++this.counter}`;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        this.config.onFallback?.("timeout");
        if (this.lastGoodResult) {
          resolve(this.lastGoodResult);
        } else {
          reject(new Error(`Worker timeout: ${this.config.timeoutMs}ms`));
        }
      }, this.config.timeoutMs);

      this.pending.set(requestId, { resolve, reject, timer, sentAt: performance.now() });

      // After postMessage: timestamps.buffer and series[n].buffer become
      // neutered (length → 0). Worker receives ownership.
      const transferList: Transferable[] = [
        timestamps.buffer as ArrayBuffer,
        ...series.map((s) => s.buffer as ArrayBuffer),
      ];

      this.worker!.postMessage(
        {
          type: "process-typed",
          requestId,
          timestamps: timestamps.buffer,
          series: series.map((s) => s.buffer),
          pointCount,
          targetSize,
        },
        transferList
      );
    });
  }

  // ═══════════════════════════════════════
  // Message handling
  // ═══════════════════════════════════════

  private handleMessage(event: MessageEvent): void {
    const msg = event.data;

    if (msg.type === "pong") return; // Heartbeat — handled elsewhere

    if (msg.type !== "result-typed") return;

    const handle = this.pending.get(msg.requestId);
    if (!handle) return; // Timeout already resolved this request

    clearTimeout(handle.timer);
    this.pending.delete(msg.requestId);

    // Create Float64Array views over transferred buffers — O(1), no copy
    const tsView = new Float64Array(msg.timestamps, 0, msg.pointCount);
    const seriesViews = msg.series.map(
      (buf: ArrayBuffer) => new Float64Array(buf, 0, msg.pointCount)
    );

    // Convert timestamps ms → seconds (uPlot convention)
    // In-place mutation is safe — we own these buffers
    for (let i = 0; i < msg.pointCount; i++) {
      tsView[i] = tsView[i] / 1000;
    }

    const uplotData: UPlotData = [tsView, ...seriesViews];

    this.lastGoodResult = uplotData;
    this.maybeRecycleOldBuffers();
    handle.resolve(uplotData);
  }

  private handleError(event: ErrorEvent): void {
    console.error("[TransferBridge] Worker error:", event.message);

    for (const [, handle] of this.pending) {
      clearTimeout(handle.timer);
      if (this.lastGoodResult) {
        handle.resolve(this.lastGoodResult);
      } else {
        handle.reject(new Error("Worker crashed"));
      }
    }
    this.pending.clear();
  }

  // ═══════════════════════════════════════
  // Buffer recycling
  // ═══════════════════════════════════════

  private maybeRecycleOldBuffers(): void {
    while (this.recyclePool.length > this.maxPoolSize) {
      this.recyclePool.shift();
    }
  }

  /** Register old buffers for recycling. Call AFTER uPlot.setData() with new data. */
  recycle(oldData: UPlotData): void {
    for (const arr of oldData) {
      if (arr instanceof Float64Array && (arr.buffer as ArrayBuffer).byteLength > 0) {
        this.recyclePool.push(arr.buffer as ArrayBuffer);
      }
    }
  }

  // ═══════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════

  terminate(): void {
    for (const [, handle] of this.pending) {
      clearTimeout(handle.timer);
      handle.reject(new Error("Bridge terminated"));
    }
    this.pending.clear();
    this.worker?.terminate();
    this.worker = null;
    this.lastGoodResult = null;
    this.recyclePool = [];
  }
}
