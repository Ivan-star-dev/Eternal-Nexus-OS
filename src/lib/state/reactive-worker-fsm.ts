// ═══════════════════════════════════════════════════════════════
// ReactiveWorkerFSM: Observable state machine for worker/fallback
//
// Architecture:
//   Events flow IN → FSM processes → State flows OUT to subscribers
//   Components subscribe to slices via selectors for minimal re-renders
//
//   ┌─────────────────────────────────────────────────────┐
//   │  heartbeat ──┐                                      │
//   │  worker ─────┼──→ FSM Core ──→ State Store          │
//   │  bridge ─────┤        │             │               │
//   │  user ───────┘        ▼             ▼               │
//   │                 Side Effects   Subscribers          │
//   │                 (restart,      (React hooks,        │
//   │                  probe,         logger, DevTools)   │
//   │                  metrics)                           │
//   └─────────────────────────────────────────────────────┘
//
// States:
//   idle → processing → normal (happy path)
//   normal → degraded (after N failures)
//   degraded → restarting → probing → recovering → normal
//   any → dead (after max restarts exhausted)
// ═══════════════════════════════════════════════════════════════

export type WorkerState =
  | "idle"
  | "processing"
  | "normal"
  | "degraded"
  | "probing"
  | "recovering"
  | "restarting"
  | "dead";

export interface FSMContext {
  state: WorkerState;
  confidence: number;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  restartCount: number;
  lastLatencyMs: number | null;
  latencyP50: number;
  latencyP90: number;
  activeSource: "worker" | "fallback";
  pendingRequests: number;
  lastTransition: {
    from: WorkerState;
    to: WorkerState;
    reason: string;
    timestamp: number;
  } | null;
}

export type FSMEvent =
  | { type: "REQUEST_SENT" }
  | { type: "REQUEST_SUCCESS"; latencyMs: number }
  | { type: "REQUEST_TIMEOUT"; afterMs: number }
  | { type: "WORKER_CRASH"; error: string }
  | { type: "PROBE_SENT" }
  | { type: "PROBE_SUCCESS"; latencyMs: number }
  | { type: "PROBE_FAILURE" }
  | { type: "RESTART_INITIATED" }
  | { type: "RESTART_SUCCESS" }
  | { type: "RESTART_FAILURE"; error: string }
  | { type: "HEARTBEAT_MISS" }
  | { type: "HEARTBEAT_RECOVERED" }
  | { type: "FORCE_FALLBACK" }
  | { type: "FORCE_RESET" };

type Subscriber<T> = (value: T) => void;
type Selector<T> = (ctx: FSMContext) => T;
type SideEffect = (ctx: FSMContext, event: FSMEvent) => void;
type Unsubscribe = () => void;

export interface FSMConfig {
  degradeAfterFailures: number;
  maxRestarts: number;
  recoveryThreshold: number;
  minRecoverySuccesses: number;
  successBoost: number;
  failurePenalty: number;
  latencyHistorySize: number;
  probeLatencyMultiplier: number;
  restartDelayMs: number;
  restartBackoffMultiplier: number;
  maxRestartDelayMs: number;
}

const DEFAULT_CONFIG: FSMConfig = {
  degradeAfterFailures: 3,
  maxRestarts: 5,
  recoveryThreshold: 0.8,
  minRecoverySuccesses: 5,
  successBoost: 0.15,
  failurePenalty: 0.4,
  latencyHistorySize: 50,
  probeLatencyMultiplier: 1.5,
  restartDelayMs: 1000,
  restartBackoffMultiplier: 2,
  maxRestartDelayMs: 30_000,
};

// ═══════════════════════════════════════
// The State Machine
// ═══════════════════════════════════════

export class ReactiveWorkerFSM {
  private ctx: FSMContext;
  private config: FSMConfig;
  private latencyHistory: number[] = [];

  // Observable infrastructure
  private subscriptions = new Map<
    number,
    { selector: Selector<any>; callback: Subscriber<any>; lastValue: any }
  >();
  private nextSubId = 0;
  private sideEffects: SideEffect[] = [];

  // Transition log
  private transitionLog: Array<{
    from: WorkerState;
    to: WorkerState;
    event: FSMEvent["type"];
    confidence: number;
    timestamp: number;
  }> = [];

