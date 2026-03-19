import { useNexusState } from "@/hooks/useNexusState";
import { useIndexOrgan } from "@/hooks/useIndexOrgan";

/**
 * Audit-safe Dev Inspector. 
 * Provides visibility into the shared session state and propagation path.
 */
export const NexusFlowInspector = () => {
  const { verdicts } = useNexusState();
  const { entries } = useIndexOrgan();

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-gold-500/30 p-4 rounded-lg font-mono text-[10px] w-64 max-h-96 overflow-y-auto shadow-2xl backdrop-blur-md">
      <div className="text-gold-500 font-bold mb-2 uppercase tracking-tighter border-b border-gold-500/20 pb-1 flex justify-between">
        <span>Nexus Flow Inspector</span>
        <span className="text-green-500">LIVE</span>
      </div>
      
      <div className="space-y-3">
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

        <div className="text-[8px] text-muted-foreground border-t border-white/5 pt-2 italic">
          Sacred Flow: Tribunal ➔ Atlas ➔ Index ➔ News
        </div>
      </div>
    </div>
  );
};
