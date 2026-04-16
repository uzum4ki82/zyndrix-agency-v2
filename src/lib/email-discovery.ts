import puppeteer from 'puppeteer';
import { uploadScreenshot } from './supabase';

/**
 * MOTOR DE DESCUBRIMIENTO DE EMAILS (DEEP SEARCH - PRO EDITION)
 * Utiliza Puppeteer para navegar por sitios dinámicos y extraer datos precisos.
 */

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

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

async function scrapeWithPuppeteer(url: string) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Configurar User-Agent real
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const content = await page.content();
    const title = await page.title();
    
    // Intentar capturar screenshot para el dashboard
    const screenshot = await page.screenshot({ encoding: 'base64' });

    return { content, title, screenshotUrl: `data:image/png;base64,${screenshot}` };
  } catch (err) {
    console.warn(`[Puppeteer] Initialization failed in this environment, attempting standard fetch fallback.`);
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const content = await response.text();
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : url;
      return { content, title, screenshotUrl: null };
    } catch (fetchErr) {
      console.error(`[Discovery] Full failure for ${url}:`, fetchErr);
      return null;
    }
  } finally {
    if (browser) await browser.close();
  }
}

export async function discoverDataFromUrl(url: string | null): Promise<any> {
  if (!url || !url.startsWith('http')) return { emails: [], socials: {}, tech: [], seo: {} };

  console.log(`[Strategic Discovery] Analizando infraestructura de ${url}...`);
  const emails = new Set<string>();
  const socials: any = {};
  const tech: string[] = [];
  const seo: any = {};
  
  // Paso 1: Scraping Dinámico con Puppeteer
  const result = await scrapeWithPuppeteer(url);
  if (!result) {
      console.warn(`[Strategic Discovery] Puppeteer falló, recurriendo a fetch básico.`);
      // Podríamos llamar al fetch básico aquí si Puppeteer falla
      return { emails: [], socials: {}, tech: [], seo: {} };
  }

  const { content: html, title, screenshotUrl } = result;
  seo.title = title;

  // Extraer Emails con Regex
  const emailMatches = html.match(EMAIL_REGEX);
  emailMatches?.forEach(e => {
    const email = e.toLowerCase();
    if (!FORBIDDEN_EMAILS.some(f => email.includes(f))) {
      if (!email.match(/\.(png|jpg|jpeg|gif|svg|webp|pdf|css|js)$/)) {
        emails.add(email);
      }
    }
  });

  // Identificar Huella Social
  Object.entries(SOCIAL_PATTERNS).forEach(([platform, regex]) => {
    const match = html.match(regex);
    if (match) socials[platform] = match[0];
  });

  // Diagnóstico Tecnológico
  Object.entries(TECH_PATTERNS).forEach(([name, regex]) => {
    if (regex.test(html)) tech.push(name);
  });

  return {
    emails: Array.from(emails),
    socials,
    tech,
    seo,
    screenshotUrl
  };
}

export async function enrichLeadsWithDeepDiscovery(leads: any[]): Promise<any[]> {
  console.log(`🔍 Iniciando High-Fidelity Discovery para ${leads.length} objetivos...`);
  
  const enrichmentPromises = leads.map(async (lead) => {
    if (!lead.website) return lead;

    try {
      const data = await discoverDataFromUrl(lead.website);
      
      let finalScreenshotUrl = data.screenshotUrl;

      // Si tenemos un base64, lo subimos a Supabase para que sea visible en emails (Gmail/Outlook no soportan base64)
      if (data.screenshotUrl && data.screenshotUrl.startsWith('data:')) {
        const base64Data = data.screenshotUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `screenshot-${lead.id}-${Date.now()}.png`;
        const publicUrl = await uploadScreenshot(buffer, fileName);
        if (publicUrl) finalScreenshotUrl = publicUrl;
      }
      
      return {
        ...lead,
        email: lead.email || data.emails[0],
        all_emails: data.emails,
        tech_stack: data.tech,
        social_links: data.socials,
        seo_meta: data.seo,
        screenshotUrl: finalScreenshotUrl,
        score: lead.score + (data.emails.length > 0 ? 10 : 0) + (data.tech.length < 2 ? 15 : 0)
      };
    } catch (e) {
      return lead;
    }
  });

  return Promise.all(enrichmentPromises);
}
