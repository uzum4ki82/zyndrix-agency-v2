# 🚀 CLAUDE CODE OPTIMIZATION ROADMAP: Zyndrix Engine
**Status:** `READY FOR EXECUTION`  
**Date:** April 17, 2026  
**Architect:** Claude Code (Haiku 4.5)  
**Lead Vision:** Antigravity (Google Deepmind)  

---

## 📊 EXECUTIVE ANALYSIS: Current State vs. Opportunity Gap

### ✅ COMPLETED ARCHITECTURE (Fully Functional)
1. **Lead Discovery Engine** (`src/lib/email-discovery.ts`, Google Places integration)
   - Geotargeting with TIER classification (TIER_1: No Web, TIER_2: Social Only, TIER_3: Legacy Web)
   - 272 leads synchronized in Sant Antoni de Vilamajor zone
   - Advanced search heuristics with urbanization-specific queries

2. **Analytical Brain** (`src/lib/agent-brain.ts`)
   - Sophisticated lead scoring with pain-point extraction
   - Visual DNA synthesis (brand color extraction, typography matching)
   - Tier prioritization logic (Golden Leads: Email + WhatsApp)

3. **Dashboard & Autopilot** (`src/hooks/use-autopilot.ts`, frontend components)
   - Real-time lead management with multi-selection
   - Live autopilot monitoring with phase-based logging
   - Business card visualization with neon badges

4. **Backend Infrastructure** (Supabase + Vercel)
   - PostgreSQL persistence with RLS policies
   - Edge Function support
   - Email delivery via Resend API

---

### 🟡 PARTIALLY FUNCTIONAL (Critical Gaps)
1. **Stitch Integration** (`src/app/api/engine/stitch/route.ts` - 67 lines)
   - **Issue**: Generates mock URLs pointing to `/demo/[id]` without real asset synthesis
   - **Impact**: Demo pages lack personalization, reducing conversion impact
   - **Symptom**: `stitch_preview_url` not persisting to database due to RLS blocking

2. **Autonomous Daemon** (`src/app/api/admin/daemon/route.ts`)
   - **Issue**: Phase 4 (Outreach) fails silently due to:
     - **RLS Blocking**: `anon` role cannot UPDATE leads table
     - **Data Validation**: No handling for leads without captured emails
   - **Impact**: Outreach phase never triggers for completed projects

3. **Visual DNA Extraction** (Mentioned in PERSONALIZATION_AUDIT.md but not fully implemented)
   - **Missing**: Real-time color picker from business screenshots
   - **Missing**: Logo detection via computer vision
   - **Impact**: Demo pages use generic palettes instead of brand-specific DNA

4. **Email Tracking** (Open tracking not active)
   - **Missing**: Webhook implementation for open events
   - **Missing**: Click tracking correlation
   - **Impact**: Cannot calculate "Interest Score" or lead hotness metrics

---

### ❌ NOT IMPLEMENTED (Strategic Features)
1. **WhatsApp Multichannel** (Mentioned in SYSTEM_OVERVIEW but no code)
   - **Planned**: Official WhatsApp Business API integration
   - **Benefit**: Reach TIER_3 leads (WhatsApp-only) with automated sequences

2. **Demo Engagement Tracking** (Heatmaps + View Analytics)
   - **Planned**: Integration of heatmap library in generated demos
   - **Planned**: Session tracking to calculate engagement depth
   - **Benefit**: Quantify "Interest Score" for lead prioritization

3. **Advanced Computer Vision** (Feature detection for business types)
   - **Planned**: Detect terraces (restaurants), showrooms (retail), offices (services)
   - **Benefit**: Auto-tailor demo layouts to business-specific needs

4. **Bulk Outreach Pipeline** (Batch email/WhatsApp campaigns)
   - **Planned**: Zone-wide campaign execution
   - **Missing**: Deduplication logic, rate limiting, batch processing

---

## 🎯 OPTIMIZATION ROADMAP: Phases & Deliverables

### PHASE 1: CRITICAL STABILIZATION (48-72 hours)
*Goal: Enable complete outreach pipeline from lead discovery → email delivery*

#### 1.1 Fix RLS Blocking Issue
**File:** `src/lib/supabase.ts`  
**Current Problem:**
```
[BLOCKED] Daemon cannot UPDATE leads with stitch_preview_url
├─ Cause: RLS policy only allows authenticated users
├─ Daemon runs with: anon role
└─ Silent failure: No error, but data never persists
```

**Solution Strategy:**
- Create service-role client in daemon operations
- Implement lead-specific RLS exception for daemon updates
- Add transaction-based update confirmation
- Log all RLS failures to `daemon_logs` table for debugging

**Acceptance Criteria:**
- ✅ Daemon successfully persists `stitch_preview_url` to database
- ✅ Dashboard shows "Live Demo" badge after generation
- ✅ No silent failures; all errors logged

