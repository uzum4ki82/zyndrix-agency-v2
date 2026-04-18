-- COMPREHENSIVE SCHEMA UPDATE FOR ZYNDRIX PULSE ENGINE
-- Run this in Supabase SQL Editor to stabilize persistence.

-- Transform id to TEXT to handle Google Place IDs natively if needed
-- WARNING: This may fail if there are foreign keys. If so, use the unique constraints below.
ALTER TABLE leads ALTER COLUMN id TYPE TEXT;

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS google_place_id TEXT,
ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS favicon_url TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS tech_stack TEXT,
ADD COLUMN IF NOT EXISTS speed_score INTEGER,
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS signals JSONB DEFAULT '{"instagram": false, "facebook": false, "whatsapp": false}'::jsonb,
ADD COLUMN IF NOT EXISTS strategic_impact TEXT,
ADD COLUMN IF NOT EXISTS growth_leak_label TEXT,
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'TIER_3',
ADD COLUMN IF NOT EXISTS pain_points TEXT[],
ADD COLUMN IF NOT EXISTS stitch_project_id TEXT,
ADD COLUMN IF NOT EXISTS stitch_preview_url TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC,
ADD COLUMN IF NOT EXISTS reviews_count INTEGER,
ADD COLUMN IF NOT EXISTS google_photo_url TEXT,
ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS site_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS extracted_colors JSONB DEFAULT '{"primary": "#6366f1", "secondary": "#10b981", "background": "#020617"}'::jsonb,
ADD COLUMN IF NOT EXISTS business_dna JSONB DEFAULT '{"strategic_angle": "Arquitectura Digital de Alto Rendimiento", "vibe": "Luxury"}'::jsonb,
ADD COLUMN IF NOT EXISTS whatsapp_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_audit TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Ensure unique constraints for deduplication
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_name_website') THEN
        ALTER TABLE leads ADD CONSTRAINT unique_name_website UNIQUE (name, website);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_google_place_id') THEN
        ALTER TABLE leads ADD CONSTRAINT unique_google_place_id UNIQUE (google_place_id);
    END IF;
END $$;
