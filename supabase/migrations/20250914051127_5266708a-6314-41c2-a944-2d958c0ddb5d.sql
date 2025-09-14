-- Enable Row Level Security on all public tables
ALTER TABLE public.Frame ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Game ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenge ENABLE ROW LEVEL SECURITY;

-- Create policies for Frame table (read-only for all users)
CREATE POLICY "Enable read access for all users" ON public.Frame
FOR SELECT USING (true);

-- Create policies for Game table (read-only for all users)
CREATE POLICY "Enable read access for all users" ON public.Game
FOR SELECT USING (true);

-- Create policies for daily_challenge table (read-only for all users)
CREATE POLICY "Enable read access for all users" ON public.daily_challenge
FOR SELECT USING (true);

-- Note: Show table already has RLS enabled and a read policy