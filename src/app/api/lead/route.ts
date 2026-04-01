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
    const { data: leadData, error: clientError } = await supabase.from('leads').upsert({
      name: body.name || 'Anonymous',
      email: body.email,
      phone: body.phone || null,
      company_name: body.company_name || null,
      message: body.message || 'Legacy Capture',
      budget: body.budget || null,
      service: body.service || null,
      status: 'new'
    }, { onConflict: 'email' }).select();

    const leadId = leadData?.[0]?.id;

    let methodUsed = 'client';

    if (clientError) {
      console.warn('Supabase Client Error, attempting fallback:', clientError.message);
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

      if (!restRes.ok) {
        throw new Error(`Fallback failed: ${restRes.status}`);
      }
      methodUsed = 'hybrid';
    }

    // 3. TRIGGER N8N AUTOMATION (Sale Funnel Brain)
    // Usamos la URL específica para Lead Magnet proporcionada por el usuario o la de entorno
    const isLeadMagnet = body.service?.includes('Blueprint');
    const n8nWebhook = isLeadMagnet 
      ? 'https://n8n.zyndrix.dev/webhook/leadmagnet' 
      : (process.env.N8N_WEBHOOK_URL || 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring');

    if (n8nWebhook) {
      // Usamos await para asegurar que el webhook se procese antes de cerrar la conexión serverless
      await fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: body.service || 'Lead Magnet V12',
          timestamp: new Date().toISOString(),
          record: {
            id: leadId, // El ID se enviará si logramos obtenerlo del insert select()
            name: body.name,
            email: body.email,
            company_name: body.company_name,
            message: body.message,
            service: body.service,
            status: 'new'
          }
        })
      }).catch(err => console.error('n8n Webhook failed:', err));
    }

    return NextResponse.json({ success: true, method: methodUsed }, { status: 201, headers: corsHeaders });

  } catch (err: any) {
    console.error('CRITICAL SYSTEM ERROR:', err.message);
    return NextResponse.json({ error: 'System crash', details: err.message }, { status: 500, headers: corsHeaders });
  }
}
