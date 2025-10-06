-- Update RLS policies for apps table to require authentication

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can insert apps" ON public.apps;
DROP POLICY IF EXISTS "Anyone can update apps" ON public.apps;
DROP POLICY IF EXISTS "Anyone can delete apps" ON public.apps;

-- Create new secure policies that require authentication
CREATE POLICY "Authenticated users can insert apps" 
ON public.apps 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update apps" 
ON public.apps 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete apps" 
ON public.apps 
FOR DELETE 
TO authenticated
USING (true);