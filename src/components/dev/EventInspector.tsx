/**
 * EventInspector.tsx — Dev-only Nervous System observability panel
 *
 * Renders ONLY when import.meta.env.DEV === true.
 * Zero render in production — returns null at top of component.
 *
 * Shows:
 * - Live event stream (latest first, capped to visible window)
 * - Counts by type + source
 * - Filter controls (type / source)
 * - Clear button
 * - Replay button (re-publishes filtered entries into default bus)
 *
 * No external dependencies beyond what the app already has.
 */

import React, { useState } from 'react';
import { useEventLedger } from '@/hooks/useEventLedger';
import type { NexusEventType, Organ } from '@/types/sacred-flow';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_TYPES: NexusEventType[] = [
  'tribunal.verdict',
  'tribunal.escalation',
  'atlas.marker',
  'atlas.layer-update',
  'index.entry',
  'news.broadcast',
];

const ALL_SOURCES: Organ[] = ['tribunal', 'atlas', 'index', 'news', 'nexus'];

const TYPE_COLORS: Record<string, string> = {
  'tribunal.verdict':    '#f59e0b',
  'tribunal.escalation': '#ef4444',
  'atlas.marker':        '#06b6d4',
  'atlas.layer-update':  '#0891b2',
  'index.entry':         '#8b5cf6',
  'news.broadcast':      '#10b981',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span
      style={{
        background: color ?? '#334155',
        color: '#f8fafc',
        borderRadius: 4,
        padding: '1px 6px',
        fontSize: 11,
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '1px 0' }}>
      <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{label}</span>
      <span style={{ color: '#f8fafc', fontFamily: 'monospace', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

interface EventInspectorProps {
  /** Default open/closed. Default: false */
  defaultOpen?: boolean;
  /** Max events to show in the list. Default: 50 */
  maxVisible?: number;
}

export function EventInspector({ defaultOpen = false, maxVisible = 50 }: EventInspectorProps) {
  // Production guard — hard stop, no overhead
  if (!import.meta.env.DEV) return null;

  return <EventInspectorInner defaultOpen={defaultOpen} maxVisible={maxVisible} />;
}

function EventInspectorInner({ defaultOpen, maxVisible }: Required<EventInspectorProps>) {
  const [open, setOpen] = useState(defaultOpen);
  const [typeFilter, setTypeFilter] = useState<NexusEventType[]>([]);
  const [sourceFilter, setSourceFilter] = useState<Organ[]>([]);
  const [lastReplay, setLastReplay] = useState<number | null>(null);

  const { entries, stats, setFilter, clear, replay, isActive } = useEventLedger(200);

  // Sync ledger filter when local state changes
  React.useEffect(() => {
    setFilter({
      types: typeFilter.length > 0 ? typeFilter : undefined,
      sources: sourceFilter.length > 0 ? sourceFilter : undefined,
    });
  }, [typeFilter, sourceFilter, setFilter]);

  function toggleType(t: NexusEventType) {
    setTypeFilter((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function toggleSource(s: Organ) {
    setSourceFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function handleReplay() {
    const count = replay();
    setLastReplay(count);
    setTimeout(() => setLastReplay(null), 2000);
  }

  const visible = entries.slice(-maxVisible).reverse();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        fontFamily: 'monospace',
        fontSize: 12,
        userSelect: 'none',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: 6,
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '4px 10px',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginLeft: 'auto',
          marginBottom: open ? 4 : 0,
        }}
      >
        <span style={{ color: isActive ? '#10b981' : '#ef4444' }}>●</span>
        <span>NX Ledger</span>
        <Badge label={String(stats.total)} color="#1e3a5f" />
        {stats.evicted > 0 && <Badge label={`-${stats.evicted}`} color="#7f1d1d" />}
      </button>

      {open && (
        <div
          style={{
            background: '#0f172a',
            border: '1px solid #1e40af',
            borderRadius: 8,
            width: 420,
            maxHeight: 520,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>
              Nervous System — Event Ledger
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleReplay}
                style={{
                  background: '#1e3a5f',
                  border: '1px solid #1d4ed8',
                  borderRadius: 4,
                  color: '#93c5fd',
                  cursor: 'pointer',
                  padding: '2px 8px',
                  fontSize: 11,
                }}
              >
                {lastReplay !== null ? `↺ ${lastReplay} accepted` : '↺ Replay'}
              </button>
              <button
                onClick={clear}
                style={{
                  background: '#1e1e2e',
                  border: '1px solid #334155',
                  borderRadius: 4,
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '2px 8px',
                  fontSize: 11,
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ padding: '6px 12px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} style={{ fontSize: 11 }}>
                  <span style={{ color: TYPE_COLORS[type] ?? '#94a3b8' }}>{type.split('.')[1]}</span>
                  <span style={{ color: '#f8fafc', marginLeft: 4, fontWeight: 600 }}>{count}</span>
                </div>
              ))}
              {Object.keys(stats.byType).length === 0 && (
                <span style={{ color: '#475569', fontSize: 11 }}>no events yet</span>
              )}
            </div>
          </div>

          {/* Filters */}
          <div
            style={{
              padding: '6px 12px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ color: '#475569', fontSize: 10, marginBottom: 2 }}>FILTER BY TYPE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {ALL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  style={{
                    background: typeFilter.includes(t) ? (TYPE_COLORS[t] ?? '#334155') : '#1e293b',
                    border: `1px solid ${typeFilter.includes(t) ? (TYPE_COLORS[t] ?? '#334155') : '#334155'}`,
                    borderRadius: 4,
                    color: typeFilter.includes(t) ? '#0f172a' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '1px 6px',
                    fontSize: 10,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ color: '#475569', fontSize: 10, marginBottom: 2, marginTop: 2 }}>FILTER BY SOURCE</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {ALL_SOURCES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSource(s)}
                  style={{
                    background: sourceFilter.includes(s) ? '#1d4ed8' : '#1e293b',
                    border: `1px solid ${sourceFilter.includes(s) ? '#3b82f6' : '#334155'}`,
                    borderRadius: 4,
                    color: sourceFilter.includes(s) ? '#eff6ff' : '#94a3b8',
                    cursor: 'pointer',
                    padding: '1px 6px',
                    fontSize: 10,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Event list */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {visible.length === 0 && (
              <div style={{ color: '#334155', padding: '12px', textAlign: 'center', fontSize: 11 }}>
                No events recorded.{' '}
                {(typeFilter.length > 0 || sourceFilter.length > 0) && 'Try clearing filters.'}
              </div>
            )}
            {visible.map((entry) => (
              <div
                key={`${entry.event.id}-${entry.seq}`}
                style={{
                  padding: '4px 12px',
                  borderBottom: '1px solid #0f172a',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                }}
              >
                <span style={{ color: '#334155', fontSize: 10, paddingTop: 1, minWidth: 24 }}>
                  {entry.seq}
                </span>
                <span
                  style={{
                    color: TYPE_COLORS[entry.event.type] ?? '#94a3b8',
                    minWidth: 120,
                    fontSize: 11,
                  }}
                >
                  {entry.event.type}
                </span>
                <span style={{ color: '#475569', minWidth: 60, fontSize: 11 }}>
                  [{entry.event.source}]
                </span>
                <span
                  style={{
                    color: '#64748b',
                    fontSize: 10,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                  title={entry.event.id}
                >
                  {entry.event.id}
                </span>
                <span style={{ color: '#1e3a5f', fontSize: 10, paddingTop: 1 }}>
                  {new Date(entry.recordedAt).toISOString().slice(11, 23)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '4px 12px',
              borderTop: '1px solid #1e293b',
              color: '#334155',
              fontSize: 10,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>capacity: {stats.capacity}</span>
            <span>evicted: {stats.evicted}</span>
            <span>showing: {visible.length} / {stats.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
