
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Necesitamos la Service Role para bypass RLS
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    console.log(`[RESEND_WEBHOOK] Evento recibido: ${type}`);

    // Solo nos interesan las aperturas
    if (type === 'email.opened') {
      const emailId = data.email_id;
      const leadId = data.tags?.lead_id;

      if (leadId && leadId !== 'test') {
        console.log(`🎯 [TRACKING] Apertura detectada para Lead: ${leadId}`);
        
        const { error } = await supabase
          .from('leads')
          .update({ 
            opened_at: new Date().toISOString(),
            status: 'opened' 
          })
          .eq('id', leadId);

        if (error) {
          console.error('❌ Error actualizando apertura en Supabase:', error);
        } else {
          console.log(`✅ Status actualizado para Lead ${leadId}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[WEBHOOK_ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
