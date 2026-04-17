-- ============================================================================
-- FIX #1: RLS POLICY - SIMPLIFIED (Only what's needed)
-- ============================================================================

-- THIS IS THE CRITICAL ONE: Allow service role to UPDATE leads
CREATE POLICY "service_role_update_leads" ON leads
  AS PERMISSIVE FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create daemon_logs table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS daemon_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'info',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on daemon_logs
ALTER TABLE daemon_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to use daemon_logs
CREATE POLICY "service_role_daemon_logs_insert" ON daemon_logs
  AS PERMISSIVE FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role_daemon_logs_select" ON daemon_logs
  AS PERMISSIVE FOR SELECT
  TO service_role
  USING (true);
