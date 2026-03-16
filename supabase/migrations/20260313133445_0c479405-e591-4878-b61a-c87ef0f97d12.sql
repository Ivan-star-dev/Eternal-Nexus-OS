
CREATE OR REPLACE FUNCTION public.fn_track_prev_value()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.prev_value = OLD.metric_value;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_append_metric_history()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.metric_history (project_id, metric_key, value, recorded_at)
  VALUES (NEW.project_id, NEW.metric_key, NEW.metric_value, now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_auto_complete_phase()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.progress >= 100 AND OLD.status != 'complete' THEN
    NEW.status = 'complete';
  END IF;
  RETURN NEW;
END;
$$;
