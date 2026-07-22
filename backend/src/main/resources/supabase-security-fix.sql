-- ====================================================================
-- Supabase Security Remediation Script for ChitChat-Application
-- Project Reference: bkwgfmaynsxiqcegzbhg
-- ====================================================================
-- Description:
-- 1. Enables Row Level Security (RLS) on all public schema tables.
-- 2. Revokes public API privileges from 'anon' and 'authenticated' roles.
-- 3. Adds explicit deny-all policies to clear Supabase Linter INFO notices.
--
-- Note: Your Spring Boot backend connects via JDBC as the database superuser
-- (postgres), so it bypasses RLS and will continue to function normally.
-- ====================================================================

-- 1. Enable Row-Level Security (RLS) on all application tables
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.message_seen ENABLE ROW LEVEL SECURITY;

-- 2. Revoke public API privileges from Supabase 'anon' and 'authenticated' roles
REVOKE ALL ON TABLE public.users FROM anon, authenticated;
REVOKE ALL ON TABLE public.rooms FROM anon, authenticated;
REVOKE ALL ON TABLE public.room_members FROM anon, authenticated;
REVOKE ALL ON TABLE public.messages FROM anon, authenticated;
REVOKE ALL ON TABLE public.message_seen FROM anon, authenticated;

-- 3. Create explicit default-deny policies to satisfy Supabase DB Linter (clears rls_enabled_no_policy INFO warnings)
DROP POLICY IF EXISTS "Deny public API access to users" ON public.users;
CREATE POLICY "Deny public API access to users" ON public.users FOR ALL USING (false);

DROP POLICY IF EXISTS "Deny public API access to rooms" ON public.rooms;
CREATE POLICY "Deny public API access to rooms" ON public.rooms FOR ALL USING (false);

DROP POLICY IF EXISTS "Deny public API access to room_members" ON public.room_members;
CREATE POLICY "Deny public API access to room_members" ON public.room_members FOR ALL USING (false);

DROP POLICY IF EXISTS "Deny public API access to messages" ON public.messages;
CREATE POLICY "Deny public API access to messages" ON public.messages FOR ALL USING (false);

DROP POLICY IF EXISTS "Deny public API access to message_seen" ON public.message_seen;
CREATE POLICY "Deny public API access to message_seen" ON public.message_seen FOR ALL USING (false);

-- Optional verification query: Check RLS status of public tables
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM 
    pg_tables 
WHERE 
    schemaname = 'public';
