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
    
    // MASTER FIX: Try direct fetch if the client fails
    const body = await req.json();
    console.log('Final Lead Ingestion Attempt:', body.email);

    // 1. Try Supabase Client (Standard)
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error: clientError } = await supabase.from('leads').upsert({
      name: body.name || 'Anonymous',
      email: body.email,
      phone: body.phone || null,
      company_name: body.company_name || null,
      message: body.message || 'Legacy Capture',
      budget: body.budget || null,
      service: body.service || null,
      status: 'new'
    }, { onConflict: 'email' });

    if (!clientError) {
      return NextResponse.json({ success: true, method: 'client' }, { status: 201, headers: corsHeaders });
    }

    // 2. Fallback: Direct REST fetch WITHOUT Bearer (Avoid JWT error)
    const restRes = await fetch(`${supabaseUrl}/rest/v1/leads?on_conflict=email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Prefer': 'resolution=merge-duplicates, return=minimal'
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone,
        company_name: body.company_name,
        message: body.message,
        service: body.service,
        status: 'new'
      })
    });

    if (restRes.ok) {
       return NextResponse.json({ success: true, method: 'direct' }, { status: 201, headers: corsHeaders });
    }

    const restErr = await restRes.json();
    console.error('Final failure:', restErr);
    return NextResponse.json({ error: 'Auth/Database block', details: restErr }, { status: 400, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json({ error: 'System crash', details: err.message }, { status: 500, headers: corsHeaders });
  }
}
