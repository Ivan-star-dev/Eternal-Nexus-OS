
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own messages"
  ON public.ai_chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own messages"
  ON public.ai_chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON public.ai_chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_ai_chat_project_agent ON public.ai_chat_messages (user_id, project_id, agent_id, created_at);
