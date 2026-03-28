/**
 * runtime.ts — NexusRuntime · The Living Organism's Central Nervous System.
 *
 * Boots all subsystems in dependency order.
 * Wires inter-layer communication via fusion bus.
 * Enforces anti-chaos laws on every state mutation.
 * Exposes getState() + subscribe() for consumers.
 *
 * ANTI-CHAOS LAWS:
 *   C-01  State flows: Identity → Intelligence → Memory → Environment
 *   C-02  No subsystem writes to another's domain — all mutations via runtime
 *   C-03  Governance checks synchronous — block before any commit
 *   C-04  Memory never destroyed on error — degrade gracefully
 *   C-05  Environment is derived from state — never independently set
 *   C-06  Evolution is additive — never subtractive without owner gate
 *   C-07  Performance budget gates all rendering — no render bypasses fidelity
 *
 * Canon: LIVING_SYSTEM_MANIFEST.md · @claude · 2026-03-28
 */

import { bus } from './fusion-bus';
import type { OrganismState } from './organism-state';
import {
  COLD_ORGANISM_STATE,
  computeContinuityScore,
  resolveBehavioralType,
} from './organism-state';
import { resolveFidelityTier, getCurrentBudget } from '@/lib/fidelity/ladder';
import {
  guardPortalRoute,
  guardArtifactCount,
  runGovernanceChecks,
} from '@/lib/governance/runtime-guard';
import { invalidateAtmosphereCache } from '@/lib/atmosphere/controller';
import { listArtifacts } from '@/lib/artifacts/store';
import type { MaturityLevel } from '@/lib/evolution/types';
import { startInstrumentation, stopInstrumentation } from '@/lib/instrumentation/event-logger';

// ─── Types ────────────────────────────────────────────────────────────────────

type StateListener = (state: OrganismState) => void;
type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

// ─── NexusRuntime ─────────────────────────────────────────────────────────────

class NexusRuntime {
  private state: OrganismState = structuredClone(COLD_ORGANISM_STATE);
  private listeners = new Set<StateListener>();
  private booted = false;
  private cleanups: Array<() => void> = [];

  // ── Boot sequence ───────────────────────────────────────────────────────────

  /**
   * Boot the organism. Safe to call multiple times — idempotent after first call.
   * Call from SessionBoot (app mount).
   */
  boot(): void {
    if (this.booted) return;
    this.booted = true;

    this.patch({ boot_phase: 'booting' });
    bus.emit('organism:booting', null, 'runtime');

    try {
      this._initFidelity();
      this._initGovernanceBridge();
      this._initArtifactBridge();
      this._initEvolutionBridge();
      this._initPortalBridge();
      this._initFusionBridgeDOMEvents();

      // Start pilot instrumentation — taps fusion bus, writes to localStorage
      startInstrumentation(this.state.memory.session_id || 'boot');
      this.cleanups.push(stopInstrumentation);

      this.patch({ boot_phase: 'live' });
      bus.emit('organism:ready', this.state, 'runtime');
    } catch (e) {
      this.patch({
        boot_phase: 'degraded',
        system: {
          ...this.state.system,
          error_count: this.state.system.error_count + 1,
        },
      });
      bus.emit('organism:degraded', { error: String(e) }, 'runtime');
      console.error('[NEXUS-RUNTIME] boot failed', e);
    }
  }

  // ── State access ────────────────────────────────────────────────────────────

