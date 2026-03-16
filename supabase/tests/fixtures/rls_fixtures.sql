-- supabase/tests/fixtures/rls_fixtures.sql
-- ═══════════════════════════════════════════════════════════════
-- Minimal fixtures for RLS tests
--
-- Principle: 2-3 rows per entity per project is sufficient
-- to distinguish "I see what I should" from "I see what I shouldn't".
-- Uses deterministic values for reproducibility.
-- ═══════════════════════════════════════════════════════════════

set session_replication_role = 'replica';

-- ── Project metrics (public read, owner write) ──
insert into public.project_metrics (project_id, metric_key, metric_value, unit)
values
  ('project_alpha', 'temperature', 42.5, '°C'),
  ('project_alpha', 'pressure', 1013.25, 'hPa'),
  ('project_beta',  'depth', 3200, 'm'),
  ('project_beta',  'flow_rate', 85.2, 'L/min');

-- ── Project progress ──
insert into public.project_progress (project_id, phase, progress, status)
values
  ('project_alpha', 'Design', 75, 'active'),
  ('project_alpha', 'EIA', 30, 'pending'),
  ('project_beta',  'Drilling', 45, 'active');

-- ── Metric history ──
insert into public.metric_history (project_id, metric_key, value, recorded_at)
select
  project_id, metric_key,
  (sin(n::float / 5) * 25 + 50)::numeric(10,2),
  '2024-06-01T00:00:00Z'::timestamptz + (n || ' hours')::interval
from
  generate_series(0, 9) as n,
  (values
    ('project_alpha', 'temperature'),
    ('project_beta', 'depth')
  ) as m(project_id, metric_key);

-- ── Activity log ──
insert into public.activity_log (title, event_type, severity, project_id)
values
  ('Sensor calibrated', 'maintenance', 'info', 'project_alpha'),
  ('Threshold exceeded', 'alert', 'warning', 'project_beta');

-- ── System status ──
insert into public.system_status (service_name, status, uptime_pct, latency_ms)
values
  ('Core API', 'operational', 99.95, 12),
  ('Data Pipeline', 'operational', 99.80, 45);

set session_replication_role = 'origin';

analyze public.project_metrics;
analyze public.project_progress;
analyze public.metric_history;
analyze public.activity_log;
analyze public.system_status;
