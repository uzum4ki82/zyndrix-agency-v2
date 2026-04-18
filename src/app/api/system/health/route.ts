import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const status = {
    status: 'operational',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      search_engine: 'operational',
      stitch_api: 'operational'
    }
  };

  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const { error } = await supabase.from('leads').select('id').limit(1);
    status.services.database = error ? 'degraded' : 'operational';
  } catch (e) {
    status.services.database = 'offline';
  }

  return NextResponse.json(status);
}
