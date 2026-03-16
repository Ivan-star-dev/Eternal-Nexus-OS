
-- Notifications table for tracking email notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage notifications"
  ON public.notifications FOR ALL
  USING (public.has_role(auth.uid(), 'owner'::app_role));

-- Function to create notification on new bid
CREATE OR REPLACE FUNCTION public.notify_on_new_bid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (
    recipient_email,
    notification_type,
    subject,
    body,
    metadata
  ) VALUES (
    'owner@nextpathinfra.com',
    'new_bid',
    'New ' || REPLACE(NEW.bid_type, '_', ' ') || ': ' || NEW.subject,
    'A new ' || REPLACE(NEW.bid_type, '_', ' ') || ' has been submitted by ' || COALESCE(NEW.contact_name, 'Unknown') || ' from ' || COALESCE(NEW.institution, 'Unknown institution') || ' (' || COALESCE(NEW.country, 'Unknown') || ').' || E'\n\nSubject: ' || NEW.subject || E'\n\nMessage: ' || NEW.message,
    jsonb_build_object('bid_id', NEW.id, 'project_id', NEW.project_id, 'institution', NEW.institution, 'country', NEW.country, 'bid_type', NEW.bid_type)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_bid_notify
  AFTER INSERT ON public.government_bids
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_new_bid();

-- Function to create notification on whitepaper download
CREATE OR REPLACE FUNCTION public.notify_on_download()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (
    recipient_email,
    notification_type,
    subject,
    body,
    metadata
  ) VALUES (
    'owner@nextpathinfra.com',
    'document_download',
    'Document Downloaded: ' || NEW.document_name,
    'Document "' || NEW.document_name || '" was downloaded from project ' || NEW.project_id || ' by a user from ' || COALESCE(NEW.institution, 'Unknown institution') || ' (' || COALESCE(NEW.country, 'Unknown') || ').',
    jsonb_build_object('download_id', NEW.id, 'project_id', NEW.project_id, 'document', NEW.document_name, 'institution', NEW.institution, 'country', NEW.country)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_download_notify
  AFTER INSERT ON public.download_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_download();
