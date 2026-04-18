import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sube una captura de pantalla al bucket de 'screenshots'
 */
export const uploadScreenshot = async (fileBuffer: Buffer | Blob, fileName: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('screenshots')
      .upload(fileName, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Error uploading screenshot:', error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (err) {
    console.error('Fatal error in uploadScreenshot:', err);
    return null;
  }
};

export type Lead = {
  id: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  category: string;
  address?: string;
  neighborhood?: string;
  score: number;
  website: string | null;
  strategy?: string;
  conversion_gap?: string;
  estimated_loss?: string;
  assigned_to?: string | null;
  follow_up_status: string;
  last_audit?: string;
  phone?: string | null;
  draft_email?: string | null;
  tech_stack?: string;
  speed_score?: number;
  ltv_estimate?: number;
  conversion_boost?: number;
  estimated_roi?: number;
  favicon_url?: string;
  og_image_url?: string;
  screenshot_url?: string;
  extracted_images?: string[];
  signals?: {
    instagram?: boolean;
    facebook?: boolean;
    whatsapp?: boolean;
  };
  load_time?: number;
  strategic_impact?: string;
  growth_leak_label?: string;
  tier?: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'OPTIMAL';
  pain_points?: string[];
  whatsapp_sent?: boolean;
  email_sent?: boolean;
  priority_score?: number;
  google_place_id?: string;
  stitch_preview_url?: string;
  stitch_project_id?: string;
  rating?: number;
  reviews_count?: number;
  google_photo_url?: string;
  email?: string | null;
  opened_at?: string | null;
  status?: string | null;
  site_active?: boolean;
  extracted_colors?: {
    primary: string;
    secondary: string;
    background: string;
  };
  business_dna?: {
    strategic_angle: string;
    vibe: string;
  };
};

 // Database Helpers
