import { useNexusState } from "@/hooks/useNexusState";
import { useIndexOrgan } from "@/hooks/useIndexOrgan";
import { getSacredFlowOrgans, WORKSPACE } from "@/config/workspace";
import { useSession } from "@/contexts/SessionContext";

/**
 * Audit-safe Dev Inspector.
 * Provides visibility into the shared session state and propagation path.
 * PLv1: exposes canonical workspace config (sacred flow + product layer).
 */
const FACE_COLOR: Record<string, string> = {
  heaven_lab:  '#22ffaa',
  bridge_nova: '#4a90e2',
  nexus_cria:  '#D4AF37',
};

export const NexusFlowInspector = () => {
  const { verdicts } = useNexusState();
  const { entries } = useIndexOrgan();
  const sacredFlowOrgans = getSacredFlowOrgans();
  const { session } = useSession();

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-gold-500/30 p-4 rounded-lg font-mono text-[10px] w-64 max-h-96 overflow-y-auto shadow-2xl backdrop-blur-md">
      <div className="text-gold-500 font-bold mb-2 uppercase tracking-tighter border-b border-gold-500/20 pb-1 flex justify-between">
        <span>Nexus Flow Inspector</span>
        <span className="text-green-500">LIVE</span>
      </div>

      <div className="space-y-3">
        {/* SESSION STATE — SESSION-AWARE-PRODUCT-INTEGRATION-001 */}
        <div>
          <div className="text-muted-foreground mb-1 flex justify-between">
            <span>SESSION</span>
            <span className={session?.is_resume ? 'text-green-400' : 'text-yellow-400'}>
              {session ? (session.is_resume ? 'RESUME' : 'LIVE') : 'COLD'}
            </span>
          </div>
          {session ? (
            <div className="space-y-0.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">face</span>
                <span
                  className="font-bold text-[9px]"
                  style={{ color: FACE_COLOR[session.active_face] ?? '#fff' }}
                >
                  {session.active_face}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground shrink-0">next</span>
                <span className="truncate text-[9px] text-right" title={session.next_expected_step}>
                  {session.next_expected_step || '—'}
                </span>
              </div>
              {session.re_entry_point && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">reentry</span>
                  <span className="truncate text-[9px] text-right text-green-400" title={session.re_entry_point}>
                    {session.re_entry_point}
                  </span>
                </div>
              )}
              {session.latest_fruit && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">fruit</span>
                  <span className="truncate text-[9px] text-right text-yellow-400" title={session.latest_fruit}>
                    {session.latest_fruit}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-[9px] text-muted-foreground italic">No active session</div>
          )}
        </div>

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
