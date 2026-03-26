/**
 * useProposalQueue — V5-AI-PROPOSALS-001
 *
 * Maintains a queue of auto-generated ParliamentProposals derived from
 * project data. The AICouncil can pull from this queue to pre-load
 * debates with real project context instead of hardcoded scripts.
 *
 * Data source: stub (static project data) until V5-INFRA-SUPABASE-001 unblocks.
 * isLive flag on each input signals whether the row came from Supabase or stub.
 *
 * CONSTRAINT: never surface isLive=true until real Supabase secrets are wired.
 */

import { useState, useCallback, useEffect } from "react";
import {
  generateProposal,
  getStubProposalInputs,
  fetchSupabaseProjects,
  type ProposalInput,
} from "@/lib/proposalGenerator";
import type { ParliamentProposal } from "@/components/nexus/AICouncil";

const QUEUE_STORAGE_KEY = "nexus:proposal-queue-seen";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function markSeen(id: string): void {
  try {
    const seen = readSeenIds();
    seen.add(id);
    // Keep last 50 seen ids
    const arr = [...seen].slice(-50);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(arr));
  } catch { /* quota — fail silently */ }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface ProposalQueueState {
  /** Proposals not yet seen by Parliament, in priority order */
  queue: ParliamentProposal[];
  /** Number of pending proposals */
  pendingCount: number;
  /** Whether data is from Supabase (false until V5-INFRA-SUPABASE-001) */
  isLive: boolean;
  /** Pull and remove the next proposal from the queue */
  dequeue: () => ParliamentProposal | null;
  /** Manually refresh the queue (e.g. after Supabase realtime event) */
  refresh: () => void;
}

export function useProposalQueue(): ProposalQueueState {
  const [queue, setQueue] = useState<ParliamentProposal[]>([]);
  const [isLive, setIsLive] = useState(false);

  const buildQueue = useCallback(async () => {
    // V5-INFRA-SUPABASE-001: try Supabase first, fall back to stubs
    let inputs: ProposalInput[] = await fetchSupabaseProjects();
    const fromLive = inputs.length > 0;
    if (!fromLive) {
      inputs = getStubProposalInputs();
    }
    setIsLive(fromLive);

    const seen = readSeenIds();
    const proposals = inputs
      .filter((input) => {
        const candidate = `auto-${input.projectId}`;
        return ![...seen].some((id) => id.startsWith(candidate));
      })
      .map(generateProposal)
      // Priority: CRÍTICO first, then ALTO, then MÉDIO, then BAIXO
      .sort((a, b) => {
        const order = { CRÍTICO: 0, ALTO: 1, MÉDIO: 2, BAIXO: 3 };
        return (order[a.impact.riskLevel] ?? 3) - (order[b.impact.riskLevel] ?? 3);
      });

    setQueue(proposals);
  }, []);

  // Build on mount
  useEffect(() => { buildQueue(); }, [buildQueue]);

  const dequeue = useCallback((): ParliamentProposal | null => {
    let result: ParliamentProposal | null = null;
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      result = prev[0];
      markSeen(result.id);
      return prev.slice(1);
    });
    return result;
  }, []);

  const refresh = useCallback(() => { buildQueue(); }, [buildQueue]);

  return {
    queue,
    pendingCount: queue.length,
    isLive,
    dequeue,
    refresh,
  };
}
