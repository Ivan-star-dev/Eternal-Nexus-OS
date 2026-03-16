import type {
  ProjectMetric,
  ActivityLogEntry,
  SystemStatusEntry,
  ProjectProgressEntry,
} from "@/types/dashboard";

export const MOCK_METRICS: ProjectMetric[] = [
  { id: "1", project_id: "deltaspine", metric_key: "budget_allocated", metric_value: 12, unit: "M€", updated_at: new Date().toISOString() },
  { id: "2", project_id: "deltaspine", metric_key: "eia_progress", metric_value: 34, unit: "%", updated_at: new Date().toISOString() },
  { id: "3", project_id: "deltaspine", metric_key: "sensor_nodes", metric_value: 0, unit: "units", updated_at: new Date().toISOString() },
  { id: "4", project_id: "geocore", metric_key: "drilling_depth", metric_value: 1.2, unit: "km", updated_at: new Date().toISOString() },
  { id: "5", project_id: "geocore", metric_key: "temperature", metric_value: 187, unit: "°C", updated_at: new Date().toISOString() },
  { id: "6", project_id: "geocore", metric_key: "power_output", metric_value: 0, unit: "MW", updated_at: new Date().toISOString() },
  { id: "7", project_id: "geocore", metric_key: "seismic_events", metric_value: 3, unit: "events", updated_at: new Date().toISOString() },
  { id: "8", project_id: "chipfold", metric_key: "conductivity", metric_value: 0.14, unit: "S/m", updated_at: new Date().toISOString() },
  { id: "9", project_id: "chipfold", metric_key: "flex_cycles", metric_value: 12400, unit: "cycles", updated_at: new Date().toISOString() },
  { id: "10", project_id: "chipfold", metric_key: "neuron_viability", metric_value: 62, unit: "days", updated_at: new Date().toISOString() },
  { id: "11", project_id: "terralenta", metric_key: "model_runs", metric_value: 847, unit: "runs", updated_at: new Date().toISOString() },
  { id: "12", project_id: "fusion", metric_key: "integration_score", metric_value: 23, unit: "%", updated_at: new Date().toISOString() },
];

export const MOCK_ACTIVITY: ActivityLogEntry[] = [
  { id: "a1", project_id: "deltaspine", event_type: "milestone", title: "EIA Draft Submitted", description: "Environmental Impact Assessment draft v2.1 submitted to Rijkswaterstaat.", severity: "info", created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "a2", project_id: "geocore", event_type: "alert", title: "Seismic Event M1.2", description: "Minor seismic event at pilot well. Within parameters.", severity: "warning", created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "a3", project_id: "chipfold", event_type: "milestone", title: "Conductivity Record", description: "Lab achieved 0.16 S/m — new project record.", severity: "success", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "a4", project_id: "fusion", event_type: "update", title: "Architecture Review", description: "Integration architecture v0.3 reviewed. 4 action items.", severity: "info", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "a5", project_id: "terralenta", event_type: "update", title: "GCM Run 847 Complete", description: "Latest GCM run shows stable Coriolis reduction.", severity: "info", created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "a6", project_id: "geocore", event_type: "milestone", title: "Gyrotron Calibration", description: "Gyrotron #1 calibrated to 1.05 MW.", severity: "success", created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "a7", project_id: "chipfold", event_type: "alert", title: "Organoid Batch Failure", description: "Batch #14 failed at day 38. Root cause: contamination.", severity: "error", created_at: new Date(Date.now() - 6 * 86400000).toISOString() },
];

export const MOCK_STATUS: SystemStatusEntry[] = [
  { id: "s1", service_name: "Database", status: "operational", latency_ms: 12, uptime_pct: 99.98, last_check: new Date().toISOString() },
  { id: "s2", service_name: "Realtime Engine", status: "operational", latency_ms: 8, uptime_pct: 99.95, last_check: new Date().toISOString() },
  { id: "s3", service_name: "Globe Renderer", status: "operational", latency_ms: 16, uptime_pct: 99.90, last_check: new Date().toISOString() },
  { id: "s4", service_name: "AI Pipeline", status: "degraded", latency_ms: 245, uptime_pct: 98.20, last_check: new Date().toISOString() },
  { id: "s5", service_name: "Sensor Network", status: "operational", latency_ms: 34, uptime_pct: 99.70, last_check: new Date().toISOString() },
  { id: "s6", service_name: "CDN / Assets", status: "operational", latency_ms: 6, uptime_pct: 99.99, last_check: new Date().toISOString() },
];

export const MOCK_PROGRESS: ProjectProgressEntry[] = [
  { id: "p1", project_id: "deltaspine", phase: "Phase 0 — EIA", progress: 34, status: "active", updated_at: new Date().toISOString() },
  { id: "p2", project_id: "deltaspine", phase: "Phase 1A — Frame", progress: 0, status: "pending", updated_at: new Date().toISOString() },
  { id: "p3", project_id: "geocore", phase: "PoC Well", progress: 18, status: "active", updated_at: new Date().toISOString() },
  { id: "p4", project_id: "geocore", phase: "Phase 1 — 3 Wells", progress: 0, status: "pending", updated_at: new Date().toISOString() },
  { id: "p5", project_id: "terralenta", phase: "GCM Study", progress: 12, status: "active", updated_at: new Date().toISOString() },
  { id: "p6", project_id: "chipfold", phase: "Phase 0 — Sim", progress: 100, status: "complete", updated_at: new Date().toISOString() },
  { id: "p7", project_id: "chipfold", phase: "Phase 1 — Transistor", progress: 65, status: "active", updated_at: new Date().toISOString() },
  { id: "p8", project_id: "fusion", phase: "Architecture", progress: 23, status: "active", updated_at: new Date().toISOString() },
  { id: "p9", project_id: "fusion", phase: "Consortium", progress: 8, status: "active", updated_at: new Date().toISOString() },
];

/** Generate 30 days of mock chart data */
export function generateMockChartData() {
  const days = 30;
  const data = [];
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    data.push({
      date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      drilling: Math.max(0, 1.2 - i * 0.035 + Math.random() * 0.1),
      conductivity: Math.max(0.08, 0.14 - i * 0.002 + Math.random() * 0.01),
      eiaProgress: Math.min(100, 34 - i * 0.8 + Math.random() * 2),
      modelRuns: Math.max(0, 847 - i * 25 + Math.floor(Math.random() * 15)),
    });
  }

  return data;
}

const SIMULATED_EVENTS: Omit<ActivityLogEntry, "id" | "created_at">[] = [
  { project_id: "deltaspine", event_type: "update", title: "Sensor calibration check passed", description: "All 12 prototype sensors within tolerance.", severity: "info" },
  { project_id: "geocore", event_type: "update", title: "Drilling depth +12m", description: "Daily progress report: 12m drilled in basalt layer.", severity: "info" },
  { project_id: "chipfold", event_type: "milestone", title: "Flex cycle test passed", description: "Sample #47 reached 15,000 cycles.", severity: "success" },
  { project_id: "terralenta", event_type: "update", title: "GCM run 848 started", description: "New simulation with adjusted polar parameters.", severity: "info" },
  { project_id: "geocore", event_type: "alert", title: "Temperature spike", description: "Thermocouple #3 reading 12% above expected.", severity: "warning" },
  { project_id: "fusion", event_type: "update", title: "HVDC topology review", description: "Three candidate topologies shortlisted.", severity: "info" },
];

export function getRandomSimulatedEvent(): ActivityLogEntry {
  const event = SIMULATED_EVENTS[Math.floor(Math.random() * SIMULATED_EVENTS.length)];
  return {
    ...event,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
}
