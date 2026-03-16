import { supabase } from "@/integrations/supabase/client";

export interface AggregatedMetric {
  bucket: string;
  project_id: string;
  metric_key: string;
  avg_value: number;
  min_value: number;
  max_value: number;
  sample_count: number;
}

interface FetchOptions {
  projectId?: string;
  metricKey?: string;
  start?: string;
  end?: string;
  limit?: number;
  refresh?: boolean;
}

export async function fetchAggregatedMetrics(
  options: FetchOptions = {}
): Promise<AggregatedMetric[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const params = new URLSearchParams();

  if (options.projectId) params.set("project_id", options.projectId);
  if (options.metricKey) params.set("metric_key", options.metricKey);
  if (options.start) params.set("start", options.start);
  if (options.end) params.set("end", options.end);
  if (options.limit) params.set("limit", String(options.limit));
  if (options.refresh) params.set("refresh", "true");

  const url = `https://${projectId}.supabase.co/functions/v1/aggregated-metrics?${params}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error || `Failed: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
}
