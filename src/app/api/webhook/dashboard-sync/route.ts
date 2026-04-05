import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lead_id, event, data } = body;

    if (!lead_id) {
      return NextResponse.json({ error: 'Missing lead_id' }, { status: 400 });
    }

    // 1. Log the automation event
    await supabase.from('automation_logs').insert({
      lead_id,
      event_type: event,
      status: 'success',
      details: data
    });

    // 2. Update the lead with new intelligence if provided
    if (data && (data.tier || data.score || data.pain_points)) {
      const updateData: any = {};
      
      if (data.tier) updateData.tier = data.tier;
      if (data.score) updateData.score = data.score;
      if (data.pain_points) updateData.pain_points = data.pain_points;
      if (data.sentiment) updateData.sentiment = data.sentiment;
      if (data.ai_summary) updateData.ai_summary = data.ai_summary;
      if (data.suggested_cta) updateData.suggested_cta = data.suggested_cta;

      await supabase
        .from('leads')
        .update(updateData)
        .eq('id', lead_id);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Dashboard synced for event: ${event}` 
    });

  } catch (error: any) {
    console.error('Webhook Sync Error:', error);
    return NextResponse.json({ 
      error: 'Inbound Sync Failed', 
      details: error.message 
    }, { status: 500 });
  }
}
