/**
 * proposalGenerator — V5-AI-PROPOSALS-001
 *
 * Derives structured ParliamentProposals from project metrics.
 * Input interface is intentionally Supabase-ready: when V5-INFRA-SUPABASE-001
 * is unblocked, replace stubProjects() with a real Supabase query and pass
 * the same ProposalInput shape.
 *
 * CONSTRAINT (owner directive 2026-03-25):
 *   Do NOT set isLive=true or indicate production-data readiness until real
 *   Supabase secrets are wired and queries return real rows.
 *
 * NO external API calls. Deterministic logic only.
 */

import type { ParliamentProposal } from "@/components/nexus/AICouncil";

// ─── Input contract (mirrors Supabase globe_projects + project dossier fields) ─

export interface ProposalInput {
  /** Unique project identifier */
  projectId: string;
  name: string;
  /** Short description / scenario context */
  description: string;
  /** Project status: active | in-progress | completed | critical */
  status: string;
  /** Total investment string, e.g. "4.2B USD" */
  totalInvestment: string;
  /** Payback / ROI string, e.g. "12 anos" */
  paybackYears: string;
  /** Highest-risk item from risk matrix */
  topRisk: string;
  /** Primary domain: energy | infra | health | climate | tech */
  domain: "energy" | "infra" | "health" | "climate" | "tech";
  /** 0–1 — derived from risk matrix HIGH count */
  riskScore: number;
  /** ISO country code or name */
  country: string;
  /** true = real Supabase row; false = stub/static data */
  isLive: boolean;
}

// ─── Risk level derivation ────────────────────────────────────────────────────

function deriveRiskLevel(
  riskScore: number,
): "BAIXO" | "MÉDIO" | "ALTO" | "CRÍTICO" {
  if (riskScore >= 0.75) return "CRÍTICO";
  if (riskScore >= 0.5)  return "ALTO";
  if (riskScore >= 0.25) return "MÉDIO";
  return "BAIXO";
}

// ─── Agent vote derivation ────────────────────────────────────────────────────

const DOMAIN_VOTES: Record<
  ProposalInput["domain"],
  Record<string, string>
> = {
  energy: {
    climate:  "FAVOR — emissões reduzidas",
    economy:  "FAVOR — independência energética",
    health:   "NEUTRO — monitoramento necessário",
    security: "FAVOR — grid resilience",
    infra:    "FAVOR (lidera) — infraestrutura crítica",
  },
  infra: {
    climate:  "NEUTRO — análise de impacto ambiental pendente",
    economy:  "FAVOR — corredor económico",
    health:   "FAVOR — logística de saúde melhorada",
    security: "FAVOR — redundância estratégica",
    infra:    "FAVOR (lidera) — backbone nacional",
  },
  health: {
    climate:  "FAVOR — nexo saúde-ambiente",
    economy:  "FAVOR — produtividade protegida",
    health:   "FAVOR (lidera) — prioridade crítica",
    security: "FAVOR — estabilidade social",
    infra:    "FAVOR — rede hospitalar reforçada",
  },
  climate: {
    climate:  "FAVOR (lidera) — urgência climática",
    economy:  "FAVOR (subsídio verde) — transição justa",
    health:   "FAVOR — saúde pública melhorada",
    security: "FAVOR — migrações climáticas mitigadas",
    infra:    "FAVOR — infraestrutura climática resiliente",
  },
  tech: {
    climate:  "NEUTRO — auditoria de consumo energético",
    economy:  "FAVOR (lidera) — competitividade digital",
    health:   "FAVOR — diagnóstico por IA habilitado",
    security: "FAVOR — soberania tecnológica",
    infra:    "FAVOR — backbone digital nacional",
  },
};

// ─── Recommendation builder ───────────────────────────────────────────────────

function buildRecommendation(input: ProposalInput): string {
  const parts: string[] = [];

  if (input.status === "critical") {
    parts.push(`Activação imediata de protocolo de emergência para ${input.name}`);
  } else {
    parts.push(`Aprovação de ${input.name} com dotação prioritária`);
  }

  parts.push(`Investimento: ${input.totalInvestment}`);
  parts.push(`ROI projectado: ${input.paybackYears}`);

  if (input.riskScore >= 0.5) {
    parts.push(`Mitigação obrigatória: ${input.topRisk}`);
  }

  return parts.join(" · ");
}

