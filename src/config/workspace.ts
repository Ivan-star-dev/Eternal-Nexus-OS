/**
 * workspace.ts — Workspace Config Layer v1
 *
 * Fonte canônica de configuração do produto Eternal Nexus.
 * Declara órgãos, fluxo sagrado e identidade do produto.
 *
 * Regras:
 * - Não contém estado em tempo real (só config estrutural)
 * - Não substitui docs/NEXUS_OS.md — é a expressão tipada dele em código
 * - Só o owner / Tribunal autorizam mudanças estruturais aqui
 * - Fluxo sagrado: Tribunal → Atlas → Index → News (imutável nesta fase)
 *
 * sacred-flow: BULK-03.1 | PLv1 | 2026-03-20
 */

// ─── Fluxo sagrado ────────────────────────────────────────────────────────────

export const SACRED_FLOW = ['tribunal', 'atlas', 'index', 'news'] as const;
export type SacredFlowStep = typeof SACRED_FLOW[number];

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface OrganConfig {
  /** Identificador canônico — nunca renomear */
  id: string;
  /** Rota no app */
  path: string;
  /** Label exibido na UI */
  label: string;
  /** Cor primária do órgão (hex) */
  color: string;
  /**
   * Posição no fluxo sagrado (1–4).
   * null = órgão fora do fluxo sagrado mas parte do organismo.
   */
  sacredFlowStep: 1 | 2 | 3 | 4 | null;
}

// ─── Órgãos ───────────────────────────────────────────────────────────────────

export const ORGANS: readonly OrganConfig[] = [
  // Fluxo sagrado — ordem imutável
  { id: 'tribunal', path: '/tribunal',          label: 'TRIBUNAL',    color: '#cc44ff', sacredFlowStep: 1 },
  { id: 'atlas',    path: '/atlas',             label: 'ATLAS',       color: '#4a90e2', sacredFlowStep: 2 },
  { id: 'index',    path: '/organism-index',    label: 'INDEX',       color: '#22ffaa', sacredFlowStep: 3 },
  { id: 'news',     path: '/news',              label: 'NEWS',        color: '#ff4444', sacredFlowStep: 4 },

  // Órgãos extendidos — fora do fluxo sagrado, parte do organismo
  { id: 'nexus',       path: '/nexus',                     label: 'NEXUS',       color: '#22ffaa', sacredFlowStep: null },
  { id: 'geopolitics', path: '/geopolitics',               label: 'GEOPOLITICS', color: '#e24a6f', sacredFlowStep: null },
  { id: 'investor',    path: '/investor/deltaspine-nl',    label: 'INVESTOR',    color: '#ffaa22', sacredFlowStep: null },
] as const;

// ─── Utilitários de acesso ────────────────────────────────────────────────────

/** Retorna os 4 órgãos do fluxo sagrado em ordem canônica */
export function getSacredFlowOrgans(): OrganConfig[] {
  return [...ORGANS]
    .filter((o): o is OrganConfig & { sacredFlowStep: 1 | 2 | 3 | 4 } =>
      o.sacredFlowStep !== null
    )
    .sort((a, b) => a.sacredFlowStep - b.sacredFlowStep);
}

/** Retorna órgão por id — undefined se não existir */
export function getOrgan(id: string): OrganConfig | undefined {
  return ORGANS.find(o => o.id === id);
}

// ─── Metadata do produto ──────────────────────────────────────────────────────

export const WORKSPACE = {
  name: 'Eternal Nexus',
  productLayer: 'PLv1',
  phase: 'Fase 3 — Governança e Auditabilidade',
  sacredFlow: SACRED_FLOW,
  canonicalBranch: 'claude/expose-workspace-config-yt4Km',
} as const;
