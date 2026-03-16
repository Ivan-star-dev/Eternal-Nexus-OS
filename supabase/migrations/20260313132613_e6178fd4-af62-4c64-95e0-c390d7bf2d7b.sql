
-- Dashboard tables for Phase 3 Realtime Dashboard

CREATE TABLE IF NOT EXISTS public.project_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  metric_key text NOT NULL,
  metric_value numeric NOT NULL,
  unit text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, metric_key)
);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text,
  event_type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  description text,
  severity text NOT NULL DEFAULT 'info',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.system_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'operational',
  latency_ms numeric DEFAULT 0,
  uptime_pct numeric DEFAULT 100,
  last_check timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  phase text NOT NULL,
  progress numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, phase)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_metrics_project ON public.project_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_project ON public.project_progress(project_id);

-- RLS
ALTER TABLE public.project_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_progress ENABLE ROW LEVEL SECURITY;

-- Public read policies (dashboard is public-facing)
CREATE POLICY "Public read metrics" ON public.project_metrics FOR SELECT USING (true);
CREATE POLICY "Public read activity" ON public.activity_log FOR SELECT USING (true);
CREATE POLICY "Public read status" ON public.system_status FOR SELECT USING (true);
CREATE POLICY "Public read progress" ON public.project_progress FOR SELECT USING (true);

-- Owner write policies
CREATE POLICY "Owners can manage metrics" ON public.project_metrics FOR ALL USING (public.has_role(auth.uid(), 'owner'::app_role));
CREATE POLICY "Owners can manage activity" ON public.activity_log FOR ALL USING (public.has_role(auth.uid(), 'owner'::app_role));
CREATE POLICY "Owners can manage status" ON public.system_status FOR ALL USING (public.has_role(auth.uid(), 'owner'::app_role));
CREATE POLICY "Owners can manage progress" ON public.project_progress FOR ALL USING (public.has_role(auth.uid(), 'owner'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_progress;
