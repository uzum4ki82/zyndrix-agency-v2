const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const supabaseServiceRole = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function getJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function processSpecialAddress(address) {
    console.log(`--- PROCESSING SPECIAL TARGET: ${address} ---`);
    
    // 1. Get Details from Google Places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    try {
        const data = await getJSON(searchUrl);
        
        if (data.results && data.results.length > 0) {
            const place = data.results[0];
            console.log(`Found Place: ${place.name} (${place.place_id})`);
            
            // 2. Get more details (website)
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,website,formatted_phone_number,rating,user_ratings_total,types&key=${GOOGLE_MAPS_API_KEY}`;
            const detailsData = await getJSON(detailsUrl);
            const details = detailsData.result;
            
            console.log(`Website: ${details.website || 'N/A'}`);
            
            // Generate a random ID if we don't have constraints for upsert
            const lead = {
                name: details.name,
                address: details.formatted_address,
                website: details.website || '',
                phone: details.formatted_phone_number || '',
                category: details.types ? details.types[0] : 'unknown',
                score: Math.round((details.rating || 0) * 20),
                status: 'NEW',
                google_place_id: place.place_id,
                created_at: new Date().toISOString()
            };
            
            // Just insert
            const { data: inserted, error } = await supabaseServiceRole
                .from('leads')
                .insert(lead)
                .select();
                
            if (error) {
                console.error('Error inserting lead (might already exist):', error.message);
            } else {
                console.log('✅ Lead successfully synchronized with Supabase:', inserted[0].id);
                console.log('--- READY FOR DAEMON AUDIT ---');
            }
            
        } else {
            console.warn('No results found for this address in Google Places.');
        }
    } catch (err) {
        console.error('Failed to process address:', err.message);
    }
}

processSpecialAddress("7150 Leetsdale Dr, Denver, CO 80224, United States");
