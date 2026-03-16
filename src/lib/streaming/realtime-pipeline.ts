// ═══════════════════════════════════════════════════════════════
// RealtimePipeline: WebSocket → RingBuffer → Worker (LTTB) → UI
//
// Architecture:
//   WebSocket ──→ RingBuffer ──→ Worker (LTTB) ──→ React State
//                    │
//                    ├─ flush by time (500ms)
//                    └─ flush by size (1000 points)
//
//   Backpressure: if Worker is busy, buffer accumulates
//   and flushes larger batch on next cycle.
// ═══════════════════════════════════════════════════════════════

export interface StreamingPoint {
  timestamp: number;
  [key: string]: number;
}

export interface PipelineConfig {
  wsUrl: string;
  bufferCapacity?: number;
  flushIntervalMs?: number;
  flushThreshold?: number;
  viewportSize?: number;
  windowMs?: number;
  yKeys?: string[];
  historyCapacity?: number;
  parseMessage?: (raw: MessageEvent) => StreamingPoint | StreamingPoint[] | null;
  wsProtocols?: string[];
}

export type PipelineState =
  | "disconnected"
  | "connecting"
  | "streaming"
  | "paused"
  | "error"
  | "backpressure";

export interface PipelineStats {
  state: PipelineState;
  pointsReceived: number;
  pointsInBuffer: number;
  pointsInHistory: number;
  pointsInViewport: number;
  flushCount: number;
  droppedPoints: number;
  workerBusy: boolean;
  lastFlushMs: number;
  avgFlushMs: number;
  wsLatencyMs: number | null;
}

type Listener = (data: StreamingPoint[], stats: PipelineStats) => void;

// ── Ring Buffer ──

class RingBuffer<T> {
  private buf: (T | undefined)[];
  private head = 0;
  private tail = 0;
  private count = 0;

  constructor(private cap: number) {
    this.buf = new Array(cap);
  }

  push(item: T): void {
    this.buf[this.head] = item;
    this.head = (this.head + 1) % this.cap;
    if (this.count < this.cap) {
      this.count++;
    } else {
      this.tail = (this.tail + 1) % this.cap;
    }
  }

  drain(): T[] {
    if (this.count === 0) return [];
    const items: T[] = [];
    let pos = this.tail;
    for (let i = 0; i < this.count; i++) {
      items.push(this.buf[pos] as T);
      pos = (pos + 1) % this.cap;
    }
    this.head = 0;
    this.tail = 0;
    this.count = 0;
    return items;
  }

  get size(): number { return this.count; }
}

// ── Pipeline ──

export class RealtimePipeline {
  private cfg: Required<PipelineConfig>;
  private ws: WebSocket | null = null;
  private incoming: RingBuffer<StreamingPoint>;
  private history: StreamingPoint[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;

  private worker: Worker | null = null;
  private workerBusy = false;
  private pendingFlush = false;

  private state: PipelineState = "disconnected";
  private listeners = new Set<Listener>();
  private lastViewport: StreamingPoint[] = [];

  // Stats
  private pointsReceived = 0;
  private droppedPoints = 0;
  private flushCount = 0;
  private flushDurations: number[] = [];
  private lastFlushMs = 0;
  private wsLatencyMs: number | null = null;
  private flushStartTime = 0;

  constructor(config: PipelineConfig) {
    this.cfg = {
      bufferCapacity: config.bufferCapacity ?? 50_000,
      flushIntervalMs: config.flushIntervalMs ?? 500,
      flushThreshold: config.flushThreshold ?? 1_000,
      viewportSize: config.viewportSize ?? 500,
      windowMs: config.windowMs ?? 30 * 60 * 1000,
      yKeys: config.yKeys ?? ["value"],
      historyCapacity: config.historyCapacity ?? 100_000,
      wsProtocols: config.wsProtocols ?? [],
      wsUrl: config.wsUrl,
      parseMessage: config.parseMessage ?? this.defaultParser.bind(this),
    };
    this.incoming = new RingBuffer(this.cfg.bufferCapacity);
  }

  // ── Public API ──

  start(): void {
    this.initWorker();
    this.connect();
    this.startFlushLoop();
  }

  pause(): void {
    this.state = "paused";
    this.stopFlushLoop();
  }

  resume(): void {
    this.state = "streaming";
    this.startFlushLoop();
    this.flush();
  }

  stop(): void {
    this.stopFlushLoop();
    this.disconnect();
    if (this.worker) { this.worker.terminate(); this.worker = null; }
    this.state = "disconnected";
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.lastViewport.length > 0) {
      listener(this.lastViewport, this.getStats());
    }
    return () => this.listeners.delete(listener);
  }

  getStats(): PipelineStats {
    return {
      state: this.state,
      pointsReceived: this.pointsReceived,
      pointsInBuffer: this.incoming.size,
      pointsInHistory: this.history.length,
      pointsInViewport: this.lastViewport.length,
      flushCount: this.flushCount,
      droppedPoints: this.droppedPoints,
      workerBusy: this.workerBusy,
      lastFlushMs: this.lastFlushMs,
      avgFlushMs: this.avgFlush(),
      wsLatencyMs: this.wsLatencyMs,
    };
  }

