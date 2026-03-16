
-- ═══════════════════════════════════════════
-- 1. TABELA: metric_history (append-only time series)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.metric_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  text NOT NULL,
  metric_key  text NOT NULL,
  value       numeric NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.metric_history IS 'Append-only time series for chart rendering. Populated by trigger on project_metrics update.';

CREATE INDEX IF NOT EXISTS idx_history_project_time
  ON public.metric_history (project_id, metric_key, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_history_recorded
  ON public.metric_history (recorded_at DESC);

-- RLS
ALTER TABLE public.metric_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_history" ON public.metric_history
  FOR SELECT USING (true);

CREATE POLICY "owner_manage_history" ON public.metric_history
  FOR ALL USING (public.has_role(auth.uid(), 'owner'::app_role));

-- ═══════════════════════════════════════════
-- 2. ADD prev_value column to project_metrics
-- ═══════════════════════════════════════════
ALTER TABLE public.project_metrics
  ADD COLUMN IF NOT EXISTS prev_value numeric;

-- ═══════════════════════════════════════════
-- 3. TRIGGERS & FUNCTIONS
-- ═══════════════════════════════════════════

-- 3a. Track prev_value on metric update
CREATE OR REPLACE FUNCTION public.fn_track_prev_value()
RETURNS trigger AS $$
BEGIN
  NEW.prev_value = OLD.metric_value;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_metrics_prev_value ON public.project_metrics;
CREATE TRIGGER trg_metrics_prev_value
  BEFORE UPDATE OF metric_value ON public.project_metrics
  FOR EACH ROW
  WHEN (OLD.metric_value IS DISTINCT FROM NEW.metric_value)
  EXECUTE FUNCTION public.fn_track_prev_value();

-- 3b. Append to metric_history on metric change
CREATE OR REPLACE FUNCTION public.fn_append_metric_history()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.metric_history (project_id, metric_key, value, recorded_at)
  VALUES (NEW.project_id, NEW.metric_key, NEW.metric_value, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_metrics_to_history ON public.project_metrics;
CREATE TRIGGER trg_metrics_to_history
  AFTER UPDATE OF metric_value ON public.project_metrics
  FOR EACH ROW
  WHEN (OLD.metric_value IS DISTINCT FROM NEW.metric_value)
  EXECUTE FUNCTION public.fn_append_metric_history();

-- 3c. Auto-complete phase when progress = 100
CREATE OR REPLACE FUNCTION public.fn_auto_complete_phase()
RETURNS trigger AS $$
BEGIN
  IF NEW.progress >= 100 AND OLD.status != 'complete' THEN
    NEW.status = 'complete';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_progress_auto_complete ON public.project_progress;
CREATE TRIGGER trg_progress_auto_complete
  BEFORE UPDATE OF progress ON public.project_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_auto_complete_phase();

-- ═══════════════════════════════════════════
-- 4. SEED metric_history (30 days)
-- ═══════════════════════════════════════════
DO $$
DECLARE
  d integer;
BEGIN
  FOR d IN REVERSE 30..0 LOOP
    INSERT INTO public.metric_history (project_id, metric_key, value, recorded_at) VALUES
      ('geocore', 'drilling_depth',
        round((0.4 + (30 - d) * 0.027 + random() * 0.05)::numeric, 3),
        now() - (d || ' days')::interval),
      ('deltaspine', 'eia_progress',
        round(least(100, 5 + (30 - d) * 0.97 + random() * 1.5)::numeric, 1),
        now() - (d || ' days')::interval),
      ('chipfold', 'conductivity',
        round((0.06 + (30 - d) * 0.0027 + random() * 0.008)::numeric, 4),
        now() - (d || ' days')::interval),
      ('terralenta', 'model_runs',
        round((100 + (30 - d) * 25 + random() * 15)::numeric, 0),
        now() - (d || ' days')::interval);
  END LOOP;
END $$;
