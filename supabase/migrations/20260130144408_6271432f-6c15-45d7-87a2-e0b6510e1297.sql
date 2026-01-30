-- Nuova tabella folders
CREATE TABLE public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'hsl(217, 91%, 60%)',
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Aggiungi campo folder_id alla tabella apps (nullable = app non in cartella)
ALTER TABLE public.apps 
ADD COLUMN folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL;

-- Aggiungi campo position_in_folder per ordinare le app dentro le cartelle
ALTER TABLE public.apps 
ADD COLUMN position_in_folder INTEGER DEFAULT 0;

-- RLS per folders (stesse policy delle apps)
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Folders are viewable by everyone" 
  ON public.folders FOR SELECT USING (true);

CREATE POLICY "Only admins can insert folders" 
  ON public.folders FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update folders" 
  ON public.folders FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete folders" 
  ON public.folders FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));