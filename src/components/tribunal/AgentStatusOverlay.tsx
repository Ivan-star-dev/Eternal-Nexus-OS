// sacred-flow: NanoBanana — Agent Status Overlay UI
// Mostra estado de TODOS os EIs em tempo real — organismo visível
// Apple-quality glass morphism + morabeza glow

import type { AgentId, AgentStatus, OrganType } from '../../types';

interface AgentStatusOverlayProps {
  agents: Map<AgentId, AgentStatus>;
  visible?: boolean;
}

const ORGAN_LABELS: Record<OrganType, string> = {
  nexus: '🧠 Nexus — Cérebro',
  atlas: '❤️ Atlas — Coração',
  index: '👁️ Index — Rosto',
  tribunal: '⚡ Tribunal — Nervoso',
  news: '📢 News — Boca',
};

const STATUS_COLORS: Record<AgentStatus['status'], string> = {
  active: '#4ECDC4',
  processing: '#FFB347',
  idle: '#666666',
  error: '#FF6B6B',
};

export default function AgentStatusOverlay({ agents, visible = true }: AgentStatusOverlayProps) {
  if (!visible) return null;

  // Group agents by organ
  const byOrgan = new Map<OrganType, [AgentId, AgentStatus][]>();
  agents.forEach((status, id) => {
    const list = byOrgan.get(status.organ) || [];
    list.push([id, status]);
    byOrgan.set(status.organ, list);
  });

  return (
    <div
      className="fixed top-4 right-4 z-50 pointer-events-auto"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 179, 71, 0.3)', // morabeza border
        padding: '16px',
        minWidth: '280px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#ffffff',
      }}
    >
      {/* sacred-flow: header */}
      <div style={{ 
        fontSize: '11px', 
        fontWeight: 700, 
        letterSpacing: '2px',
        color: '#FFB347',
        marginBottom: '12px',
        textTransform: 'uppercase',
      }}>
        ● ETERNAL NEXUS — LIVE
      </div>

      {/* sacred-flow: agents by organ */}
      {Array.from(byOrgan.entries()).map(([organ, agentList]) => (
        <div key={organ} style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>
            {ORGAN_LABELS[organ]}
          </div>
          {agentList.map(([id, status]) => (
            <div key={id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 0',
            }}>
              {/* Status dot */}
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: STATUS_COLORS[status.status],
                boxShadow: status.status === 'processing' 
                  ? `0 0 8px ${STATUS_COLORS[status.status]}` 
                  : 'none',
                animation: status.status === 'processing' ? 'pulse 1.5s infinite' : 'none',
              }} />
              {/* Agent name */}
              <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '90px' }}>
                {id}
              </span>
              {/* Task */}
              <span style={{ 
                fontSize: '10px', 
                color: '#aaa', 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '140px',
              }}>
                {status.currentTask}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* sacred-flow: flow indicator */}
      <div style={{
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255, 179, 71, 0.2)',
        fontSize: '9px',
        color: '#FFB347',
        textAlign: 'center',
        letterSpacing: '1px',
      }}>
        TRIBUNAL → ATLAS → INDEX → NEWS
      </div>
    </div>
  );
}
