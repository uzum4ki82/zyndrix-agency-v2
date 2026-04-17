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

// Configuration
const CONFIG = {
    loopDelayMs: 60000, // 1 minute between main cycles
    maxAuditBatch: 10,
    maxGenerateBatch: 5,
    maxOutreachBatch: 5,
    minScoreForGeneration: 30,
};

// --- LOGGING HELPER ---
function log(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console.log(entry);
    if (Object.keys(context).length > 0) console.log(JSON.stringify(context, null, 2));
    
    // Also append to a local log file for the Dashboard to read
    fs.appendFileSync(path.resolve(__dirname, './daemon.log'), entry + '\n');
}

// --- PHASE 2: AUDIT LOGIC (PUPPETEER) ---
async function runAutoAudit() {
    log('info', 'Searching for NEW leads to audit...');
    
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
    
    const browser = await puppeteer.launch({ headless: "new" });

    for (const lead of leads) {
        try {
            log('info', `Auditing: ${lead.name} (${lead.website})`);
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
            
            const start = Date.now();
            await page.goto(lead.website, { waitUntil: 'networkidle2', timeout: 35000 });
            const loadTime = (Date.now() - start) / 1000;
            
            // TAKE SCREENSHOT
            const screenshotName = `audit-${lead.id}.png`;
            const screenshotBuffer = await page.screenshot({ type: 'png' });
            
            log('info', `Uploading screenshot to Supabase Storage: ${screenshotName}`);
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('screenshots')
                .upload(screenshotName, screenshotBuffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            let screenshotUrl = `/screenshots/${screenshotName}`; // Fallback local path
            if (uploadError) {
                log('error', `Supabase Upload Error: ${uploadError.message}`);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('screenshots')
                    .getPublicUrl(uploadData.path);
                screenshotUrl = publicUrl;
                log('success', `Screenshot live: ${screenshotUrl}`);
            }
            
            // --- EXTRACT BRAND DNA ---
            log('info', `Extracting Brand DNA and Contact info for ${lead.name}...`);
            const discoveryData = await page.evaluate(() => {
                const getStyle = (el, prop) => window.getComputedStyle(el).getPropertyValue(prop);
                
                // Email extraction
                const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                const html = document.documentElement.innerHTML;
                const matches = html.match(EMAIL_REGEX) || [];
                const forbidden = ['wixpress.com', 'sentry.io', 'example.com', 'domain.com'];
                const email = matches.find(e => !forbidden.some(f => e.includes(f)));

                // Get main background and primary text/button colors
                const bodyBg = getStyle(document.body, 'background-color');
                const headings = document.querySelectorAll('h1, h2, h3, button, a.button, .btn');
                const primaryColor = headings.length > 0 ? getStyle(headings[0], 'color') : '#000000';
                
                // Helper to convert rgb to hex
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
                    email: email || null,
                    primaryColor: rgbToHex(primaryColor),
                    backgroundColor: rgbToHex(bodyBg),
                    fontFamily: getStyle(document.body, 'font-family').split(',')[0].replace(/['"]/g, '')
                };
            });

            log('success', `Discovery: Email: ${discoveryData.email || 'None'}, Color: ${discoveryData.primaryColor}`);
            
            // --- DETECT TECH STACK ---
            const tech = await page.evaluate(() => {
                const stack = [];
                const html = document.documentElement.innerHTML;
                if (html.includes('wp-content')) stack.push('WordPress');
                if (html.includes('wix.com')) stack.push('Wix');
                if (html.includes('shopify')) stack.push('Shopify');
                if (html.includes('squarespace')) stack.push('Squarespace');
                if (window.next) stack.push('Next.js');
                return stack;
            });

            const speedScore = Math.round(Math.max(0, 100 - (loadTime * 15)));
            const painPoints = [];
            if (speedScore < 60) painPoints.push(`Velocidad crítica: ${loadTime.toFixed(1)}s`);
            if (tech.includes('Wix') || tech.includes('WordPress')) painPoints.push(`Arquitectura limitada (${tech[0]})`);
            if (!lead.website.startsWith('https')) painPoints.push("Falta SSL / Seguridad");

            log('success', `Result for ${lead.name}: ${tech.join(', ') || 'Custom'} (${loadTime.toFixed(2)}s)`);

            // Sincronización directa con Supabase
            const { error: syncError } = await supabase
                .from('leads')
                .update({
                    email: discoveryData.email || lead.email,
                    tech_stack: tech.join(', ') || 'Custom',
                    load_time: loadTime,
                    speed_score: speedScore,
                    pain_points: painPoints,
                    screenshot_url: screenshotUrl,
                    strategy: `Marca premium con paleta ${discoveryData.primaryColor} y tipografía ${discoveryData.fontFamily}.`,
                    last_audit: new Date().toISOString()
                })
                .eq('id', lead.id);

            if (!syncError) {
                log('success', `Result for ${lead.name} synced DIRECTLY.`);
            } else {
                log('error', `Direct sync failed for ${lead.name} after audit: ${syncError.message}`);
            }

        } catch (err) {
            log('warning', `Failed to audit ${lead.name}: ${err.message}`);
            // Marcar como auditado con error directamente para evitar bucles infinitos
            await supabase
                .from('leads')
                .update({ tech_stack: 'Check Manual', last_audit: new Date().toISOString() })
                .eq('id', lead.id);
        }
    }

    await browser.close();
}

// --- PHASE 3: ASSET GENERATION (STITCH) ---
async function runAutoGeneration() {
    log('info', 'Searching for candidates for Asset Generation...');
    
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

    log('info', `Phase 3: Found ${leads.length} candidates for personalzed design generation.`);

    for (const lead of leads) {
        log('info', `Triggering Automatic Stitch Project for ${lead.name}...`);
        
        try {
            // Call our own Stitch API to generate the design metadata
            const apiBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const response = await fetch(`${apiBase}/api/engine/stitch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ business: lead })
            });

            const result = await response.json();
            
            if (result.success) {
                // Sincronización directa con Supabase para evitar dependencia del despliegue en Vercel
                const { error: syncError } = await supabase
                    .from('leads')
                    .update({
                        stitch_preview_url: result.previewUrl,
                        stitch_project_id: result.stitchProjectId,
                        status: 'GENERATED',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', lead.id);

                if (!syncError) {
                    log('success', `Project generated and synced (DIRECT) for ${lead.name}: ${result.previewUrl}`);
                } else {
                    log('error', `Direct sync failed for ${lead.name}: ${syncError.message}`);
                }
            } else {
                log('error', `Generation failed for ${lead.name}: ${result.error}`);
            }
        } catch (err) {
            log('error', `Generation failed for ${lead.name}`, err);
        }
    }
}

// --- PHASE 4: OUTREACH (RESEND) ---
async function runAutoOutreach() {
    log('info', 'Phase 4: Checking for Outreach candidates...');
    
    // Only send if it has a preview URL and hasn't been sent yet
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'GENERATED')
        .eq('site_active', true)
        .is('email_sent', false)
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
                    location: lead.address.split(',')[0],
                    analysisData: {
                        techStack: lead.tech_stack,
                        painPoints: lead.pain_points,
                        stitchPreviewUrl: lead.stitch_preview_url,
                        screenshotUrl: lead.screenshot_url,
                        ogImageUrl: lead.og_image_url || lead.screenshot_url
                    }
                })
            });

            const result = await response.json();

            if (result.success) {
                log('success', `Outreach successful for ${lead.name}`);
                
                // Sincronización DIRECTA con Supabase para evitar bucles de spam
                const { error: syncError } = await supabase
                    .from('leads')
                    .update({
                        email_sent: true,
                        status: 'OUTREACH_COMPLETE',
                        last_outreach_at: new Date().toISOString()
                    })
                    .eq('id', lead.id);

                if (!syncError) {
                    log('success', `Lead ${lead.name} marked as CONTACTED in database.`);
                } else {
                    log('error', `Failed to mark lead ${lead.name} as contacted: ${syncError.message}`);
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
        'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Hospitalet de Llobregat', 'Vitoria-Gasteiz', 'A Coruña', 'Elche', 'Granada',
        'Terrassa', 'Badalona', 'Oviedo', 'Sabadell', 'Cartagena', 'Jerez de la Frontera', 'Móstoles', 'Santa Cruz de Tenerife', 'Pamplona', 'Almería',
        'Alcalá de Henares', 'Fuenlabrada', 'Leganés', 'San Sebastián', 'Getafe', 'Burgos', 'Albacete', 'Castellón de la Plana', 'Santander', 'Alcorcón',
        'San Cristóbal de La Laguna', 'Logroño', 'Badajoz', 'Huelva', 'Salamanca', 'Marbella', 'Lleida', 'Dos Hermanas', 'Tarragona', 'Torrejón de Ardoz',
        'León', 'Mataró', 'Parla', 'Algeciras', 'Cádiz', 'Santa Coloma de Gramenet', 'Jaén', 'Alcobendas', 'Ourense', 'Reus',
        'Telde', 'Estepona', 'Benidorm', 'Sagunto', 'Paterna', 'San Cugat del Vallès', 'Torrevieja', 'Gandia', 'Avilés', 'Cuenca',
        'Guadalajara', 'Toledo', 'Segovia', 'Ávila', 'Soria', 'Teruel', 'Zamora', 'Palencia', 'Cáceres', 'Ciudad Real'
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
                        tech_stack: lead.tech_stack || '',
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

// --- MAIN LOOP ---
async function startCommander() {
    log('info', '================================================');
    log('info', '🚀 ZYNDRIX COMMANDER v2.2 - Discovery Robustness');
    log('info', '================================================');
    
    let lastScanTime = 0;
    const SCAN_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

    while (true) {
        try {
            const now = Date.now();
            if (now - lastScanTime > SCAN_INTERVAL) {
                await runAutoScan();
                lastScanTime = now;
            }

            await runAutoAudit();
            await runAutoGeneration();
            await runAutoOutreach();
            
            log('info', `Cycle complete. Sleeping for ${CONFIG.loopDelayMs / 1000}s...`);
            await new Promise(r => setTimeout(r, CONFIG.loopDelayMs));
        } catch (err) {
            log('error', 'CRITICAL ERROR IN COMMANDER ENGINE', err);
            // Self-healing attempt: wait longer on critical error
            await new Promise(r => setTimeout(r, 30000));
        }
    }
}

// Handle termination
process.on('SIGINT', () => {
    log('warning', 'Shutting down Commander...');
    process.exit();
});

startCommander();
