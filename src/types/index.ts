export interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  score: number;
  status: 'high' | 'medium' | 'low' | 'DESIGN_READY' | 'ARCHIVED' | string;
  website: string | null;
  reviews: number;
  reviewsCount?: number;
  rating: number;
  distance: string;
  strategy: 'REDISEÑO_UX' | 'IA_RESERVAS' | 'WEB_OFFENSIVE' | 'SEO_LOCAL';
  psychologicalHook: string;
  techStack?: string | string[];
  speedScore?: number;
  mobileStatus: 'fail' | 'ok';
  estimatedRoi?: number; // Deprecated: Use strategicImpact
  ltvEstimate?: number;  // Deprecated: Use marketPotential
  conversionBoost?: number;
  strategicImpact?: 'CRITICAL' | 'MODERATE' | 'LOW';
  commercialLeak?: string;
  favicon?: string;
  ogImage?: string;
  conversionGap: string;
  lastAudit: string;
  companyType?: 'pyme' | 'empresa' | 'autonomo' | 'corporativo';
  contactPerson?: string;
  email?: string;
  phone?: string;
  googlePlaceId?: string;
  google_place_id?: string;
  tier?: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'OPTIMAL';
  draftEmail?: string;
  assignedTo?: string;
  followUpStatus?: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'MEETING_SET' | 'CLOSED' | 'REJECTED';
  follow_up_status?: string;
  email_sent?: boolean;
  whatsapp_sent?: boolean;
  screenshotUrl?: string;
  extractedImages?: string[];
  signals?: {
    instagram: boolean;
    facebook: boolean;
    whatsapp: boolean;
    linkedin: boolean;
  };
  last_contacted_at?: string;
  notes?: string;
  all_emails?: string[];
  discovery_method?: string;
  intel?: AuditResult;
  photoUrl?: string | null;
  marketLeaderRef?: string;
  competitorGap?: number;
  stitch_preview_url?: string;
  stitch_project_id?: string;
  loadTime?: number;
  opened_at?: string | null;
  // [FIX #4] Email tracking fields
  resend_email_id?: string;
  email_sent_at?: string;
  email_delivered?: boolean;
  email_delivered_at?: string;
  email_opened?: boolean;
  email_opened_at?: string;
  email_clicked?: boolean;
  email_clicked_at?: string;
  email_bounced?: boolean;
  email_bounced_at?: string;
  email_complained?: boolean;
  email_complained_at?: string;
  engagement_score?: number;
  open_status?: 'pending' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
  [key: string]: any;
}

export type AuditResult = {
  score: number;
  gapIntensity?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STABLE';
  screenshotUrl?: string;
  foundEmails: string[];
  findings: string[];
  presenceQuality?: number; // 0 to 100
  pitchHeadline: string;
  opportunityScore?: number; // 0-100 derived from gap
  growthIndex?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'OPTIMAL';
  proposedLayout?: string;
  ltvEstimate?: number;
  conversionBoost?: number;
  strategy?: string;
  marketPotential?: 'CRÍTICO' | 'ALTO' | 'SIGNIFICATIVO' | 'MODERADO';
  estimatedLossLabel?: string;
  strategicImpact?: 'CRITICAL_FINANCIAL' | 'SIGNIFICANT_COMMERCIAL' | 'MODERATE_OPERATIONAL' | 'STABLE';
  growthLeakLabel?: string;
  favicon?: string;
  ogImage?: string;
  techStack?: string[];
  extractedImages?: string[];
  signals?: {
    instagram: boolean;
    facebook: boolean;
    whatsapp: boolean;
    linkedin: boolean;
  };
  tier?: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'OPTIMAL';
  painPoints?: string[];
  loadTime?: number;
  seo?: {
    title?: string;
    description?: string;
  };
  competitorGap?: string;
  marketLeaderRef?: string;
  roi?: number;
  impact?: string;
  industryName?: string;
  screenshot?: string;
};

export interface TeamMember {
  id: string;
  name: string;
  role: 'CLOSER' | 'HUNTER' | 'MANAGER';
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  closes: number;
  revenue: string;
  activeLeads: number;
}

export type LogType = 'info' | 'success' | 'warning' | 'ai' | 'error';

export interface OperationLog {
  id: string;
  text: string;
  type: LogType;
  isInternal?: boolean;
  image?: string;
  meta?: string;
}

export interface Cycle {
  id: string;
  name: string;
  type: 'DISCOVERY' | 'AUDIT' | 'OUTREACH' | 'FOLLOWUP';
  status: 'IDLE' | 'SCANNING' | 'ANALYZING' | 'SENDING' | 'WAITING';
  progress: number;
  results: number;
  lastRun?: string;
}

export interface ProtocolSettings {
  autoOutreach: boolean;
  aggressiveMode: boolean;
  minScore: number;
  searchRadius: number;
  priorityVerticals: string[];
}
