# 🔧 FIX #1 EXECUTION: RLS Blocking Issue - STEP BY STEP

**Status:** Code changes DONE ✅ | Waiting for SQL execution  
**Time:** ~10 minutes to complete  
**Risk Level:** LOW (RLS policies are standard Supabase patterns)

---

## 📋 WHAT WAS CHANGED IN CODE

### File 1: `src/lib/supabase.ts`
✅ **DONE** - Added:
- Service role client initialization
- `updateLeadWithServiceRole()` function
- Error handling and logging

### File 2: `zyndrix_daemon.js`
✅ **DONE** - Updated:
- Created service role client for daemon
- Added `updateLeadServiceRole()` helper function
- Replaced 3 UPDATE operations to use service role
  - ✅ Phase 2 (Audit) - Line 195
  - ✅ Phase 3 (Generation) - Line 256
  - ✅ Phase 4 (Outreach) - Line 340

---

## 🚀 YOUR TURN: Execute SQL in Supabase

### STEP 1: Open Supabase Dashboard
```
1. Go to: https://app.supabase.com
2. Select your Zyndrix project
3. Click: "SQL Editor" (left sidebar)
```

### STEP 2: Run the SQL Script
```
1. Click: "+ New Query"
2. Copy entire content from: FIX_1_RLS_POLICIES.sql
3. Paste into SQL editor
4. Click: "RUN" button (or Cmd+Enter)
```

Expected output: `✓ Success` (green checkmark)

### STEP 3: Verify the Fix

Run these verification queries ONE BY ONE:

**Query 1: Check RLS policies exist**
```sql
SELECT policyname, roles, permissive
FROM pg_policies
WHERE tablename = 'leads'
ORDER BY policyname;
```
Expected: You should see policies including `service_role_update_leads`

**Query 2: Check daemon_logs table**
```sql
SELECT * FROM daemon_logs LIMIT 1;
```
Expected: Table exists (may be empty, that's OK)

**Query 3: Check new columns exist**
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'leads'
AND column_name IN ('brand_palette', 'visual_features', 'outreach_status', 'engagement_score')
ORDER BY column_name;
```
Expected: All 4 columns should be listed

---

## ⚠️ IMPORTANT: Environment Variables

Before the daemon can work, you MUST set:

### In your `.env.local`:
```
# Already should have:
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NOW ADD:
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Where to find SERVICE_ROLE_KEY:
```
1. Supabase Dashboard → Your Project
2. Settings (gear icon) → API
3. Copy "service_role secret" (the long key starting with "eyJ...")
4. Paste into .env.local as SUPABASE_SERVICE_ROLE_KEY
```

**🔐 SECURITY:** Never commit `.env.local` to git. Never share this key.

---

## ✅ VERIFICATION: Daemon Can Now Write

To test that the fix works:

### Option A: Manual Test (Recommended)
```javascript
// Run in Node.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Try to update a test lead
const { data, error } = await supabase
  .from('leads')
  .update({ email_sent: true })
  .eq('id', 'some-lead-id')
  .select();

if (error) console.error('FAILED:', error);
else console.log('SUCCESS:', data);
```

### Option B: Automatic Test
Once daemon runs, check for successful updates in daemon.log or by running:
```sql
-- Check if daemon has updated any leads
SELECT COUNT(*) as updated_count
FROM leads
WHERE updated_at > NOW() - INTERVAL '5 minutes'
AND (email_sent = true OR status = 'GENERATED' OR status = 'OUTREACH_COMPLETE');
```

If count > 0, the fix is working! ✅

---

## 🐛 TROUBLESHOOTING

### Problem: "permission denied" error in daemon.log
**Solution:** 
- Check SUPABASE_SERVICE_ROLE_KEY is correct in .env.local
- Verify key is set in .env.local (not .env)
- Make sure it's the SERVICE_ROLE_KEY, not ANON_KEY

### Problem: "RLS policy not found" error
**Solution:**
- Run FIX_1_RLS_POLICIES.sql again
- Check that "service_role_update_leads" policy appears in pg_policies

### Problem: Database update succeeds but data not visible in UI
**Solution:**
- This is expected if RLS on SELECT is restrictive
- UI uses ANON_KEY (restricted by RLS)
- Daemon uses SERVICE_ROLE_KEY (unrestricted)
- Check directly with: `SELECT * FROM leads WHERE id = '...'`

---

## 📊 EXPECTED RESULTS AFTER FIX #1

### Before Fix #1:
```
Daemon runs:
├─ Phase 1 (Search): ✅ Finds leads
├─ Phase 2 (Audit): ✅ Analyzes leads
├─ Phase 3 (Generate): ✅ Creates Stitch projects
│  └─ Tries to save stitch_preview_url ❌ FAILS (RLS blocks)
└─ Phase 4 (Outreach): ❌ Never runs (no preview URL)

Result: 0 emails sent to customers
```

### After Fix #1:
```
Daemon runs:
├─ Phase 1 (Search): ✅ Finds leads
├─ Phase 2 (Audit): ✅ Analyzes leads
├─ Phase 3 (Generate): ✅ Creates Stitch projects
│  └─ Saves stitch_preview_url ✅ SUCCESS (service role)
└─ Phase 4 (Outreach): ✅ Sends emails

Result: Emails sent to all qualified customers ✅
```

---

## 🎯 NEXT STEPS AFTER FIX #1

Once this is complete and verified:

1. ✅ This fix enables Phase 1-4 to work
2. 🟡 Move to FIX #2: Real Stitch Integration (if needed credentials)
3. 🟡 Move to FIX #3: Visual DNA Extraction
4. 🟡 Move to FIX #4: Email Tracking

Timeline: This SQL execution should take 5 minutes max.

---

## ❓ QUESTIONS?

If you get stuck:
1. Check the error message in Supabase SQL Editor
2. Look in `daemon.log` for error details
3. Run verification queries above
4. Check `.env.local` has SUPABASE_SERVICE_ROLE_KEY

---

**Ready? Execute FIX_1_RLS_POLICIES.sql now, then tell me when it's done.**

Once SQL is executed and verified, Phase 1 fix is COMPLETE! ✅
