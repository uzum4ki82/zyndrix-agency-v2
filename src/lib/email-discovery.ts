/**
 * MOTOR DE DESCUBRIMIENTO DE EMAILS (DEEP SEARCH)
 * Este módulo se encarga de extraer correos electrónicos de las webs de los leads
 * para aumentar la tasa de contacto automática.
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Bloqueamos dominios que suelen ser ruidosos o falsos positivos
const FORBIDDEN_EMAILS = [
  'wixpress.com', 'sentry.io', 'example.com', 'domain.com', 
  'bootstrap.com', 'wp.com', 'template.com', 'email@email.com'
];

const SOCIAL_PATTERNS = {
  instagram: /instagram\.com\/([^/?"\s]+)/i,
  facebook: /facebook\.com\/([^/?"\s]+)/i,
  linkedin: /linkedin\.com\/(?:company|in)\/([^/?"\s]+)/i,
  twitter: /twitter\.com\/([^/?"\s]+)/i,
  whatsapp: /wa\.me|api\.whatsapp\.com|whatsapp:|web\.whatsapp\.com/i,
};

const TECH_PATTERNS = {
  wordpress: /wp-content|wp-includes/i,
  wix: /wixstatic|wix-code/i,
  shopify: /shopify\.com|cdn\.shopify/i,
  squarespace: /squarespace\.com|static1\.squarespace/i,
  elementor: /elementor-template/i,
  nextjs: /_next\/static/i,
  react: /react/i,
  webflow: /webflow\.com|wf-loading/i,
};

async function fetchHTML(url: string, timeout = 5000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    clearTimeout(id);

    if (!response.ok) return null;
    return await response.text();
  } catch (err) {
    return null;
  }
}

export async function discoverDataFromUrl(url: string | null): Promise<any> {
  if (!url || !url.startsWith('http')) return { emails: [], socials: {}, tech: [], seo: {} };

  const emails = new Set<string>();
  const socials: any = {};
  const tech: string[] = [];
  const seo: any = {};
  
  const html = await fetchHTML(url);
  if (!html) return { emails: [], socials: {}, tech: [], seo: {} };

  // 1. Extraer Emails
  const emailMatches = html.match(EMAIL_REGEX);
  emailMatches?.forEach(e => {
    const email = e.toLowerCase();
    if (!FORBIDDEN_EMAILS.some(f => email.includes(f))) {
      if (!email.endsWith('.png') && !email.endsWith('.jpg') && !email.endsWith('.svg')) {
        emails.add(email);
      }
    }
  });

  // 2. Extraer Redes Sociales
  Object.entries(SOCIAL_PATTERNS).forEach(([platform, regex]) => {
    const match = html.match(regex);
    if (match) socials[platform] = match[0];
  });

  // 3. Detectar Tecnología
  Object.entries(TECH_PATTERNS).forEach(([name, regex]) => {
    if (regex.test(html)) tech.push(name);
  });

  // 4. Metadatos SEO
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) seo.title = titleMatch[1];
  
  const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
  if (descMatch) seo.description = descMatch[1];

  // 5. Búsqueda profunda de emails si no hay en la home
  if (emails.size === 0) {
    const commonPaths = ['/contacto', '/contact', '/aviso-legal'];
    const baseUrl = new URL(url).origin;

    for (const path of commonPaths) {
      const pageHtml = await fetchHTML(`${baseUrl}${path}`);
      if (pageHtml) {
        const matches = pageHtml.match(EMAIL_REGEX);
        matches?.forEach(e => {
          const email = e.toLowerCase();
          if (!FORBIDDEN_EMAILS.some(f => email.includes(f))) {
            emails.add(email);
          }
        });
      }
      if (emails.size > 0) break;
    }
  }

  return {
    emails: Array.from(emails),
    socials,
    tech,
    seo
  };
}

export async function enrichLeadsWithDeepDiscovery(leads: any[]): Promise<any[]> {
  console.log(`🔍 Iniciando Deep Discovery para ${leads.length} leads...`);
  
  const enrichmentPromises = leads.map(async (lead) => {
    if (!lead.website) return lead;

    try {
      const data = await discoverDataFromUrl(lead.website);
      
      return {
        ...lead,
        email: lead.email || data.emails[0],
        all_emails: data.emails,
        discovery_method: data.emails.length > 0 ? 'deep_search' : lead.discovery_method,
        techStack: data.tech,
        social_links: data.socials,
        seo_meta: data.seo,
        signals: {
          ...lead.signals,
          instagram: !!data.socials.instagram,
          facebook: !!data.socials.facebook,
          linkedin: !!data.socials.linkedin,
          whatsapp: !!data.socials.whatsapp
        }
      };
    } catch (e) {
      return lead;
    }
  });

  return Promise.all(enrichmentPromises);
}
