import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the lead to n8n
    const n8nResponse = await fetch('https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n response error:', n8nResponse.status, errorText);
      return NextResponse.json({ 
        error: 'n8n error', 
        status: n8nResponse.status,
        details: errorText 
      }, { status: n8nResponse.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