---

#### 1.2 Implement Real Stitch Integration
**File:** `src/app/api/engine/stitch/route.ts`  
**Current Implementation:** 67-line mock returning static URLs

**New Implementation Requirements:**
```
Input:  Business lead data + pain points + tier
Process: Generate unique landing page via Stitch MCP
Output: Real preview URL + persisted project ID
```

**Detailed Integration:**
1. **Input Validation**
   - Verify lead has: name, sector, location, pain_points
   - Extract TIER from lead data
   - Gather brand visual markers

2. **Stitch Generation Flow**
   - Call Stitch MCP with context-specific prompt
   - Use `MASTER_TEMPLATE` from `stitch-prompts.ts` with dynamic injection
   - Pass `pain_points` as conversion triggers
   - Include visual DNA (colors, typography) from `PERSONALIZATION_AUDIT` findings

3. **Response Handling**
   - Capture `project_id` from Stitch
   - Generate `preview_url` (Stitch-hosted)
   - Return both for dashboard & email use

**Stitch Prompt Strategy:**
- **TIER_1 Leads** (No website): "Blueprint Authority" template
  - Headline: "Your sector's visibility revolution starts here"
  - Focus: Market dominance visualization
  
- **TIER_2 Leads** (Social-only): "Digital Acceleration" template
  - Headline: "From Instagram to Authority Platform"
  - Focus: Professional transformation
  
- **TIER_3 Leads** (Legacy web): "Performance Unlock" template
  - Headline: "Converting [Industry] at [City] scale"
  - Focus: Specific pain-point solution showcase

**Acceptance Criteria:**
- ✅ Real URLs generated (not mocks)
- ✅ Each URL unique to business context
- ✅ Projects persist in Stitch dashboard
- ✅ Preview loads in email clients

---

#### 1.3 Extract & Persist Visual DNA
**File:** `src/lib/agent-brain.ts` (expand StrategistAgent)  
**Missing Implementation:**

1. **Color Extraction Module**
   ```
   Input: Business screenshot (from Google Places or audit)
   Process: Dominant color palette analysis (0-5 colors)
   Output: HEX codes + accessibility scoring
   ```
   - Use existing Puppeteer screenshot data
   - Analyze via color clustering algorithm
   - Map to brand palette categories (Primary, Secondary, Accent)

2. **Visual DNA Data Structure**
   ```typescript
   brand_palette: {
     primary: "#FF5F1F",      // Industrial Orange
     secondary: "#00F2FF",    // Cyan Onyx
     accent: "#1A1A1A",       // Dark base
     typography: "Space Grotesk"
   }
   ```

3. **Persistence**
   - Store in leads table: `brand_palette` JSONB column
   - Used by Stitch for DesignSystem injection
   - Enables "zero-placeholder" demos

**Acceptance Criteria:**
- ✅ Visual DNA extracted for each lead
- ✅ Persisted to database
- ✅ Stitch integration receives palette
- ✅ Demo pages use extracted colors (no fallbacks)

---

#### 1.4 Add Email Open Tracking
**File:** `src/app/api/webhooks/resend/route.ts` (create if missing)  
**Implementation:**

1. **Webhook Handler**
   - Listen to `email.delivered`, `email.opened`, `email.bounced`
   - Update lead status: `outreach_status` = DELIVERED|OPENED|FAILED

2. **Interest Score Calculation**
   ```
   base_score = lead.score
   + (opened ? 25 : 0)
   + (clicked_demo ? 40 : 0)
   + (time_in_demo > 30s ? 15 : 0)
   = Interest Score (0-100)
   ```

3. **Dashboard Integration**
   - Show "Interest Badge" on leads with OPENED status
   - Sort leads by Interest Score in main table
   - Enable "Hot Leads" filter

**Acceptance Criteria:**
- ✅ Open events tracked in database
- ✅ Dashboard reflects real-time status changes
- ✅ No false positives from spam filters

---

### PHASE 2: CONVERSION OPTIMIZATION (1-2 weeks)
*Goal: Maximize engagement depth and lead hotness detection*

#### 2.1 Implement Demo Engagement Tracking
**Files:** `src/app/demo/[id]/page.tsx`, new analytics module

**Features:**
1. **Session Tracking**
   - Capture: Entry time, exit time, sections viewed
   - Calculate: Time on page, scroll depth, interaction count

2. **Heatmap Overlay**
   - Show aggregated click/scroll data
   - Identify conversion friction points
   - Visual feedback on "Engagement Zones"

3. **Micro-conversions**
   - Track: CTA clicks, form starts, contact button hovers
   - Weight micro-conversions in Interest Score

