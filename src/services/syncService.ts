import { updateLeadWithServiceRole } from '@/lib/supabase';
import { daemonLog } from '@/lib/logger';

/**
 * ZYNDRIX SYNC SERVICE
 * Orchestrates persistence of audit results, email campaigns, and lead enrichment
 */

export interface AuditResult {
  screenshotUrl: string | null;
  foundEmails: string[];
  techStack: string[];
  loadTime: number;
  favicon: string;
  ogImage: string;
  extractedImages: string[];
  signals: {
    instagram: boolean;
    facebook: boolean;
    whatsapp: boolean;
  };
  seo: {
    title: string;
    description: string;
    h1: string;
  };
  findings: string[];
}

export async function persistAuditResults(
  leadId: string,
  auditResult: AuditResult,
  siteUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    daemonLog('info', `[SYNC] Persisting audit results for lead ${leadId}...`);

    // Extract primary email from findings
    const primaryEmail = auditResult.foundEmails?.[0] || null;

    const updateData: any = {
      screenshot_url: auditResult.screenshotUrl,
      email: primaryEmail,
      tech_stack: JSON.stringify(auditResult.techStack),
      speed_score: auditResult.loadTime,
      favicon_url: auditResult.favicon,
      og_image_url: auditResult.ogImage,
      signals: {
        instagram: auditResult.signals.instagram,
        facebook: auditResult.signals.facebook,
        whatsapp: auditResult.signals.whatsapp
      },
      site_active: auditResult.loadTime > 0,
      last_audit: new Date().toISOString()
    };

    const result = await updateLeadWithServiceRole(leadId, updateData);

    if (!result.success) {
      daemonLog('error', `[SYNC] Failed to persist audit results: ${result.error}`);
      return { success: false, error: result.error };
    }

    daemonLog('success', `[SYNC] ✓ Audit results persisted for lead ${leadId}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    daemonLog('error', `[SYNC] Error persisting audit results: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

export async function persistEmailCampaign(
  leadId: string,
  emailContent: string,
  recipient: string,
  campaignType: 'pitch' | 'follow-up' = 'pitch'
): Promise<{ success: boolean; error?: string }> {
  try {
    daemonLog('info', `[SYNC] Recording email campaign for lead ${leadId}...`);

    const updateData = {
      email_sent: true,
      email_content: emailContent,
      email_recipient: recipient,
      email_campaign_type: campaignType,
      email_sent_at: new Date().toISOString(),
      status: 'OUTREACH_SENT'
    };

    const result = await updateLeadWithServiceRole(leadId, updateData);

    if (!result.success) {
      daemonLog('error', `[SYNC] Failed to persist email campaign: ${result.error}`);
      return { success: false, error: result.error };
    }

    daemonLog('success', `[SYNC] ✓ Email campaign recorded for lead ${leadId}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    daemonLog('error', `[SYNC] Error persisting email campaign: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

export async function persistEmailOpen(
  leadId: string,
  timestamp?: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    daemonLog('info', `[SYNC] Recording email open for lead ${leadId}...`);

    const updateData = {
      opened_at: (timestamp || new Date()).toISOString(),
      status: 'EMAIL_OPENED'
    };

    const result = await updateLeadWithServiceRole(leadId, updateData);

    if (!result.success) {
      daemonLog('error', `[SYNC] Failed to record email open: ${result.error}`);
      return { success: false, error: result.error };
    }

    daemonLog('success', `[SYNC] ✓ Email open recorded for lead ${leadId}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    daemonLog('error', `[SYNC] Error recording email open: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

export async function persistWhatsappInteraction(
  leadId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    daemonLog('info', `[SYNC] Recording WhatsApp interaction for lead ${leadId}...`);

    const updateData = {
      whatsapp_sent: true,
      whatsapp_sent_at: new Date().toISOString(),
      status: 'WHATSAPP_ENGAGED'
    };

    const result = await updateLeadWithServiceRole(leadId, updateData);

    if (!result.success) {
      daemonLog('error', `[SYNC] Failed to record WhatsApp interaction: ${result.error}`);
      return { success: false, error: result.error };
    }

    daemonLog('success', `[SYNC] ✓ WhatsApp interaction recorded for lead ${leadId}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    daemonLog('error', `[SYNC] Error recording WhatsApp interaction: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

export async function persistLeadStatusTransition(
  leadId: string,
  newStatus: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    daemonLog('info', `[SYNC] Updating lead ${leadId} status to ${newStatus}...`);

    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (metadata) {
      updateData.metadata = metadata;
    }

    const result = await updateLeadWithServiceRole(leadId, updateData);

    if (!result.success) {
      daemonLog('error', `[SYNC] Failed to update status: ${result.error}`);
      return { success: false, error: result.error };
    }

    daemonLog('success', `[SYNC] ✓ Lead ${leadId} transitioned to ${newStatus}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    daemonLog('error', `[SYNC] Error updating lead status: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}
