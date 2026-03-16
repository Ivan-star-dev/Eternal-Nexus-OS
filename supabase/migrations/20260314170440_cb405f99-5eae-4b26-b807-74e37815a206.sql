
-- Public contributions table
CREATE TABLE public.public_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  votes_up integer NOT NULL DEFAULT 0,
  votes_down integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.public_contributions ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Public read contributions" ON public.public_contributions
  FOR SELECT TO public USING (true);

-- Authenticated users can insert own
CREATE POLICY "Auth users can insert contributions" ON public.public_contributions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Contribution votes table (tracks who voted)
CREATE TABLE public.contribution_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id uuid REFERENCES public.public_contributions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contribution_id, user_id)
);

ALTER TABLE public.contribution_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read votes" ON public.contribution_votes
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth users can insert votes" ON public.contribution_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Auth users can update own votes" ON public.contribution_votes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Auth users can delete own votes" ON public.contribution_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Function to update vote counts
CREATE OR REPLACE FUNCTION public.fn_update_contribution_votes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.public_contributions SET
      votes_up = (SELECT count(*) FROM public.contribution_votes WHERE contribution_id = NEW.contribution_id AND vote_type = 'up'),
      votes_down = (SELECT count(*) FROM public.contribution_votes WHERE contribution_id = NEW.contribution_id AND vote_type = 'down')
    WHERE id = NEW.contribution_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.public_contributions SET
      votes_up = (SELECT count(*) FROM public.contribution_votes WHERE contribution_id = OLD.contribution_id AND vote_type = 'up'),
      votes_down = (SELECT count(*) FROM public.contribution_votes WHERE contribution_id = OLD.contribution_id AND vote_type = 'down')
    WHERE id = OLD.contribution_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER trg_update_contribution_votes
AFTER INSERT OR UPDATE OR DELETE ON public.contribution_votes
FOR EACH ROW EXECUTE FUNCTION public.fn_update_contribution_votes();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_contributions;
