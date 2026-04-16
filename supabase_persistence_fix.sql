-- COMPREHENSIVE LEAD INTELLIGENCE PERSISTENCE UPGRADE
-- Run this in your Supabase SQL Editor to ensure all business intelligence is captured.

-- 1. Ensure all standard and intelligence columns exist in 'leads'
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS strategy TEXT,
ADD COLUMN IF NOT EXISTS conversion_gap TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS tech_stack TEXT,
ADD COLUMN IF NOT EXISTS speed_score INTEGER,
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS pain_points TEXT[],
ADD COLUMN IF NOT EXISTS strategic_impact TEXT,
ADD COLUMN IF NOT EXISTS growth_leak_label TEXT,
ADD COLUMN IF NOT EXISTS ltv_estimate NUMERIC,
ADD COLUMN IF NOT EXISTS favicon_url TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS extracted_images TEXT[],
ADD COLUMN IF NOT EXISTS signals JSONB DEFAULT '{"instagram": false, "facebook": false, "whatsapp": false}'::jsonb,
ADD COLUMN IF NOT EXISTS load_time NUMERIC,
ADD COLUMN IF NOT EXISTS last_audit TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 2. Relax assigned_to constraint if using custom IDs or non-auth.users
-- If you want to allow any string ID for team members, we might need to change the column type or drop the constraint.
-- For now, we'll just ensure the column exists. It was already in supabase_schema.sql as UUID.
-- If you are using 'member-1', 'member-2', we should change it to TEXT.
ALTER TABLE leads ALTER COLUMN assigned_to TYPE TEXT;

-- 3. Ensure updated_at exists for tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 4. Re-verify unique constraint for UPSERT reliability
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_name_website') THEN
        ALTER TABLE leads ADD CONSTRAINT unique_name_website UNIQUE (name, website);
    END IF;
END $$;
