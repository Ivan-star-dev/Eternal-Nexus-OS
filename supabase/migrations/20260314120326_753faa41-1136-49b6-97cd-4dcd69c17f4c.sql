CREATE TABLE public.globe_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  lat numeric NOT NULL,
  lon numeric NOT NULL,
  color text NOT NULL DEFAULT '#ffd700',
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'Ω CLEARANCE',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.globe_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own projects"
  ON public.globe_projects FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all projects"
  ON public.globe_projects FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can delete own projects"
  ON public.globe_projects FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.globe_projects FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);