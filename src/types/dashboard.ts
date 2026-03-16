export interface ProjectMetric {
  id: string;
  project_id: string;
  metric_key: string;
  metric_value: number;
  unit: string;
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  project_id: string | null;
  event_type: string;
  title: string;
  description: string | null;
  severity: "info" | "success" | "warning" | "error";
  created_at: string;
}

export interface SystemStatusEntry {
  id: string;
  service_name: string;
  status: "operational" | "degraded" | "down";
  latency_ms: number;
  uptime_pct: number;
  last_check: string;
}

export interface ProjectProgressEntry {
  id: string;
  project_id: string;
  phase: string;
  progress: number;
  status: "pending" | "active" | "complete" | "blocked";
  updated_at: string;
}
