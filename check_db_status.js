const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
    try {
        const envContent = fs.readFileSync(filePath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join('=').trim();
            }
        });
    } catch (err) {}
}

loadEnv(path.resolve(__dirname, './.env.local'));

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLeads() {
    const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching leads:', error.message);
    } else {
        console.log('Total leads in database:', count);
    }

    const { data: cols, error: colError } = await supabase
        .from('leads')
        .select('*')
        .limit(1);
    
    if (colError) {
        console.error('Error fetching column samples:', colError.message);
    } else if (data && data[0]) {
        console.log('Columns found in leads table:', Object.keys(data[0]));
    } else {
        console.log('Table found but empty.');
    }
}

checkLeads();
