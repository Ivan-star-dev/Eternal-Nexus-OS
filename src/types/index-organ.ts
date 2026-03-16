// sacred-flow: grok
import { OrganType } from '@/types/index';

export interface IndexEntry {
  id: string;
  rank: number;
  title: string;
  summary: string;
  sources: { organ: OrganType; dataId: string; confidence: number }[];
  category: 'verdict' | 'climate' | 'economy' | 'security' | 'health' | 'infra';
  severity: number; // 0-1 scale
  timestamp: number;
  crossReferences: string[];
  flowTarget: 'news'; // Immutable sacred flow to News
}

export interface IndexStats {
  totalEntries: number;
  byCategory: Record<string, number>;
  avgSeverity: number;
  topSources: string[];
}
