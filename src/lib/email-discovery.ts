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
  if (!url || !url.startsWith('http')) return { emails: [], socials: {}, tech: [], seo: {}, whatsapp: null };

  console.log(`[Strategic Discovery] Analizando infraestructura de ${url}...`);
  const emails = new Set<string>();
  const socials: any = {};
  const tech: string[] = [];
  const seo: any = {};
  let whatsapp: string | null = null;
  
  // Paso 1: Scraping Dinámico con Puppeteer
  const result = await scrapeWithPuppeteer(url);
  if (!result) return { emails: [], socials: {}, tech: [], seo: {}, whatsapp: null };

  const { content: html, title, screenshotUrl } = result;
  seo.title = title;

  function extractEmails(text: string) {
    const matches = text.match(EMAIL_REGEX);
    matches?.forEach(e => {
      const email = e.toLowerCase();
      if (!FORBIDDEN_EMAILS.some(f => email.includes(f))) {
        if (!email.match(/\.(png|jpg|jpeg|gif|svg|webp|pdf|css|js)$/)) {
          emails.add(email);
        }
      }
    });

    // Extract mailto: links specifically
    const mailtoMatches = text.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi);
    mailtoMatches?.forEach(m => {
      const email = m.replace('mailto:', '').toLowerCase();
      if (!FORBIDDEN_EMAILS.some(f => email.includes(f))) {
        emails.add(email);
      }
    });
  }

  function extractWhatsApp(text: string) {
    const waMatch = text.match(/(?:wa\.me|api\.whatsapp\.com\/send\?phone=|whatsapp:\/\/send\?phone=)(\d+)/i);
    if (waMatch && waMatch[1]) {
      whatsapp = waMatch[1];
    }
    // Also check for tel: links that might be whatsapp
    if (!whatsapp) {
      const telMatch = text.match(/tel:(\+?\d{9,15})/i);
      if (telMatch && telMatch[1]) {
        // We assume it might be whatsapp for business if it's on a landing page
        whatsapp = telMatch[1].replace(/\s/g, '');
      }
    }
  }

  extractEmails(html);
  extractWhatsApp(html);

  // Paso 2: Deep Link Discovery (Si no hay emails en la Home)
  if (emails.size === 0) {
    // Look for more variants of contact/legal pages
    const contactLinks = html.match(/href="([^"]*(?:contacto|contact|legal|about|quienes|nosotros|aviso|privacidad|cookies)[^"]*)"/gi);
    if (contactLinks && contactLinks.length > 0) {
        // Explore top 2 likely candidates instead of just 1
        const uniqueLinks = Array.from(new Set(contactLinks)).slice(0, 2);
        
        for (const link of uniqueLinks) {
          let contactUrl = link.match(/href="([^"]*)"/i)?.[1];
          if (contactUrl) {
              if (!contactUrl.startsWith('http')) {
                  const base = new URL(url).origin;
                  contactUrl = new URL(contactUrl, base).href;
              }
              console.log(`[Deep Discovery] Explorando sub-página táctica: ${contactUrl}`);
              const contactResult = await scrapeWithPuppeteer(contactUrl);
              if (contactResult) {
                  extractEmails(contactResult.content);
                  if (!whatsapp) extractWhatsApp(contactResult.content);
              }
          }
          if (emails.size > 0) break;
        }
    }
  }

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
    screenshotUrl,
    whatsapp
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
        email: lead.email || (data.emails.length > 0 ? data.emails[0] : null),
        whatsapp: lead.whatsapp || data.whatsapp,
        all_emails: data.emails,
        tech_stack: data.tech,
        social_links: data.socials,
        seo_meta: data.seo,
        screenshotUrl: finalScreenshotUrl,
        score: lead.score + (data.emails.length > 0 ? 10 : 0) + (data.whatsapp ? 15 : 0) + (data.tech.length < 2 ? 15 : 0)
      };
    } catch (e) {
      return lead;
    }
  });

  return Promise.all(enrichmentPromises);
}