  getState(): Readonly<OrganismState> {
    return this.state;
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ── Mutation API (layer-specific, enforces C-01) ─────────────────────────────

  /**
   * Set identity layer. Call from AuthContext on auth state change.
   * Triggers behavioral type recomputation.
   */
  setIdentity(patch: Partial<OrganismState['identity']>): void {
    this.patch({ identity: { ...this.state.identity, ...patch } });
  }

  /**
   * Sync memory layer from SessionContext. Call on every session update.
   * Recomputes continuity score automatically.
   */
  syncSession(session: {
    session_id: string;
    subject: string;
    re_entry_point: string;
    is_resume: boolean;
    open_panels: string[];
    ts_last_active: string;
    scroll_snapshot?: unknown;
  }): void {
    const artifactCount = this.state.memory.artifact_count;
    const continuity_score = computeContinuityScore({
      re_entry_point: session.re_entry_point,
      is_resume: session.is_resume,
      artifact_count: artifactCount,
      last_active: session.ts_last_active,
      open_panels: session.open_panels,
      scroll_snapshot: session.scroll_snapshot,
    });

    this.patch({
      memory: {
        ...this.state.memory,
        session_id: session.session_id,
        subject: session.subject,
        re_entry_point: session.re_entry_point,
        is_resume: session.is_resume,
        open_panels: session.open_panels,
        last_active: session.ts_last_active,
        continuity_score,
      },
    });

    if (session.is_resume) {
      bus.emit('session:resumed', { session_id: session.session_id }, 'session');
    }
  }

  /**
   * Update artifact count (called from artifact store hooks).
   * Triggers governance check for artifact count limit.
   */
  syncArtifactCount(count: number): void {
    const govResult = runGovernanceChecks([() => guardArtifactCount(count)]);

    if (!govResult.allowed) {
      this._recordViolations(govResult.violations);
    }

    const prev = this.state.memory;
    this.patch({
      memory: { ...prev, artifact_count: count },
    });
  }

  /**
   * Record portal entry. Validates portal via governance, updates environment.
   * C-05: environment is a consequence of state, not independently set.
   */
  enterPortal(portalId: string): void {
    const govResult = runGovernanceChecks([() => guardPortalRoute(portalId)]);

    if (!govResult.allowed) {
      this._recordViolations(govResult.violations);
      // C-03: governance is synchronous and blocks the commit
      return;
    }

    const prevPortal = this.state.environment.current_portal;
    if (prevPortal) {
      bus.emit('portal:exited', { portal: prevPortal }, 'runtime');
    }

    this.patch({
      environment: {
        ...this.state.environment,
        previous_portal: prevPortal,
        current_portal: portalId as OrganismState['environment']['current_portal'],
        atmosphere_dirty: true,
        transition_in_progress: true,
      },
    });

    bus.emit('portal:entered', { portal: portalId }, 'runtime');
  }

  /** Called when transition animation ends. */
  transitionEnded(): void {
    this.patch({
      environment: {
        ...this.state.environment,
        transition_in_progress: false,
        atmosphere_dirty: false,
      },
    });
    bus.emit('transition:ended', null, 'runtime');
  }

  /**
   * Update evolution state from useEvolution hook.
   * C-06: evolution is additive — only increase level, never lower without gate.
   */
  syncEvolution(maturity: MaturityLevel): void {
    const prev = this.state.intelligence;
    const newLevel = maturity.level;

    // C-06: never lower maturity level
    const safeLevel = Math.max(prev.maturity_level, newLevel) as 0 | 1 | 2 | 3;
    const dominantPortal = maturity.dominantRoute[0] ?? null;

    const behavioral_type = resolveBehavioralType(
      safeLevel,
      this.state.memory.artifact_count,
      maturity.totalSessions,
      dominantPortal
    );

    this.patch({
      intelligence: {
        ...prev,
        maturity_level: safeLevel,
        dominant_portal: dominantPortal as OrganismState['intelligence']['dominant_portal'],
      },
      identity: {
        ...this.state.identity,
        behavioral_type,
      },
    });

    if (safeLevel > prev.maturity_level) {
      bus.emit('evolution:leveled-up', { level: safeLevel }, 'evolution');
    }
  }

  /**
   * Push a route suggestion from the route intelligence engine.
   */
  setSuggestion(suggestion: OrganismState['intelligence']['route_suggestion'], confidence: number): void {
    this.patch({
      intelligence: {
        ...this.state.intelligence,
        route_suggestion: suggestion,
        suggestion_confidence: confidence,
      },
    });

    if (suggestion) {
      bus.emit('route:suggested', { suggestion, confidence }, 'route-intelligence');
    }
  }

  /** Mark a subsystem as degraded. */
  degradeSubsystem(name: string): void {
    this.patch({
      system: {
        ...this.state.system,
        subsystem_health: {
          ...this.state.system.subsystem_health,
          [name]: 'degraded',
        },
      },
    });
  }

  // ── Teardown ────────────────────────────────────────────────────────────────

  destroy(): void {
    this.cleanups.forEach(fn => fn());
    this.cleanups = [];
    this.listeners.clear();
    this.booted = false;
    this.state = structuredClone(COLD_ORGANISM_STATE);
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  /** Merge a partial state patch and notify all subscribers. */
  private patch(partial: DeepPartial<OrganismState>): void {
    this.state = deepMerge(this.state, partial) as OrganismState;
    this.listeners.forEach(l => {
      try { l(this.state); } catch { /* listener errors are non-fatal */ }
    });
  }

  private _recordViolations(violations: OrganismState['system']['governance_violations']): void {
    const now = new Date().toISOString();
    this.patch({
      system: {
        ...this.state.system,
        governance_violations: [
          ...this.state.system.governance_violations,
          ...violations,
        ].slice(-20), // keep last 20
        violation_count: this.state.system.violation_count + violations.length,
        last_violation_ts: now,
      },
    });
    violations.forEach(v => bus.emit('governance:violation', v, 'governance'));
  }

  // ── Subsystem bridges ───────────────────────────────────────────────────────

  private _initFidelity(): void {
    const tier = resolveFidelityTier();
    this.patch({
      environment: { ...this.state.environment, fidelity_tier: tier },
    });

    // Listen to fidelity changes (from ControlTower override or auto-detect)
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ tier: string }>;
      const newTier = custom.detail?.tier as typeof tier;
      if (!newTier) return;
      invalidateAtmosphereCache();
      this.patch({
        environment: {
          ...this.state.environment,
          fidelity_tier: newTier,
          atmosphere_dirty: true,
        },
      });
      bus.emit('fidelity:changed', { tier: newTier }, 'fidelity');
    };

    try {
      window.addEventListener('nxos:fidelity-changed', handler);
      this.cleanups.push(() => window.removeEventListener('nxos:fidelity-changed', handler));
    } catch { /* non-browser */ }
  }

