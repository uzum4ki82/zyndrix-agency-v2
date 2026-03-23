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
      console.error('n8n proxy error:', await n8nResponse.text());
      return NextResponse.json({ error: 'Failed to forward to n8n' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