// ─── Consensus hash (deterministic, not cryptographic) ───────────────────────

function makeConsensusHash(input: ProposalInput, ts: string): string {
  const seed = `${input.projectId}${input.name}${ts.slice(0, 10)}`;
  const h = Array.from(seed).reduce(
    (a, c) => ((a * 31 + c.charCodeAt(0)) | 0),
    0,
  );
  return `0x${Math.abs(h).toString(16).padStart(8, "0")}`;
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateProposal(input: ProposalInput): ParliamentProposal {
  const ts = new Date().toISOString();
  const riskLevel = deriveRiskLevel(input.riskScore);

  return {
    id: `auto-${input.projectId}-${ts.slice(0, 10).replace(/-/g, "")}`,
    title: `${input.name} — ${input.country} · Deliberação Parlamentar`,
    scenario: `${input.description} · Status: ${input.status.toUpperCase()} · Risco dominante: ${input.topRisk}`,
    recommendation: buildRecommendation(input),
    votes: DOMAIN_VOTES[input.domain],
    impact: {
      cost: input.totalInvestment,
      roi: input.paybackYears,
      riskLevel,
    },
    approvedAt: ts,
    consensusHash: makeConsensusHash(input, ts),
  };
}

// ─── Stub project inputs (static data layer) ─────────────────────────────────
// V5-INFRA-SUPABASE-001: replace this with Supabase query when .env is wired.
// The ProposalInput shape must be maintained for drop-in replacement.

export function getStubProposalInputs(): ProposalInput[] {
  return [
    {
      projectId: "deltaspine-nl",
      name: "DeltaSpine NL",
      description: "Infraestrutura subaquática modular nos canais holandeses — mobilidade, energia, dados, regeneração ambiental",
      status: "active",
      totalInvestment: "4.2B EUR",
      paybackYears: "18 anos",
      topRisk: "Aceitação política da modificação de canais históricos UNESCO",
      domain: "infra",
      riskScore: 0.45,
      country: "Netherlands",
      isLive: false,
    },
    {
      projectId: "geocore-power",
      name: "Geocore Power",
      description: "Planta geotérmica profunda no Pico do Fogo, Cabo Verde — energia limpa para o arquipélago",
      status: "in-progress",
      totalInvestment: "1.8B USD",
      paybackYears: "14 anos",
      topRisk: "Actividade vulcânica não prevista no perfil geológico",
      domain: "energy",
      riskScore: 0.62,
      country: "Cabo Verde",
      isLive: false,
    },
    {
      projectId: "fusion-core",
      name: "Fusion Core",
      description: "Reactor de fusão compacto de alta eficiência — núcleo energético de próxima geração para Paris",
      status: "active",
      totalInvestment: "22B EUR",
      paybackYears: "30 anos",
      topRisk: "Prazo de ignição sustentada — ainda não demonstrado a escala comercial",
      domain: "energy",
      riskScore: 0.78,
      country: "France",
      isLive: false,
    },
    {
      projectId: "chip-fold",
      name: "Chip Fold",
      description: "Arquitectura de chip fotónico dobrado — computação de nova geração para Tokyo",
      status: "in-progress",
      totalInvestment: "8.4B JPY",
      paybackYears: "10 anos",
      topRisk: "Dependência de fornecedores de fotolitografia EUV — concentração geopolítica",
      domain: "tech",
      riskScore: 0.55,
      country: "Japan",
      isLive: false,
    },
    {
      projectId: "terra-lenta",
      name: "Terra Lenta",
      description: "Sistema de monitoramento sísmico contínuo e cidade resiliente em Lisboa",
      status: "active",
      totalInvestment: "900M EUR",
      paybackYears: "20 anos",
      topRisk: "Falha de sensor em cadeia durante evento sísmico real",
      domain: "infra",
      riskScore: 0.38,
      country: "Portugal",
      isLive: false,
    },
  ];
}
