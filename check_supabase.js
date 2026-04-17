const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load .env.local manually
const dotEnv = fs.readFileSync('.env.local', 'utf8');
const env = {};
dotEnv.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) env[key.trim()] = val.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    console.error('Supabase URL not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
    console.log(`Checking Supabase at: ${supabaseUrl}`);
    
    // Total leads
    const { count: totalLeads, error: errTotal } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    if (errTotal) console.error('Error fetching total:', errTotal.message);
    else console.log(`Total Leads: ${totalLeads}`);

    // Leads with tech_stack
    const { count: withTechCount } = await supabase.from('leads').select('*', { count: 'exact', head: true })
        .not('tech_stack', 'is', null);
    console.log(`Leads with Tech Stack: ${withTechCount || 0}`);

    // Leads with status GENERATED
    const { count: generatedCount } = await supabase.from('leads').select('*', { count: 'exact', head: true })
        .eq('status', 'GENERATED');
    console.log(`Leads Status GENERATED: ${generatedCount || 0}`);

    // Detail of latest leads
    const { data: latestLeads } = await supabase.from('leads').select('name, status, stitch_preview_url, tech_stack')
        .order('created_at', { ascending: false })
        .limit(10);
    
    console.log('\nLatest 10 Leads:');
    if (latestLeads) {
        latestLeads.forEach(l => {
            console.log(`- ${l.name} [${l.status}] | Preview: ${l.stitch_preview_url || 'N/A'} | Tech: ${l.tech_stack ? 'YES' : 'NO'}`);
        });
    } else {
        console.log('No leads found or error fetching.');
    }
}

checkData();
