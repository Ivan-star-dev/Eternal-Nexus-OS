/**
 * useOrganLiveStatus — Live Organ Status Layer (PLv4)
 *
 * Retorna o estado vivo de cada órgão do organismo.
 * Distingue explicitamente dados vivos de placeholders.
 *
 * Fontes ativas nesta camada (PLv4):
 *   ATLAS       → temperatura Mindelo via realtimeData de useIndexOrgan (Open-Meteo)
 *   TRIBUNAL    → TanStack Query (useNexusState) — contagem de veredictos da sessão
 *   INDEX       → contagem de entradas via useIndexOrgan (agregação real do fluxo)
 *   NEWS        → entradas da última 1h derivadas do Index (fluxo Índice → Notícias)
 *   GEOPOLITICS → contagem de sismos M4.5+ (24h) via USGS Earthquake API (pública, sem auth)
 *
 * Fontes pendentes (PLv5+):
 *   nexus, investor → placeholder explícito (B-001 / nova infra / dados owner)
 *
 * Regras:
 *   - Não criar novos backends ou autenticação
 *   - Usar apenas infraestrutura já presente no codebase
 *   - Fallback gracioso sempre — nunca quebrar o grid
 *   - isLive: false = placeholder honesto, não dado vivo
 *   - useIndexOrgan é a fonte única de realtimeData (evita instâncias duplicadas)
 *
 * sacred-flow: BULK-SBA-02+03 | PLv4 | 2026-03-20
 */

import { useState, useEffect } from 'react';
import { useNexusState } from '@/hooks/useNexusState';
import { useIndexOrgan } from '@/hooks/useIndexOrgan';
import { fetchRecentEarthquakes } from '@/lib/earthquakeData';

export interface OrganLiveData {
  metric: string;
  metricLabel: string;
  status: string;
  /**
   * true  = valor calculado em tempo real nesta sessão (API ou estado derivado)
   * false = placeholder estático (fonte real a integrar em PLv5+)
   */
  isLive: boolean;
}

// Intervalo de temperatura de Mindelo → string de status legível
function climateStatus(tempC: number): string {
  if (tempC >= 30) return `${tempC.toFixed(1)}°C — calor intenso`;
  if (tempC >= 24) return `${tempC.toFixed(1)}°C — temperatura tropical`;
  if (tempC >= 18) return `${tempC.toFixed(1)}°C — ameno`;
  return `${tempC.toFixed(1)}°C — fresco`;
}

export function useOrganLiveStatus(): Record<string, OrganLiveData> {
  // ── TRIBUNAL: veredictos da sessão ──────────────────────────────────────
  const { verdicts } = useNexusState();

  // ── INDEX + ATLAS + NEWS: useIndexOrgan é a fonte única de realtimeData ─
  // useIndexOrgan agrega tribunal + realtimeData (Open-Meteo + fallback simulado)
  // realtimeData exposto em SBA-01 para eliminar instância duplicada de useRealtimeData
  const { entries, isProcessing, realtimeData } = useIndexOrgan();

  // ATLAS: temperatura de Mindelo a partir do ponto clima no realtimeData
  const tempPoint = realtimeData.find(p => p.source === 'climate');
  const tempC = tempPoint?.temperature ?? tempPoint?.value ?? null;

  // NEWS: entradas geradas na última hora (fluxo Index → News)
  // Todas as IndexEntry têm flowTarget: 'news' — o subset recente é a "notícia viva"
  const ONE_HOUR_MS = 3_600_000;
  const recentCount = entries.filter(e => e.timestamp > Date.now() - ONE_HOUR_MS).length;

  // ── GEOPOLITICS: sismos M4.5+ nas últimas 24h via USGS ──────────────────
  // API pública, sem auth, sem nova infra. Fetch único no mount; não precisa de polling
  // para o nível de informação exibido no grid (sísmos diários, não mudam a cada minuto)
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
      // Temperatura real de Mindelo, Cabo Verde — ponto de origem do sacred-flow
      metric: isProcessing ? '…' : tempC !== null ? `${Math.round(tempC)}°C` : '—',
      metricLabel: 'Mindelo',
      status: isProcessing ? 'Lendo clima…' : tempC !== null ? climateStatus(tempC) : 'Clima indisponível',
      isLive: true,
    },

    index: {
      // Entradas reais agregadas: tribunal verdicts + dados climáticos do fluxo
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
      // Derivado do Index: entradas recentes (última 1h) = "notícias vivas"
      metric: recentCount.toString(),
      metricLabel: 'última hora',
      status: recentCount > 0
        ? `${recentCount} evento${recentCount > 1 ? 's' : ''} recente${recentCount > 1 ? 's' : ''}`
        : 'Echo-Vox em espera',
      isLive: true,
    },

    geopolitics: {
      // USGS Earthquake Feed — M4.5+ nas últimas 24h — API pública real
      metric: quakeLoading ? '…' : quakeCount !== null ? quakeCount.toString() : '—',
      metricLabel: 'M4.5+ / 24h',
      status: quakeLoading
        ? 'Lendo USGS…'
        : quakeCount !== null
          ? `${quakeCount} sismo${quakeCount !== 1 ? 's' : ''} detectado${quakeCount !== 1 ? 's' : ''}`
          : 'USGS indisponível',
      isLive: true,
    },

    // ── Placeholders honestos — PLv5+ ─────────────────────────────────────
    nexus: {
      // 3 EIs definidos no sistema (AgentId: zeta-9, kronos, nanobanana)
      // isLive: false — valor estático da config, não dinâmico em runtime
      metric: '3',
      metricLabel: 'EIs',
      status: 'Sistema Nexus',
      isLive: false,
    },
    investor: {
      // Placeholder — depende de dados do owner (B-001) ou Supabase auth
      metric: '$2.8B',
      metricLabel: 'pipeline',
      status: 'DeltaSpine NL',
      isLive: false,
    },
  };
}
