-- ZYNDRIX SURVIVAL PATCH: RLS BYPASS FOR DAEMON
-- Run this in the Supabase SQL Editor to allow the daemon (anon role) 
-- to sync lead data during autonomous cycles.

-- 1. Enable RLS on leads (if not already enabled)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Create policy to allow anonymous updates to existing leads
-- (In a production high-security environment, we would use a service role key 
-- or a secure function, but for rapid deployment of the Zyndrix Commander, 
-- this policy unblocks the persistence layer).
DROP POLICY IF EXISTS "Daemon Lead Sync" ON leads;
CREATE POLICY "Daemon Lead Sync" ON leads 
FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);

-- 3. Also allow anonymous selects so the daemon can find candidates
DROP POLICY IF EXISTS "Daemon Lead Discovery" ON leads;
CREATE POLICY "Daemon Lead Discovery" ON leads 
FOR SELECT 
TO anon 
USING (true);

-- 4. Verify columns for the new extraction logic
ALTER TABLE leads ADD COLUMN IF NOT EXISTS brand_palette JSONB DEFAULT '[]'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS logo_url TEXT;