  // Scheduled actions
  private scheduledRestart: ReturnType<typeof setTimeout> | null = null;
  private scheduledProbe: ReturnType<typeof setTimeout> | null = null;

  constructor(config?: Partial<FSMConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.ctx = this.createInitialContext();
  }

  private createInitialContext(): FSMContext {
    return {
      state: "idle",
      confidence: 1.0,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      restartCount: 0,
      lastLatencyMs: null,
      latencyP50: 0,
      latencyP90: 0,
      activeSource: "worker",
      pendingRequests: 0,
      lastTransition: null,
    };
  }

  // ═══════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════

  send(event: FSMEvent): WorkerState {
    const prevState = this.ctx.state;

    this.processEvent(event);

    if (this.ctx.state !== prevState) {
      this.ctx.lastTransition = {
        from: prevState,
        to: this.ctx.state,
        reason: event.type,
        timestamp: performance.now(),
      };
      this.transitionLog.push({
        from: prevState,
        to: this.ctx.state,
        event: event.type,
        confidence: this.ctx.confidence,
        timestamp: performance.now(),
      });
      if (this.transitionLog.length > 200) {
        this.transitionLog.splice(0, 100);
      }
    }

    for (const effect of this.sideEffects) {
      try {
        effect(this.ctx, event);
      } catch (err) {
        console.error("[FSM] Side effect error:", err);
      }
    }

    this.notifySubscribers();
    return this.ctx.state;
  }

  /**
   * Subscribe to a slice of the FSM context.
   * Callback only fires when selected value changes (shallow compare).
   */
  subscribe<T>(selector: Selector<T>, callback: Subscriber<T>): Unsubscribe {
    const id = this.nextSubId++;
    const initialValue = selector(this.ctx);

    this.subscriptions.set(id, {
      selector,
      callback,
      lastValue: initialValue,
    });

    callback(initialValue);

    return () => {
      this.subscriptions.delete(id);
    };
  }

  /** Subscribe to the full context. Re-notifies on ANY change. */
  subscribeAll(callback: Subscriber<Readonly<FSMContext>>): Unsubscribe {
    return this.subscribe((ctx) => ctx, callback);
  }

  /**
   * Register a side effect that runs AFTER each event.
   * Used for: worker restart, probe dispatch, metrics collection.
   */
  registerEffect(effect: SideEffect): Unsubscribe {
    this.sideEffects.push(effect);
    return () => {
      const idx = this.sideEffects.indexOf(effect);
      if (idx >= 0) this.sideEffects.splice(idx, 1);
    };
  }

  /** Register side effect (alias for registerEffect) */
  addSideEffect(effect: SideEffect): Unsubscribe {
    return this.registerEffect(effect);
  }

  getContext(): Readonly<FSMContext> {
    return { ...this.ctx };
  }

  getTransitionLog() {
    return [...this.transitionLog];
  }

  shouldUseWorker(): boolean {
    return (
      this.ctx.activeSource === "worker" &&
      this.ctx.state !== "degraded" &&
      this.ctx.state !== "dead" &&
      this.ctx.state !== "restarting"
    );
  }

  shouldUseFallback(): boolean {
    return this.ctx.activeSource === "fallback";
  }

  destroy(): void {
    this.clearScheduled();
    this.subscriptions.clear();
    this.sideEffects.length = 0;
    this.latencyHistory.length = 0;
    this.transitionLog.length = 0;
  }

  // ═══════════════════════════════════════
  // Event Processing
  // ═══════════════════════════════════════

  private processEvent(event: FSMEvent): void {
    if (event.type === "FORCE_RESET") {
      this.clearScheduled();
      this.ctx = this.createInitialContext();
      this.latencyHistory = [];
      return;
    }
    if (event.type === "FORCE_FALLBACK") {
      this.clearScheduled();
      this.ctx.state = "degraded";
      this.ctx.activeSource = "fallback";
      return;
    }

    switch (this.ctx.state) {
      case "idle":
      case "normal":
        this.processNormal(event);
        break;
      case "processing":
        this.processProcessing(event);
        break;
      case "degraded":
        this.processDegraded(event);
        break;
      case "probing":
        this.processProbing(event);
        break;
      case "recovering":
        this.processRecovering(event);
        break;
      case "restarting":
        this.processRestarting(event);
        break;
      case "dead":
        break; // Terminal — only FORCE_RESET exits (handled above)
    }
  }

