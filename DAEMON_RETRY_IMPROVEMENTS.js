/**
 * ZYNDRIX DAEMON - RETRY LOGIC & RESILIENCE MODULE
 * ================================================
 * Drop-in improvements for zyndrix_daemon.js to handle API failures gracefully
 *
 * Apply these changes to the main daemon file
 */

// ============================================================================
// 1. ENVIRONMENT VALIDATION (Add to top of daemon, before creating clients)
// ============================================================================

function validateEnvironment() {
  const REQUIRED = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GOOGLE_MAPS_API_KEY',
    'ANTHROPIC_API_KEY'
  ];

  const OPTIONAL = [
    'STITCH_API_KEY',
    'STITCH_MCP_ENDPOINT'
  ];

  const missing = [];
  REQUIRED.forEach(key => {
    if (!process.env[key]) missing.push(key);
  });

  if (missing.length > 0) {
    console.error('❌ CRITICAL: Missing required environment variables:');
    missing.forEach(k => console.error(`   - ${k}`));
    process.exit(1);
  }

  const optionalMissing = [];
  OPTIONAL.forEach(key => {
    if (!process.env[key]) optionalMissing.push(key);
  });

  if (optionalMissing.length > 0) {
    console.warn('⚠️  Optional vars missing (using fallbacks):');
    optionalMissing.forEach(k => console.warn(`   - ${k}`));
  }

  console.log('✅ Environment validation passed');
}

// Call this right after loadEnv()
// validateEnvironment();


// ============================================================================
// 2. RETRY HELPER (Add to utility functions section)
// ============================================================================

class RetryPolicy {
  constructor(maxRetries = 3, initialDelayMs = 1000, backoffMultiplier = 2) {
    this.maxRetries = maxRetries;
    this.initialDelayMs = initialDelayMs;
    this.backoffMultiplier = backoffMultiplier;
  }

  async execute(fn, context = '') {
    let lastError;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries - 1) {
          log('error', `[RETRY] Final attempt failed for ${context}: ${error.message}`);
          throw error;
        }

        const delayMs = this.initialDelayMs * Math.pow(this.backoffMultiplier, attempt);
        log('warning', `[RETRY] Attempt ${attempt + 1}/${this.maxRetries - 1} failed for ${context}. Retrying in ${delayMs}ms...`);

        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    throw lastError;
  }
}

// Usage example:
// const updateRetry = new RetryPolicy(3, 1000, 2);
// await updateRetry.execute(
//   () => updateLeadServiceRole(leadId, data),
//   `update lead ${leadId}`
// );


// ============================================================================
// 3. CIRCUIT BREAKER (Add to utility functions section)
// ============================================================================

class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeoutMs = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED -> OPEN -> HALF_OPEN
  }

  async execute(fn, name) {
    // Check if we need to reset
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        log('info', `[CIRCUIT_BREAKER] ${name} attempting recovery...`);
        this.state = 'HALF_OPEN';
        this.failureCount = 0;
      } else {
        throw new Error(`Circuit breaker for ${name} is OPEN - service unavailable`);
      }
    }

    try {
      const result = await fn();

      if (this.state === 'HALF_OPEN') {
        log('success', `[CIRCUIT_BREAKER] ${name} recovered!`);
        this.state = 'CLOSED';
        this.failureCount = 0;
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        log('error', `[CIRCUIT_BREAKER] ${name} OPENED after ${this.failureCount} failures`);
        this.state = 'OPEN';
      }

      throw error;
    }
  }
}

// Usage example (create once globally):
// const stitchBreaker = new CircuitBreaker(3, 60000);
// const apiResult = await stitchBreaker.execute(
//   () => fetch(`${apiBase}/api/engine/stitch`, {...}),
//   'Stitch API'
// );


// ============================================================================
// 4. IMPROVED updateLeadServiceRole WITH RETRY
// ============================================================================

// Replace the existing updateLeadServiceRole function with this:

