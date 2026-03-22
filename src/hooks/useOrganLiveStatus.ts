/**
 * useOrganLiveStatus — Live Organ Status Layer (PLv6.1)
 *
 * Retorna o estado vivo de cada órgão do organismo.
 * Distingue explicitamente dados vivos de placeholders.
 *
 * Fontes ativas nesta camada (PLv6.1 — Layer 1 + Layer 2 Supabase):
 *   ATLAS       → temperatura Mindelo via realtimeData de useIndexOrgan (Open-Meteo)
 *   TRIBUNAL    → TanStack Query (useNexusState) — contagem de veredictos da sessão
 *   INDEX       → contagem de entradas via useIndexOrgan (agregação real do fluxo)
 *   NEWS        → entradas da última 1h derivadas do Index (fluxo Índice → Notícias)
 *   GEOPOLITICS → contagem de sismos M4.5+ (24h) via USGS Earthquake API (pública, sem auth)
 *   NEXUS       → duração da sessão activa do sistema (runtime, computed em tempo real)
 *   INVESTOR    → contagem de projectos activos via Supabase globe_projects (Layer 2)
 *                 + GDP NL via World Bank Open Data (Layer 1 — contexto macro no status)
 *
 * Regras:
 *   - Não criar novos backends ou autenticação
 *   - Usar apenas infraestrutura já presente no codebase + DATA_LAYER_1 + DATA_LAYER_2
 *   - Fallback gracioso sempre — nunca quebrar o grid
 *   - isLive: false = placeholder estático, não dado vivo
 *   - useIndexOrgan é a fonte única de realtimeData (evita instâncias duplicadas)
 *   - Layer 3 (dados owner proprietários) fica em PLv7+
 *
 * sacred-flow: SUPER-BULK-A + PLv5.1 + PLv6.1 | DATA_LAYER_1 + DATA_LAYER_2 | 2026-03-20
 */

import { useState, useEffect, useRef } from 'react';
import { useNexusState } from '@/hooks/useNexusState';
import { useIndexOrgan } from '@/hooks/useIndexOrgan';
import { fetchRecentEarthquakes } from '@/lib/earthquakeData';
import { fetchWorldBankIndicator, formatUSD } from '@/lib/worldBankData';
import { fetchProjectsSummary } from '@/lib/projectsData';

export interface OrganLiveData {
  metric: string;
  metricLabel: string;
  status: string;
  /**
   * true  = valor calculado em tempo real nesta sessão (API ou estado derivado)
   * false = placeholder estático (fonte real a integrar em PLv6+)
   */
  isLive: boolean;
}

// ── Utilitários internos ────────────────────────────────────────────────────

/** Temperatura de Mindelo → string de status legível */
function climateStatus(tempC: number): string {
  if (tempC >= 30) return `${tempC.toFixed(1)}°C — calor intenso`;
  if (tempC >= 24) return `${tempC.toFixed(1)}°C — temperatura tropical`;
  if (tempC >= 18) return `${tempC.toFixed(1)}°C — ameno`;
  return `${tempC.toFixed(1)}°C — fresco`;
}

/**
 * Formata duração em ms para string legível.
 * < 1m → "Xs" | < 1h → "Xm Ys" | >= 1h → "Xh Ym"
 */
