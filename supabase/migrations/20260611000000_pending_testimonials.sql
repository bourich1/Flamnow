-- Add image_url and rating to existing testimonials table
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);

-- Create the pending_testimonials table
CREATE TABLE IF NOT EXISTS public.pending_testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    company TEXT,
    position TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.pending_testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public to INSERT new testimonials
CREATE POLICY "Public can insert pending testimonials" 
ON public.pending_testimonials 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public to SELECT approved testimonials
CREATE POLICY "Public can view approved testimonials" 
ON public.pending_testimonials 
FOR SELECT 
TO public 
USING (status = 'approved');

-- Allow admins full access
CREATE POLICY "Admins have full access to pending_testimonials"
ON public.pending_testimonials
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins WHERE admins.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins WHERE admins.id = auth.uid()
  )
);

-- Note: The Storage Bucket 'testimonial-submissions' has been created via JS API.
-- Set up Storage Policies for 'testimonial-submissions'
CREATE POLICY "Public can upload testimonial images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'testimonial-submissions');

CREATE POLICY "Public can view testimonial images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'testimonial-submissions');

CREATE POLICY "Admins have full access to testimonial images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'testimonial-submissions' AND EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid())
)
WITH CHECK (
  bucket_id = 'testimonial-submissions' AND EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid())
);
