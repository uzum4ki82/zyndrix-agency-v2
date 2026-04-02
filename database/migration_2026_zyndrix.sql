-- ZYNDRIX 2026: MASTER MIGRATION
-- Adds support for automated discovery, niche scoring, and outreach logs

-- Extend Leads Table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS niche_category TEXT, -- 'dentist', 'real_estate', etc.
ADD COLUMN IF NOT EXISTS zyndrix_score INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_reasoning TEXT,
ADD COLUMN IF NOT EXISTS targeted_pack TEXT,
ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'es',
ADD COLUMN IF NOT EXISTS google_maps_id TEXT UNIQUE;

-- Create Outreach Log Table (if not exists)
CREATE TABLE IF NOT EXISTS outreach_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- 'whatsapp', 'email', 'ig'
    sequence_stage INT DEFAULT 1,
    message_sent TEXT,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for CRM Performance
CREATE INDEX IF NOT EXISTS idx_leads_zyndrix_score ON leads (zyndrix_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_niche ON leads (niche_category);
CREATE INDEX IF NOT EXISTS idx_outreach_lead_id ON outreach_logs (lead_id);

-- View for Dashboard (Top Qualified Leads)
CREATE OR REPLACE VIEW top_qualified_leads AS
SELECT business_name, site, zyndrix_score, niche_category, status
FROM leads
WHERE zyndrix_score > 60
ORDER BY zyndrix_score DESC;