const updateRetryPolicy = new RetryPolicy(3, 1000, 2);

async function updateLeadServiceRole(leadId, updates) {
  return updateRetryPolicy.execute(async () => {
    try {
      const { data, error } = await supabaseServiceRole
        .from('leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        log('error', `[RLS BYPASS] Update failed for lead ${leadId}: ${error.message}`);
        return { success: false, error: error.message };
      }

      log('success', `[RLS BYPASS] Successfully updated lead ${leadId}`);
      return { success: true, data };
    } catch (err) {
      log('error', `[RLS BYPASS] Exception updating lead ${leadId}: ${err.message}`);
      throw err; // Let retry policy handle it
    }
  }, `update lead ${leadId}`);
}


// ============================================================================
// 5. IMPROVED runAutoAudit WITH BETTER ERROR HANDLING
// ============================================================================

// Replace try-catch in runAutoAudit with:

async function runAutoAudit() {
  log('info', 'Searching for NEW leads to audit...');

  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .neq('website', '')
      .is('tech_stack', null)
      .limit(CONFIG.maxAuditBatch);

    if (error) {
      log('error', `Error fetching leads for audit: ${error.message}`);
      return;
    }

    if (!leads || leads.length === 0) {
      log('info', 'No new leads found for audit.');
      return;
    }

    log('info', `Starting audit for ${leads.length} leads.`);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const lead of leads) {
      try {
        log('info', `Auditing: ${lead.name} (${lead.website})`);
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

        const start = Date.now();
        let screenshotUrl = null;
        let discovery = { emails: [], socials: {}, primaryColor: '#000000', backgroundColor: '#ffffff', fontFamily: 'sans-serif' };
        let tech = [];
        let loadTime = 0;

        try {
          await page.goto(lead.website, { waitUntil: 'networkidle2', timeout: 35000 });
          loadTime = (Date.now() - start) / 1000;

          // TAKE SCREENSHOT
          const screenshotName = `audit-${lead.id}-${Date.now()}.png`;
          const screenshotBuffer = await page.screenshot({ type: 'png' });

          log('info', `Uploading screenshot to Supabase Storage: ${screenshotName}`);

          const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
            .from('screenshots')
            .upload(screenshotName, screenshotBuffer, { contentType: 'image/png', upsert: true });

          screenshotUrl = `/screenshots/${screenshotName}`;
          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('screenshots')
              .getPublicUrl(uploadData.path);
            screenshotUrl = publicUrl;
            log('success', `Screenshot live: ${screenshotUrl}`);
          } else {
            log('warning', `Supabase upload failed, using fallback: ${uploadError?.message}`);
          }

          // DEEP DISCOVERY
          discovery = await page.evaluate(() => {
            const getStyle = (el, prop) => window.getComputedStyle(el).getPropertyValue(prop);
            const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const html = document.documentElement.innerHTML;
            const matches = html.match(EMAIL_REGEX) || [];

            const forbidden = ['wixpress.com', 'sentry.io', 'example.com', 'bootstrap.com', 'github.com', 'google.com'];
            const emails = Array.from(new Set(matches))
              .map(e => e.toLowerCase())
              .filter(e => !forbidden.some(f => e.includes(f)))
              .filter(e => !e.match(/\.(png|jpg|jpeg|gif|svg|webp|pdf|css|js)$/));

            const waMatch = html.match(/(?:wa\.me|api\.whatsapp\.com|whatsapp:|web\.whatsapp\.com)\/(\d+)/i);
            const socials = {
              instagram: !!html.match(/instagram\.com/i),
              facebook: !!html.match(/facebook\.com/i),
              linkedin: !!html.match(/linkedin\.com/i)
            };

            const bodyBg = getStyle(document.body, 'background-color');
            const headings = document.querySelectorAll('h1, h2, h3, button, a.button, .btn');
            const primaryColor = headings.length > 0 ? getStyle(headings[0], 'color') : '#000000';

            const rgbToHex = (rgb) => {
              try {
                const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                if (!match) return rgb;
                const r = parseInt(match[1]).toString(16).padStart(2, '0');
                const g = parseInt(match[2]).toString(16).padStart(2, '0');
                const b = parseInt(match[3]).toString(16).padStart(2, '0');
                return `#${r}${g}${b}`;
              } catch(e) { return rgb; }
            };

            return {
              emails,
              socials,
              primaryColor: rgbToHex(primaryColor),
              backgroundColor: rgbToHex(bodyBg),
              fontFamily: getStyle(document.body, 'font-family').split(',')[0].replace(/['"]/g, '')
            };
          });

          log('info', `Home Discovery: ${discovery.emails.length} emails found.`);

          // DETECT TECH STACK
          tech = await page.evaluate(() => {
            const stack = [];
            const html = document.documentElement.innerHTML;
            if (html.includes('wp-content')) stack.push('WordPress');
            if (html.includes('wix.com') || html.includes('wixstatic')) stack.push('Wix');
            if (html.includes('shopify')) stack.push('Shopify');
            if (html.includes('squarespace')) stack.push('Squarespace');
            if (html.includes('webflow')) stack.push('Webflow');
            if (window.next || html.includes('_next/static')) stack.push('Next.js');
            return stack;
          });

        } catch (pageError) {
          log('warning', `Page navigation failed for ${lead.name}: ${pageError.message}`);
          // Continue with minimal data
        }

        // SAVE AUDIT WITH RETRY
        const speedScore = Math.round(Math.max(0, 100 - (loadTime * 15)));
        const painPoints = [];
        if (speedScore < 60) painPoints.push(`Velocidad crítica: ${loadTime.toFixed(1)}s`);
        if (tech.length > 0) {
          if (tech.includes('Wix') || tech.includes('WordPress')) painPoints.push(`Arquitectura limitada (${tech[0]})`);
        } else {
          painPoints.push("Infraestructura Legacy");
        }
        if (!lead.website.startsWith('https')) painPoints.push("Falta SSL");

        const finalEmail = discovery.emails.length > 0 ? discovery.emails[0] : null;

        log('success', `Final Result for ${lead.name}: Email: ${finalEmail || 'None'}, Tech: ${tech.join(', ') || 'Custom'}`);

        // USE RETRY LOGIC
        const auditResult = await updateLeadServiceRole(lead.id, {
          email: finalEmail || lead.email,
          tech_stack: tech.join(', ') || 'Custom',
          load_time: loadTime,
          speed_score: speedScore,
          pain_points: painPoints,
          screenshot_url: screenshotUrl,
          signals: discovery.socials,
          extracted_colors: {
            primary: discovery.primaryColor,
            background: discovery.backgroundColor,
            secondary: discovery.primaryColor === '#000000' ? '#4f46e5' : discovery.primaryColor
          },
          business_dna: {
            strategic_angle: `${tech.length > 0 ? tech[0] : 'Legacy'} Efficiency Optimization`,
            vibe: discovery.fontFamily || 'Sans-serif'
          },
          strategy: `Marca con paleta ${discovery.primaryColor}. Potencial conversión mediante Headless UI.`,
          last_audit: new Date().toISOString()
        });

        if (auditResult.success) {
          log('success', `Lead ${lead.name} fully audited and synced.`);
        }

      } catch (err) {
        log('warning', `Failed to audit ${lead.name}: ${err.message}`);
        // Minimal fallback
        try {
          await updateLeadServiceRole(lead.id, {
            tech_stack: 'Check Manual',
            last_audit: new Date().toISOString()
          });
        } catch (fallbackErr) {
          log('error', `Fallback update also failed for ${lead.name}`);
        }
      }
    }

    await browser.close();
  } catch (err) {
    log('error', 'CRITICAL ERROR IN AUDIT PHASE', err);
  }
}


