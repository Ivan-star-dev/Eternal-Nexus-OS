import type { OrganType } from '@/types/index';

export type IndexCategory = 'verdict' | 'climate' | 'economy' | 'security' | 'health' | 'infra';

export const INDEX_CATEGORIES: IndexCategory[] = [
  'verdict',
  'climate',
  'economy',
  'security',
  'health',
  'infra',
];

export interface IndexSourceRef {
  organ: OrganType;
  dataId: string;
  confidence: number;
}

export interface IndexEntry {
  id: string;
  rank: number;
  title: string;
  summary: string;
  sources: IndexSourceRef[];
  category: IndexCategory;
  severity: number;
  timestamp: number;
  crossReferences: string[];
  flowTarget: 'news';
}

export interface IndexStats {
  totalEntries: number;
  byCategory: Record<IndexCategory, number>;
  avgSeverity: number;
  topSources: string[];
}

export const createEmptyIndexCategoryCount = (): Record<IndexCategory, number> => (
  Object.fromEntries(INDEX_CATEGORIES.map((category) => [category, 0])) as Record<IndexCategory, number>
);
