-- AI Generations History Table
CREATE TABLE public.ai_generations_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_generations_log ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own AI logs" ON public.ai_generations_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own AI logs" ON public.ai_generations_log FOR INSERT WITH CHECK (auth.uid() = user_id);
