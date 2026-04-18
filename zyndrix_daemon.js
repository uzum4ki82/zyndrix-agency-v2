/**
 * ZYNDRIX AUTONOMOUS COMMANDER (THE DAEMON)
 * -----------------------------------------
 * This script is the "Auto-Pilot" of the Zyndrix platform.
 * It manages the entire lead lifecycle autonomously:
 * 1. DISCOVERY: Scans Google Places for new leads.
 * 2. INTELLIGENCE: Audits tech stack & performance (Puppeteer).
 * 3. GENERATION: Triggers Stitch AI for custom assets.
 * 4. OUTREACH: Sends personalized emails via Resend.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// 1. Setup Environment
function loadEnv(filePath) {
    try {
        const envContent = fs.readFileSync(filePath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join('=').trim();
            }
        });
    } catch (err) {
        console.error("Could not load .env.local:", err.message);
    }
}

loadEnv(path.resolve(__dirname, './.env.local'));

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// [FIX #1] Service Role Client - Bypasses RLS for daemon operations
// [FIX #5] Validate environment on startup
function validateEnvironment() {
  const REQUIRED = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GOOGLE_MAPS_API_KEY',
    'ANTHROPIC_API_KEY'
  ];

  const missing = REQUIRED.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ CRITICAL: Missing required environment variables:');
    missing.forEach(k => console.error(`   - ${k}`));
    process.exit(1);
  }
  console.log('✅ Environment validation passed');
}

validateEnvironment();

const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// [FIX #1] + [FIX #5] Helper function to update leads using service role (bypasses RLS) with retry logic
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
                throw new Error(error.message); // Throw so retry logic catches it
            }

            log('success', `[RLS BYPASS] Successfully updated lead ${leadId}`);
            return { success: true, data };
        } catch (err) {
            log('error', `[RLS BYPASS] Exception updating lead ${leadId}: ${err.message}`);
            throw err; // Let retry policy handle retries
        }
    }, `update lead ${leadId}`);
}

// Configuration
const CONFIG = {
    loopDelayMs: 30000, // Reduced to 30s for more aggressive cycles
    maxAuditBatch: 20,  // Doubled capacity
    maxGenerateBatch: 10, // Doubled capacity
    maxOutreachBatch: 10, // Doubled capacity
    minScoreForGeneration: 10, // Lowered threshold to generate more demos
    parallelAudits: 3, // [SENIOR] Process 3 leads in parallel
};

// --- LOGGING HELPER ---
function log(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console.log(entry);
    if (Object.keys(context).length > 0) console.log(JSON.stringify(context, null, 2));

    const logPath = path.resolve(__dirname, './daemon.log');
    
    // [SENIOR] Basic Log Rotation: If > 5MB, rename and start fresh
    if (fs.existsSync(logPath) && fs.statSync(logPath).size > 5 * 1024 * 1024) {
      const backupPath = logPath + '.old';
      fs.renameSync(logPath, backupPath);
      fs.writeFileSync(logPath, `[${timestamp}] [INFO] LOG ROTATED - SYSTEM CLEAN\n`);
    }

    fs.appendFileSync(logPath, entry + '\n');
}

// --- RETRY POLICY [FIX #5] ---
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

const updateRetryPolicy = new RetryPolicy(3, 1000, 2);

// --- CIRCUIT BREAKER [FIX #5] ---
class CircuitBreaker {
    constructor(failureThreshold = 5, resetTimeoutMs = 60000) {
        this.failureThreshold = failureThreshold;
        this.resetTimeoutMs = resetTimeoutMs;
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED';
    }

    async execute(fn, name) {
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

const stitchBreaker = new CircuitBreaker(3, 60000);
const genRetryPolicy = new RetryPolicy(3, 2000, 2);

// --- PHASE 2: AUDIT LOGIC (PUPPETEER) ---
async function runAutoAudit() {
    log('info', 'Searching for NEW leads to audit...');
    
    // Select leads that have a website but haven't been audited yet (no tech_stack)
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

    log('info', `Starting audit for ${leads.length} leads in groups of ${CONFIG.parallelAudits}.`);
    
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    // [SENIOR] Parallel processing with Worker-style chunks
    for (let i = 0; i < leads.length; i += CONFIG.parallelAudits) {
        const chunk = leads.slice(i, i + CONFIG.parallelAudits);
        await Promise.all(chunk.map(async (lead) => {
            let page;
            try {
                // [FIX #1.2] URL Validation
                const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                if (!lead.website || !URL_REGEX.test(lead.website)) {
                    log('warning', `Skipping invalid URL for ${lead.name}: ${lead.website}`);
                    return;
                }

                log('info', `Auditing: ${lead.name} (${lead.website})`);
                page = await browser.newPage();
                await page.setViewport({ width: 1280, height: 800 });
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
                
                const start = Date.now();
                // [FIX #6] Strict timeout of 30s
                await page.goto(lead.website, { waitUntil: 'networkidle2', timeout: 30000 });
                const loadTime = (Date.now() - start) / 1000;
                
                // TAKE SCREENSHOT
                const screenshotName = `audit-${lead.id}-${Date.now()}.png`;
                const screenshotBuffer = await page.screenshot({ type: 'png' });
                
                log('info', `Uploading screenshot to Supabase Storage: ${screenshotName}`);
                
                // [FIX] Use service role client to bypass RLS for screenshots
                const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
                    .from('screenshots')
                    const target = links.find(a => {
                        const txt = a.innerText.toLowerCase();
                        const href = a.getAttribute('href')?.toLowerCase() || '';
                        return txt.includes('contact') || txt.includes('contacto') || 
                               href.includes('contact') || href.includes('contacto') ||
                               txt.includes('legal') || txt.includes('aviso') ||
                               txt.includes('politica') || txt.includes('privacidad') ||
                               href.includes('legal') || href.includes('aviso');
                    });
                    return target ? target.href : null;
                });

                if (contactLink && contactLink.startsWith('http')) {
                    // [FIX #3] Unvalidated Redirects
                    try {
                        const targetHost = new URL(contactLink).hostname.replace('www.', '');
                        const sourceHost = new URL(lead.website).hostname.replace('www.', '');
                        
                        if (targetHost !== sourceHost) {
                            log('warning', `Redirect outside domain: ${targetHost} != ${sourceHost}`);
                            return discovery;
                        }

                        log('info', `Deep Discovery: Navigating to secondary page: ${contactLink}`);
                        await page.goto(contactLink, { waitUntil: 'load', timeout: 20000 });
                        const contactDiscovery = await extractEmailsAndInfo(page);
                        discovery.emails = [...new Set([...discovery.emails, ...contactDiscovery.emails])];
                        log('success', `Deep Discovery finished: ${discovery.emails.length} emails found after exploration.`);
                    } catch (e) {
                        log('warning', `Failed to visit contact page or invalid URL: ${e.message}`);
                    }
                }
            }

            // --- DETECT TECH STACK ---
            const tech = await page.evaluate(() => {
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

            const speedScore = Math.round(Math.max(0, 100 - (loadTime * 15)));
            const painPoints = [];
            if (speedScore < 60) painPoints.push(`Velocidad crítica: ${loadTime.toFixed(1)}s`);
            if (tech.length > 0) {
                if (tech.includes('Wix') || tech.includes('WordPress')) painPoints.push(`Arquitectura limitada (${tech[0]})`);
            } else {
                painPoints.push("Infraestructura Legacy (No detectada)");
            }
            if (!lead.website.startsWith('https')) painPoints.push("Falta SSL / Seguridad");

            const finalEmail = discovery.emails.length > 0 ? discovery.emails[0] : null;

            log('success', `Final Result for ${lead.name}: Email: ${finalEmail || 'None'}, Tech: ${tech.join(', ') || 'Custom'}`);

            // [FIX #1] Use service role to update lead (bypasses RLS)
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
                    secondary: discovery.primaryColor === '#000000' ? '#4f46e5' : discovery.primaryColor // Simple derivation for now
                },
                business_dna: {
                    strategic_angle: `${tech.length > 0 ? tech[0] : 'Legacy'} Efficiency Optimization`,
                    vibe: discovery.fontFamily || 'Sans-serif'
                },
                strategy: `Marca premium con paleta ${discovery.primaryColor} y tipografía ${discovery.fontFamily}. Potencial de conversión mediante Headless UI.`,
                last_audit: new Date().toISOString()
            });

            if (auditResult.success) {
                log('success', `Lead ${lead.name} fully audited and synced.`);
            }

        } catch (err) {
            log('warning', `Failed to audit ${lead.name}: ${err.message}`);
            // Fallback: minimal update to avoid infinite loop
            await updateLeadServiceRole(lead.id, { 
                tech_stack: 'Check Manual', 
                last_audit: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        } finally {
            if (page) await page.close();
        }
    }

    await browser.close();
}


// --- PHASE 3: ASSET GENERATION (STITCH) [FIX #5] ---
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
            log('error', `Error fetching candidates for Asset Generation: ${error.message}`);
            return;
        }

        if (!leads || leads.length === 0) {
            log('info', 'Phase 3: No candidates found for generation.');
            return;
        }

        log('info', `Phase 3: Found ${leads.length} candidates for personalized design generation.`);

        for (const lead of leads) {
            log('info', `Triggering Automatic Stitch Project for ${lead.name}...`);

            try {
                const apiBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

                // Use circuit breaker + retry for Stitch API + [FIX #6] Fetch Timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                const result = await stitchBreaker.execute(
                    () => genRetryPolicy.execute(
                        () => fetch(`${apiBase}/api/engine/stitch`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ business: lead, autoTrigger: true }),
                            signal: controller.signal
                        }).then(r => {
                            clearTimeout(timeoutId);
                            if (!r.ok) throw new Error(`HTTP ${r.status}`);
                            return r.json();
                        }),
                        `Asset Generation for ${lead.name}`
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

// --- PHASE 4: OUTREACH (RESEND) ---
async function runAutoOutreach() {
    log('info', 'Phase 4: Outreach is currently DISABLED by user request.');
    return;
    
    // Only send if it has a preview URL and hasn't been sent yet
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .not('email', 'is', null)
        .is('email_sent', false)
        .or('status.eq.GENERATED,status.eq.AUDITED') // Broadened to catch audited leads too
        .limit(CONFIG.maxOutreachBatch);

    if (error || !leads || leads.length === 0) return;

    for (const lead of leads) {
        log('info', `Automating Outreach for ${lead.name}...`);
        
        try {
            // Only proceed if we have an email or if we are in diagnostic mode
            const targetEmail = lead.email;
            if (!targetEmail) {
                log('warning', `Skipping outreach for ${lead.name}: No corporate email discovered yet.`);
                continue;
            }

            // Call our Next.js API to send the real email
            const apiBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const response = await fetch(`${apiBase}/api/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: lead.id,
                    name: lead.name,
                    email: targetEmail,
                    location: lead.address?.split(',')?.[0] || 'Unknown',
                    analysisData: {
                        techStack: lead.tech_stack,
                        painPoints: lead.pain_points,
                        stitchPreviewUrl: lead.stitch_preview_url,
                        screenshotUrl: lead.screenshot_url,
                        ogImageUrl: lead.og_image_url || lead.screenshot_url,
                        extracted_colors: lead.extracted_colors
                    }
                })
            });

            const result = await response.json();

            if (result.success) {
                log('success', `Outreach successful for ${lead.name}`);

                // [FIX #1] Use service role to mark email as sent (bypasses RLS)
                const outreachResult = await updateLeadServiceRole(lead.id, {
                    email_sent: true,
                    status: 'OUTREACH_COMPLETE',
                    last_outreach_at: new Date().toISOString()
                });

                if (outreachResult.success) {
                    log('success', `Lead ${lead.name} marked as CONTACTED via SERVICE ROLE.`);
                } else {
                    log('error', `Service role sync failed for ${lead.name}: ${outreachResult.error}`);
                }
            } else {
                log('error', `Outreach failed for ${lead.name}: ${JSON.stringify(result.error)}`);
            }
        } catch (err) {
            log('error', `Outreach failed for ${lead.name}`, err);
        }
    }
}

// --- PHASE 1: DISCOVERY (SCAN) ---
async function runAutoScan() {
    log('info', 'Phase 1: Starting Autonomous Discovery Scan...');
    
    // Configurable focus for the day
    const niches = ['restaurante', 'clínica dental', 'reformas', 'taller mecánico', 'peluquería'];
    const locations = [
        'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma de Mallorca', 'Las Palmas de Gran Canaria', 'Bilbao',
        'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'L\'Hospitalet de Llobregat', 'Vitoria-Gasteiz', 'A Coruña', 'Granada', 'Elche',
        'Oviedo', 'Badalona', 'Terrassa', 'Cartagena', 'Jerez de la Frontera', 'Sabadell', 'Móstoles', 'Santa Cruz de Tenerife', 'Alcalá de Henares', 'Fuenlabrada',
        'Pamplona', 'Almería', 'Leganés', 'Donostia-San Sebastián', 'Castellón de la Plana', 'Burgos', 'Santander', 'Albacete', 'Getafe', 'Alcorcón',
        'Logroño', 'San Cristóbal de La Laguna', 'Badajoz', 'Salamanca', 'Huelva', 'Marbella', 'Lleida', 'Dos Hermanas', 'Tarragona', 'Torrejón de Ardoz',
        'Parla', 'Mataró', 'Algeciras', 'León', 'Alcobendas', 'Santa Coloma de Gramenet', 'Cádiz', 'Jaén', 'El Ejido', 'Roquetas de Mar',
        'Telde', 'Reus', 'Santiago de Compostela', 'Lorca', 'Cerdanyola del Vallès', 'San Fernando', 'San Cugat del Vallès', 'San Sebastián de los Reyes', 'Rivas-Vaciamadrid', 'Cornellà de Llobregat'
    ];
    
    const niche = niches[Math.floor(Math.random() * niches.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    log('info', `Targeting: ${niche} in ${location}`);
    
    try {
        // We use our existing API endpoint logic to keep things unified
        const apiBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${apiBase}/api/engine/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ niche, location, companyType: 'pyme' })
        });

        const newLeads = await response.json();
        
        if (Array.isArray(newLeads) && newLeads.length > 0) {
            log('success', `Found ${newLeads.length} new leads. Synchronizing with Supabase...`);
            
            for (const lead of newLeads) {
                // Check if already exists to avoid duplication
                const { data: existing } = await supabase
                    .from('leads')
                    .select('id')
                    .eq('name', lead.name)
                    .eq('address', lead.address || lead.vicinity)
                    .maybeSingle();

                if (!existing) {
                    // Sanitize lead object to match existing schema
                    const cleanLead = {
                        name: lead.name,
                        category: lead.category || lead.intel?.niche || niche,
                        address: lead.address || lead.vicinity,
                        website: lead.website || '',
                        phone: lead.phone || null,
                        score: Math.round(Number(lead.score || 0)),
                        status: lead.status || 'NEW',
                        tech_stack: lead.tech_stack || null,
                        screenshot_url: lead.screenshot_url || null,
                        stitch_preview_url: null,
                        created_at: new Date().toISOString()
                    };
                    
                    const { error } = await supabase.from('leads').insert(cleanLead);
                    if (error) log('error', `Initial Sync failed for ${lead.name}: ${error.message} (Code: ${error.code})`);
                }
            }
        } else {
            log('warning', 'Scanner completed but no high-quality leads were found.');
        }
    } catch (err) {
        log('error', 'Discovery scan engine failed', err);
    }
}

// --- MAIN LOOP [FIX #5] ---
async function startCommander() {
    log('info', '================================================');
    log('info', '🚀 ZYNDRIX COMMANDER v2.4 - RESILIENT');
    log('info', '================================================');

    let lastScanTime = 0; // Will trigger immediate scan on first iteration
    const SCAN_INTERVAL = 30 * 60 * 1000; // 30 minutes for nationwide coverage
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

// Handle termination
process.on('SIGINT', () => {
    log('warning', 'Shutting down Commander...');
    process.exit();
});

startCommander();
