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
    console.log('Ingesting Lead:', body.email);

    // Write ONLY to the 'leads' table
    const { error } = await supabase
      .from('leads')
      .upsert([{
        name: body.name || 'Anonymous',
        email: body.email,
        phone: body.phone || null,
        message: body.message || '',
        status: 'new',
        created_at: new Date().toISOString()
      }], { onConflict: 'email' });

    if (error) {
      console.error('Database Ingestion Failure:', error);
      throw error;
    }

    // n8n Relay
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(e => console.error('n8n error:', e));
    }

    return NextResponse.json({ success: true, message: 'Lead captured in leads table' }, { 
      status: 201, 
      headers: corsHeaders 
    });

  } catch (err: any) {
    console.error('API critical error:', err.message);
    return NextResponse.json({ error: 'Failed to process lead', details: err.message }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
