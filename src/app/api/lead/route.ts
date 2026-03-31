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
    // --- CLAUDE'S NEW SCHEMA (PROSPECTS) ---
    const fullName = body.name || 'User';
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ') || 'N/A';

    try {
      // Primary attempt: 'prospects' table (Claude's new schema)
      const { error: pError } = await supabase
        .from('prospects')
        .upsert([{
          first_name: firstName,
          last_name: lastName,
          email: body.email,
          phone: body.phone || null,
          status: 'New',
          source: 'API Gateway',
          reasoning: `Budget: ${body.budget} | Serv: ${body.service} | Msg: ${body.message}`
        }], { onConflict: 'email' });

      if (pError) {
        console.warn('Draft prospects failed, falling back to legacy leads:', pError.message);
        
        // Secondary attempt: legacy 'leads' table
        await supabase
          .from('leads')
          .upsert([{
            name: body.name,
            email: body.email,
            phone: body.phone,
            message: body.message,
            status: 'new'
          }], { onConflict: 'email' });
      }

      console.log('¡LEAD PERSISTIDO CON ÉXITO!');
      
      const n8nData = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        budget: body.budget,
        user: body.name,
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
      
      return NextResponse.json({ success: true, message: 'Lead captured' }, { 
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
