// ═══════════════════════════════════════════════════════════════
// RecoveryStateMachine: 5-state FSM with confidence scoring
// and hysteresis for worker recovery decisions.
//
// States:
//   NORMAL ──(N timeouts)──→ DEGRADED
//     ↑                        │
//     │                        ├──(restart ok)──→ PROBING
//     │                        │                    │
//     │                        ←──(probe fail)──────┤
//     │                                             │
//     │                        ┌──(probe ok)──→ RECOVERING
//     │                        │                    │
//     │                        ←──(confidence < 0.15)┤
//     │                                             │
//     ←────(confidence ≥ threshold + N successes)───┘
//
//     DEAD ← any state after maxRestarts exhausted
//
// Hysteresis:
//   - Enter DEGRADED: requires N consecutive timeouts
//   - Return to NORMAL: requires confidence ≥ 0.8 AND M consecutive successes
//   - Confidence rises slowly (+0.15/success) but drops fast (-0.4/failure)
// ═══════════════════════════════════════════════════════════════

export type RecoveryState =
  | "normal"
  | "degraded"
  | "probing"
  | "recovering"
  | "dead";

export interface RecoveryEvent {
  type:
    | "request_success"
    | "request_timeout"
    | "worker_crash"
    | "probe_success"
    | "probe_failure"
    | "restart_success"
    | "restart_failure";
  latencyMs?: number;
  timestamp: number;
}

export interface RecoveryConfig {
  /** Timeouts to enter DEGRADED. Default: 3 */
  degradeAfterTimeouts: number;
  /** Restarts to declare DEAD. Default: 5 */
  maxRestarts: number;
  /** Confidence score to return to NORMAL (0–1). Default: 0.8 */
  recoveryThreshold: number;
  /** Confidence increment per success. Default: 0.15 */
  successBoost: number;
  /** Confidence decrement per failure. Default: 0.4 */
  failurePenalty: number;
  /** Min consecutive successes in RECOVERING before NORMAL. Default: 5 */
  minConsecutiveSuccesses: number;
  /** Max acceptable latency in RECOVERING (ms). 0 = use dynamic P90. Default: 0 */
  maxAcceptableLatencyMs: number;
  /** Latency history window size. Default: 50 */
  historyWindow: number;
  /** Transition callback */
  onTransition?: (from: RecoveryState, to: RecoveryState, reason: string) => void;
}

const DEFAULT_CONFIG: Required<RecoveryConfig> = {
  degradeAfterTimeouts: 3,
  maxRestarts: 5,
  recoveryThreshold: 0.8,
  successBoost: 0.15,
  failurePenalty: 0.4,
  minConsecutiveSuccesses: 5,
  maxAcceptableLatencyMs: 0,
  historyWindow: 50,
  onTransition: () => {},
};

export class RecoveryStateMachine {
  private state: RecoveryState = "normal";
  private config: Required<RecoveryConfig>;

  // Counters
  private consecutiveTimeouts = 0;
  private consecutiveSuccesses = 0;
  private restartCount = 0;
  private confidenceScore = 1.0;

  // Latency history for percentile-based decisions
  private latencyHistory: number[] = [];

  // State duration tracking
  private stateEnteredAt = performance.now();
  private stateHistory: { state: RecoveryState; durationMs: number }[] = [];

