/**
 * usePortfolioData — V6-PORTFOLIO-DASHBOARD-001
 *
 * Aggregates portfolio-level KPIs from:
 *   - globe_projects   → project count, status breakdown
 *   - project_metrics  → investment, CO₂, jobs, SDG score (by metric_key)
 *
 * metric_key contracts (canonical):
 *   "investment_usd"   → USD value (millions)
 *   "co2_tonnes"       → CO₂ tonnes avoided / year
 *   "jobs_created"     → direct jobs created
 *   "sdg_score"        → composite SDG score 0–100
 *
 * Real-time: invalidates on any change to globe_projects or project_metrics.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PortfolioKPIs {
  projectCount: number;
  activeCount: number;
  pilotCount: number;
  planningCount: number;
  totalInvestmentUSD: number;   // millions USD
  totalCO2Tonnes: number;       // tonnes / year avoided
  totalJobsCreated: number;     // direct jobs
  avgSDGScore: number;          // 0–100 composite
  lastUpdated: string | null;
}

const EMPTY: PortfolioKPIs = {
  projectCount: 0,
  activeCount: 0,
  pilotCount: 0,
  planningCount: 0,
  totalInvestmentUSD: 0,
  totalCO2Tonnes: 0,
  totalJobsCreated: 0,
  avgSDGScore: 0,
  lastUpdated: null,
};

async function fetchPortfolioKPIs(): Promise<PortfolioKPIs> {
  // Parallel fetch — projects + metrics
  const [projectsRes, metricsRes] = await Promise.all([
    supabase.from("globe_projects").select("id, status"),
    supabase
      .from("project_metrics")
      .select("metric_key, metric_value, updated_at")
      .in("metric_key", ["investment_usd", "co2_tonnes", "jobs_created", "sdg_score"]),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (metricsRes.error) throw metricsRes.error;

  const projects = projectsRes.data ?? [];
  const metrics = metricsRes.data ?? [];

  // Project counts
  const projectCount = projects.length;
  const activeCount = projects.filter(p => p.status === "active").length;
  const pilotCount = projects.filter(p => p.status === "pilot").length;
  const planningCount = projects.filter(p => p.status === "planning").length;

  // Aggregate metrics by key
  let totalInvestmentUSD = 0;
  let totalCO2Tonnes = 0;
  let totalJobsCreated = 0;
  const sdgScores: number[] = [];
  let lastUpdated: string | null = null;

  for (const m of metrics) {
    if (m.metric_key === "investment_usd") totalInvestmentUSD += m.metric_value;
    if (m.metric_key === "co2_tonnes") totalCO2Tonnes += m.metric_value;
    if (m.metric_key === "jobs_created") totalJobsCreated += m.metric_value;
    if (m.metric_key === "sdg_score") sdgScores.push(m.metric_value);
    if (m.updated_at && (!lastUpdated || m.updated_at > lastUpdated)) {
      lastUpdated = m.updated_at;
    }
  }

  const avgSDGScore =
    sdgScores.length > 0
      ? Math.round(sdgScores.reduce((a, b) => a + b, 0) / sdgScores.length)
      : 0;

  return {
    projectCount,
    activeCount,
    pilotCount,
    planningCount,
    totalInvestmentUSD,
    totalCO2Tonnes,
    totalJobsCreated,
    avgSDGScore,
    lastUpdated,
  };
}

export function usePortfolioData() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["portfolio-kpis"],
    queryFn: fetchPortfolioKPIs,
    refetchInterval: 60_000,
    placeholderData: EMPTY,
  });

  // Real-time invalidation on either table
  useEffect(() => {
    const channel = supabase
      .channel("portfolio-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "globe_projects" },
        () => queryClient.invalidateQueries({ queryKey: ["portfolio-kpis"] })
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_metrics" },
        () => queryClient.invalidateQueries({ queryKey: ["portfolio-kpis"] })
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return query;
}