// ============================================================================
// 6. IMPROVED runAutoGeneration WITH CIRCUIT BREAKER
// ============================================================================

const stitchBreaker = new CircuitBreaker(3, 60000);
const genRetryPolicy = new RetryPolicy(3, 2000, 2);

async function runAutoGeneration() {
  log('info', 'Searching for candidates for Asset Generation...');

  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .not('tech_stack', 'is', null)
      .is('stitch_preview_url', null)
      .gt('score', CONFIG.minScoreForGeneration)
      .limit(CONFIG.maxGenerateBatch);

    if (error) {
      log('error', `Error fetching candidates: ${error.message}`);
      return;
    }

    if (!leads || leads.length === 0) {
      log('info', 'Phase 3: No candidates found for generation.');
      return;
    }

    log('info', `Phase 3: Found ${leads.length} candidates for generation.`);

    for (const lead of leads) {
      try {
        log('info', `Triggering Stitch Project for ${lead.name}...`);

        const apiBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const result = await stitchBreaker.execute(
          () => genRetryPolicy.execute(
            () => fetch(`${apiBase}/api/engine/stitch`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ business: lead, autoTrigger: true })
            }).then(r => {
              if (!r.ok) throw new Error(`HTTP ${r.status}`);
              return r.json();
            }),
            `Stitch API for ${lead.name}`
          ),
          'Stitch API'
        );

        if (result.success) {
          const stitchResult = await updateLeadServiceRole(lead.id, {
            stitch_preview_url: result.previewUrl,
            stitch_project_id: result.stitchProjectId,
            status: 'GENERATED',
            updated_at: new Date().toISOString()
          });

          if (stitchResult.success) {
            log('success', `Generated for ${lead.name}: ${result.previewUrl}`);
          }
        } else {
          log('error', `Generation failed for ${lead.name}: ${result.error}`);
        }
      } catch (err) {
        log('warning', `Generation skipped for ${lead.name}: ${err.message}`);
      }
    }
  } catch (err) {
    log('error', 'CRITICAL ERROR IN GENERATION PHASE', err);
  }
}


