import { NextResponse } from 'next/server';
import { updateLeadWithServiceRole } from '@/lib/supabase';

/**
 * [FIX #4] RESEND EMAIL TRACKING WEBHOOK
 * ======================================
 * Receives email events from Resend (opens, clicks, bounces, etc.)
 * and updates lead engagement metrics in real-time.
 */

interface ResendEvent {
  type: 'email.sent' | 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained';
  created_at: string;
  email_id: string;
  from: string;
  to: string;
  tags?: Array<{ name: string; value: string }>;
}

export async function POST(request: Request) {
  try {
    const event = (await request.json()) as ResendEvent;

    // Extract lead_id from tags
    const leadIdTag = event.tags?.find(tag => tag.name === 'lead_id');
    const leadId = leadIdTag?.value;

    if (!leadId || leadId === 'test') {
      console.log(`[RESEND_WEBHOOK] Ignoring event for test email: ${event.type}`);
      return NextResponse.json({ success: true });
    }

    console.log(`[RESEND_WEBHOOK] Received ${event.type} for lead ${leadId}`);

    // Calculate current timestamp
    const timestamp = new Date().toISOString();

    // Handle different event types
    switch (event.type) {
      case 'email.sent':
        console.log(`[RESEND_WEBHOOK] ✓ Email sent to ${event.to}`);
        return NextResponse.json({ success: true });

      case 'email.delivered':
        await updateLeadWithServiceRole(leadId, {
          email_delivered: true,
          email_delivered_at: timestamp,
          engagement_score: 10
        });
        console.log(`[RESEND_WEBHOOK] ✓ Email delivered to ${event.to}`);
        return NextResponse.json({ success: true });

      case 'email.opened':
        const updateOpenResult = await updateLeadWithServiceRole(leadId, {
          email_opened: true,
          email_opened_at: timestamp,
          open_status: 'opened',
          engagement_score: 25
        });

        if (updateOpenResult.success) {
          console.log(`[RESEND_WEBHOOK] ✓ Email opened by ${event.to}`);
        } else {
          console.error(`[RESEND_WEBHOOK] Failed to update open status: ${updateOpenResult.error}`);
        }
        return NextResponse.json({ success: true });

      case 'email.clicked':
        const updateClickResult = await updateLeadWithServiceRole(leadId, {
          email_clicked: true,
          email_clicked_at: timestamp,
          engagement_score: 50
        });

        if (updateClickResult.success) {
          console.log(`[RESEND_WEBHOOK] ✓ Link clicked by ${event.to}`);
        } else {
          console.error(`[RESEND_WEBHOOK] Failed to update click status: ${updateClickResult.error}`);
        }
        return NextResponse.json({ success: true });

      case 'email.bounced':
        const updateBounceResult = await updateLeadWithServiceRole(leadId, {
          email_bounced: true,
          email_bounced_at: timestamp,
          open_status: 'bounced',
          engagement_score: 0
        });

        if (updateBounceResult.success) {
          console.log(`[RESEND_WEBHOOK] ⚠️ Email bounced for ${event.to}`);
        } else {
          console.error(`[RESEND_WEBHOOK] Failed to update bounce status: ${updateBounceResult.error}`);
        }
        return NextResponse.json({ success: true });

      case 'email.complained':
        const updateComplaintResult = await updateLeadWithServiceRole(leadId, {
          email_complained: true,
          email_complained_at: timestamp,
          open_status: 'complained',
          engagement_score: -100,
          site_active: false
        });

        if (updateComplaintResult.success) {
          console.log(`[RESEND_WEBHOOK] 🚨 Spam complaint from ${event.to}`);
        } else {
          console.error(`[RESEND_WEBHOOK] Failed to update complaint status: ${updateComplaintResult.error}`);
        }
        return NextResponse.json({ success: true });

      default:
        console.warn(`[RESEND_WEBHOOK] Unknown event type: ${event.type}`);
        return NextResponse.json({ success: true });
    }

  } catch (error) {
    console.error('[RESEND_WEBHOOK_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
