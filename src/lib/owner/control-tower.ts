/**
 * OWNER-CONTROL-LAYER-001
 * Minimum control tower — owner-only runtime controls.
 * Stored in localStorage under 'nxos_owner_controls'.
 *
 * Controls:
 *   - Fidelity override (force tier regardless of device detection)
 *   - Gate states (which pilot gates are open)
 *   - System flags (maintenance mode, feature flags)
 *   - Readiness snapshot (last ship-gate check)
 *
 * Browser-safe: no node imports.
 */

import { setFidelityOverride, clearFidelityOverride } from '@/lib/fidelity';
import type { FidelityTier } from '@/lib/fidelity';

const STORE_KEY = 'nxos_owner_controls';

export type GateId =
  | 'GATE_PILOT_OPEN'
  | 'GATE_V4_OPEN'
  | 'GATE_V5_OPEN'
  | 'GATE_V10_OPEN'
  | 'GATE_PLv6_b'
  | 'GATE_FVL_IMPL';

export interface GateState {
  id: GateId;
  open: boolean;
  ts_opened: string | null;
  note: string;
}

export interface SystemFlag {
  key: string;
  enabled: boolean;
  note: string;
}

export interface ReadinessSnapshot {
  ts_checked: string;
  p0_passed: number;
  p0_total: number;
  p1_passed: number;
  p1_total: number;
  notes: string;
}

export interface OwnerControls {
  fidelity_override: FidelityTier | null;
  gates: GateState[];
  flags: SystemFlag[];
  readiness: ReadinessSnapshot | null;
  ts_last_updated: string;
}

const DEFAULT_CONTROLS: OwnerControls = {
  fidelity_override: null,
  gates: [
    { id: 'GATE_PILOT_OPEN', open: false, ts_opened: null, note: 'Open when all P0 items pass' },
    { id: 'GATE_V4_OPEN', open: true, ts_opened: '2026-03-27', note: 'V4 unlocked by @codex score 0.91' },
    { id: 'GATE_V5_OPEN', open: false, ts_opened: null, note: 'Awaits V4 complete' },
    { id: 'GATE_V10_OPEN', open: false, ts_opened: null, note: 'Final V10 gate — all gaps closed' },
    { id: 'GATE_PLv6_b', open: true, ts_opened: '2026-03-28', note: 'Data layer gate opened' },
    { id: 'GATE_FVL_IMPL', open: true, ts_opened: '2026-03-28', note: 'Founder page implemented' },
  ],
  flags: [
    { key: 'maintenance_mode', enabled: false, note: 'Show maintenance banner' },
    { key: 'show_next_step_hint', enabled: true, note: 'Show route intelligence hints' },
    { key: 'enable_artifact_sync', enabled: false, note: 'Sync artifacts to Supabase' },
    { key: 'enable_pilot_access', enabled: false, note: 'Allow real users beyond owner' },
  ],
  readiness: null,
  ts_last_updated: new Date().toISOString(),
};

// ─── Storage ──────────────────────────────────────────────────────────────────

function load(): OwnerControls {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { ...DEFAULT_CONTROLS };
    const parsed = JSON.parse(raw) as Partial<OwnerControls>;
    // Merge with defaults to handle new fields added over time
    return {
      ...DEFAULT_CONTROLS,
      ...parsed,
      gates: parsed.gates ?? DEFAULT_CONTROLS.gates,
      flags: parsed.flags ?? DEFAULT_CONTROLS.flags,
    };
  } catch {
    return { ...DEFAULT_CONTROLS };
  }
}

function save(controls: OwnerControls): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      ...controls,
      ts_last_updated: new Date().toISOString(),
    }));
  } catch { /* ignore */ }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getControls(): OwnerControls {
  return load();
}

export function setFidelityTierOverride(tier: FidelityTier | null): void {
  const controls = load();
  controls.fidelity_override = tier;
  if (tier) {
    setFidelityOverride(tier);
  } else {
    clearFidelityOverride();
  }
  save(controls);
  window.dispatchEvent(new Event('nxos:fidelity-changed'));
}

export function openGate(gateId: GateId, note?: string): void {
  const controls = load();
  const gate = controls.gates.find(g => g.id === gateId);
  if (gate) {
    gate.open = true;
    gate.ts_opened = new Date().toISOString();
    if (note) gate.note = note;
  }
  save(controls);
}

export function closeGate(gateId: GateId): void {
  const controls = load();
  const gate = controls.gates.find(g => g.id === gateId);
  if (gate) {
    gate.open = false;
    gate.ts_opened = null;
  }
  save(controls);
}

export function isGateOpen(gateId: GateId): boolean {
  return load().gates.find(g => g.id === gateId)?.open ?? false;
}

export function setFlag(key: string, enabled: boolean): void {
  const controls = load();
  const flag = controls.flags.find(f => f.key === key);
  if (flag) {
    flag.enabled = enabled;
  } else {
    controls.flags.push({ key, enabled, note: '' });
  }
  save(controls);
}

export function getFlag(key: string): boolean {
  return load().flags.find(f => f.key === key)?.enabled ?? false;
}

export function recordReadinessSnapshot(snap: Omit<ReadinessSnapshot, 'ts_checked'>): void {
  const controls = load();
  controls.readiness = { ...snap, ts_checked: new Date().toISOString() };
  save(controls);
}

export function resetControls(): void {
  localStorage.removeItem(STORE_KEY);
  clearFidelityOverride();
}
