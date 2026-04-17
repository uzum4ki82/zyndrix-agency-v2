/**
 * [FIX #4] EMAIL TRACKING - DATABASE SCHEMA UPDATES
 * ==================================================
 * Adds columns to leads table for email engagement tracking via Resend webhooks
 *
 * Run this in Supabase > SQL Editor
 */

-- Add email tracking columns to leads table
ALTER TABLE leads ADD COLUMN resend_email_id TEXT;
ALTER TABLE leads ADD COLUMN email_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN email_delivered BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN email_delivered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN email_opened BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN email_opened_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN email_clicked BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN email_clicked_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN email_bounced BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN email_bounced_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN email_complained BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN email_complained_at TIMESTAMP WITH TIME ZONE;

-- Engagement score: -100 (complaint) to 100 (strong engagement)
-- Updated by webhook events:
-- 10 = delivery, 25 = open, 50 = click, -100 = complaint
ALTER TABLE leads ADD COLUMN engagement_score INTEGER DEFAULT 0;

-- Status summary: 'delivered', 'opened', 'clicked', 'bounced', 'complained'
ALTER TABLE leads ADD COLUMN open_status TEXT DEFAULT 'pending';

-- Create indexes for common queries
CREATE INDEX idx_leads_open_status ON leads(open_status);
CREATE INDEX idx_leads_engagement_score ON leads(engagement_score);
CREATE INDEX idx_leads_email_opened ON leads(email_opened);
CREATE INDEX idx_leads_resend_email_id ON leads(resend_email_id);

-- Create tracking events log table (optional, for audit trail)
CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id TEXT NOT NULL REFERENCES leads(id),
  event_type TEXT NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX idx_email_events_lead_id ON email_events(lead_id);
CREATE INDEX idx_email_events_type ON email_events(event_type);

-- Add RLS policy for email_events table
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_insert_events" ON email_events
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "service_role_read_events" ON email_events
  FOR SELECT
  USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Verify columns created
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name LIKE 'email_%' OR column_name LIKE 'engagement_%' OR column_name LIKE 'open_%'
ORDER BY ordinal_position DESC
LIMIT 15;
