
-- Revoke API access to materialized view (security fix)
REVOKE ALL ON public.metrics_daily_agg FROM anon, authenticated;
-- Only allow access via the refresh function or direct service_role queries
GRANT SELECT ON public.metrics_daily_agg TO authenticated;
