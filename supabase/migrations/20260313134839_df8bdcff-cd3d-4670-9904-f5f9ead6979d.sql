
-- Daily aggregation view for metric_history
-- Simulates TimescaleDB continuous aggregates without the extension

CREATE MATERIALIZED VIEW IF NOT EXISTS public.metrics_daily_agg AS
SELECT
  date_trunc('day', recorded_at)::date AS bucket,
  project_id,
  metric_key,
  avg(value)::numeric(12,4)    AS avg_value,
  min(value)::numeric(12,4)    AS min_value,
  max(value)::numeric(12,4)    AS max_value,
  count(*)                      AS sample_count
FROM public.metric_history
GROUP BY bucket, project_id, metric_key
ORDER BY bucket DESC;

-- Index for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_metrics_daily_agg_unique
  ON public.metrics_daily_agg (bucket, project_id, metric_key);

CREATE INDEX IF NOT EXISTS idx_metrics_daily_agg_project
  ON public.metrics_daily_agg (project_id, metric_key, bucket DESC);

-- Function to refresh the materialized view (callable from cron or edge function)
CREATE OR REPLACE FUNCTION public.fn_refresh_metrics_daily()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.metrics_daily_agg;
END;
$$;
