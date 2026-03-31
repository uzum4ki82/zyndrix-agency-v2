import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vrvfftftnlspajplqjye.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    console.log('Ingesting Lead:', body.email);

    // Simple INSERT - If email exists it may fail due to unique constraint, so we use upsert
    const { data, error } = await supabase
      .from('leads')
      .upsert({
        name: body.name || 'Anonymous',
        email: body.email,
        phone: body.phone || null,
        company_name: body.company_name || null,
        message: body.message || 'Legacy Capture',
        budget: body.budget || null,
        service: body.service || null,
        status: 'new'
      }, { onConflict: 'email' });

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 400, headers: corsHeaders });
    }

    // Optional: n8n Relay
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(e => console.error('n8n error:', e));
    }

    return NextResponse.json({ success: true, data }, { status: 201, headers: corsHeaders });

  } catch (err: any) {
    console.error('Critical Failure:', err.message);
    return NextResponse.json({ error: 'Critical failure', details: err.message }, { status: 500, headers: corsHeaders });
  }
}
