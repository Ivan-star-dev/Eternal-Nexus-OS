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

// ─── Supabase enrichment registry ────────────────────────────────────────────
// Maps known project names → rich metadata not stored in globe_projects table.
// For unknown projects, sensible defaults are derived from lat/lon/color/status.

type RichMeta = Pick<ProposalInput,
  "totalInvestment" | "paybackYears" | "topRisk" | "domain" | "riskScore" | "country"
>;

const ENRICHMENT_REGISTRY: Record<string, RichMeta> = {
  "Delta Spine NL":  { totalInvestment: "4.2B EUR",  paybackYears: "18 anos", topRisk: "Aceitação política da modificação de canais históricos UNESCO",         domain: "infra",   riskScore: 0.45, country: "Netherlands" },
  "DeltaSpine NL":   { totalInvestment: "4.2B EUR",  paybackYears: "18 anos", topRisk: "Aceitação política da modificação de canais históricos UNESCO",         domain: "infra",   riskScore: 0.45, country: "Netherlands" },
  "Pico do Fogo":    { totalInvestment: "1.8B USD",  paybackYears: "14 anos", topRisk: "Actividade vulcânica não prevista no perfil geológico",                  domain: "energy",  riskScore: 0.62, country: "Cabo Verde"  },
  "Geocore Power":   { totalInvestment: "1.8B USD",  paybackYears: "14 anos", topRisk: "Actividade vulcânica não prevista no perfil geológico",                  domain: "energy",  riskScore: 0.62, country: "Cabo Verde"  },
  "Fusion Core":     { totalInvestment: "22B EUR",   paybackYears: "30 anos", topRisk: "Prazo de ignição sustentada — ainda não demonstrado a escala comercial", domain: "energy",  riskScore: 0.78, country: "France"     },
  "Chip Fold":       { totalInvestment: "8.4B JPY",  paybackYears: "10 anos", topRisk: "Dependência de fornecedores de fotolitografia EUV — concentração geopolítica", domain: "tech", riskScore: 0.55, country: "Japan"  },
  "Terra Lenta":     { totalInvestment: "900M EUR",  paybackYears: "20 anos", topRisk: "Falha de sensor em cadeia durante evento sísmico real",                  domain: "infra",   riskScore: 0.38, country: "Portugal"   },
  "Next Path Infra NL": { totalInvestment: "3.1B EUR", paybackYears: "15 anos", topRisk: "Coordenação multi-stakeholder entre municípios holandeses",            domain: "infra",   riskScore: 0.42, country: "Netherlands" },
  "Next Path Infra PT": { totalInvestment: "1.2B EUR", paybackYears: "12 anos", topRisk: "Aprovação regulatória de zonas especiais de desenvolvimento",          domain: "infra",   riskScore: 0.35, country: "Portugal"   },
  "Next Path Infra BR": { totalInvestment: "4.8B BRL", paybackYears: "16 anos", topRisk: "Instabilidade cambial e risco de crédito soberano",                    domain: "infra",   riskScore: 0.58, country: "Brazil"     },
  "Next Path Infra US": { totalInvestment: "9.2B USD", paybackYears: "20 anos", topRisk: "Aprovação federal e coordenação inter-agências",                       domain: "infra",   riskScore: 0.40, country: "USA"        },
  "Next Path Infra AE": { totalInvestment: "5.5B AED", paybackYears: "14 anos", topRisk: "Exposição geopolítica regional e dependência de commodities",          domain: "infra",   riskScore: 0.52, country: "UAE"        },
  "Next Path Infra JP": { totalInvestment: "7.0B JPY", paybackYears: "18 anos", topRisk: "Risco sísmico e custo de construção em altitude urbana",               domain: "infra",   riskScore: 0.48, country: "Japan"      },
};

function colorToDomain(color: string): ProposalInput["domain"] {
  const map: Record<string, ProposalInput["domain"]> = {
    "#f5c24a": "energy", "#d4a017": "energy",
    "#4a90e2": "tech",   "#c026d3": "tech",
    "#22c55e": "climate","#a0e7e5": "infra",
    "#8b6f47": "infra",  "#ec4899": "health",
  };
  return map[color.toLowerCase()] ?? "infra";
}

function latLonToCountry(lat: number, lon: number): string {
  // Coarse bounding-box lookup — good enough for known project locations
  if (lat > 10 && lat < 20  && lon < -20)          return "Cabo Verde";
  if (lat > 50 && lat < 55  && lon > 3 && lon < 7) return "Netherlands";
  if (lat > 36 && lat < 44  && lon > 1 && lon < 4) return "Spain";
  if (lat > 36 && lat < 41  && lon > -10 && lon < -6) return "Portugal";
  if (lat > 45 && lat < 50  && lon > 0 && lon < 5) return "France";
  if (lat > 30 && lat < 40  && lon > 130)          return "Japan";
  if (lat > -25 && lat < -20 && lon > -45)         return "Brazil";
  if (lat > 38 && lat < 42  && lon > 54)           return "UAE";
  if (lat > 38 && lat < 45  && lon > -80 && lon < -70) return "USA";
  return "Global";
}

function enrichRow(row: {
  id: string; name: string; description: string | null;
  lat: number; lon: number; color: string; status: string;
}): ProposalInput {
  const meta = ENRICHMENT_REGISTRY[row.name] ?? {
    totalInvestment: "TBD",
    paybackYears: "TBD",
    topRisk: "Risk assessment pending",
    domain: colorToDomain(row.color),
    riskScore: row.status === "critical" ? 0.80 : 0.40,
    country: latLonToCountry(row.lat, row.lon),
  };
  return {
    projectId: row.id,
    name: row.name,
    description: row.description ?? row.name,
    status: row.status,
    isLive: true,
    ...meta,
  };
}

// ─── Supabase fetch (V5-INFRA-SUPABASE-001 — live path) ──────────────────────
// Queries globe_projects and enriches rows with local metadata.
// Returns [] on error so the queue hook gracefully falls back to stubs.

export async function fetchSupabaseProjects(): Promise<ProposalInput[]> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("globe_projects")
      .select("id, name, description, lat, lon, color, status")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) return [];
    return data.map(enrichRow);
  } catch {
    return [];
  }
}

// ─── Stub project inputs (static data layer) ─────────────────────────────────
// Fallback when Supabase is not reachable or returns empty.

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
