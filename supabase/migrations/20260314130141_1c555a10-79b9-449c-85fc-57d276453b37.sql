
CREATE TABLE public.nexus_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  prompt text NOT NULL,
  domain text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'pending',
  data_sources jsonb DEFAULT '[]'::jsonb,
  agent_results jsonb DEFAULT '{}'::jsonb,
  unified_analysis text,
  data_snapshot jsonb DEFAULT '{}'::jsonb,
  integrity_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.nexus_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own simulations"
  ON public.nexus_simulations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own simulations"
  ON public.nexus_simulations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations"
  ON public.nexus_simulations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can read all simulations"
  ON public.nexus_simulations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));
