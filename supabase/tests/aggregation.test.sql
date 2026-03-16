-- ═══════════════════════════════════════════════════════════════
-- pgTAP: Tests for metrics_daily_agg materialized view
-- and aggregation infrastructure
-- ═══════════════════════════════════════════════════════════════

begin;
select plan(12);

-- ═══════════════════════════════════════════
-- 1. Materialized view exists
-- ═══════════════════════════════════════════

select has_materialized_view(
  'public', 'metrics_daily_agg',
  'metrics_daily_agg materialized view exists'
);

-- ═══════════════════════════════════════════
-- 2. View has expected columns
-- ═══════════════════════════════════════════

select has_column('public', 'metrics_daily_agg', 'bucket', 'has bucket column');
select has_column('public', 'metrics_daily_agg', 'project_id', 'has project_id column');
select has_column('public', 'metrics_daily_agg', 'metric_key', 'has metric_key column');
select has_column('public', 'metrics_daily_agg', 'avg_value', 'has avg_value column');
select has_column('public', 'metrics_daily_agg', 'min_value', 'has min_value column');
select has_column('public', 'metrics_daily_agg', 'max_value', 'has max_value column');
select has_column('public', 'metrics_daily_agg', 'sample_count', 'has sample_count column');

-- ═══════════════════════════════════════════
-- 3. Indexes exist
-- ═══════════════════════════════════════════

select has_index(
  'public', 'metrics_daily_agg', 'idx_metrics_daily_agg_unique',
  'unique index on (bucket, project_id, metric_key) exists'
);

select has_index(
  'public', 'metrics_daily_agg', 'idx_metrics_daily_agg_project',
  'project lookup index exists'
);

-- ═══════════════════════════════════════════
-- 4. Refresh function exists
-- ═══════════════════════════════════════════

select has_function(
  'public', 'fn_refresh_metrics_daily', array[]::text[],
  'fn_refresh_metrics_daily function exists'
);

-- ═══════════════════════════════════════════
-- 5. Verify metric_history source table
-- ═══════════════════════════════════════════

select has_table('public', 'metric_history', 'metric_history source table exists');
select col_not_null('public', 'metric_history', 'value', 'metric_history.value is NOT NULL');

select * from finish();
rollback;
