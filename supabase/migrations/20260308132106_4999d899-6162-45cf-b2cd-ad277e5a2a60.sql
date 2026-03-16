
-- Document revisions table for version history with attribution and copyright
CREATE TABLE public.document_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  document_name TEXT NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  revision_notes TEXT,
  storage_path TEXT NOT NULL,
  file_size BIGINT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_institution TEXT,
  copyright_holder TEXT NOT NULL DEFAULT 'Ivanildo Michel Monteiro Fernandes',
  copyright_year INTEGER NOT NULL DEFAULT 2026,
  license_type TEXT NOT NULL DEFAULT 'ALL_RIGHTS_RESERVED',
  classification TEXT NOT NULL DEFAULT 'CONFIDENTIAL',
  is_current BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, document_name, version_number)
);

ALTER TABLE public.document_revisions ENABLE ROW LEVEL SECURITY;

-- Owner can do everything
CREATE POLICY "Owners can manage revisions"
  ON public.document_revisions FOR ALL
  USING (public.has_role(auth.uid(), 'owner'::app_role));

-- Authenticated users can view current revisions
CREATE POLICY "Authenticated can view current revisions"
  ON public.document_revisions FOR SELECT
  TO authenticated
  USING (is_current = true);

-- Owner can view all revisions including old ones
CREATE POLICY "Owners can view all revisions"
  ON public.document_revisions FOR SELECT
  USING (public.has_role(auth.uid(), 'owner'::app_role));
