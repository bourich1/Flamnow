-- Migration: Add status column to contact_messages table
ALTER TABLE public.contact_messages 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'read', 'replied', 'archived'));