  private processNormal(event: FSMEvent): void {
    switch (event.type) {
      case "REQUEST_SENT":
        this.ctx.pendingRequests++;
        this.ctx.state = "processing";
        break;
      case "HEARTBEAT_MISS":
        this.ctx.consecutiveFailures++;
        if (this.ctx.consecutiveFailures >= this.config.degradeAfterFailures) {
          this.enterDegraded();
        }
        break;
      case "WORKER_CRASH":
        this.enterDegraded();
        break;
    }
  }

  private processProcessing(event: FSMEvent): void {
    switch (event.type) {
      case "REQUEST_SENT":
        this.ctx.pendingRequests++;
        break;
      case "REQUEST_SUCCESS":
        this.ctx.pendingRequests = Math.max(0, this.ctx.pendingRequests - 1);
        this.ctx.consecutiveSuccesses++;
        this.ctx.consecutiveFailures = 0;
        this.ctx.lastLatencyMs = event.latencyMs;
        this.recordLatency(event.latencyMs);
        this.boostConfidence();
        if (this.ctx.pendingRequests === 0) {
          this.ctx.state = "normal";
        }
        break;
      case "REQUEST_TIMEOUT":
        this.ctx.pendingRequests = Math.max(0, this.ctx.pendingRequests - 1);
        this.ctx.consecutiveSuccesses = 0;
        this.ctx.consecutiveFailures++;
        this.penalizeConfidence();
        if (this.ctx.consecutiveFailures >= this.config.degradeAfterFailures) {
          this.enterDegraded();
        } else if (this.ctx.pendingRequests === 0) {
          this.ctx.state = "normal";
        }
        break;
      case "WORKER_CRASH":
        this.ctx.pendingRequests = 0;
        this.enterDegraded();
        break;
    }
  }

  private processDegraded(event: FSMEvent): void {
    switch (event.type) {
      case "REQUEST_SENT":
        this.ctx.pendingRequests++;
        break;
      case "REQUEST_SUCCESS":
        this.ctx.pendingRequests = Math.max(0, this.ctx.pendingRequests - 1);
        break;
      case "RESTART_INITIATED":
        this.ctx.state = "restarting";
        break;
    }

    // Auto-schedule restart if none pending
    if (
      this.ctx.state === "degraded" &&
      !this.scheduledRestart &&
      this.ctx.restartCount < this.config.maxRestarts
    ) {
      this.scheduleRestart();
    }
  }

  private processRestarting(event: FSMEvent): void {
    switch (event.type) {
      case "RESTART_SUCCESS":
        this.ctx.restartCount++;
        this.ctx.state = "probing";
        this.scheduleProbe();
        break;
      case "RESTART_FAILURE":
        this.ctx.restartCount++;
        if (this.ctx.restartCount >= this.config.maxRestarts) {
          this.ctx.state = "dead";
          this.ctx.activeSource = "fallback";
        } else {
          this.ctx.state = "degraded";
        }
        break;
      case "REQUEST_SENT":
        this.ctx.pendingRequests++;
        break;
    }
  }

  private processProbing(event: FSMEvent): void {
    switch (event.type) {
      case "PROBE_SUCCESS":
        if (this.isProbeLatencyAcceptable(event.latencyMs)) {
          this.ctx.confidence = 0.3;
          this.ctx.consecutiveSuccesses = 0;
          this.ctx.activeSource = "worker";
          this.ctx.state = "recovering";
        } else {
          this.ctx.state = "degraded";
        }
        break;
      case "PROBE_FAILURE":
        this.ctx.state = "degraded";
        break;
      case "WORKER_CRASH":
        this.enterDegraded();
        break;
      case "REQUEST_SENT":
        this.ctx.pendingRequests++;
        break;
    }
  }

