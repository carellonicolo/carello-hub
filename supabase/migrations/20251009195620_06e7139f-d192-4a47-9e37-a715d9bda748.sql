-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;

-- RLS policy: users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Update RLS policies for apps table to require admin role
DROP POLICY IF EXISTS "Authenticated users can insert apps" ON public.apps;
DROP POLICY IF EXISTS "Authenticated users can update apps" ON public.apps;
DROP POLICY IF EXISTS "Authenticated users can delete apps" ON public.apps;

-- Create admin-only policies for app management
CREATE POLICY "Only admins can insert apps"
  ON public.apps
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update apps"
  ON public.apps
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete apps"
  ON public.apps
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));