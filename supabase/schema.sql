-- =======================================================
-- Supabase Database Schema
-- Paste this script into the Supabase SQL Editor to set up your database.
-- =======================================================

-- -------------------------------------------------------
-- Helper: Trigger to automatically update updated_at timestamps
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------
-- 1. Admins Table & Admin Security Check Function
-- -------------------------------------------------------
-- Links to auth.users. Users in this table are recognized as site administrators.
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Admin Security Policies
CREATE POLICY "Admins can view admins list" 
ON public.admins FOR SELECT TO authenticated USING (true);

-- Create a secure function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- -------------------------------------------------------
-- 2. Services Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY, -- String identifier (e.g. 'branding')
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    benefits TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    metric_label TEXT,
    metric_value TEXT,
    color TEXT NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Services Policies
CREATE POLICY "Enable read access for all users on services" 
ON public.services FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on services" 
ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- -------------------------------------------------------
-- 3. Projects Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY, -- String identifier (e.g. 'volt-audio')
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Branding', 'Digital', 'Campaigns', 'Production')),
    year TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    results TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    color TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    cover_image TEXT NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects Policies
CREATE POLICY "Enable read access for all users on projects" 
ON public.projects FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on projects" 
ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- -------------------------------------------------------
-- 4. Clients Table (Brand Logos/Names)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL UNIQUE
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Clients Policies
CREATE POLICY "Enable read access for all users on clients" 
ON public.clients FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on clients" 
ON public.clients FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- -------------------------------------------------------
-- 5. Testimonials Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY, -- String identifier (e.g. 't1')
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    metric TEXT NOT NULL,
    metric_label TEXT NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Testimonials Policies
CREATE POLICY "Enable read access for all users on testimonials" 
ON public.testimonials FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on testimonials" 
ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- -------------------------------------------------------
-- 6. FAQs Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- FAQs Policies
CREATE POLICY "Enable read access for all users on faqs" 
ON public.faqs FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on faqs" 
ON public.faqs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- -------------------------------------------------------
-- 7. Team Members Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_members (
    id TEXT PRIMARY KEY, -- String identifier (e.g. 'm1')
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NOT NULL,
    specialty TEXT NOT NULL,
    instagram TEXT DEFAULT '#' NOT NULL,
    linkedin TEXT DEFAULT '#' NOT NULL
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team Members Policies
CREATE POLICY "Enable read access for all users on team_members" 
ON public.team_members FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on team_members" 
ON public.team_members FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- -------------------------------------------------------
-- 8. Contact Messages Table (for Form Submissions)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    services TEXT[] DEFAULT '{}'::TEXT[],
    budget TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'read', 'replied', 'archived'))
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Contact Messages Policies
-- Public can insert messages (send us contact forms)
CREATE POLICY "Enable public inserts for contact_messages" 
ON public.contact_messages FOR INSERT TO public WITH CHECK (true);

-- Only admins can read/view contact submissions
CREATE POLICY "Enable read access for admins on contact_messages" 
ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());

-- Only admins can delete contact submissions
CREATE POLICY "Enable delete access for admins on contact_messages" 
ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());


-- -------------------------------------------------------
-- 9. Analytics Events Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id TEXT,
    event_name TEXT NOT NULL,
    page_path TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB NOT NULL
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics Events Policies
-- Public can log/insert analytics events from the client browser
CREATE POLICY "Enable public inserts for analytics_events" 
ON public.analytics_events FOR INSERT TO public WITH CHECK (true);

-- Only admins can view/query analytics event data
CREATE POLICY "Enable read access for admins on analytics_events" 
ON public.analytics_events FOR SELECT TO authenticated USING (public.is_admin());


-- -------------------------------------------------------
-- 10. Site Settings Table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY, -- setting key (e.g. 'maintenance_mode')
    value JSONB NOT NULL, -- setting value (holds text, bool, or complex objects)
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to auto-update updated_at on update
CREATE TRIGGER set_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Site Settings Policies
CREATE POLICY "Enable read access for all users on site_settings" 
ON public.site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Enable write access for admins on site_settings" 
ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
