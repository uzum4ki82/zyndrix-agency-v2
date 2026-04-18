-- ADD MISSING BRAND_PALETTE COLUMN
-- Run in Supabase SQL Editor immediately

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS brand_palette JSONB DEFAULT '{"primary": "#6366f1", "secondary": "#10b981", "background": "#020617", "confidence": 0.85}'::jsonb;

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('brand_palette', 'extracted_colors', 'business_dna');