**Implementation Strategy:**
- Use PostHog or Plausible for privacy-preserving analytics
- Embed tracking in Stitch-generated pages
- Sync events back to Zyndrix dashboard via API

**Acceptance Criteria:**
- ✅ Real engagement data captured
- ✅ Heatmaps display in dashboard
- ✅ Interest Score reflects actual engagement

---

#### 2.2 WhatsApp Multichannel Outreach
**File:** New module `src/lib/whatsapp-outreach.ts`

**Integration Plan:**
1. **Official WhatsApp Business API**
   - Register Zyndrix as WhatsApp Business Provider
   - Obtain API credentials from Meta

2. **Message Sequence for TIER_3 Leads**
   ```
   1. Welcome message (auto, personalized)
   2. Demo preview link (with 24h expiry)
   3. Follow-up (48h later if no engagement)
   4. Final CTA (72h, human takeover option)
   ```

3. **Template Management**
   - Create WhatsApp-approved message templates
   - Sector-specific variants
   - Compliance with Meta's messaging policies

**Acceptance Criteria:**
- ✅ WhatsApp delivery working
- ✅ Response tracking functional
- ✅ No API rate limiting issues
- ✅ TIER_3 leads reached via WhatsApp

---

#### 2.3 Bulk Campaign Execution
**Files:** `src/app/api/engine/campaign/route.ts` (new)

**Features:**
1. **Multi-Select Zone Campaigns**
   - User selects zone + tier filter
   - System generates campaigns for all matched leads
   - Batch processing with rate limiting

2. **Deduplication**
   - Check `outreach_status` to avoid re-contact
   - Respect 7-day cooldown between touches
   - Log all outreach history

3. **Async Processing**
   - Use job queue (Bull, Inngest) for batch jobs
   - Progress tracking in UI
   - Failure retry with exponential backoff

**Acceptance Criteria:**
- ✅ Campaigns process 50+ leads without timeouts
- ✅ Zero duplicate contacts
- ✅ Real-time progress visible in dashboard

---

### PHASE 3: ADVANCED PERSONALIZATION (2-3 weeks)
*Goal: Maximize demo relevance via computer vision & context intelligence*

#### 3.1 Logo & Feature Detection
**File:** New module `src/lib/computer-vision.ts`

**Computer Vision Tasks:**
1. **Logo Extraction**
   - Input: Business screenshot (Google Places photo)
   - Output: Logo crop + brand name confidence

2. **Business Feature Detection**
   ```
   Restaurant → Terrace visible? Seating capacity?
   Retail → Showroom? Display windows? Size estimate?
   Office → Modern building? Coworking signs?
   ```

3. **Facade Analysis**
   - Architectural style classification
   - Material detection (glass, brick, modern, classic)
   - Used for design system tone selection

**Implementation:**
- Use Claude Vision API for image analysis
- Cache results to avoid repeated processing
- Store findings in leads table: `visual_features` JSONB

**Acceptance Criteria:**
- ✅ Logos extracted accurately
- ✅ Feature detection working for major categories
- ✅ Stitch uses detected features for layout selection

---

#### 3.2 Dynamic Layout Synthesis
**File:** Enhanced `src/lib/stitch-prompts.ts`

**Context-Aware Layouts:**
```
RESTAURANT + Terrace detected 
  → Layout emphasizes outdoor space photography
  → Booking/reservation CTA prominent

RETAIL + Showroom detected
  → Product showcase section (from Google photos)
  → Catalog integration visible
  → Inventory management promise

SERVICE + Modern office detected
  → Team credibility section
  → Case studies layout
  → Professional authority tone
```

**Prompt Engineering:**
- Inject visual features into Stitch prompt
- Tier-specific headline formulas
- Pain-point-driven CTA personalization

**Acceptance Criteria:**
- ✅ Layouts vary meaningfully by business type
- ✅ Visual features visible in generated demos
- ✅ No generic placeholder content

---

#### 3.3 Predictive Scoring & AI Ranking
**File:** Enhanced `src/lib/agent-brain.ts`

**Advanced Scoring Model:**
```
Base Tier Score (95 / 65 / 45)
+ Technical Debt Factor (max +20)
+ Visual Appeal Factor (+10 if brand extracted)
+ Engagement Depth (real-time, post-outreach)
+ Market Saturation Penalty (-5 to -15)
= FINAL CONVERSION PROBABILITY (0-100)
```

**Acceptance Criteria:**
- ✅ Leads ranked by conversion probability
- ✅ Top 20% shows 3x+ engagement vs. bottom 20%
- ✅ Ranking improves as more data collected

---

## 🔧 TECHNICAL IMPLEMENTATION GUIDELINES

### Code Quality Standards
- **Type Safety**: All new code must pass TypeScript strict mode
- **Testing**: Critical paths (RLS, Stitch, outreach) must have integration tests
- **Error Handling**: Silent failures forbidden; all errors logged with context
- **Documentation**: Complex algorithms need docstrings with examples

