// ═══════════════════════════════════════════════════════════════
// Lightweight Heartbeat Monitor
//
// Three strategies for monitoring worker health without
// impacting main thread performance:
//
//   A. PiggybackHeartbeat (recommended default)
//      - Zero overhead during normal operation
//      - Explicit pings only during idle periods
//      - Uses requestIdleCallback to avoid competing with renders
//
//   B. SharedMemoryHeartbeat (zero-message)
//      - Worker increments atomic counter periodically
//      - Main thread reads via Atomics.load (nanoseconds)
//      - Detects infinite loops (no message channel needed)
//      - Requires SharedArrayBuffer (COOP/COEP headers)
//
//   C. createHeartbeat() compositor
//      - Auto-selects best available strategy
// ═══════════════════════════════════════════════════════════════

export interface HeartbeatMonitor {
  start(): void;
  stop(): void;
  /** Called when we receive any response from the worker */
  notifyActivity(): void;
  isAlive(): boolean;
  getLatencyMs(): number | null;
}

export interface HeartbeatConfig {
  /** Interval between health checks (ms). Default: 5000 */
  intervalMs: number;
  /** Max time to wait for pong (ms). Default: 2000 */
  timeoutMs: number;
  /** Missed pings before declaring unresponsive. Default: 3 */
  maxMissed: number;
  /** Called when worker becomes unresponsive */
  onUnresponsive: () => void;
  /** Called when worker recovers after being unresponsive */
  onRecovered: () => void;
}

// ═══════════════════════════════════════
// Strategy A: Piggyback + Idle-only Ping
// ═══════════════════════════════════════
//
// While the worker is responding to real requests, heartbeat
// is implicit (zero cost). Explicit pings are only sent during
// idle periods, scheduled via requestIdleCallback to avoid
// competing with render frames.

export class PiggybackHeartbeat implements HeartbeatMonitor {
  private config: HeartbeatConfig;
  private worker: Worker;

  private lastActivityAt = performance.now();
  private lastPongLatency: number | null = null;
  private missedPings = 0;
  private alive = true;
  private running = false;

  private idleCallbackId: number | null = null;
  private fallbackTimerId: ReturnType<typeof setTimeout> | null = null;
  private pendingPingId: string | null = null;
  private pendingPingSentAt = 0;
  private pingTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(worker: Worker, config: HeartbeatConfig) {
    this.worker = worker;
    this.config = config;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.alive = true;
    this.missedPings = 0;
    this.lastActivityAt = performance.now();
    this.scheduleNextCheck();
  }

  stop(): void {
    this.running = false;
    if (this.idleCallbackId != null) {
      cancelIdleCallback(this.idleCallbackId);
      this.idleCallbackId = null;
    }
    if (this.fallbackTimerId != null) {
      clearTimeout(this.fallbackTimerId);
      this.fallbackTimerId = null;
    }
    if (this.pingTimeoutId != null) {
      clearTimeout(this.pingTimeoutId);
      this.pingTimeoutId = null;
    }
  }

  notifyActivity(): void {
    this.lastActivityAt = performance.now();
    this.missedPings = 0;
    if (!this.alive) {
      this.alive = true;
      this.config.onRecovered();
    }
  }

  /** Call when receiving a pong message from the worker */
  handlePong(pingId: string): void {
    if (pingId !== this.pendingPingId) return;
    this.lastPongLatency = performance.now() - this.pendingPingSentAt;
    this.pendingPingId = null;
    if (this.pingTimeoutId != null) {
      clearTimeout(this.pingTimeoutId);
      this.pingTimeoutId = null;
    }
    this.notifyActivity();
  }

  isAlive(): boolean {
    return this.alive;
  }

  getLatencyMs(): number | null {
    return this.lastPongLatency;
  }

  // ═══════════════════════════════════════

  private scheduleNextCheck(): void {
    if (!this.running) return;

    if (typeof requestIdleCallback === "function") {
      this.idleCallbackId = requestIdleCallback(
        (deadline) => {
          // Only execute if we have at least 2ms of idle time
          if (deadline.timeRemaining() > 2) {
            this.performCheck();
          }
          this.scheduleNextCheck();
        },
        { timeout: this.config.intervalMs * 2 }
      );
    } else {
      this.fallbackTimerId = setTimeout(() => {
        this.performCheck();
        this.scheduleNextCheck();
      }, this.config.intervalMs);
    }
  }

