
-- Chat messages table for real-time communication
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  sender_institution TEXT,
  sender_country TEXT,
  message TEXT NOT NULL,
  is_owner_reply BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert their own messages
CREATE POLICY "Users can insert own messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Users can view messages in projects they participate in
CREATE POLICY "Users can view project messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid()
    OR public.has_role(auth.uid(), 'owner')
  );

-- Owners can insert replies
CREATE POLICY "Owners can insert replies"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
