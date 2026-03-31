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
    // Note: If you haven't added these columns to your Supabase "leads" table, they will be ignored or might cause an error
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert([{
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        budget: body.budget || null,
        user: body.name, // Mapping usuario to name
        company_name: body.company_name || null,
        message: body.message || null,
        status: 'new',
      }])
      .select()
      .single();

    if (error) {
      console.warn('Supabase Insert Error (possible missing columns):', error.message);
      // We continue since the primary concern is n8n
    }
    
    // Prepare data for n8n
    const n8nData = {
      ...(newLead || {}),
      name: body.name,
      email: body.email,
      phone: body.phone,
      budget: body.budget,
      user: body.name || body.user,
      company_name: body.company_name,
      message: body.message,
      source: 'API Gateway',
      timestamp: new Date().toISOString()
    };
    
    // Send to n8n if webhook is configured
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(n8nData)
      }).catch(err => console.error('n8n Webhook error:', err));
    }
    
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
