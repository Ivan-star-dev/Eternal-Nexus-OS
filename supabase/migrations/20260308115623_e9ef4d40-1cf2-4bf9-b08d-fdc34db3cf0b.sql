
-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Government profiles table
CREATE TABLE public.government_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  institution TEXT NOT NULL,
  country TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  official_email TEXT NOT NULL,
  phone TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.government_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.government_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.government_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.government_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_government_profiles_updated_at
  BEFORE UPDATE ON public.government_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Download logs table
CREATE TABLE public.download_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  document_name TEXT NOT NULL,
  institution TEXT,
  country TEXT,
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own downloads"
  ON public.download_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads"
  ON public.download_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Project notes table
CREATE TABLE public.project_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'interest', 'feedback', 'question')),
  content TEXT NOT NULL,
  institution TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON public.project_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON public.project_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.project_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.project_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_project_notes_updated_at
  BEFORE UPDATE ON public.project_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_download_logs_project ON public.download_logs(project_id);
CREATE INDEX idx_download_logs_user ON public.download_logs(user_id);
CREATE INDEX idx_project_notes_project ON public.project_notes(project_id);
CREATE INDEX idx_project_notes_user ON public.project_notes(user_id);
