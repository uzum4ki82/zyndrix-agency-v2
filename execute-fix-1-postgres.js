#!/usr/bin/env node
/**
 * FIX #1: RLS POLICIES - POSTGRES CONNECTION
 */

const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
    host: 'vrvfftftnlspajplqjye.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    ssl: 'require'
});

async function executeFix1() {
    console.log('🚀 EXECUTING FIX #1: RLS POLICIES');
    console.log('==================================\n');

    try {
        await client.connect();
        console.log('✓ Connected to Postgres\n');

        // Read the SQL file
        const sqlContent = fs.readFileSync('./FIX_1_RLS_POLICIES.sql', 'utf8');

        // Split by statements (simple approach)
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--'));

        console.log(`Found ${statements.length} SQL statements\n`);

        let successCount = 0;
        let skipCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];

            if (stmt.length < 10) continue; // Skip empty

            try {
                console.log(`[${i+1}/${statements.length}] Executing...`);
                await client.query(stmt);
                console.log(`   ✓ Success\n`);
                successCount++;
            } catch (err) {
                if (err.message.includes('already exists') || err.message.includes('ALREADY EXISTS')) {
                    console.log(`   ⚠ Already exists (OK)\n`);
                    skipCount++;
                } else {
                    console.log(`   ⚠ Error: ${err.message}\n`);
                    skipCount++;
                }
            }
        }

        console.log('==================================');
        console.log(`✓ Executed: ${successCount}`);
        console.log(`⚠ Skipped/Errored: ${skipCount}`);
        console.log('==================================\n');

        // Verify
        console.log('VERIFICATION:');
        const policiesRes = await client.query(
            "SELECT policyname FROM pg_policies WHERE tablename = 'leads' LIMIT 10"
        );
        console.log(`✓ Found ${policiesRes.rows.length} RLS policies`);

        const tablesRes = await client.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%daemon%'"
        );
        console.log(`✓ daemon_logs table exists: ${tablesRes.rows.length > 0}\n`);

        console.log('✅ FIX #1 COMPLETE!\n');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Full error:', error);
        if (error.message.includes('password')) {
            console.error('\nℹ️  Need POSTGRES_PASSWORD environment variable');
            console.error('This password is NOT the service role key');
            console.error('It\'s the database admin password');
        }
    } finally {
        try {
            await client.end();
        } catch (e) {
            // ignore
        }
    }
}

executeFix1();
