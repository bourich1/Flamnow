-- 1. Services Table
ALTER TABLE public.services
ADD COLUMN title_en TEXT,
ADD COLUMN title_ar TEXT,
ADD COLUMN title_fr TEXT,
ADD COLUMN tagline_en TEXT,
ADD COLUMN tagline_ar TEXT,
ADD COLUMN tagline_fr TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN description_ar TEXT,
ADD COLUMN description_fr TEXT,
ADD COLUMN features_en TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN features_ar TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN features_fr TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN benefits_en TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN benefits_ar TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN benefits_fr TEXT[] DEFAULT '{}'::TEXT[];

-- Migrate Services Data
UPDATE public.services
SET 
  title_en = title,
  tagline_en = tagline,
  description_en = description,
  features_en = features,
  benefits_en = benefits;

-- 2. Projects Table
ALTER TABLE public.projects
ADD COLUMN title_en TEXT,
ADD COLUMN title_ar TEXT,
ADD COLUMN title_fr TEXT,
ADD COLUMN tagline_en TEXT,
ADD COLUMN tagline_ar TEXT,
ADD COLUMN tagline_fr TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN description_ar TEXT,
ADD COLUMN description_fr TEXT,
ADD COLUMN long_description_en TEXT,
ADD COLUMN long_description_ar TEXT,
ADD COLUMN long_description_fr TEXT,
ADD COLUMN challenge_en TEXT,
ADD COLUMN challenge_ar TEXT,
ADD COLUMN challenge_fr TEXT,
ADD COLUMN solution_en TEXT,
ADD COLUMN solution_ar TEXT,
ADD COLUMN solution_fr TEXT,
ADD COLUMN results_en TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN results_ar TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN results_fr TEXT[] DEFAULT '{}'::TEXT[];

-- Migrate Projects Data
UPDATE public.projects
SET 
  title_en = title,
  tagline_en = tagline,
  description_en = description,
  long_description_en = long_description,
  challenge_en = challenge,
  solution_en = solution,
  results_en = results;

-- 3. Testimonials Table
ALTER TABLE public.testimonials
ADD COLUMN name_en TEXT,
ADD COLUMN name_ar TEXT,
ADD COLUMN name_fr TEXT,
ADD COLUMN role_en TEXT,
ADD COLUMN role_ar TEXT,
ADD COLUMN role_fr TEXT,
ADD COLUMN company_en TEXT,
ADD COLUMN company_ar TEXT,
ADD COLUMN company_fr TEXT,
ADD COLUMN quote_en TEXT,
ADD COLUMN quote_ar TEXT,
ADD COLUMN quote_fr TEXT,
ADD COLUMN metric_label_en TEXT,
ADD COLUMN metric_label_ar TEXT,
ADD COLUMN metric_label_fr TEXT;

-- Migrate Testimonials Data
UPDATE public.testimonials
SET 
  name_en = name,
  role_en = role,
  company_en = company,
  quote_en = quote,
  metric_label_en = metric_label;

-- 4. FAQs Table
ALTER TABLE public.faqs
ADD COLUMN question_en TEXT,
ADD COLUMN question_ar TEXT,
ADD COLUMN question_fr TEXT,
ADD COLUMN answer_en TEXT,
ADD COLUMN answer_ar TEXT,
ADD COLUMN answer_fr TEXT;

-- Migrate FAQs Data
UPDATE public.faqs
SET 
  question_en = question,
  answer_en = answer;

-- 5. Team Members Table
ALTER TABLE public.team_members
ADD COLUMN name_en TEXT,
ADD COLUMN name_ar TEXT,
ADD COLUMN name_fr TEXT,
ADD COLUMN role_en TEXT,
ADD COLUMN role_ar TEXT,
ADD COLUMN role_fr TEXT,
ADD COLUMN bio_en TEXT,
ADD COLUMN bio_ar TEXT,
ADD COLUMN bio_fr TEXT,
ADD COLUMN specialty_en TEXT,
ADD COLUMN specialty_ar TEXT,
ADD COLUMN specialty_fr TEXT;

-- Migrate Team Members Data
UPDATE public.team_members
SET 
  name_en = name,
  role_en = role,
  bio_en = bio,
  specialty_en = specialty;
