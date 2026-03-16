-- supabase/tests/fixtures/timeseries_fixtures.sql
-- ═══════════════════════════════════════════════════════════════
-- Fixtures for metric_history time-series testing
--
-- Generates 48h of data at 2-second intervals (~86K points)
-- spanning multiple natural day boundaries for aggregation tests.
-- ═══════════════════════════════════════════════════════════════

set session_replication_role = 'replica';

insert into public.metric_history (project_id, metric_key, value, recorded_at)
select
  'project_alpha',
  'temperature',
  (20 + 5 * sin(n::float / 3600) + random())::numeric(10,2),
  '2024-01-01T00:00:00Z'::timestamptz + (n * interval '2 seconds')
from generate_series(0, 86400) as n;

-- Second series for multi-metric aggregation testing
insert into public.metric_history (project_id, metric_key, value, recorded_at)
select
  'project_alpha',
  'pressure',
  (1013 + 10 * cos(n::float / 1800) + random() * 2)::numeric(10,2),
  '2024-01-01T00:00:00Z'::timestamptz + (n * interval '2 seconds')
from generate_series(0, 86400) as n;

-- Different project for isolation tests
insert into public.metric_history (project_id, metric_key, value, recorded_at)
select
  'project_beta',
  'depth',
  (3000 + n::float / 100)::numeric(10,2),
  '2024-01-01T00:00:00Z'::timestamptz + (n * interval '10 seconds')
from generate_series(0, 17280) as n;

set session_replication_role = 'origin';

analyze public.metric_history;
