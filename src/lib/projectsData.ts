/**
 * projectsData — Projects Table Layer (PLv6.1)
 *
 * Fetcher canónico para globe_projects via Supabase (Layer 2 — auth/Supabase).
 * Usa cliente anon — globe_projects é legível sem autenticação.
 *
 * Padrão paralelo a worldBankData.ts (Layer 1 — Open Data).
 * Não importar este ficheiro em múltiplos hooks — preferir consumo via useOrganLiveStatus.
 *
 * Campos expostos de globe_projects:
 *   id, name, description, lat, lon, color, status, user_id, created_at
 *
 * PLv6.1 | 2026-03-20
 */

import { supabase } from '@/integrations/supabase/client';

export interface GlobeProject {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lon: number;
  color: string;
  status: string;
  created_at: string;
}

export interface ProjectsSummary {
  /** Total de projectos na tabela */
  total: number;
  /** Projectos com status diferente de inativo/archived */
  active: number;
  /** Lista reduzida para consumo nos órgãos (máx 5) */
  recent: GlobeProject[];
  /** true = dados reais do Supabase; false = fallback por erro */
  isLive: boolean;
  error: string | null;
}

const INACTIVE_STATUSES = ['archived', 'inactive', 'closed', 'cancelado'];

/**
 * Fetcha resumo dos projectos a partir de globe_projects.
 * Ordena por created_at DESC — retorna máx 20 linhas (suficiente para métricas).
 */
export async function fetchProjectsSummary(): Promise<ProjectsSummary> {
  try {
    const { data, error } = await supabase
      .from('globe_projects')
      .select('id, name, description, lat, lon, color, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data) {
      return {
        total: 0,
        active: 0,
        recent: [],
        isLive: false,
        error: error?.message ?? 'sem dados',
      };
    }

    const projects = data as GlobeProject[];
    const active = projects.filter(
      (p) => !INACTIVE_STATUSES.some((s) => p.status?.toLowerCase().includes(s))
    ).length;

    return {
      total: projects.length,
      active,
      recent: projects.slice(0, 5),
      isLive: true,
      error: null,
    };
  } catch (err) {
    return {
      total: 0,
      active: 0,
      recent: [],
      isLive: false,
      error: err instanceof Error ? err.message : 'erro desconhecido',
    };
  }
}
