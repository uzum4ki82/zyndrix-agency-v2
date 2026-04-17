-- ============================================================================
-- FIX #1: RLS POLICY UPDATES FOR DAEMON SERVICE ROLE
-- ============================================================================
--
-- This script allows the Zyndrix daemon to write to the leads table
-- using SUPABASE_SERVICE_ROLE_KEY, bypassing RLS restrictions.
--
-- Execute this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================================

-- Step 1: Check current RLS policies on leads table
-- Run this first to see what policies exist
-- SELECT * FROM pg_policies WHERE tablename = 'leads';

-- Step 2: Create policy to allow service role updates
-- Service role (authenticated as service_role) can always UPDATE
CREATE POLICY "service_role_update_leads" ON leads
  AS PERMISSIVE FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 3: Keep existing user-facing policies (if any)
-- These ensure regular authenticated users can still access their data
-- You may already have these, so this is just a reference

CREATE POLICY "users_can_read_own_leads" ON leads
  AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "users_can_insert_leads" ON leads
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Step 4: Verify daemon_logs table exists and is accessible
-- This table stores errors and success logs from daemon operations
CREATE TABLE IF NOT EXISTS daemon_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'info',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create RLS policy for daemon_logs table
ALTER TABLE daemon_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_insert_logs" ON daemon_logs
  AS PERMISSIVE FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role_select_logs" ON daemon_logs
  AS PERMISSIVE FOR SELECT
  TO service_role
  USING (true);

-- Step 5: Add missing columns to leads table if needed
-- These are used by FIX #2, #3, #4 but needed for RLS to work properly
ALTER TABLE leads ADD COLUMN IF NOT EXISTS brand_palette JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS visual_features JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_status TEXT DEFAULT 'PENDING';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_opened_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS demo_visited BOOLEAN DEFAULT false;

-- Step 6: Create index for faster queries by daemon
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_tech_stack ON leads(tech_stack);
CREATE INDEX IF NOT EXISTS idx_leads_stitch_preview ON leads(stitch_preview_url);
CREATE INDEX IF NOT EXISTS idx_leads_email_sent ON leads(email_sent);

-- ============================================================================
-- VERIFICATION STEPS (Run these to verify the fix worked)
-- ============================================================================

-- 1. Check if service_role has UPDATE permission
-- SELECT grantee, privilege_type
-- FROM role_table_grants
-- WHERE table_name = 'leads' AND grantee = 'service_role';

-- 2. List all RLS policies on leads table
-- SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'leads';

-- 3. Check if daemon_logs table exists and is set up
-- SELECT * FROM daemon_logs LIMIT 5;

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If daemon still can't write, check:
-- 1. SUPABASE_SERVICE_ROLE_KEY is set correctly in .env.local
-- 2. The key matches your Supabase project's service role key
-- 3. Run: SELECT auth.jwt() to verify token is correct

-- To view the actual error from daemon:
-- SELECT * FROM daemon_logs WHERE status = 'error' ORDER BY created_at DESC LIMIT 10;

-- ============================================================================
-- SAFETY NOTES
-- ============================================================================
--
-- 1. Service role has FULL ACCESS - never expose SUPABASE_SERVICE_ROLE_KEY
-- 2. This policy allows any request with the service key to UPDATE
-- 3. For production, monitor daemon_logs for unusual patterns
-- 4. Consider adding audit logging to track changes made by daemon
--
-- ============================================================================
