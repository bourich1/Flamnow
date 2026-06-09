-- ====================================================================
-- Supabase Security Setup: Row Level Security (RLS) & Storage Rules
-- Paste this script into the Supabase SQL Editor to enforce security.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Enable Row Level Security (RLS) on all tables
-- --------------------------------------------------------------------
ALTER TABLE IF EXISTS public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 2. Clean up existing policies (prevents duplicate policy errors)
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view admins list" ON public.admins;
DROP POLICY IF EXISTS "Enable read access for all users on services" ON public.services;
DROP POLICY IF EXISTS "Enable write access for admins on services" ON public.services;
DROP POLICY IF EXISTS "Enable read access for all users on projects" ON public.projects;
DROP POLICY IF EXISTS "Enable write access for admins on projects" ON public.projects;
DROP POLICY IF EXISTS "Enable read access for all users on clients" ON public.clients;
DROP POLICY IF EXISTS "Enable write access for admins on clients" ON public.clients;
DROP POLICY IF EXISTS "Enable read access for all users on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Enable write access for admins on testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Enable read access for all users on faqs" ON public.faqs;
DROP POLICY IF EXISTS "Enable write access for admins on faqs" ON public.faqs;
DROP POLICY IF EXISTS "Enable read access for all users on team_members" ON public.team_members;
DROP POLICY IF EXISTS "Enable write access for admins on team_members" ON public.team_members;
DROP POLICY IF EXISTS "Enable public inserts for contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable read access for admins on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable update access for admins on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable delete access for admins on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable public inserts for analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Enable read access for admins on analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Enable read access for all users on site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Enable write access for admins on site_settings" ON public.site_settings;

-- --------------------------------------------------------------------
-- 3. Core Database Policies
-- --------------------------------------------------------------------

-- Admins Table
CREATE POLICY "Admins can view admins list" 
ON public.admins FOR SELECT TO authenticated USING (true);

-- Services Table
CREATE POLICY "Enable read access for all users on services" 
ON public.services FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on services" 
ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Projects Table
CREATE POLICY "Enable read access for all users on projects" 
ON public.projects FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on projects" 
ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Clients Table
CREATE POLICY "Enable read access for all users on clients" 
ON public.clients FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on clients" 
ON public.clients FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Testimonials Table
CREATE POLICY "Enable read access for all users on testimonials" 
ON public.testimonials FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on testimonials" 
ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- FAQs Table
CREATE POLICY "Enable read access for all users on faqs" 
ON public.faqs FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on faqs" 
ON public.faqs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Team Members Table
CREATE POLICY "Enable read access for all users on team_members" 
ON public.team_members FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on team_members" 
ON public.team_members FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Contact Messages Table (Admin manages, public submits)
CREATE POLICY "Enable public inserts for contact_messages" 
ON public.contact_messages FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable read access for admins on contact_messages" 
ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Enable update access for admins on contact_messages" 
ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Enable delete access for admins on contact_messages" 
ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- Analytics Events Table (Admin views, public submits page views)
CREATE POLICY "Enable public inserts for analytics_events" 
ON public.analytics_events FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable read access for admins on analytics_events" 
ON public.analytics_events FOR SELECT TO authenticated USING (public.is_admin());

-- Site Settings Table
CREATE POLICY "Enable read access for all users on site_settings" 
ON public.site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on site_settings" 
ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- --------------------------------------------------------------------
-- 4. Secure Storage Policies (storage.objects table)
-- --------------------------------------------------------------------

-- Allow public to select/read files from our 5 specific public buckets
DROP POLICY IF EXISTS "Public Select Storage Objects" ON storage.objects;
CREATE POLICY "Public Select Storage Objects"
ON storage.objects FOR SELECT TO public
USING (bucket_id IN ('brand-assets', 'project-images', 'client-logos', 'team-avatars', 'testimonial-avatars'));

-- Allow authenticated admin users to insert/upload new files to these buckets
DROP POLICY IF EXISTS "Admin Insert Storage Objects" ON storage.objects;
CREATE POLICY "Admin Insert Storage Objects"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id IN ('brand-assets', 'project-images', 'client-logos', 'team-avatars', 'testimonial-avatars') 
    AND public.is_admin()
);

-- Allow authenticated admin users to update files in these buckets
DROP POLICY IF EXISTS "Admin Update Storage Objects" ON storage.objects;
CREATE POLICY "Admin Update Storage Objects"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id IN ('brand-assets', 'project-images', 'client-logos', 'team-avatars', 'testimonial-avatars') 
    AND public.is_admin()
);

-- Allow authenticated admin users to delete files in these buckets
DROP POLICY IF EXISTS "Admin Delete Storage Objects" ON storage.objects;
CREATE POLICY "Admin Delete Storage Objects"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id IN ('brand-assets', 'project-images', 'client-logos', 'team-avatars', 'testimonial-avatars') 
    AND public.is_admin()
);
