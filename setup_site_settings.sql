-- 1. Create the site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Turn on Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access (so your website can fetch the data)
CREATE POLICY "Enable read access for all users" ON public.site_settings
    FOR SELECT USING (true);

-- 4. Allow admin (authenticated users) to insert/update the settings
CREATE POLICY "Enable all access for authenticated users" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
