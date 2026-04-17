// INITIALIZE ZYNDRIX INFRASTRUCTURE: SCREENSHOTS BUCKET
// ---------------------------------------------------
// This script ensures that the Supabase Storage bucket for screenshots 
// is correctly created and configured for public access.

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment
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

async function initStorage() {
    console.log("Checking storage buckets...");
    
    // 1. Create 'screenshots' bucket if not exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
        console.error("Error listing buckets:", listError.message);
        return;
    }

    const hasBucket = buckets.find(b => b.name === 'screenshots');
    
    if (!hasBucket) {
        console.log("Creating 'screenshots' bucket...");
        const { error: createError } = await supabase.storage.createBucket('screenshots', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg'],
            fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
            console.error("Failed to create bucket:", createError.message);
        } else {
            console.log("Bucket 'screenshots' created successfully.");
        }
    } else {
        console.log("Bucket 'screenshots' already exists.");
    }

    console.log("\nInfrastructure ready! The daemon can now save visual evidence.");
}

initStorage();
