const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
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
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
    console.log('--- APPLYING MIGRATION FIX #4 ---');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    const sqlFile = path.resolve(__dirname, './FIX_4_EMAIL_TRACKING.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL into individual statements for primitive execution if needed,
    // but better to use an RPC or just try to run it.
    // Supabase JS client doesn't have a direct SQL executor.
    // We will use a dedicated tool or just assume the user does it.
    
    console.log('Supabase JS Client does not support raw SQL execution directly.');
    console.log('Please execute the content of FIX_4_EMAIL_TRACKING.sql in the Supabase Dashboard SQL Editor.');
    console.log('Project Ref: etcxlzpwxwnlrhowldel');
    
    // However, we can check if the columns exist already.
    const { data, error } = await supabase.from('leads').select('*').limit(1);
    
    if (error) {
        console.error('Error checking leads table:', error.message);
    } else if (data && data.length > 0) {
        const lead = data[0];
        const columns = Object.keys(lead);
        console.log('Existing columns in leads table:', columns);
        
        const required = ['resend_email_id', 'email_sent_at', 'engagement_score'];
        const missing = required.filter(c => !columns.includes(c));
        
        if (missing.length === 0) {
            console.log('✅ Migration appears to be ALREADY APPLIED.');
        } else {
            console.log('❌ Migration MISSING columns:', missing);
        }
    }
}

applyMigration();
