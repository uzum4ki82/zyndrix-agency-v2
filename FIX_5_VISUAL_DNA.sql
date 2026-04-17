-- FIX 5: ADAPTIVE VISUAL DNA SCHEMA
-- ---------------------------------
-- This migration adds the necessary columns to store 
-- brand identity data extracted during the autonomous audit.

-- 1. Add extracted_colors column (JSONB)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS extracted_colors JSONB DEFAULT '{"primary": "#6366f1", "secondary": "#10b981", "background": "#020617"}'::jsonb;

-- 2. Add business_dna column (JSONB)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS business_dna JSONB DEFAULT '{"strategic_angle": "Arquitectura Digital de Alto Rendimiento", "vibe": "Luxury"}'::jsonb;

-- 3. Comment for documentation
COMMENT ON COLUMN leads.extracted_colors IS 'Brand colors extracted via computer vision or CSS analysis.';
COMMENT ON COLUMN leads.business_dna IS 'Strategic insights about the brand personality and positioning.';
