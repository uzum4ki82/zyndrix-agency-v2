-- ZYNDRIX GRAND RESET: SYSTEM OVERHAUL
-- -----------------------------------
-- This script resets all lead data related to visual identity and site generation.
-- Purpose: To allow the new "Adaptive Visual DNA" system to re-audit and re-generate 
-- all existing leads from scratch, ensuring premium quality.

-- 1. Reset Tech Audit & DNA
UPDATE leads 
SET 
  tech_stack = NULL, 
  extracted_colors = NULL, 
  business_dna = NULL,
  speed_score = 0,
  load_time = 0,
  pain_points = ARRAY[]::text[],
  screenshot_url = NULL,
  last_audit = NULL,
  strategy = 'Re-iniciado para optimización de arquitectura digital.';

-- 2. Reset Generation & Outreach Status
UPDATE leads
SET
  status = 'NEW',
  stitch_preview_url = NULL,
  stitch_project_id = NULL,
  email_sent = false,
  whatsapp_sent = false,
  site_active = true,
  last_outreach_at = NULL;

-- 3. Optimization: Clear old events to avoid confusion
TRUNCATE TABLE email_events;

-- 4. Result
-- After running this, the Zyndrix Daemon will detect all leads as "UNAUIDITED" 
-- and will start the premium deep-discovery process automatically.
