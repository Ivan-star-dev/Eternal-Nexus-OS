
-- Create storage bucket for whitepapers
INSERT INTO storage.buckets (id, name, public)
VALUES ('whitepapers', 'whitepapers', false);

-- RLS: Only owners can upload files
CREATE POLICY "Owners can upload whitepapers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'whitepapers' AND
  public.has_role(auth.uid(), 'owner')
);

-- RLS: Only owners can update/delete files
CREATE POLICY "Owners can manage whitepapers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'whitepapers' AND
  public.has_role(auth.uid(), 'owner')
);

CREATE POLICY "Owners can delete whitepapers"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'whitepapers' AND
  public.has_role(auth.uid(), 'owner')
);

-- RLS: Authenticated users can download (read) whitepapers
CREATE POLICY "Authenticated users can download whitepapers"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'whitepapers' AND
  auth.role() = 'authenticated'
);
