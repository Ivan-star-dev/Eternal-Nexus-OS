import { supabase } from "@/integrations/supabase/client";

interface BatchMetricItem {
  project_id: string;
  metric_key: string;
  metric_value: number;
  unit?: string;
}

interface BatchOptions {
  skip_unchanged?: boolean;
  dry_run?: boolean;
}

interface BatchResult {
  success: boolean;
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: any[];
  duration_ms: number;
  dry_run: boolean;
}

export async function batchUpdateMetrics(
  metrics: BatchMetricItem[],
  options?: BatchOptions
): Promise<BatchResult> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated — please sign in first");
  }

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const url = `https://${projectId}.supabase.co/functions/v1/batch-metrics`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      metrics,
      options: { skip_unchanged: true, ...options },
    }),
  });

  if (!response.ok && response.status !== 207) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error || `Batch failed: ${response.status}`);
  }

  return response.json();
}
