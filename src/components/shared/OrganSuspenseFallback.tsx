// sacred-flow: antigravity — OrganSuspenseFallback
// Loading state for lazy-loaded organs with gold morabeza pulse

const OrganSuspenseFallback = ({ organName }: { organName: string }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      background: '#0a0a0f',
      fontFamily: 'monospace',
    }}
  >
    {/* Pulse circle */}
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #FFB347 0%, transparent 70%)',
        animation: 'organPulse 1.5s ease-in-out infinite',
        marginBottom: '1.5rem',
      }}
    />
    {/* Organ name */}
    <span
      style={{
        fontSize: '0.7rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#FFB347',
        marginBottom: '0.5rem',
      }}
    >
      {organName}
    </span>
    {/* Status text */}
    <span
      style={{
        fontSize: '0.5rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#666',
      }}
    >
      Initializing...
    </span>
    {/* Keyframes injected inline */}
    <style>{`
      @keyframes organPulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.3); opacity: 1; }
      }
    `}</style>
  </div>
);

export default OrganSuspenseFallback;