export const syncLead = async (lead: Partial<Lead> & Record<string, unknown>): Promise<Lead | null> => {
  if (!supabaseUrl || !supabaseAnonKey || (supabaseUrl.includes('placeholder'))) {
    console.warn('Supabase not configured. Skipping sync.');
    return null;
  }
  
  // Mapeo exhaustivo de campos con soporte para camelCase y snake_case
  const biz = lead as Record<string, any>;
  const mappedData: Partial<Lead> & Record<string, unknown> = {
    id: lead.id || biz.id,
    name: lead.name || biz.name,
    category: lead.category || biz.category || biz.intel?.niche,
    address: lead.address || biz.address || biz.vicinity,
    website: lead.website || biz.website || 'https://zyndrix.dev/pending',
    email: lead.email || biz.email || biz.intel?.email,
    opened_at: lead.opened_at || biz.opened_at,
    phone: lead.phone || (biz.phone as string) || (biz.international_phone_number as string) || (biz.nationalPhoneNumber as string),
    score: Math.round(Number(lead.score || biz.score || biz.intel?.score || 0)),
    status: (lead.status as any) || biz.status || 'medium',
    follow_up_status: (lead.follow_up_status as any) || (biz.followUpStatus as any) || 'NEW',
    assigned_to: (lead.assigned_to as any) || (biz.assignedTo as any) || null,
    strategy: lead.strategy || biz.strategy || biz.intel?.strategy,
    conversion_gap: lead.conversion_gap || (biz.conversionGap as string) || biz.intel?.findings?.[0],
    tech_stack: lead.tech_stack || (Array.isArray(biz.techStack) ? biz.techStack.join(', ') : ((biz.techStack as string) || biz.intel?.techStack?.join(', '))),
    speed_score: Math.round(Number(lead.speed_score !== undefined ? lead.speed_score : (biz.speedScore !== undefined ? (biz.speedScore as number) : (biz.intel?.score || 0)))),
    screenshot_url: lead.screenshot_url || (biz.screenshotUrl as string) || biz.intel?.screenshotUrl,
    draft_email: lead.draft_email || (biz.draftEmail as string),
    favicon_url: lead.favicon_url || (biz.favicon as string) || biz.intel?.favicon,
    og_image_url: lead.og_image_url || (biz.ogImage as string) || biz.intel?.ogImage,
    strategic_impact: lead.strategic_impact || (biz.strategicImpact as string) || biz.intel?.strategicImpact,
    growth_leak_label: lead.growth_leak_label || (biz.growthLeakLabel as string) || biz.intel?.growthLeakLabel,
    estimated_loss: lead.estimated_loss || (biz.estimatedLossLabel as string) || biz.intel?.estimatedLossLabel,
    tier: lead.tier || (biz.tier as any) || biz.intel?.tier,
    pain_points: lead.pain_points || (biz.painPoints as string[]) || biz.intel?.painPoints,
    load_time: lead.load_time || (biz.loadTime as number) || biz.intel?.loadTime,
    email_sent: !!(lead.email_sent || (biz.email_sent as boolean)),
    last_audit: lead.last_audit || (biz.lastAudit as string) || new Date().toISOString(),
    google_place_id: lead.google_place_id || (biz.googlePlaceId as string) || (biz.google_place_id as string),
    stitch_preview_url: lead.stitch_preview_url || (biz.stitchPreviewUrl as string),
    stitch_project_id: lead.stitch_project_id || (biz.stitchProjectId as string),
    rating: lead.rating !== undefined ? lead.rating : (biz.rating as number),
    reviews_count: lead.reviews_count !== undefined ? lead.reviews_count : (biz.reviewsCount as number),
    google_photo_url: lead.google_photo_url || (biz.photoUrl as string),
    signals: lead.signals || biz.signals || (biz.intel as any)?.signals,
    site_active: lead.site_active !== undefined ? !!lead.site_active : (biz.site_active !== undefined ? !!biz.site_active : true)
  };

  // Limpiar nulos y asegurar consistencia
  Object.keys(mappedData).forEach(key => {
    if (mappedData[key] === undefined) delete (mappedData as any)[key];
  });

  // Validación de UUID para assigned_to
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (mappedData.assigned_to && typeof mappedData.assigned_to === 'string' && !uuidRegex.test(mappedData.assigned_to)) {
    console.warn(`Invalid UUID for assigned_to: ${mappedData.assigned_to}. Setting to null.`);
    mappedData.assigned_to = null;
  }

  try {
    const cleanData = { ...mappedData };

    const { data, error } = await supabase
      .from('leads')
      .upsert({
        ...cleanData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select();
    
    if (error) {
      console.error('CRITICAL: Supabase Sync Error:', error.message, error.details, error.hint);
      
      // Fallback 1: Error de tipo UUID en assigned_to (aunque ya lo validamos con regex)
      if (error.code === '22P02' && error.message.includes('assigned_to')) {
        delete mappedData.assigned_to;
        return syncLead(mappedData as any);
      }
      
      throw error;
    }
    return data?.[0] || null;
  } catch (e) {
    console.error('Fatal Sync Exception:', e);
    return null;
  }
};

export const logAutomationAction = async (
  botId: string, 
  action: string, 
  details: { text?: string; meta?: string; [key: string]: unknown }, 
  status: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  const { error } = await supabase
    .from('automation_logs')
    .insert({
      bot_id: botId,
      action,
      details,
      status
    });
  
  if (error) console.error('Error logging automation:', error);
};

export const checkLeadByCriteria = async (name: string, neighborhood: string, googlePlaceId?: string) => {
  if (!supabaseUrl || !supabaseAnonKey || (supabaseUrl.includes('placeholder'))) return null;
  
  let query = supabase.from('leads').select('id, name, website, phone, email_sent, status');
  
  if (googlePlaceId) {
    query = query.eq('google_place_id', googlePlaceId);
  } else {
    query = query.eq('name', name).eq('neighborhood', neighborhood);
  }
  
  const { data } = await query.maybeSingle();
  return data;
};

export const checkLeadExists = async (website: string | null) => {
  if (!website || !supabaseUrl || !supabaseAnonKey) return false;

  const cleanUrl = website.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const { data } = await supabase
    .from('leads')
    .select('id')
    .or(`website.ilike.%${cleanUrl}%,website.ilike.%${website}%`)
    .single();

  return !!data;
};

export const checkLeadByGooglePlaceId = async (googlePlaceId: string) => {
  if (!googlePlaceId || !supabaseUrl || !supabaseAnonKey) return null;

  const { data } = await supabase
    .from('leads')
    .select('id, name, email_sent, status')
    .eq('google_place_id', googlePlaceId)
    .maybeSingle();

  return data;
};

export const getLeads = async (): Promise<Lead[]> => {
  if (!supabaseUrl || !supabaseAnonKey || (supabaseUrl.includes('placeholder'))) {
    console.warn('Supabase not configured. Returning empty leads list.');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Fatal error in getLeads:', err);
    return [];
  }
};

export const getLeadById = async (id: string): Promise<Lead | null> => {
  if (!supabaseUrl || !supabaseAnonKey || (supabaseUrl.includes('placeholder'))) return null;

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching lead by id:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Fatal error in getLeadById:', err);
    return null;
  }
};

// SERVICE ROLE CLIENT - For daemon/server operations that bypass RLS
const supabaseServiceRole = (() => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || serviceRoleKey === 'placeholder-service-key') {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not configured. Daemon operations may fail.');
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey);
})();

export const updateLeadWithServiceRole = async (
  leadId: string,
  updates: Partial<Lead> & Record<string, unknown>
): Promise<{ success: boolean; error?: string; data?: Lead }> => {
  if (!supabaseServiceRole) {
    return { success: false, error: 'Service role client not initialized' };
  }

  try {
    const { data, error } = await supabaseServiceRole
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error(`[RLS BYPASS] Update failed for lead ${leadId}:`, error.message);
      return { success: false, error: error.message };
    }

    console.log(`[RLS BYPASS] Successfully updated lead ${leadId}`);
    return { success: true, data };
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    console.error(`[RLS BYPASS] Exception updating lead ${leadId}:`, errorMsg);
    return { success: false, error: errorMsg };
  }
};

export const getLeadByIdWithServiceRole = async (id: string): Promise<Lead | null> => {
  if (!supabaseServiceRole) return null;

  try {
    const { data, error } = await supabaseServiceRole
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`[RLS BYPASS] Error fetching lead ${id}:`, error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`[RLS BYPASS] Fatal error fetching lead ${id}:`, err);
    return null;
  }
};

