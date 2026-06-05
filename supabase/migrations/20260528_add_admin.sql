-- Migration to add admin capabilities to profiles table

-- 1. Add is_admin column if it doesn't already exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Mark specific default accounts as administrator
UPDATE public.profiles SET is_admin = TRUE WHERE email = 'admin@candidature-express.fr';
UPDATE public.profiles SET is_admin = TRUE WHERE email = 'admin@example.com';

-- 3. Add admin policies to profiles table (to allow admins to view/update all profiles)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (
    (auth.uid() = id) OR
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
  );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE
  USING (
    (auth.uid() = id) OR
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
  );

-- 4. Add admin policies to resumes table
DROP POLICY IF EXISTS "Admins can manage all resumes" ON public.resumes;
CREATE POLICY "Admins can manage all resumes" ON public.resumes
  FOR ALL
  USING (
    (auth.uid() = user_id) OR
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
  );

-- 5. Add admin policies to cover_letters table
DROP POLICY IF EXISTS "Admins can manage all cover letters" ON public.cover_letters;
CREATE POLICY "Admins can manage all cover letters" ON public.cover_letters
  FOR ALL
  USING (
    (auth.uid() = user_id) OR
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
  );