function formatSession(ms: number): string {
  const totalS = Math.floor(ms / 1000);
  const h = Math.floor(totalS / 3600);
  const m = Math.floor((totalS % 3600) / 60);
  const s = totalS % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// ── Hook principal ──────────────────────────────────────────────────────────

export function useOrganLiveStatus(): Record<string, OrganLiveData> {
  // ── TRIBUNAL: veredictos da sessão ──────────────────────────────────────
  const { verdicts } = useNexusState();

  // ── INDEX + ATLAS + NEWS: useIndexOrgan é a fonte única de realtimeData ─
  // Expõe realtimeData desde SBA-01 — elimina instância duplicada de useRealtimeData
  const { entries, isProcessing, realtimeData } = useIndexOrgan();

  // ATLAS: temperatura de Mindelo a partir do ponto clima no realtimeData
  const tempPoint = realtimeData.find(p => p.source === 'climate');
  const tempC = tempPoint?.temperature ?? tempPoint?.value ?? null;

  // NEWS: entradas geradas na última hora (fluxo Index → News)
  const ONE_HOUR_MS = 3_600_000;
  const recentCount = entries.filter(e => e.timestamp > Date.now() - ONE_HOUR_MS).length;

  // ── GEOPOLITICS: sismos M4.5+ nas últimas 24h via USGS ──────────────────
  const [quakeCount, setQuakeCount] = useState<number | null>(null);
  const [quakeLoading, setQuakeLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setQuakeLoading(true);
    fetchRecentEarthquakes().then(quakes => {
      if (mounted) {
        setQuakeCount(quakes.length);
        setQuakeLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // ── NEXUS: duração da sessão activa ─────────────────────────────────────
  // Session timer — o tempo desde que o sistema foi montado nesta sessão.
  // "Runtime do sistema" é o sinal mais honesto para NEXUS como orquestrador:
  //   - sempre vivo (nunca null, nunca falha)
  //   - reflecte actividade real desta janela de trabalho
  //   - o status complementa com actividade do pipeline (verdicts + entries)
  const sessionStart = useRef(Date.now());
  const [sessionMs, setSessionMs] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSessionMs(Date.now() - sessionStart.current), 1000);
    return () => clearInterval(t);
  }, []);

  const pipelineOps = verdicts.length + entries.length;

  // ── INVESTOR: projectos activos via Supabase (Layer 2) ───────────────────
  // Métrica primária: contagem de projectos activos em globe_projects
  // Contexto macro: GDP NL via World Bank (Layer 1) — aparece no status
  const [projectsSummary, setProjectsSummary] = useState<{
    active: number; total: number; isLive: boolean;
  } | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [investorGdp, setInvestorGdp] = useState<{ formatted: string; date: string } | null>(null);

  useEffect(() => {
    let mounted = true;

    // Fetch paralelo: Supabase projects + World Bank GDP
    Promise.all([
      fetchProjectsSummary(),
      fetchWorldBankIndicator('nl', 'NY.GDP.MKTP.CD'),
    ]).then(([projects, gdp]) => {
      if (!mounted) return;
      setProjectsLoading(false);
      setProjectsSummary({ active: projects.active, total: projects.total, isLive: projects.isLive });
      if (gdp?.value) setInvestorGdp({ formatted: formatUSD(gdp.value), date: gdp.date });
    });

    return () => { mounted = false; };
  }, []);

  // ── Mapeamento por organ id ───────────────────────────────────────────────
  return {
    tribunal: {
      metric: verdicts.length.toString(),
      metricLabel: 'veredictos',
      status: verdicts.length > 0
        ? `${verdicts.length} veredicto${verdicts.length > 1 ? 's' : ''} em sessão`
        : 'Tribunal em sessão',
      isLive: true,
    },

    atlas: {
      metric: isProcessing ? '…' : tempC !== null ? `${Math.round(tempC)}°C` : '—',
      metricLabel: 'Mindelo',
      status: isProcessing ? 'Lendo clima…' : tempC !== null ? climateStatus(tempC) : 'Clima indisponível',
      isLive: true,
    },

    index: {
      metric: isProcessing ? '…' : entries.length.toString(),
      metricLabel: 'entradas',
      status: isProcessing
        ? 'Indexando fluxo…'
        : entries.length > 0
          ? `${entries.length} entrada${entries.length !== 1 ? 's' : ''} indexada${entries.length !== 1 ? 's' : ''}`
          : 'Aguardando fluxo',
      isLive: true,
    },

    news: {
      metric: recentCount.toString(),
      metricLabel: 'última hora',
      status: recentCount > 0
        ? `${recentCount} evento${recentCount > 1 ? 's' : ''} recente${recentCount > 1 ? 's' : ''}`
        : 'Echo-Vox em espera',
      isLive: true,
    },

    geopolitics: {
      metric: quakeLoading ? '…' : quakeCount !== null ? quakeCount.toString() : '—',
      metricLabel: 'M4.5+ / 24h',
      status: quakeLoading
        ? 'Lendo USGS…'
        : quakeCount !== null
          ? `${quakeCount} sismo${quakeCount !== 1 ? 's' : ''} detectado${quakeCount !== 1 ? 's' : ''}`
          : 'USGS indisponível',
      isLive: true,
    },

    nexus: {
      // Session timer: duração real desta sessão no sistema
      // Status complementa com ops do pipeline + projectos activos se disponível
      metric: formatSession(sessionMs),
      metricLabel: 'sessão',
      status: (() => {
        const projectsStr = projectsSummary?.isLive && projectsSummary.active > 0
          ? ` | ${projectsSummary.active} projecto${projectsSummary.active !== 1 ? 's' : ''}`
          : '';
        return pipelineOps > 0
          ? `Pipeline activo — ${pipelineOps} op${pipelineOps > 1 ? 's' : ''}${projectsStr}`
          : `Sistema Nexus activo${projectsStr}`;
      })(),
      isLive: true,
    },

    investor: {
      // Métrica primária: projectos activos em globe_projects (Layer 2 — Supabase real)
      // Contexto macro: GDP NL World Bank (Layer 1) no status
      metric: projectsLoading
        ? '…'
        : projectsSummary?.isLive
          ? projectsSummary.active.toString()
          : '—',
      metricLabel: projectsSummary?.isLive ? 'projectos activos' : 'projectos',
      status: projectsLoading
        ? 'Lendo projectos…'
        : projectsSummary?.isLive
          ? investorGdp
            ? `${projectsSummary.total} total · PIB NL ${investorGdp.formatted} (${investorGdp.date})`
            : `${projectsSummary.total} projectos registados`
          : 'Portfólio indisponível',
      isLive: projectsSummary?.isLive ?? false,
    },
  };
}