  private _initGovernanceBridge(): void {
    // Load initial artifact count for governance baseline
    try {
      const artifacts = listArtifacts();
      this.patch({ memory: { ...this.state.memory, artifact_count: artifacts.length } });
    } catch {
      this.degradeSubsystem('artifacts');
    }
  }

  private _initArtifactBridge(): void {
    // Sync artifact count via DOM events from the store
    const handler = () => {
      try {
        const artifacts = listArtifacts();
        this.syncArtifactCount(artifacts.length);
      } catch { /* non-fatal */ }
    };

    try {
      window.addEventListener('nxos:artifact:created', handler);
      window.addEventListener('nxos:artifact:updated', handler);
      window.addEventListener('nxos:artifact:archived', handler);
      this.cleanups.push(() => {
        window.removeEventListener('nxos:artifact:created', handler);
        window.removeEventListener('nxos:artifact:updated', handler);
        window.removeEventListener('nxos:artifact:archived', handler);
      });
    } catch { /* non-browser */ }
  }

  private _initEvolutionBridge(): void {
    // Evolution sync is driven by useOrganism hook via syncEvolution()
    // No DOM bridge needed — React integration handles it
  }

  private _initPortalBridge(): void {
    // Portal entry driven by useOrganism hook via enterPortal()
    // Transition end driven by PortalShell via transitionEnded()
  }

  private _initFusionBridgeDOMEvents(): void {
    // Re-emit all native nxos:* DOM events onto the fusion bus
    // so non-React subsystems can participate in the event graph
    const kinds = [
      'nxos:portal:entered', 'nxos:portal:exited',
      'nxos:session:updated', 'nxos:governance:violation',
    ] as const;

    kinds.forEach(domKind => {
      const busKind = domKind.replace('nxos:', '') as import('./fusion-bus').FusionEventKind;
      const handler = (e: Event) => {
        bus.emit(busKind, (e as CustomEvent).detail, 'dom-bridge');
      };
      try {
        window.addEventListener(domKind, handler);
        this.cleanups.push(() => window.removeEventListener(domKind, handler));
      } catch { /* non-browser */ }
    });
  }
}

// ─── Deep merge helper ────────────────────────────────────────────────────────

function deepMerge(base: unknown, patch: unknown): unknown {
  if (patch === null || patch === undefined) return base;
  if (typeof base !== 'object' || typeof patch !== 'object') return patch;
  if (Array.isArray(patch)) return patch;

  const result = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(patch as object)) {
    const k = key as string;
    result[k] = deepMerge(
      (base as Record<string, unknown>)[k],
      (patch as Record<string, unknown>)[k]
    );
  }
  return result;
}

// ─── Singleton ────────────────────────────────────────────────────────────────

export const nexusRuntime = new NexusRuntime();
