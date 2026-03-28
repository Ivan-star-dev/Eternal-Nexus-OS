/**
 * ControlTower.tsx
 * Owner-only runtime control panel — minimum viable version.
 * Accessible only when authenticated as owner.
 * Fixed bottom-right, collapsed by default.
 *
 * Canon: GAP-CLOSURE-V10-001 · Gap 17 (Owner Control Layer)
 * @claude | 2026-03-28
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getControls,
  setFidelityTierOverride,
  openGate,
  closeGate,
  setFlag,
} from '@/lib/owner/control-tower';
import type { OwnerControls, GateId } from '@/lib/owner/control-tower';
import type { FidelityTier } from '@/lib/fidelity';
import { nexusRuntime } from '@/lib/core/runtime';
import { getPilotMetrics } from '@/lib/instrumentation/event-logger';
import { getSystemHealthSummary } from '@/lib/governance/scoring';
import type { SystemHealthSummary, ScoreGrade } from '@/lib/governance/scoring';
import { getReturnMetrics } from '@/lib/spawn/returnTracker';
import type { ReturnMetrics } from '@/lib/spawn/returnTracker';

const EASE = [0.22, 1, 0.36, 1] as const;
const FIDELITY_TIERS: FidelityTier[] = ['ultra', 'high', 'balanced', 'light'];

const SCORE_ROWS: { key: keyof SystemHealthSummary['scores']; label: string }[] = [
  { key: 'continuity',    label: 'Continuity' },
  { key: 'calm',         label: 'Calm' },
  { key: 'identity',     label: 'Identity' },
  { key: 'adaptation',   label: 'Adaptation' },
  { key: 'return_quality', label: 'Return' },
  { key: 'artifact',     label: 'Artifact' },
  { key: 'clarity',      label: 'Clarity' },
  { key: 'friction',     label: 'Friction ↓' },
];

function gradeColor(g: ScoreGrade): string {
  const map: Record<ScoreGrade, string> = {
    S: '#d4af37', A: '#00e5a0', B: '#4db8ff',
    C: '#ffd966', D: '#ff9933', F: '#ff5555',
  };
  return map[g];
}

export default function ControlTower() {
  const [open, setOpen] = useState(false);
  const [controls, setControls] = useState<OwnerControls>(() => getControls());
  const [health, setHealth] = useState<SystemHealthSummary | null>(null);
  const [wedge, setWedge] = useState<ReturnMetrics | null>(null);

  // Reload controls + health scores when panel opens
  useEffect(() => {
    if (!open) return;
    setControls(getControls());
    try {
      const state = nexusRuntime.getState();
      const metrics = getPilotMetrics();
      setHealth(getSystemHealthSummary(state, metrics));
    } catch {
      // scoring is read-only; silently skip if runtime not ready
    }
    setWedge(getReturnMetrics());
  }, [open]);

  const handleFidelityChange = (tier: FidelityTier | null) => {
    setFidelityTierOverride(tier);
    setControls(getControls());
  };

  const handleGateToggle = (gateId: GateId, currentlyOpen: boolean) => {
    if (currentlyOpen) closeGate(gateId);
    else openGate(gateId);
    setControls(getControls());
  };

  const handleFlagToggle = (key: string, current: boolean) => {
    setFlag(key, !current);
    setControls(getControls());
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Owner Control Tower"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: open ? 'rgba(212,175,55,0.15)' : 'rgba(10,10,26,0.85)',
          border: `1px solid ${open ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.2)'}`,
          color: 'rgba(212,175,55,0.8)',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        ⊕
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              position: 'absolute',
              bottom: '52px',
              right: 0,
              width: '280px',
              background: 'rgba(6,8,16,0.96)',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '14px',
              padding: '20px',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 16px 48px -8px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Header */}
            <div>
              <span style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.5)' }}>
                Owner · Control Tower
              </span>
              <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.25), transparent)', marginTop: '8px' }} />
            </div>

            {/* Fidelity */}
            <Section label="Fidelity Tier">
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {([null, ...FIDELITY_TIERS] as (FidelityTier | null)[]).map(tier => {
                  const active = controls.fidelity_override === tier;
                  return (
                    <button
                      key={tier ?? 'auto'}
                      onClick={() => handleFidelityChange(tier)}
                      style={{
                        fontSize: '9px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: active ? 'rgba(212,175,55,0.15)' : 'transparent',
                        border: `1px solid ${active ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.1)'}`,
                        color: active ? 'rgba(212,175,55,0.9)' : 'rgba(180,165,120,0.5)',
                        cursor: 'pointer',
                      }}
                    >
                      {tier ?? 'auto'}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Gates */}
            <Section label="Gates">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {controls.gates.map(gate => (
                  <div
                    key={gate.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
                  >
                    <span style={{ fontSize: '9px', color: 'rgba(170,185,200,0.6)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {gate.id.replace('GATE_', '')}
                    </span>
                    <Toggle active={gate.open} onToggle={() => handleGateToggle(gate.id as GateId, gate.open)} />
                  </div>
                ))}
              </div>
            </Section>

            {/* Flags */}
            <Section label="Flags">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {controls.flags.map(flag => (
                  <div
                    key={flag.key}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
                  >
                    <span style={{ fontSize: '9px', color: 'rgba(170,185,200,0.6)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {flag.key}
                    </span>
                    <Toggle active={flag.enabled} onToggle={() => handleFlagToggle(flag.key, flag.enabled)} />
                  </div>
                ))}
              </div>
            </Section>

            {/* Readiness */}
            {controls.readiness && (
              <Section label="Last Readiness Check">
                <div style={{ fontSize: '9px', color: 'rgba(150,175,195,0.5)', lineHeight: 1.6 }}>
                  <div>P0: {controls.readiness.p0_passed}/{controls.readiness.p0_total}</div>
                  <div>P1: {controls.readiness.p1_passed}/{controls.readiness.p1_total}</div>
                  <div>{new Date(controls.readiness.ts_checked).toLocaleDateString()}</div>
                </div>
              </Section>
            )}

            {/* Wedge Gate Metrics */}
            {wedge ? (
              <Section label={`Wedge Gate · ${wedge.wedge_signal.toUpperCase()}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    ['Visits',         String(wedge.visit_count)],
                    ['Returns',        String(wedge.return_count)],
                    ['48h Return',     wedge.returned_within_48h ? '✓ YES' : '— no'],
                    ['Since First',    `${wedge.hours_since_first}h`],
                    ['Since Last',     `${wedge.hours_since_last}h`],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', color: 'rgba(170,185,200,0.55)' }}>{label}</span>
                      <span style={{ fontSize: '9px', color: wedge.returned_within_48h && label === '48h Return' ? '#00e5a0' : 'rgba(200,218,235,0.75)', fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '8px', marginTop: '4px', color: wedge.wedge_signal === 'strong' ? '#00e5a0' : wedge.wedge_signal === 'weak' ? '#ffd966' : 'rgba(255,100,100,0.7)', letterSpacing: '0.15em' }}>
                  {wedge.wedge_signal === 'strong' ? '✓ WEDGE PROVEN' : wedge.wedge_signal === 'weak' ? '↑ BUILDING SIGNAL' : '○ NO SIGNAL YET'}
                </div>
              </Section>
            ) : (
              <Section label="Wedge Gate">
                <span style={{ fontSize: '9px', color: 'rgba(150,170,190,0.4)' }}>No lab visits recorded</span>
              </Section>
            )}

            {/* System Health Scores */}
            {health && (
              <Section label={`System Health · ${health.overall_grade}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {SCORE_ROWS.map(({ key, label }) => {
                    const s = health.scores[key];
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '9px', color: 'rgba(170,185,200,0.55)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {label}
                        </span>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: gradeColor(s.grade), minWidth: '10px', textAlign: 'right' }}>
                          {s.grade}
                        </span>
                        <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
                          <div style={{ height: '100%', width: `${Math.round(s.value * 100)}%`, background: gradeColor(s.grade), borderRadius: '2px', transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {health.pilot_ready ? (
                  <div style={{ fontSize: '8px', color: '#00e5a0', marginTop: '6px', letterSpacing: '0.2em' }}>
                    ✓ PILOT READY
                  </div>
                ) : health.blocking_issues.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '6px' }}>
                    {health.blocking_issues.map((issue, i) => (
                      <div key={i} style={{ fontSize: '8px', color: 'rgba(255,100,100,0.8)', lineHeight: 1.4 }}>
                        ⚠ {issue}
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.35)' }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '32px',
        height: '16px',
        borderRadius: '8px',
        background: active ? 'rgba(0,229,160,0.3)' : 'rgba(100,115,130,0.2)',
        border: `1px solid ${active ? 'rgba(0,229,160,0.4)' : 'rgba(120,140,160,0.2)'}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: '2px',
        left: active ? '16px' : '2px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: active ? '#00e5a0' : 'rgba(150,170,190,0.4)',
        transition: 'left 0.2s, background 0.2s',
      }} />
    </button>
  );
}
