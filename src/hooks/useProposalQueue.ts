/**
 * useProposalQueue — V6-COUNCIL-LIVE-001 (upgraded from V5-AI-PROPOSALS-001)
 *
 * Maintains a queue of auto-generated ParliamentProposals from globe_projects.
 * V6 upgrades:
 *   - Real-time subscription to globe_projects (refreshes queue on project changes)
 *   - isLive: true when Supabase returns real rows (no more stub constraint)
 */

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    const arr = [...seen].slice(-50);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(arr));
  } catch { /* quota — fail silently */ }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface ProposalQueueState {
  queue: ParliamentProposal[];
  pendingCount: number;
  /** true = queue built from real Supabase globe_projects rows */
  isLive: boolean;
  dequeue: () => ParliamentProposal | null;
  refresh: () => void;
}

export function useProposalQueue(): ProposalQueueState {
  const [queue, setQueue] = useState<ParliamentProposal[]>([]);
  const [isLive, setIsLive] = useState(false);

  const buildQueue = useCallback(async () => {
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
      .sort((a, b) => {
        const order = { CRÍTICO: 0, ALTO: 1, MÉDIO: 2, BAIXO: 3 };
        return (order[a.impact.riskLevel] ?? 3) - (order[b.impact.riskLevel] ?? 3);
      });

    setQueue(proposals);
  }, []);

  // Build on mount
  useEffect(() => { buildQueue(); }, [buildQueue]);

  // V6: real-time subscription — rebuild queue when globe_projects changes
  useEffect(() => {
    const channel = supabase
      .channel("proposal-queue-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "globe_projects" },
        () => buildQueue()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [buildQueue]);

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

  return { queue, pendingCount: queue.length, isLive, dequeue, refresh };
}
