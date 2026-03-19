import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      return NextResponse.json([], { headers: corsHeaders });
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data || '[]'), { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json([], { headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    console.log('DEBUG: Raw Body Received:', rawBody);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e: any) {
      console.error('DEBUG: Manual JSON Parse Failed:', e.message);
      // Try to recover if it looks like a shell-escaped string or partially malformed
      return NextResponse.json({ error: 'Invalid JSON payload', details: e.message, received: rawBody }, { 
        status: 400,
        headers: corsHeaders
      });
    }
    
    // Read existing leads
    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf8').trim();
      if (data) {
        try {
          leads = JSON.parse(data);
        } catch (e: any) {
          console.error('CRITICAL: JSON parse error in leads.json:', e.message, 'Content:', data);
          leads = []; // Fallback
        }
      }
    }
    
    // AI Lead Scoring Logic (Simple Heuristic)
    const scoringBody = (body.message || '') + (body.company_name || '') + (body.name || '');
    let score = 5; // Default score
    if (scoringBody.length > 100) score += 1;
    if (body.email && !body.email.includes('gmail.com') && !body.email.includes('hotmail.com')) score += 2; // Business email
    if (body.message && body.message.length > 50) score += 1;
    if (body.company_name && body.company_name !== 'N/A') score += 1;
    
    const newLead = {
      id: Math.random().toString(36).substring(2, 11),
      ...body,
      status: 'new',
      created_at: new Date().toISOString(),
      lead_score: Math.min(score, 10),
      automation_steps: [
        { name: 'Captura', status: 'completed', time: new Date().toISOString() },
        { name: 'Enriquecimiento IA', status: 'completed', time: new Date().toISOString() },
        { name: 'Notificación', status: 'pending' },
        { name: 'Auto-Respuesta', status: 'pending' }
      ]
    };

    // Simulate n8n/Webhook Hook (Background)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      }).catch(err => console.error('Webhook error:', err));
    }
    
    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    // Simulate second step of automation after 2 seconds
    setTimeout(() => {
      try {
        const currentData = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        const leadIndex = currentData.findIndex((l: any) => l.id === newLead.id);
        if (leadIndex !== -1) {
          currentData[leadIndex].automation_steps[2].status = 'completed';
          currentData[leadIndex].automation_steps[2].time = new Date().toISOString();
          currentData[leadIndex].status = 'contacted';
          fs.writeFileSync(LEADS_FILE, JSON.stringify(currentData, null, 2));
        }
      } catch (e) {
        console.error('Auto-update error:', e);
      }
    }, 5000);
    
    return NextResponse.json(newLead, { 
      status: 201,
      headers: corsHeaders 
    });
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: 'Failed to save lead', details: error.message }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
