import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HealthReport {
  generated_at: string;
  health: {
    status: "healthy" | "degraded" | "critical";
    score: number;
    anomalies: string[];
  };
  services: {
    total: number;
    operational: number;
    degraded: number;
    avg_uptime_pct: number;
    avg_latency_ms: number;
    details: any[];
  };
  projects: {
    avg_progress_pct: number;
    phases: any[];
  };
  metrics: {
    total_history_rows: number;
    recent_aggregations: any[];
    latest_values: any[];
  };
  activity: {
    recent: any[];
    critical_count: number;
  };
  chat: {
    total_messages: number;
  };
  duration_ms: number;
}

export function useHealthCheck() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-check`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data: HealthReport = await res.json();
      setReport(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Health check failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { report, loading, error, fetchHealth };
}
