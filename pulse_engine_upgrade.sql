-- UPGRADE LEADS TABLE FOR ZYNDRIX PULSE ENGINE
-- Run this in your Supabase SQL Editor

-- 1. Add missing intelligence columns
ALTER TABLE leads 
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
ADD COLUMN IF NOT EXISTS whatsapp_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0;

-- 2. Add unique constraint for deduplication (required for UPSERT)
-- First, handle possible duplicates if they exist (optional, caution)
-- DELETE FROM leads a USING leads b WHERE a.id < b.id AND a.name = b.name AND COALESCE(a.website, '') = COALESCE(b.website, '');

ALTER TABLE leads 
ADD CONSTRAINT unique_name_website UNIQUE (name, website);

-- 3. New table for detailed interactions (for the future)
CREATE TABLE IF NOT EXISTS lead_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type TEXT, -- 'EMAIL_SENT', 'WHATSAPP_SENT', 'SITE_VISIT'
    content TEXT,
    meta JSONB
);

-- 4. Enable RLS for the new table
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todo a usuarios autenticados" ON lead_interactions FOR ALL USING (auth.role() = 'authenticated');
