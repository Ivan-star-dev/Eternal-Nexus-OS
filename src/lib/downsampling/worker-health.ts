// ═══════════════════════════════════════════════════════════════
// WorkerHealthMonitor: heartbeat + crash detection + recovery
//
// Detects: crash (onerror), infinite loop (no pong), memory leak
// (slow pong), deadlock (missed heartbeats).
//
// Recovery: exponential backoff restart with max attempts.
// ═══════════════════════════════════════════════════════════════

export type WorkerHealthState =
  | "healthy"
  | "slow"
  | "unresponsive"
  | "restarting"
  | "dead";

export interface HealthConfig {
  heartbeatIntervalMs: number;
  heartbeatTimeoutMs: number;
  maxMissedHeartbeats: number;
  pongLatencyWarningMs: number;
  restartBaseDelayMs: number;
  maxRestarts: number;
  onStateChange?: (state: WorkerHealthState) => void;
  onRestartNeeded: () => Promise<Worker>;
}

interface HeartbeatRecord {
  sentAt: number;
  receivedAt: number | null;
  latencyMs: number | null;
}

export class WorkerHealthMonitor {
  private config: Required<HealthConfig>;
  private worker: Worker | null = null;
  private state: WorkerHealthState = "healthy";

  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private pendingPingId: string | null = null;
  private pendingPingSentAt = 0;
  private missedHeartbeats = 0;
  private heartbeatHistory: HeartbeatRecord[] = [];

  private restartCount = 0;
  private restartTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: Partial<HealthConfig> & { onRestartNeeded: () => Promise<Worker> }) {
    this.config = {
      heartbeatIntervalMs: config.heartbeatIntervalMs ?? 5000,
      heartbeatTimeoutMs: config.heartbeatTimeoutMs ?? 2000,
      maxMissedHeartbeats: config.maxMissedHeartbeats ?? 3,
      pongLatencyWarningMs: config.pongLatencyWarningMs ?? 100,
      restartBaseDelayMs: config.restartBaseDelayMs ?? 1000,
      maxRestarts: config.maxRestarts ?? 5,
      onStateChange: config.onStateChange ?? (() => {}),
      onRestartNeeded: config.onRestartNeeded,
    };
  }

  /** Start monitoring a worker. Worker must respond to { type: "ping", id } with { type: "pong", id }. */
  attach(worker: Worker): void {
    this.worker = worker;
    this.missedHeartbeats = 0;
    this.setState("healthy");

    const originalOnMessage = worker.onmessage;
    worker.onmessage = (event: MessageEvent) => {
      if (event.data.type === "pong") {
        this.handlePong(event.data.id);
        return;
      }
      originalOnMessage?.call(worker, event);
    };

    const originalOnError = worker.onerror;
    worker.onerror = (event) => {
      this.handleCrash();
      originalOnError?.call(worker, event);
    };

    this.startHeartbeat();
  }

  detach(): void {
    this.stopHeartbeat();
    if (this.restartTimer) { clearTimeout(this.restartTimer); this.restartTimer = null; }
    this.worker = null;
  }

  // ═══════════════════════════════════════
  // Heartbeat
  // ═══════════════════════════════════════

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => this.sendPing(), this.config.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
  }

  private sendPing(): void {
    if (!this.worker) return;

    if (this.pendingPingId) {
      this.handleMissedHeartbeat();
    }

    const pingId = `ping_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.pendingPingId = pingId;
    this.pendingPingSentAt = performance.now();

    try {
      this.worker.postMessage({ type: "ping", id: pingId });
    } catch {
      this.handleCrash();
      return;
    }

    setTimeout(() => {
      if (this.pendingPingId === pingId) this.handleMissedHeartbeat();
    }, this.config.heartbeatTimeoutMs);
  }

  private handlePong(id: string): void {
    if (id !== this.pendingPingId) return;

    const latencyMs = performance.now() - this.pendingPingSentAt;
    this.pendingPingId = null;
    this.missedHeartbeats = 0;

    this.heartbeatHistory.push({ sentAt: this.pendingPingSentAt, receivedAt: performance.now(), latencyMs });
    if (this.heartbeatHistory.length > 20) this.heartbeatHistory.shift();

    if (latencyMs > this.config.pongLatencyWarningMs) {
      if (this.state !== "slow") {
        console.warn(`[HealthMonitor] Slow pong: ${latencyMs.toFixed(1)}ms (threshold: ${this.config.pongLatencyWarningMs}ms)`);
      }
      this.setState("slow");
    } else {
      this.setState("healthy");
    }
  }

  private handleMissedHeartbeat(): void {
    this.pendingPingId = null;
    this.missedHeartbeats++;

    this.heartbeatHistory.push({ sentAt: this.pendingPingSentAt, receivedAt: null, latencyMs: null });

    console.warn(`[HealthMonitor] Missed heartbeat (${this.missedHeartbeats}/${this.config.maxMissedHeartbeats})`);

    if (this.missedHeartbeats >= this.config.maxMissedHeartbeats) {
      this.setState("unresponsive");
      this.initiateRestart();
    }
  }

  // ═══════════════════════════════════════
  // Crash & Restart
  // ═══════════════════════════════════════

  private handleCrash(): void {
    console.error("[HealthMonitor] Worker crashed");
    this.stopHeartbeat();
    this.initiateRestart();
  }

  private initiateRestart(): void {
    if (this.restartCount >= this.config.maxRestarts) {
      console.error(`[HealthMonitor] Max ${this.config.maxRestarts} restarts exhausted. Worker dead.`);
      this.setState("dead");
      return;
    }

    this.setState("restarting");

    if (this.worker) { try { this.worker.terminate(); } catch {} this.worker = null; }

    const delay = this.config.restartBaseDelayMs * Math.pow(2, this.restartCount);
    this.restartCount++;

    console.info(`[HealthMonitor] Restart #${this.restartCount} in ${delay}ms`);

    this.restartTimer = setTimeout(async () => {
      try {
        const newWorker = await this.config.onRestartNeeded();
        this.attach(newWorker);
        this.restartCount = Math.max(0, this.restartCount - 1);
        console.info("[HealthMonitor] Worker restarted successfully");
      } catch (err) {
        console.error("[HealthMonitor] Restart failed:", err);
        this.initiateRestart();
      }
    }, delay);
  }

  // ═══════════════════════════════════════
  // State & Reporting
  // ═══════════════════════════════════════

  private setState(state: WorkerHealthState): void {
    if (this.state !== state) {
      this.state = state;
      this.config.onStateChange(state);
    }
  }

  getState(): WorkerHealthState { return this.state; }

  getReport() {
    const latencies = this.heartbeatHistory.filter((h) => h.latencyMs !== null).map((h) => h.latencyMs!);
    const avg = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
    const missRate = this.heartbeatHistory.length > 0
      ? this.heartbeatHistory.filter((h) => h.receivedAt === null).length / this.heartbeatHistory.length
      : 0;

    return {
      state: this.state,
      missedHeartbeats: this.missedHeartbeats,
      restartCount: this.restartCount,
      maxRestarts: this.config.maxRestarts,
      avgPongLatencyMs: Math.round(avg * 100) / 100,
      heartbeatMissRate: Math.round(missRate * 100),
      historySize: this.heartbeatHistory.length,
    };
  }

  reset(): void {
    this.restartCount = 0;
    this.missedHeartbeats = 0;
    this.heartbeatHistory = [];
    if (this.state === "dead") this.setState("healthy");
  }
}