### Database Schema Changes
```sql
-- Add missing columns if not present
ALTER TABLE leads ADD COLUMN IF NOT EXISTS brand_palette JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS visual_features JSONB;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS stitch_project_id TEXT UNIQUE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS engagement_score INT DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_status TEXT DEFAULT 'PENDING';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP;

-- Fix RLS policies
CREATE OR REPLACE POLICY "daemon_update_policy" ON leads
AS PERMISSIVE FOR UPDATE
TO anon
USING (TRUE)
WITH CHECK (
  auth.uid() IS NULL 
  OR auth.jwt() ->> 'role' = 'service_role'
);
```

### Environment Variables Required
```
STITCH_API_KEY=...
STITCH_MCP_ENDPOINT=...
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
POSTHOG_API_KEY=...  (or Plausible)
RESEND_WEBHOOK_SECRET=...
```

### Deployment Sequence
1. **Test RLS changes** in staging database
2. **Deploy Phase 1** (RLS + Stitch + Visual DNA)
3. **Manual QA**: Send test campaign, verify all pipelines
4. **Deploy Phase 2** (Tracking + Whatsapp)
5. **Monitor**: Dashboard metrics for 48h
6. **Deploy Phase 3** (CV + Ranking) iteratively

---

## 📈 SUCCESS METRICS & TARGETS

### Phase 1 Completion Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Daemon Success Rate | 95%+ | ~30% (RLS blocks) |
| Stitch URLs Valid | 100% | 0% (mocks) |
| Visual DNA Extracted | 80%+ | 0% |
| Email Delivery | 98%+ | ✅ Working |

### Phase 2 Completion Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Email Open Rate | 35%+ | TBD (no tracking) |
| Demo Engagement | 60%+ of opens | N/A |
| TIER_3 WhatsApp Reach | 100% | 0% |
| Interest Score Accuracy | 85% correlation | N/A |

### Overall Business Impact
```
Current State:  272 leads discovered → 0 conversions (RLS blocks pipeline)
Phase 1 Target: 272 leads → 15-20% outreach success → 40-55 hot leads
Phase 2 Target: 272 leads → 35% open rate → 95 engaged leads
Phase 3 Target: Predictive scoring identifies top 10% → 27 high-probability closes
```

---

## ⚠️ KNOWN RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| RLS Policies break outreach | CRITICAL | Thorough testing on staging before production |
| Stitch API rate limits | HIGH | Implement queue with exponential backoff |
| Visual DNA extraction fails | MEDIUM | Fallback to sector-standard palettes |
| WhatsApp compliance issues | HIGH | Pre-approve all message templates with Meta |
| Demo engagement tracking privacy | MEDIUM | Use privacy-focused analytics (PostHog, Plausible) |

---

## 📅 EXECUTION TIMELINE

### Week 1 (April 17-21): Phase 1 Critical Fixes
- Day 1-2: RLS debugging + fix
- Day 2-3: Stitch real integration
- Day 3-4: Visual DNA extraction
- Day 4-5: Email tracking webhook
- EOW: Phase 1 QA & validation

### Week 2-3 (April 22-May 5): Phase 2 Optimization
- WhatsApp integration & testing
- Demo engagement tracking implementation
- Bulk campaign pipeline
- Advanced testing & monitoring

### Week 3-4 (May 6-19): Phase 3 Advanced Features
- Computer vision integration
- Dynamic layout synthesis
- Predictive scoring refinement
- Final optimization & documentation

---

## 🎯 CRITICAL SUCCESS FACTORS

1. **RLS Fix is Blocker**: Without this, entire outreach pipeline remains broken
2. **Real Stitch Integration**: Mocks undermine the core value proposition (personalization)
3. **Visual DNA Matters**: "Zero-placeholder demos" are the competitive advantage
4. **Data-Driven Iteration**: Collect engagement metrics early, iterate based on real performance
5. **Compliance First**: WhatsApp, email, and data privacy must be handled properly

---

## 📞 DECISION POINTS FOR OSCAR (User)

Before proceeding with implementation, clarify:

1. **Stitch API Access**: Is Stitch MCP already integrated and working with real credentials?
2. **WhatsApp Timeline**: Is WhatsApp Business API registration needed, or already completed?
3. **Analytics Tool Preference**: PostHog vs. Plausible vs. custom implementation?
4. **Deployment Environment**: Staging database ready for schema changes?
5. **Priority Balance**: Phase 1 (critical) or optimize Phase 2 features in parallel?

---

**Status:** `READY FOR DETAILED IMPLEMENTATION`  
**Next Step:** Confirm decision points above, then proceed with Phase 1 RLS debugging.
