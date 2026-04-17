# ⚡ IMMEDIATE ACTIONS: Claude Code Execution Guide
**Priority:** CRITICAL → HIGH → MEDIUM  
**Timeline:** This Week (April 17-21)  
**Owner:** Oscar (Zyndrix), Implemented by Claude Code  

---

## 🚨 THE SITUATION IN 30 SECONDS

✅ **What Works:** Lead discovery, dashboard, Resend integration  
❌ **What's Broken:** Daemon can't save preview URLs (RLS blocking), Stitch is mock, no email tracking  
🎯 **Result:** 272 discovered leads → 0 conversions (pipeline blocked)  

**Fix Order:** RLS → Stitch → Visual DNA → Email Tracking (in this order)

---

## 🔴 CRITICAL FIX #1: RLS Blocking Issue (6-8 hours)

### The Problem
```
Daemon generates preview URL ✅
Daemon tries to UPDATE database ❌
Reason: Daemon runs as 'anon', RLS only allows 'authenticated' users
Result: Silent failure → preview_url never saved → demo not sent
```

### The Fix (Step by Step)

**Step 1: Create Safe Daemon Update Function**
```
File: src/lib/supabase.ts
Task: Add new function called `updateLeadAsServiceRole()`
Function should:
  - Accept leadId, stitch_preview_url, stitch_project_id
  - Use Supabase service role client (from server context)
  - Include error logging to new 'daemon_logs' table
  - Return success/failure status
```

**Step 2: Update RLS Policy**
```sql
File: Supabase Dashboard → SQL Editor
Run this query:

-- Allow daemon updates via service role
CREATE OR REPLACE POLICY "allow_daemon_updates" ON leads
AS PERMISSIVE FOR UPDATE
TO authenticated, service_role
USING (TRUE)
WITH CHECK (TRUE);

-- Keep security: audit trail
CREATE TABLE IF NOT EXISTS daemon_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  lead_id BIGINT REFERENCES leads(id),
  action TEXT,
  status TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Step 3: Test**
```
Run: http://localhost:3000/api/admin/daemon
Check: Supabase dashboard → leads table → one lead should have stitch_preview_url
Expected: Dashboard shows "Live Demo" badge ✅
```

**Decision Point:** Do you have Supabase admin access to run the SQL query?

---

## 🔴 CRITICAL FIX #2: Real Stitch Integration (10-12 hours)

### The Problem
Currently `src/app/api/engine/stitch/route.ts` returns mock URLs:
```javascript
// CURRENT (MOCK)
return { 
  previewUrl: `/demo/${lead.id}`, 
  projectId: `mock-${lead.id}` 
}
```

This means:
- Each lead gets the same generic demo page
- No personalization, no visual DNA
- Defeats the "Architectural Luxury" value prop

### The Fix

**Step 1: Verify Stitch API Access**
```
Question: Do you have Stitch MCP credentials?
  - Stitch API Key?
  - Stitch Endpoint URL?
  - Any existing Stitch projects in your dashboard?
  
If YES → Proceed to Step 2
If NO → Register at [Stitch dashboard] or contact API provider
```

**Step 2: Update Stitch Route**
```typescript
File: src/app/api/engine/stitch/route.ts

Replace the entire function with:

