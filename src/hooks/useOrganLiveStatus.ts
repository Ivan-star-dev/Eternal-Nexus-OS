/**
 * useOrganLiveStatus — Live Organ Status Layer (PLv3)
 *
 * Retorna o estado vivo de cada órgão do organismo.
 * Distingue explicitamente dados vivos de placeholders.
 *
 * Fontes ativas nesta camada:
 *   ATLAS    → Open-Meteo API (Mindelo, Cabo Verde) — temperatura real em tempo real
 *   TRIBUNAL → TanStack Query (useNexusState) — contagem de veredictos da sessão
 *
 * Fontes pendentes (PLv4+):
 *   nexus, index, news, investor, geopolitics → placeholder explícito
 *
 * Regras:
 *   - Não criar novos backends ou autenticação
 *   - Usar apenas infraestrutura já presente no codebase
 *   - Fallback gracioso sempre — nunca quebrar o grid
 *   - isLive: false = placeholder honesto, não dado vivo
 *
 * sacred-flow: BULK-04.1 | PLv3 | 2026-03-20
 */

import { useNexusState } from '@/hooks/useNexusState';
import { useRealtimeData } from '@/hooks/useRealtimeData';

export interface OrganLiveData {
  metric: string;
  metricLabel: string;
  status: string;
  /**
   * true  = valor calculado em tempo real nesta sessão
   * false = placeholder estático (fonte real a integrar em PLv4+)
   */
  isLive: boolean;
}

// Intervalos de temperatura para determinar status do clima em Mindelo
function climateStatus(tempC: number): string {
  if (tempC >= 30) return `${tempC.toFixed(1)}°C — calor intenso`;
  if (tempC >= 24) return `${tempC.toFixed(1)}°C — temperatura tropical`;
  if (tempC >= 18) return `${tempC.toFixed(1)}°C — ameno`;
  return `${tempC.toFixed(1)}°C — fresco`;
}

export function useOrganLiveStatus(): Record<string, OrganLiveData> {
  // ── TRIBUNAL: veredictos da sessão corrente ──────────────────────────────
  const { verdicts } = useNexusState();

  // ── ATLAS: temperatura real de Mindelo, Cabo Verde ───────────────────────
  // useRealtimeData com apenas 'climate' — Open-Meteo, sem auth, fallback embutido
  const { data: climateData, isLoading: atlasLoading } = useRealtimeData({
    sources: ['climate'],
    interval: 120_000, // 2 min — clima não muda a cada segundo
  });

  const tempPoint = climateData.find(p => p.source === 'climate');
  const tempC = tempPoint?.temperature ?? tempPoint?.value ?? null;

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
      metric: atlasLoading
        ? '…'
        : tempC !== null
          ? `${Math.round(tempC)}°C`
          : '—',
      metricLabel: 'Mindelo',
      status: atlasLoading
        ? 'Lendo clima…'
        : tempC !== null
          ? climateStatus(tempC)
          : 'Clima indisponível',
      isLive: true,
    },

    // ── Placeholders explícitos — PLv4+ ──────────────────────────────────
    nexus: {
      metric: '—',
      metricLabel: 'simulações',
      status: '3 EIs debatendo',
      isLive: false,
    },
    index: {
      metric: '—',
      metricLabel: 'entradas',
      status: 'Indexação ativa',
      isLive: false,
    },
    news: {
      metric: '—',
      metricLabel: 'alertas hoje',
      status: 'Echo-Vox ativo',
      isLive: false,
    },
    investor: {
      metric: '$2.8B',
      metricLabel: 'pipeline',
      status: 'DeltaSpine NL',
      isLive: false,
    },
    geopolitics: {
      metric: '—',
      metricLabel: 'países',
      status: 'Mapa vivo',
      isLive: false,
    },
  };
}
