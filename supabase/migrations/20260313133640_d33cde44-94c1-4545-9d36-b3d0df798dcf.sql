
-- Add columns first
ALTER TABLE public.project_metrics
  ADD COLUMN IF NOT EXISTS min_value numeric,
  ADD COLUMN IF NOT EXISTS max_value numeric;

-- Then constraints
ALTER TABLE public.project_progress
  ADD CONSTRAINT chk_progress_range CHECK (progress >= 0 AND progress <= 100);

ALTER TABLE public.system_status
  ADD CONSTRAINT chk_latency_positive CHECK (latency_ms >= 0);

ALTER TABLE public.system_status
  ADD CONSTRAINT chk_uptime_range CHECK (uptime_pct >= 0 AND uptime_pct <= 100);

ALTER TABLE public.project_metrics
  ADD CONSTRAINT chk_metric_bounds CHECK (
    (min_value IS NULL AND max_value IS NULL) OR
    (min_value IS NULL OR max_value IS NULL) OR
    (min_value <= max_value)
  );
