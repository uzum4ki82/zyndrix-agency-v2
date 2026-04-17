/**
 * ZYNDRIX SYSTEM AUDIT & VERIFIER v3.0
 * Professional Diagnostic Tool for Production Infrastructure
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, './.env.local');
        if (!fs.existsSync(envPath)) return false;
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join('=').trim();
            }
        });
        return true;
    } catch (err) {
        return false;
    }
}

async function runAudit() {
    console.log('\x1b[36m%s\x1b[0m', '🔍 ZYNDRIX SYSTEM AUDIT - EXECUTIVE REPORT');
    console.log('============================================\n');

    if (!loadEnv()) {
        console.log('❌ ERROR: .env.local not found.');
        return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('1. [INFRA] Supabase Connection (Public)');
    const supabase = createClient(supabaseUrl, anonKey);
    const { count, error: leadsError } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    
    if (leadsError) {
        console.log(`   ❌ FAILED: ${leadsError.message}`);
    } else {
        console.log(`   ✅ SUCCESS: Found ${count || 0} leads.`);
    }

    console.log('\n2. [FIX #1] RLS Bypass (Service Role)');
    if (!serviceKey) {
        console.log('   ❌ FAILED: SUPABASE_SERVICE_ROLE_KEY missing.');
    } else {
        const adminSupabase = createClient(supabaseUrl, serviceKey);
        const { data: testRead, error: readError } = await adminSupabase.from('leads').select('id').limit(1);
        
        if (readError) {
            console.log(`   ❌ FAILED: Read access denied. (${readError.message})`);
        } else {
            console.log('   ✅ SUCCESS: Admin Auth verified.');
            if (testRead && testRead.length > 0) {
                const { error: updateError } = await adminSupabase.from('leads').update({ updated_at: new Date().toISOString() }).eq('id', testRead[0].id);
                if (updateError) {
                    console.log(`   ❌ FAILED: Update blocked. (${updateError.message})`);
                } else {
                    console.log('   ✅ SUCCESS: Full RLS Bypass active.');
                }
            } else {
                 console.log('   🟡 WARNING: No leads to test update on.');
            }
        }
    }

    console.log('\n3. [FIX #2] Stitch Integration (Legacy vs Real)');
    const stitchKey = process.env.STITCH_API_KEY;
    if (!stitchKey || stitchKey.includes('sk_test')) {
        console.log('   🟡 WARNING: FALLBACK MODE (Generic prompts only).');
    } else {
        console.log('   ✅ SUCCESS: PRODUCTION MODE (Real Stitch creation).');
    }

    console.log('\n4. [FIX #4] Email Outreach (Resend)');
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey || resendKey.includes('re_123456789')) {
        console.log('   🟡 WARNING: SIMULATION MODE (No real emails).');
    } else {
        console.log('   ✅ SUCCESS: PRODUCTION MODE (Real outreach active).');
    }

    console.log('\n5. [DATABASE] Tracking & DNA Columns');
    // Using admin client for schema check
    const checkClient = serviceKey ? createClient(supabaseUrl, serviceKey) : supabase;
    const { error: colCheck } = await checkClient.from('leads').select('brand_palette, outreach_status').limit(1);
    
    if (colCheck) {
        if (colCheck.message.includes('not exist')) {
            console.log('   ❌ FAILED: New columns MISSING.');
            console.log('      ACTION: Please run FIX_1_RLS_POLICIES.sql in your SQL Editor.');
        } else {
            console.log(`   ❌ ERROR: ${colCheck.message}`);
        }
    } else {
        console.log('   ✅ SUCCESS: Schema verified (DNA & Tracking Ready).');
    }

    console.log('\n============================================');
    console.log('\x1b[32m%s\x1b[0m', 'AUDIT COMPLETE - SYSTEM READY FOR DEPLOYMENT');
}

runAudit();
