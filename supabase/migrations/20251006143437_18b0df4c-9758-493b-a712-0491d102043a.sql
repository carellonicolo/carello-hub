-- Create apps table for managing dashboard icons
CREATE TABLE public.apps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  href TEXT NOT NULL,
  color TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read apps (public dashboard)
CREATE POLICY "Apps are viewable by everyone" 
ON public.apps 
FOR SELECT 
USING (true);

-- For now, allow anyone to manage apps (you can restrict to admin later)
CREATE POLICY "Anyone can insert apps" 
ON public.apps 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update apps" 
ON public.apps 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete apps" 
ON public.apps 
FOR DELETE 
USING (true);

-- Create index on position for ordering
CREATE INDEX idx_apps_position ON public.apps(position);