  private performCheck(): void {
    const idleTimeMs = performance.now() - this.lastActivityAt;

    // If we received activity recently, worker is alive (piggybacking)
    if (idleTimeMs < this.config.intervalMs) return;

    // Worker has been idle too long — send explicit ping
    if (this.pendingPingId) return; // Already have a pending ping

    this.sendPing();
  }

  private sendPing(): void {
    const pingId = `hb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    this.pendingPingId = pingId;
    this.pendingPingSentAt = performance.now();

    try {
      this.worker.postMessage({ type: "ping", id: pingId });
    } catch {
      this.handleMiss();
      return;
    }

    this.pingTimeoutId = setTimeout(() => {
      if (this.pendingPingId === pingId) {
        this.pendingPingId = null;
        this.handleMiss();
      }
    }, this.config.timeoutMs);
  }

  private handleMiss(): void {
    this.missedPings++;
    if (this.missedPings >= this.config.maxMissed) {
      this.alive = false;
      this.config.onUnresponsive();
    }
  }
}

// ═══════════════════════════════════════
// Strategy B: SharedArrayBuffer Counter
// ═══════════════════════════════════════
//
// Worker increments an atomic counter periodically.
// Main thread reads via Atomics.load (nanoseconds, zero messages).
// Can detect infinite loops where the worker can't process messages.

export class SharedMemoryHeartbeat implements HeartbeatMonitor {
  private config: HeartbeatConfig;
  private sharedBuffer: SharedArrayBuffer;
  private sharedView: Int32Array;

  private lastSeenCounter = 0;
  private missedChecks = 0;
  private alive = true;
  private running = false;
  private checkTimerId: ReturnType<typeof setInterval> | null = null;
  private lastCounterChangeAt = 0;

  constructor(worker: Worker, config: HeartbeatConfig) {
    void worker; // Stored for potential future use
    this.config = config;
    this.sharedBuffer = new SharedArrayBuffer(8);
    this.sharedView = new Int32Array(this.sharedBuffer);
    Atomics.store(this.sharedView, 0, 0);
  }

  /** Pass to worker during init so it can increment the counter */
  getSharedBuffer(): SharedArrayBuffer {
    return this.sharedBuffer;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.alive = true;
    this.missedChecks = 0;
    this.lastSeenCounter = Atomics.load(this.sharedView, 0);
    this.lastCounterChangeAt = performance.now();

    this.checkTimerId = setInterval(() => {
      this.performCheck();
    }, this.config.intervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.checkTimerId) {
      clearInterval(this.checkTimerId);
      this.checkTimerId = null;
    }
  }

  notifyActivity(): void {
    this.missedChecks = 0;
    if (!this.alive) {
      this.alive = true;
      this.config.onRecovered();
    }
  }

  isAlive(): boolean {
    return this.alive;
  }

  getLatencyMs(): number | null {
    if (this.lastCounterChangeAt === 0) return null;
    const elapsed = performance.now() - this.lastCounterChangeAt;
    return elapsed < this.config.intervalMs * 2 ? Math.round(elapsed * 100) / 100 : null;
  }

  private performCheck(): void {
    const currentCounter = Atomics.load(this.sharedView, 0);

    if (currentCounter !== this.lastSeenCounter) {
      this.lastSeenCounter = currentCounter;
      this.lastCounterChangeAt = performance.now();
      this.missedChecks = 0;
      if (!this.alive) {
        this.alive = true;
        this.config.onRecovered();
      }
    } else {
      this.missedChecks++;
      if (this.missedChecks >= this.config.maxMissed) {
        this.alive = false;
        this.config.onUnresponsive();
      }
    }
  }
}

// ═══════════════════════════════════════
// Compositor: auto-select best strategy
// ═══════════════════════════════════════

export function createHeartbeat(
  worker: Worker,
  config: HeartbeatConfig
): HeartbeatMonitor {
  const sabAvailable =
    typeof SharedArrayBuffer !== "undefined" &&
    typeof Atomics !== "undefined";

  if (sabAvailable) {
    console.info("[Heartbeat] Using SharedArrayBuffer (zero-message)");
    return new SharedMemoryHeartbeat(worker, config);
  }

  console.info("[Heartbeat] Using Piggyback + requestIdleCallback");
  return new PiggybackHeartbeat(worker, config);
}