  // ── WebSocket ──

  private connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.state = "connecting";

    try {
      this.ws = new WebSocket(this.cfg.wsUrl, this.cfg.wsProtocols);
      this.ws.binaryType = "arraybuffer";

      this.ws.onopen = () => {
        this.state = "streaming";
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => this.handleIncoming(event);

      this.ws.onclose = () => this.scheduleReconnect();

      this.ws.onerror = () => { this.state = "error"; };
    } catch {
      this.state = "error";
      this.scheduleReconnect();
    }
  }

  private disconnect(): void {
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close(1000, "Stopped");
      this.ws = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.state === "disconnected") return;
    this.state = "error";
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30_000);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  // ── Ingestion ──

  private handleIncoming(event: MessageEvent): void {
    const parsed = this.cfg.parseMessage(event);
    if (!parsed) return;

    const points = Array.isArray(parsed) ? parsed : [parsed];
    for (const p of points) {
      this.pointsReceived++;
      this.incoming.push(p);
    }

    if (this.incoming.size >= this.cfg.flushThreshold) {
      if (!this.workerBusy) {
        this.flush();
      } else {
        this.pendingFlush = true;
        this.state = "backpressure";
      }
    }
  }

  private defaultParser(event: MessageEvent): StreamingPoint | null {
    try {
      const raw = typeof event.data === "string"
        ? event.data
        : new TextDecoder().decode(event.data);
      const msg = JSON.parse(raw);

      if (msg.type === "pong" && msg.t) {
        this.wsLatencyMs = Math.round(performance.now() - msg.t);
        return null;
      }

      if (msg.timestamp && typeof msg.timestamp === "number") {
        return msg as StreamingPoint;
      }
      return null;
    } catch {
      return null;
    }
  }

  // ── Flush Loop ──

  private startFlushLoop(): void {
    this.stopFlushLoop();
    this.flushTimer = setInterval(() => this.flush(), this.cfg.flushIntervalMs);
  }

  private stopFlushLoop(): void {
    if (this.flushTimer) { clearInterval(this.flushTimer); this.flushTimer = null; }
  }

  private flush(): void {
    const newPoints = this.incoming.drain();
    if (newPoints.length === 0 && !this.pendingFlush) return;

    // Add to history
    this.history.push(...newPoints);

    // Trim history to capacity
    if (this.history.length > this.cfg.historyCapacity) {
      this.droppedPoints += this.history.length - this.cfg.historyCapacity;
      this.history = this.history.slice(-this.cfg.historyCapacity);
    }

    // Extract visible window
    const windowStart = Date.now() - this.cfg.windowMs;
    const visibleData = this.history.filter((p) => p.timestamp >= windowStart);

    if (this.workerBusy) {
      this.pendingFlush = true;
      return;
    }

    this.sendToWorker(visibleData);
  }

  // ── Worker ──

  private initWorker(): void {
    try {
      this.worker = new Worker(
        new URL("../downsampling/lttb.worker.ts", import.meta.url),
        { type: "module" }
      );

      this.worker.onmessage = (event) => this.handleWorkerMsg(event.data);
      this.worker.onerror = () => {
        this.workerBusy = false;
        this.emitDirect();
      };
    } catch {
      this.worker = null;
    }
  }

  private sendToWorker(data: StreamingPoint[]): void {
    if (!this.worker || data.length <= this.cfg.viewportSize) {
      this.lastViewport = data.length > this.cfg.viewportSize
        ? data.slice(-this.cfg.viewportSize)
        : data;
      this.emit();
      return;
    }

    this.workerBusy = true;
    this.flushStartTime = performance.now();

    this.worker.postMessage({
      type: "process",
      requestId: `stream_${Date.now()}`,
      payload: {
        data,
        targetSize: this.cfg.viewportSize,
        yKeys: this.cfg.yKeys,
        multiSeries: this.cfg.yKeys.length > 1,
      },
    });
  }

  private handleWorkerMsg(msg: any): void {
    this.workerBusy = false;

    if (msg.type === "result") {
      this.lastFlushMs = Math.round((performance.now() - this.flushStartTime) * 100) / 100;
      this.flushDurations.push(this.lastFlushMs);
      if (this.flushDurations.length > 50) this.flushDurations.shift();

      this.flushCount++;
      this.lastViewport = msg.data;
      this.state = "streaming";
      this.emit();
    }

    if (msg.type === "pong") return;
    if (msg.type === "ready") return;

    if (this.pendingFlush) {
      this.pendingFlush = false;
      setTimeout(() => this.flush(), 0);
    }
  }

  // ── Emit ──

  private emit(): void {
    const stats = this.getStats();
    for (const l of this.listeners) {
      try { l(this.lastViewport, stats); } catch { /* ignore listener errors */ }
    }
  }

  private emitDirect(): void {
    this.lastViewport = this.history.slice(-this.cfg.viewportSize);
    this.emit();
  }

  private avgFlush(): number {
    if (this.flushDurations.length === 0) return 0;
    return Math.round(
      (this.flushDurations.reduce((a, b) => a + b, 0) / this.flushDurations.length) * 100
    ) / 100;
  }
}
