import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET is removed for security as it was exposing sensitive lead data publicly. 
// Use the Supabase client with RLS for secure data fetching in the dashboard.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // AI Lead Scoring Logic
    const scoringBody = (body.message || '') + (body.company_name || '') + (body.name || '');
    let score = 5; 
    if (scoringBody.length > 80) score += 1;
    if (body.email && !body.email.match(/gmail|hotmail|yahoo/)) score += 2;
    if (body.company_name && body.company_name !== 'N/A') score += 1;
    
    // Save to Supabase (The master source of truth)
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert([{
        name: body.name,
        email: body.email,
        company_name: body.company_name || null,
        message: body.message || null,
        status: 'new',
        score_ia: Math.min(score, 10),
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Simulate n8n/Webhook Hook (Fire-and-forget)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.zyndrix.dev/webhook-test/zyndrix-lead-scoring';
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newLead, source: 'API Gateway' })
    }).catch(err => console.error('Webhook error:', err));
    
    return NextResponse.json(newLead, { 
      status: 201,
      headers: corsHeaders 
    });
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: 'Failed to process lead', details: error.message }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