  constructor(config?: Partial<RecoveryConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ═══════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════

  /** Feed an event into the FSM. Returns the (possibly new) state. */
  feed(event: RecoveryEvent): RecoveryState {
    switch (this.state) {
      case "normal":
        return this.handleNormal(event);
      case "degraded":
        return this.handleDegraded(event);
      case "probing":
        return this.handleProbing(event);
      case "recovering":
        return this.handleRecovering(event);
      case "dead":
        return this.state; // Terminal — no transitions out
    }
  }

  getState(): RecoveryState {
    return this.state;
  }

  getConfidence(): number {
    return this.confidenceScore;
  }

  getReport() {
    return {
      state: this.state,
      confidence: Math.round(this.confidenceScore * 100),
      confidenceScore: Math.round(this.confidenceScore * 100) / 100,
      consecutiveTimeouts: this.consecutiveTimeouts,
      consecutiveSuccesses: this.consecutiveSuccesses,
      restartCount: this.restartCount,
      maxRestarts: this.config.maxRestarts,
      latencyP50Ms: this.getLatencyPercentile(50),
      latencyP90Ms: this.getLatencyPercentile(90),
      latencyP99Ms: this.getLatencyPercentile(99),
      stateHistory: [...this.stateHistory.slice(-10)],
      stateDurationMs: Math.round(performance.now() - this.stateEnteredAt),
      timeInCurrentState: Math.round(performance.now() - this.stateEnteredAt),
    };
  }

  /** Whether the worker should handle requests (normal or recovering) */
  shouldUseWorker(): boolean {
    return this.state === "normal" || this.state === "recovering";
  }

  /** Whether fallback should handle requests (degraded or dead) */
  shouldUseFallback(): boolean {
    return this.state === "degraded" || this.state === "dead";
  }

  /** Full reset (e.g. after switching dataset) */
  reset(): void {
    this.consecutiveTimeouts = 0;
    this.consecutiveSuccesses = 0;
    this.restartCount = 0;
    this.confidenceScore = 1.0;
    this.latencyHistory = [];
    this.stateHistory = [];
    this.transitionTo("normal", "Manual reset");
  }

  // ═══════════════════════════════════════
  // State handlers
  // ═══════════════════════════════════════

  private handleNormal(event: RecoveryEvent): RecoveryState {
    switch (event.type) {
      case "request_success":
        this.consecutiveTimeouts = 0;
        this.consecutiveSuccesses++;
        if (event.latencyMs != null) this.recordLatency(event.latencyMs);
        // Slowly top up confidence
        this.confidenceScore = Math.min(1.0, this.confidenceScore + this.config.successBoost * 0.1);
        return this.state;

      case "request_timeout":
        this.consecutiveTimeouts++;
        this.consecutiveSuccesses = 0;
        this.confidenceScore = Math.max(0, this.confidenceScore - this.config.failurePenalty * 0.5);

        if (this.consecutiveTimeouts >= this.config.degradeAfterTimeouts) {
          return this.transitionTo("degraded", `${this.consecutiveTimeouts} consecutive timeouts`);
        }
        return this.state;

      case "worker_crash":
        return this.transitionTo("degraded", "Worker crash");

      default:
        return this.state;
    }
  }

  private handleDegraded(event: RecoveryEvent): RecoveryState {
    switch (event.type) {
      case "restart_success":
        return this.transitionTo("probing", "Worker recreated, sending probe");

      case "restart_failure":
        this.restartCount++;
        if (this.restartCount >= this.config.maxRestarts) {
          return this.transitionTo("dead", `${this.config.maxRestarts} restarts exhausted`);
        }
        return this.state;

      default:
        return this.state;
    }
  }

  private handleProbing(event: RecoveryEvent): RecoveryState {
    switch (event.type) {
      case "probe_success": {
        const limit = this.getProbeLatencyLimit();
        if (event.latencyMs != null && event.latencyMs > limit && limit > 0) {
          return this.transitionTo(
            "degraded",
            `Probe slow (${event.latencyMs.toFixed(1)}ms > ${limit.toFixed(0)}ms limit)`
          );
        }
        this.confidenceScore = event.latencyMs != null ? 0.3 : 0.2;
        this.consecutiveSuccesses = 0;
        return this.transitionTo(
          "recovering",
          `Probe OK${event.latencyMs != null ? ` (${event.latencyMs.toFixed(1)}ms)` : ""}`
        );
      }

      case "probe_failure":
        return this.transitionTo("degraded", "Probe failed");

      default:
        return this.state;
    }
  }

  /**
   * RECOVERING: worker is responding but not yet trusted.
   * Each success increases confidence; any failure drops it hard.
   * Only when confidence ≥ threshold AND N consecutive successes → NORMAL.
   */
  private handleRecovering(event: RecoveryEvent): RecoveryState {
    switch (event.type) {
      case "request_success": {
        this.consecutiveSuccesses++;

        let boost = this.config.successBoost;
        if (event.latencyMs != null) {
          this.recordLatency(event.latencyMs);
          const median = this.getLatencyPercentile(50);
          if (median > 0 && event.latencyMs < median) {
            boost += this.config.successBoost * 0.5; // Extra bonus for fast responses
          }
        }
        this.confidenceScore = Math.min(1.0, this.confidenceScore + boost);

        // Promotion criteria: high confidence + sustained successes
        if (
          this.confidenceScore >= this.config.recoveryThreshold &&
          this.consecutiveSuccesses >= this.config.minConsecutiveSuccesses
        ) {
          this.restartCount = Math.max(0, this.restartCount - 1);
          return this.transitionTo(
            "normal",
            `Confidence ${this.confidenceScore.toFixed(2)} ≥ ${this.config.recoveryThreshold}, ` +
            `${this.consecutiveSuccesses} consecutive successes`
          );
        }
        return this.state;
      }

      case "request_timeout":
        this.consecutiveSuccesses = 0;
        this.confidenceScore = Math.max(0, this.confidenceScore - this.config.failurePenalty);
        if (this.confidenceScore < 0.15) {
          return this.transitionTo(
            "degraded",
            `Confidence dropped to ${this.confidenceScore.toFixed(2)} — back to fallback`
          );
        }
        return this.state;

      case "worker_crash":
        return this.transitionTo("degraded", "Worker crash during recovery");

      default:
        return this.state;
    }
  }

  // ═══════════════════════════════════════
  // Internals
  // ═══════════════════════════════════════

  private transitionTo(newState: RecoveryState, reason: string): RecoveryState {
    if (this.state === newState) return this.state;

    const prev = this.state;
    const duration = performance.now() - this.stateEnteredAt;

    this.stateHistory.push({ state: prev, durationMs: Math.round(duration) });
    if (this.stateHistory.length > 20) this.stateHistory.shift();

    this.state = newState;
    this.stateEnteredAt = performance.now();

    console.info(`[RecoveryFSM] ${prev} → ${newState}: ${reason}`);
    this.config.onTransition(prev, newState, reason);

    return newState;
  }

  private recordLatency(ms: number): void {
    this.latencyHistory.push(ms);
    if (this.latencyHistory.length > this.config.historyWindow) {
      this.latencyHistory.shift();
    }
  }

  private getLatencyPercentile(pct: number): number {
    if (this.latencyHistory.length === 0) return 0;
    const sorted = [...this.latencyHistory].sort((a, b) => a - b);
    const idx = Math.min(
      Math.ceil((pct / 100) * sorted.length) - 1,
      sorted.length - 1
    );
    return Math.round(sorted[Math.max(0, idx)] * 100) / 100;
  }

  private getProbeLatencyLimit(): number {
    const p90 = this.getLatencyPercentile(90);
    return p90 > 0
      ? p90 * 1.5 // Up to 50% above historical P90
      : this.config.maxAcceptableLatencyMs || 100;
  }
}
