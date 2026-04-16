import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * WEBHOOK DE RESEND
 * Escucha eventos de apertura y clic para actualizar el CRM en tiempo real.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    console.log(`📩 Webhook de Resend recibido: ${type}`);

    // Solo nos interesan las aperturas y clics por ahora
    if (type === 'email.opened' || type === 'email.clicked') {
      const leadId = data.tags?.lead_id;

      if (leadId && leadId !== 'test') {
        const newStatus = type === 'email.clicked' ? 'INTERESTED' : 'OPENED';
        
        console.log(`🎯 Lead ${leadId} ha interactuado (${type}). Actualizando estado a ${newStatus}...`);

        const { error } = await supabase
          .from('leads')
          .update({ 
            follow_up_status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', leadId);

        if (error) {
          console.error('❌ Error actualizando lead en Supabase:', error.message);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Loggear la actividad en el sistema de auditoría si fuera necesario
        console.log(`✅ Lead ${leadId} marcado como ${newStatus}.`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Error fatal en Webhook:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