  private processRecovering(event: FSMEvent): void {
    switch (event.type) {
      case "REQUEST_SENT":
        this.ctx.pendingRequests++;
        break;
      case "REQUEST_SUCCESS":
        this.ctx.pendingRequests = Math.max(0, this.ctx.pendingRequests - 1);
        this.ctx.consecutiveSuccesses++;
        this.ctx.consecutiveFailures = 0;
        this.ctx.lastLatencyMs = event.latencyMs;
        this.recordLatency(event.latencyMs);
        this.boostConfidence();
        if (
          this.ctx.confidence >= this.config.recoveryThreshold &&
          this.ctx.consecutiveSuccesses >= this.config.minRecoverySuccesses
        ) {
          this.ctx.restartCount = Math.max(0, this.ctx.restartCount - 1);
          this.ctx.state = "normal";
        }
        break;
      case "REQUEST_TIMEOUT":
        this.ctx.pendingRequests = Math.max(0, this.ctx.pendingRequests - 1);
        this.ctx.consecutiveSuccesses = 0;
        this.ctx.consecutiveFailures++;
        this.penalizeConfidence();
        if (this.ctx.confidence < 0.15) {
          this.enterDegraded();
        }
        break;
      case "WORKER_CRASH":
        this.ctx.pendingRequests = 0;
        this.ctx.confidence = 0;
        this.enterDegraded();
        break;
    }
  }

  // ═══════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════

  private enterDegraded(): void {
    this.clearScheduled();
    this.ctx.activeSource = "fallback";
    this.ctx.pendingRequests = 0;
    this.ctx.consecutiveSuccesses = 0;
    this.ctx.state = "degraded";
  }

  private boostConfidence(): void {
    const median = this.ctx.latencyP50;
    const bonus =
      median > 0 &&
      this.ctx.lastLatencyMs != null &&
      this.ctx.lastLatencyMs < median
        ? this.config.successBoost * 0.5
        : 0;
    this.ctx.confidence = Math.min(
      1.0,
      this.ctx.confidence + this.config.successBoost + bonus
    );
  }

  private penalizeConfidence(): void {
    this.ctx.confidence = Math.max(
      0,
      this.ctx.confidence - this.config.failurePenalty
    );
  }

  private recordLatency(ms: number): void {
    this.latencyHistory.push(ms);
    if (this.latencyHistory.length > this.config.latencyHistorySize) {
      this.latencyHistory.shift();
    }
    const sorted = [...this.latencyHistory].sort((a, b) => a - b);
    const len = sorted.length;
    this.ctx.latencyP50 = sorted[Math.floor(len * 0.5)] ?? 0;
    this.ctx.latencyP90 = sorted[Math.floor(len * 0.9)] ?? 0;
  }

  private isProbeLatencyAcceptable(latencyMs: number): boolean {
    if (this.ctx.latencyP90 <= 0) return latencyMs < 100;
    return latencyMs <= this.ctx.latencyP90 * this.config.probeLatencyMultiplier;
  }

  // ── Scheduling ──

  private scheduleRestart(): void {
    const delay = Math.min(
      this.config.restartDelayMs *
        Math.pow(this.config.restartBackoffMultiplier, this.ctx.restartCount),
      this.config.maxRestartDelayMs
    );

    this.scheduledRestart = setTimeout(() => {
      this.scheduledRestart = null;
      this.send({ type: "RESTART_INITIATED" });
    }, delay);
  }

  private scheduleProbe(): void {
    this.scheduledProbe = setTimeout(() => {
      this.scheduledProbe = null;
      this.send({ type: "PROBE_SENT" });
    }, 500);
  }

  private clearScheduled(): void {
    if (this.scheduledRestart) {
      clearTimeout(this.scheduledRestart);
      this.scheduledRestart = null;
    }
    if (this.scheduledProbe) {
      clearTimeout(this.scheduledProbe);
      this.scheduledProbe = null;
    }
  }

  // ── Notification ──

  private notifySubscribers(): void {
    for (const [, sub] of this.subscriptions) {
      try {
        const newValue = sub.selector(this.ctx);
        if (!shallowEqual(sub.lastValue, newValue)) {
          sub.lastValue =
            typeof newValue === "object" && newValue !== null
              ? { ...newValue }
              : newValue;
          sub.callback(newValue);
        }
      } catch (err) {
        console.error("[FSM] Subscriber error:", err);
      }
    }
  }
}

// ── Shallow equal helper ──

function shallowEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}
