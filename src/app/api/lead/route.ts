import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// MASTER CONFIG (Hardcoded for maximum reliability during launch)
const SB_URL = 'https://vrvfftftnlspajplqjye.supabase.co';
const SB_KEY = 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE';

export async function POST(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') return NextResponse.json({}, { headers: corsHeaders });

  try {
    const body = await req.json();
    console.log('--- INGESTIÓN INICIADA ---', body.email);

    // 1. PERSISTENCIA EN SUPABASE (Prioridad 1)
    const resSupabase = await fetch(`${SB_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: body.name || 'Anónimo',
        email: body.email,
        phone: body.phone || null,
        company_name: body.company_name || null,
        message: body.message || 'Lead v23',
        budget: body.budget || null,
        service: body.service || 'General',
        status: 'new'
      })
    });

    const leadData = await resSupabase.json();
    const leadId = leadData?.[0]?.id || null;

    if (!resSupabase.ok) {
      console.error('Supabase Fail:', leadData);
    }

    // 2. DISPARO DE WEBHOOKS (n8n)
    const isMagnet = body.service?.includes('Blueprint');
    const n8nUrl = isMagnet 
      ? 'https://n8n.zyndrix.dev/webhook/leadmagnet'
      : 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring';

    // Usamos el registro real de Supabase si existe, si no, caemos al body original
    const recordPayload = leadData?.[0] || {
      id: leadId,
      name: body.name || 'Anónimo',
      email: body.email,
      phone: body.phone || null,
      company_name: body.company_name || null,
      message: body.message || 'Lead v23',
      budget: body.budget || null,
      service: body.service || 'General',
      status: 'new'
    };

    // Payload final unificado
    const payload = {
      source: body.service,
      record: recordPayload
    };

    // Intentamos el oficial y el de test por si acaso
    const webhooks = [n8nUrl, n8nUrl.replace('/webhook/', '/webhook-test/')];
    
    for (const url of webhooks) {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(e => console.log('Omitiendo error de webhook:', url));
    }

    // 3. SEÑAL AL DASHBOARD
    fetch('https://n8n.zyndrix.dev/webhook/dashboard-data', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ type: 'lead_in', id: leadId })
    }).catch(() => {});

    return NextResponse.json({ 
      success: true, 
      id: leadId,
      processed: true 
    }, { status: 201, headers: corsHeaders });

  } catch (err: any) {
    console.error('CRITICAL ERROR v23:', err.message);
    return NextResponse.json({ error: 'System error', details: err.message }, { status: 500, headers: corsHeaders });
  }
}
