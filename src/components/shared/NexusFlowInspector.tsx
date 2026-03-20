import { useNexusState } from "@/hooks/useNexusState";
import { useIndexOrgan } from "@/hooks/useIndexOrgan";
import { getSacredFlowOrgans, WORKSPACE } from "@/config/workspace";

/**
 * Audit-safe Dev Inspector.
 * Provides visibility into the shared session state and propagation path.
 * PLv1: exposes canonical workspace config (sacred flow + product layer).
 */
export const NexusFlowInspector = () => {
  if (import.meta.env.PROD) return null;

  const { verdicts } = useNexusState();
  const { entries } = useIndexOrgan();
  const sacredFlowOrgans = getSacredFlowOrgans();

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-gold-500/30 p-4 rounded-lg font-mono text-[10px] w-64 max-h-96 overflow-y-auto shadow-2xl backdrop-blur-md">
      <div className="text-gold-500 font-bold mb-2 uppercase tracking-tighter border-b border-gold-500/20 pb-1 flex justify-between">
        <span>Nexus Flow Inspector</span>
        <span className="text-green-500">LIVE</span>
      </div>

      <div className="space-y-3">
        {/* Workspace config — PLv1 */}
        <div>
          <div className="text-muted-foreground mb-1">WORKSPACE CONFIG</div>
          <div className="flex gap-1 flex-wrap">
            {sacredFlowOrgans.map((organ, i) => (
              <span key={organ.id} className="flex items-center gap-0.5">
                <span
                  className="px-1 py-0.5 rounded text-[8px] font-bold"
                  style={{ color: organ.color, border: `1px solid ${organ.color}40` }}
                >
                  {organ.label}
                </span>
                {i < sacredFlowOrgans.length - 1 && (
                  <span className="text-muted-foreground/50">→</span>
                )}
              </span>
            ))}
          </div>
          <div className="text-[8px] text-muted-foreground mt-1">
            {WORKSPACE.name} · {WORKSPACE.productLayer}
          </div>
        </div>

        <div>
          <div className="text-muted-foreground mb-1 flex justify-between">
            <span>TRIBUNAL VERDICTS</span>
            <span className="bg-gold-500/10 px-1 rounded">{verdicts.length}</span>
          </div>
          <ul className="space-y-1">
            {verdicts.slice(0, 3).map(v => (
              <li key={v.id} className="text-[9px] border-l border-gold-500/50 pl-2 py-0.5">
                <div className="truncate text-foreground">{v.topic}</div>
                <div className="text-gold-500/70 capitalize">{v.verdict} ({Math.round(v.confidence * 100)}%)</div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-muted-foreground mb-1 flex justify-between">
            <span>INDEX ENTRIES</span>
            <span className="bg-blue-500/10 px-1 rounded">{entries.length}</span>
          </div>
          <ul className="space-y-1">
            {entries.slice(0, 3).map(e => (
              <li key={e.id} className="text-[9px] border-l border-blue-500/50 pl-2 py-0.5">
                <div className="truncate text-foreground">{e.title}</div>
                <div className="text-blue-500/70 uppercase">{e.category} | SEV: {e.severity.toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
