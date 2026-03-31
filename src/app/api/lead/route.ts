import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Ingesting Lead with Adaptive Schema:', body.email);

    // Parsing name for the new first_name/last_name format
    const [firstName, ...lastNameParts] = (body.name || 'Anonymous').split(' ');
    const lastName = lastNameParts.join(' ') || 'N/A';

    // Write to 'leads' using the actual columns found in your DB
    const { error } = await supabase
      .from('leads')
      .upsert([{
        first_name: firstName,
        last_name: lastName,
        email: body.email,
        phone: body.phone || null,
        reasoning: body.message || 'No message', 
        status: 'new'
      }], { onConflict: 'email' });

    if (error) {
      console.error('Database rejection:', error);
      // Try one last fallback with 'name' if 'first_name' fails (Double insurance)
      if (error.code === 'PGRST204') {
         await supabase.from('leads').upsert([{
           name: body.name,
           email: body.email,
           message: body.message,
           status: 'new'
         }], { onConflict: 'email' });
      } else {
        throw error;
      }
    }

    // n8n Relay
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(e => console.error('n8n error:', e));
    }

    return NextResponse.json({ success: true, message: 'Lead captured' }, { 
      status: 201, 
      headers: corsHeaders 
    });

  } catch (err: any) {
    console.error('API Error:', err.message);
    return NextResponse.json({ error: 'Failed to process lead', details: err.message }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