export async function POST(request: Request) {
  const { lead, painPoints, tier } = await request.json();

  // 1. Build context-aware prompt
  const prompt = buildStitchPrompt({
    businessName: lead.name,
    sector: lead.category,
    location: lead.location_display,
    painPoints: painPoints,
    tier: tier,
    brandPalette: lead.brand_palette,
    visualFeatures: lead.visual_features
  });

  // 2. Call Stitch MCP
  const stitchResponse = await fetch(
    `${process.env.STITCH_MCP_ENDPOINT}/projects/create`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STITCH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${lead.name} - ${new Date().toISOString()}`,
        prompt: prompt,
        config: {
          theme: lead.brand_palette || defaultTheme,
          components: tier === 'TIER_1' ? blueprintLayout : standardLayout
        }
      })
    }
  );

  const { projectId, previewUrl } = await stitchResponse.json();

  // 3. Persist to database
  await updateLeadAsServiceRole(lead.id, {
    stitch_project_id: projectId,
    stitch_preview_url: previewUrl
  });

  return Response.json({ previewUrl, projectId });
}
```

**Step 3: Update Stitch Prompts**
```
File: src/lib/stitch-prompts.ts

This file already exists. You need to:
  1. Review the MASTER_TEMPLATE
  2. Ensure it accepts dynamic variables:
     - {BUSINESS_NAME}
     - {LOCATION}
     - {SECTOR}
     - {PAIN_POINTS}
     - {COLOR_PRIMARY}
     - {COLOR_SECONDARY}
  3. Create TIER-specific prompt variants:
     - TIER_1: "Blueprint Authority" (no web → full strategy show)
     - TIER_2: "Digital Acceleration" (social only → growth narrative)
     - TIER_3: "Performance Unlock" (legacy web → specific pain fix)
```

**Step 4: Test**
```
1. Dashboard → Select a lead → Click "Generate AI Demo"
2. Check database: stitch_preview_url should be populated
3. Click preview URL → Should load unique demo for that business
```

**Decision Points:**
- Do you have Stitch API access ready?
- What's your preferred prompt format (JSON, XML, markdown)?
- Should all tiers use same visual style or differ?

---

## 🟡 HIGH PRIORITY FIX #3: Visual DNA Extraction (8-10 hours)

### The Problem
Generated demos use generic colors/fonts instead of business-specific branding.

### The Fix

**Step 1: Add Color Extraction Logic**
```typescript
File: src/lib/agent-brain.ts

Add to HunterAgent.analyze():

// Extract dominant colors from business screenshot if available
if (lead.screenshot_url) {
  const colors = await extractDominantColors(lead.screenshot_url);
  const brandPalette = {
    primary: colors[0],      // Most dominant
    secondary: colors[1],    // 2nd dominant
    accent: colors[2],       // 3rd for highlights
    dark: '#1A1A1A',         // Fixed dark base
    typography: selectTypography(lead.category)
  };
  return { ...findings, brand_palette: brandPalette };
}
```

**Step 2: Color Extraction Function**
```typescript
// New file: src/lib/color-extractor.ts

async function extractDominantColors(imageUrl: string): string[] {
  // Use Claude Vision API (simple color analysis)
  // or use existing sharp/jimp library for pixel analysis
  
  // Option A: Claude Vision (simple, slow)
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "url", url: imageUrl }
        },
        {
          type: "text",
          text: "Extract the 3 dominant HEX colors from this business image. Return as JSON: {primary: '#...', secondary: '#...', accent: '#...'}"
        }
      ]
    }],
    max_tokens: 256
  });
  
  // Parse and return colors
  return parseColorsFromResponse(response);
}
```

**Step 3: Store in Database**
```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS brand_palette JSONB;

-- After extraction, update:
UPDATE leads 
SET brand_palette = '{"primary":"#FF5F1F","secondary":"#00F2FF","accent":"#1A1A1A"}'
WHERE id = $1;
```

**Step 4: Pass to Stitch**
```typescript
// In stitch route, inject brand_palette:
const prompt = buildStitchPrompt({
  ...other fields,
  primaryColor: lead.brand_palette.primary,
  secondaryColor: lead.brand_palette.secondary
});
```

**Decision Point:**
- Can you use Claude Vision API, or do you prefer image pixel analysis?
- Should color extraction happen at search time or demo generation time?

---

## 🟡 HIGH PRIORITY FIX #4: Email Tracking (6-8 hours)

### The Problem
You don't know if emails are being opened. No interest scoring.

### The Fix

**Step 1: Enable Resend Tracking**
```
Resend Dashboard → Settings
Enable:
  ✅ Open Tracking
  ✅ Click Tracking
  
Note: This happens server-side, already built into Resend
```

**Step 2: Add Webhook Handler**
```typescript
File: src/app/api/webhooks/resend/route.ts (create if missing)

export async function POST(request: Request) {
  const event = await request.json();

  const leadId = extractLeadIdFromEmail(event.email);

  switch(event.type) {
    case 'email.opened':
      await supabase
        .from('leads')
        .update({
          outreach_status: 'OPENED',
          engagement_score: 25,
          last_opened_at: new Date()
        })
        .eq('id', leadId);
      break;

    case 'email.clicked':
      await supabase
        .from('leads')
        .update({
          outreach_status: 'CLICKED',
          engagement_score: 50,
          demo_visited: true
        })
        .eq('id', leadId);
      break;

    case 'email.bounced':
      await supabase
        .from('leads')
        .update({
          outreach_status: 'BOUNCED',
          email_valid: false
        })
        .eq('id', leadId);
      break;
  }

  return Response.json({ success: true });
}
```

**Step 3: Configure Webhook in Resend**
```
Resend Dashboard → Webhooks
Add webhook endpoint: https://yourdomain.com/api/webhooks/resend
Events: email.opened, email.clicked, email.bounced
```

**Step 4: Display in Dashboard**
```
File: src/components/dashboard/LeadsTable.tsx

Add column showing:
  🟢 OPENED (25 pts)
  🔵 CLICKED (50 pts)
  ⚪ DELIVERED (10 pts)
  ❌ BOUNCED (0 pts)
```

**Decision Point:**
- Should you use Resend's built-in tracking or implement custom pixel tracking?
- What engagement metrics matter most to you?

---

## 📊 VALIDATION CHECKLIST: After Each Fix

### After RLS Fix:
```
□ Run daemon via API
□ Check daemon_logs table for any errors
□ Verify leads table has stitch_preview_url populated
□ Dashboard shows "Live Demo" badge
```

### After Stitch Integration:
```
□ Generate demo for a test lead
□ stitch_preview_url is NOT /demo/[id] (should be real Stitch URL)
□ Click URL, verify it loads unique demo
□ Demo uses lead's actual business name/location
```

### After Visual DNA:
```
□ Extract colors for several leads
□ Visually compare demo with business website color scheme
□ Stitch prompt receives color variables
□ Demo styling reflects extracted colors (not generic)
```

### After Email Tracking:
```
□ Send test email to yourself
□ Dashboard shows DELIVERED status
□ Open email in browser
□ Dashboard updates to OPENED (check Resend webhook logs)
□ Interest score visible in table
```

---

## 🎯 DECISION: Start Where?

### Option A: Maximum Impact (Recommended)
**Timeline:** 32-38 hours  
**Order:** RLS → Stitch → Visual DNA → Email Tracking  
**Result:** Complete pipeline working + personalized demos

### Option B: Quick Win (Safe)
**Timeline:** 14-16 hours  
**Order:** Email Tracking → Visual DNA  
**Risk:** Daemon still blocked, core pipeline incomplete  
**Benefit:** At least you see what's working

### Option C: Parallel (Aggressive)
**Timeline:** Same as A, but split across parallel tasks  
**Risk:** More context switching  
**Benefit:** Faster completion if you have help  

**Recommendation:** Option A is cleanest. RLS fix is blocker for everything else.

---

## 🔧 TECHNICAL QUESTIONS FOR YOU

Before Claude Code starts implementation, answer these:

1. **Stitch API Status**
   - [ ] I have Stitch API credentials
   - [ ] I need help obtaining Stitch access
   - [ ] Stitch MCP is already integrated, just needs real calls

2. **Database Access**
   - [ ] I can run SQL migrations on Supabase
   - [ ] I need you to guide me through it

3. **Environment Variables**
   - [ ] All required .env variables are set
   - [ ] I need to add new ones (Stitch API key, etc.)

4. **Priority**
   - [ ] Fix everything this week (intensive)
   - [ ] Prioritize Phase 1 only, Phase 2 next week

5. **Testing**
   - [ ] I can test in production
   - [ ] I want to test in staging first

---

## 📞 NEXT STEPS

1. **Answer the 5 questions above** ← START HERE
2. **Confirm you want Option A (full pipeline)**
3. **Point Claude Code to your codebase** (you're reading this in VSCode)
4. **Claude Code will:**
   - Create feature branches for each fix
   - Implement with inline comments
   - Provide git commits with clear messages
   - Walk you through testing
   - Deploy step-by-step with safety gates

---

**Status:** `AWAITING DECISIONS BEFORE EXECUTION`  
**Estimated Total Time:** 32-40 hours (spread across week)  
**Confidence Level:** 95% (all issues are well-defined)  

**Ready? Tell Oscar to answer the 5 decision questions above, then Claude Code will proceed.**
