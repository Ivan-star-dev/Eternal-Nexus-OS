import { useSyncExternalStore } from 'react';
import type { TribunalVerdict } from '@/types/index';
import type { IndexEntry } from '@/types/index-organ';

export interface OrganismVerdict extends TribunalVerdict {
  createdAt: number;
  source: 'tribunal';
  summary: string;
  status: 'new' | 'indexed' | 'broadcast';
  region?: string;
  evidenceReference?: string;
}

export interface OrganismNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'climate' | 'health' | 'security' | 'economy' | 'infra';
  timestamp: string;
  source: string;
}

interface OrganismFlowState {
  verdicts: OrganismVerdict[];
  indexEntries: IndexEntry[];
  newsItems: OrganismNewsItem[];
}

let state: OrganismFlowState = {
  verdicts: [],
  indexEntries: [],
  newsItems: [],
};

const listeners = new Set<() => void>();
const statusOrder: Record<OrganismVerdict['status'], number> = {
  new: 0,
  indexed: 1,
  broadcast: 2,
};

const emit = () => {
  listeners.forEach((listener) => listener());
};

const setState = (next: OrganismFlowState | ((prev: OrganismFlowState) => OrganismFlowState)) => {
  state = typeof next === 'function' ? next(state) : next;
  emit();
};

const mergeStatus = (
  current: OrganismVerdict['status'],
  next: OrganismVerdict['status'],
): OrganismVerdict['status'] => {
  if (statusOrder[next] > statusOrder[current]) return next;
  return current;
};

export const getOrganismFlowSnapshot = (): OrganismFlowState => state;

export const pushOrganismVerdict = (verdict: OrganismVerdict): void => {
  setState((prev) => ({
    ...prev,
    verdicts: [verdict, ...prev.verdicts].slice(0, 100),
  }));
};

export const setOrganismIndexEntries = (entries: IndexEntry[]): void => {
  const indexedVerdictIds = new Set(
    entries
      .filter((entry) => entry.id.startsWith('verdict-'))
      .map((entry) => entry.id.replace('verdict-', '')),
  );

  setState((prev) => ({
    ...prev,
    indexEntries: entries,
    verdicts: prev.verdicts.map((v) => ({
      ...v,
      status: indexedVerdictIds.has(v.id) ? mergeStatus(v.status, 'indexed') : v.status,
    })),
  }));
};

export const setOrganismNewsItems = (items: OrganismNewsItem[]): void => {
  const broadcastVerdictIds = new Set(
    items
      .map((item) => {
        if (item.id.startsWith('verdict-')) return item.id.replace('verdict-', '');
        return null;
      })
      .filter((id): id is string => Boolean(id)),
  );

  setState((prev) => ({
    ...prev,
    newsItems: items,
    verdicts: prev.verdicts.map((v) => ({
      ...v,
      status: broadcastVerdictIds.has(v.id) ? mergeStatus(v.status, 'broadcast') : v.status,
    })),
  }));
};

export const resetOrganismFlowForTest = (): void => {
  setState({ verdicts: [], indexEntries: [], newsItems: [] });
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useOrganismFlow = () => {
  const snapshot = useSyncExternalStore(subscribe, getOrganismFlowSnapshot, getOrganismFlowSnapshot);

  return {
    ...snapshot,
    pushVerdict: pushOrganismVerdict,
    setIndexEntries: setOrganismIndexEntries,
    setNewsItems: setOrganismNewsItems,
  };
};
