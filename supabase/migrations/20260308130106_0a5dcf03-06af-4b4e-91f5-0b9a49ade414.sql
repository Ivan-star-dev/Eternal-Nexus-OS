
-- 1. User roles enum and table
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'government', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can see own roles, owners can see all
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Owners can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'owner'));

-- 2. Government bids table
CREATE TABLE public.government_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id TEXT NOT NULL,
  bid_type TEXT NOT NULL DEFAULT 'expression_of_interest',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  institution TEXT,
  country TEXT,
  contact_name TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.government_bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bids" ON public.government_bids
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bids" ON public.government_bids
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can view all bids" ON public.government_bids
  FOR SELECT USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Owners can update bids" ON public.government_bids
  FOR UPDATE USING (public.has_role(auth.uid(), 'owner'));

-- 3. Edit logs table
CREATE TABLE public.edit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  changes JSONB,
  institution TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.edit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view all edit logs" ON public.edit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Authenticated users can insert logs" ON public.edit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Add gov ID fields to government_profiles
ALTER TABLE public.government_profiles
  ADD COLUMN IF NOT EXISTS gov_id_type TEXT,
  ADD COLUMN IF NOT EXISTS gov_id_number TEXT,
  ADD COLUMN IF NOT EXISTS gov_id_country TEXT,
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending';

-- 5. Trigger for updated_at on government_bids
CREATE TRIGGER update_government_bids_updated_at
  BEFORE UPDATE ON public.government_bids
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Enable realtime for bids
ALTER PUBLICATION supabase_realtime ADD TABLE public.government_bids;
