// sacred-flow: Zeta-9 — TRIBUNAL = Sistema Nervoso do organismo
// Juízes holográficos decidem → flui para Atlas → Index → News
// Fluxo imutável OBRIGATÓRIO: Tribunal → Atlas → Index → News

import { useState, useCallback, useEffect } from 'react';
import type { TribunalVerdict, AgentStatus, AgentId } from '../../types';

// sacred-flow: EIs fixos do Tribunal — NUNCA mudar
const TRIBUNAL_JUDGES: AgentId[] = ['zeta-9', 'kronos', 'nanobanana'];

interface TribunalCoreProps {
  onVerdict?: (verdict: TribunalVerdict) => void;  // flows to Atlas
  isActive?: boolean;
}

export default function TribunalCore({ onVerdict, isActive = true }: TribunalCoreProps) {
  const [verdicts, setVerdicts] = useState<TribunalVerdict[]>([]);
  const [judgeStates, setJudgeStates] = useState<Map<AgentId, AgentStatus>>(
    new Map(TRIBUNAL_JUDGES.map(id => [id, {
      id,
      organ: 'tribunal',
      status: 'idle',
      currentTask: 'Aguardando tópico...',
      confidence: 0,
      lastUpdate: Date.now(),
      particleColor: '#FFB347', // morabeza gold
    }]))
  );

  // sacred-flow: processar tópico — 3 juízes analisam em paralelo
  const processVerdict = useCallback(async (topic: string): Promise<TribunalVerdict> => {
    // Activate all judges
    setJudgeStates(prev => {
      const next = new Map(prev);
      TRIBUNAL_JUDGES.forEach(id => {
        const current = next.get(id)!;
        next.set(id, { ...current, status: 'processing', currentTask: topic, lastUpdate: Date.now() });
      });
      return next;
    });

    // sacred-flow: simulate deliberation (replace with real AI calls)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    const verdict: TribunalVerdict = {
      id: `verdict-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      topic,
      judges: [...TRIBUNAL_JUDGES],
      verdict: Math.random() > 0.2 ? 'approved' : 'needs-review',
      confidence: 0.7 + Math.random() * 0.3,
      reasoning: `Tribunal analysis of "${topic}" by ${TRIBUNAL_JUDGES.join(', ')}`,
      timestamp: Date.now(),
      flowTarget: 'atlas', // sacred-flow: Tribunal → Atlas ALWAYS
    };

    // Reset judges to idle
    setJudgeStates(prev => {
      const next = new Map(prev);
      TRIBUNAL_JUDGES.forEach(id => {
        const current = next.get(id)!;
        next.set(id, { ...current, status: 'idle', currentTask: 'Deliberação completa', confidence: verdict.confidence, lastUpdate: Date.now() });
      });
      return next;
    });

    setVerdicts(prev => [verdict, ...prev].slice(0, 50)); // Keep last 50

    // sacred-flow: FLOW — verdict flies to Atlas
    onVerdict?.(verdict);

    return verdict;
  }, [onVerdict]);

  return {
    verdicts,
    judgeStates,
    processVerdict,
    judges: TRIBUNAL_JUDGES,
    isActive,
  };
}

// sacred-flow: export hook version for components
export function useTribunal(onVerdict?: (v: TribunalVerdict) => void) {
  return TribunalCore({ onVerdict });
}