// ============================================================================
// 7. IMPROVED MAIN LOOP WITH BETTER ERROR HANDLING
// ============================================================================

async function startCommander() {
  log('info', '================================================');
  log('info', '🚀 ZYNDRIX COMMANDER v2.3 - RESILIENT');
  log('info', '================================================');

  // VALIDATE ENV BEFORE STARTING
  validateEnvironment();

  let lastScanTime = 0;
  const SCAN_INTERVAL = 24 * 60 * 60 * 1000;
  let consecutiveErrors = 0;
  const MAX_CONSECUTIVE_ERRORS = 5;

  while (true) {
    try {
      const now = Date.now();

      if (now - lastScanTime > SCAN_INTERVAL) {
        try {
          await runAutoScan();
          lastScanTime = now;
        } catch (err) {
          log('error', `Scan phase failed: ${err.message}`);
        }
      }

      try {
        await runAutoAudit();
      } catch (err) {
        log('error', `Audit phase failed: ${err.message}`);
      }

      try {
        await runAutoGeneration();
      } catch (err) {
        log('error', `Generation phase failed: ${err.message}`);
      }

      consecutiveErrors = 0;
      log('info', `Cycle complete. Sleeping for ${CONFIG.loopDelayMs / 1000}s...`);
      await new Promise(r => setTimeout(r, CONFIG.loopDelayMs));

    } catch (err) {
      consecutiveErrors++;
      log('error', `CYCLE ERROR (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}): ${err.message}`);

      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        log('error', '🚨 TOO MANY ERRORS - SHUTTING DOWN FOR MANUAL REVIEW');
        process.exit(1);
      }

      // Exponential backoff on errors
      const backoffMs = 30000 * Math.pow(2, Math.min(consecutiveErrors - 1, 3));
      log('warning', `Waiting ${backoffMs / 1000}s before retry...`);
      await new Promise(r => setTimeout(r, backoffMs));
    }
  }
}


// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RetryPolicy,
    CircuitBreaker,
    validateEnvironment
  };
}
