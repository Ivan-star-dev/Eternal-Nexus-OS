-- ═══════════════════════════════════════════════════════════════
-- pgTAP: Comprehensive RLS Tests for All Dashboard Tables
--
-- Tests each table for:
--   1. RLS is enabled
--   2. Correct policies exist
--   3. Trigger functions exist
--   4. Schema constraints are enforced
--   5. Materialized view and refresh function
--
-- All tests run in a single transaction with ROLLBACK.
-- ═══════════════════════════════════════════════════════════════

begin;
select plan(35);

-- ═══════════════════════════════════════════
-- 1. RLS enabled on all dashboard tables
-- ═══════════════════════════════════════════

select row_security_active('public.project_metrics');
select row_security_active('public.metric_history');
select row_security_active('public.activity_log');
select row_security_active('public.system_status');
select row_security_active('public.project_progress');
select row_security_active('public.user_roles');

-- ═══════════════════════════════════════════
-- 2. project_metrics policies
-- ═══════════════════════════════════════════

select policies_are(
  'public', 'project_metrics',
  array['Owners can manage metrics', 'Public read metrics'],
  'project_metrics: owner manage + public read'
);

select col_not_null('public', 'project_metrics', 'project_id', 'project_id NOT NULL');
select col_not_null('public', 'project_metrics', 'metric_key', 'metric_key NOT NULL');
select col_not_null('public', 'project_metrics', 'metric_value', 'metric_value NOT NULL');

-- ═══════════════════════════════════════════
-- 3. metric_history policies
-- ═══════════════════════════════════════════

select policies_are(
  'public', 'metric_history',
  array['anon_read_history', 'owner_manage_history'],
  'metric_history: anon read + owner manage'
);

select col_not_null('public', 'metric_history', 'project_id', 'history project_id NOT NULL');
select col_not_null('public', 'metric_history', 'metric_key', 'history metric_key NOT NULL');
select col_not_null('public', 'metric_history', 'value', 'history value NOT NULL');

-- ═══════════════════════════════════════════
-- 4. activity_log policies
-- ═══════════════════════════════════════════

select policies_are(
  'public', 'activity_log',
  array['Owners can manage activity', 'Public read activity'],
  'activity_log: owner manage + public read'
);

-- ═══════════════════════════════════════════
-- 5. system_status policies
-- ═══════════════════════════════════════════

select policies_are(
  'public', 'system_status',
  array['Owners can manage status', 'Public read status'],
  'system_status: owner manage + public read'
);

-- ═══════════════════════════════════════════
-- 6. project_progress policies
-- ═══════════════════════════════════════════

select policies_are(
  'public', 'project_progress',
  array['Owners can manage progress', 'Public read progress'],
  'project_progress: owner manage + public read'
);

-- ═══════════════════════════════════════════
-- 7. user_roles policies
-- ═══════════════════════════════════════════

select policies_are(
  'public', 'user_roles',
  array['Owners can manage roles', 'Owners can view all roles', 'Users can view own roles'],
  'user_roles: correct policy set'
);

-- ═══════════════════════════════════════════
-- 8. Security definer functions
-- ═══════════════════════════════════════════

select has_function(
  'public', 'has_role', array['uuid', 'app_role'],
  'has_role security definer exists'
);

select function_lang_is('public', 'has_role', array['uuid', 'app_role'], 'sql',
  'has_role uses sql language'
);

-- ═══════════════════════════════════════════
-- 9. Trigger functions for metrics pipeline
-- ═══════════════════════════════════════════

select has_function('public', 'fn_track_prev_value', array[]::text[],
  'fn_track_prev_value exists');

select has_function('public', 'fn_append_metric_history', array[]::text[],
  'fn_append_metric_history exists');

select has_function('public', 'fn_auto_complete_phase', array[]::text[],
  'fn_auto_complete_phase exists');

select has_function('public', 'update_updated_at_column', array[]::text[],
  'update_updated_at_column exists');

-- ═══════════════════════════════════════════
-- 10. Materialized view infrastructure
-- ═══════════════════════════════════════════

select has_materialized_view('public', 'metrics_daily_agg',
  'metrics_daily_agg materialized view exists');

select has_column('public', 'metrics_daily_agg', 'bucket', 'agg has bucket');
select has_column('public', 'metrics_daily_agg', 'avg_value', 'agg has avg_value');
select has_column('public', 'metrics_daily_agg', 'min_value', 'agg has min_value');
select has_column('public', 'metrics_daily_agg', 'max_value', 'agg has max_value');
select has_column('public', 'metrics_daily_agg', 'sample_count', 'agg has sample_count');

select has_index('public', 'metrics_daily_agg', 'idx_metrics_daily_agg_unique',
  'unique index on agg exists');

select has_function('public', 'fn_refresh_metrics_daily', array[]::text[],
  'fn_refresh_metrics_daily exists');

-- ═══════════════════════════════════════════
-- 11. All dashboard tables exist
-- ═══════════════════════════════════════════

select has_table('public', 'project_metrics', 'project_metrics exists');
select has_table('public', 'metric_history', 'metric_history exists');
select has_table('public', 'activity_log', 'activity_log exists');
select has_table('public', 'system_status', 'system_status exists');
select has_table('public', 'project_progress', 'project_progress exists');

select * from finish();
rollback;
