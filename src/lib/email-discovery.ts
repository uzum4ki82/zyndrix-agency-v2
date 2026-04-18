import puppeteer, { Browser } from 'puppeteer';
import { uploadScreenshot } from './supabase';
import { daemonLog } from './logger';

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

async function scrapeWithPuppeteer(url: string, existingBrowser?: Browser | null) {
  let browser = existingBrowser;
  let ownBrowser = false;
  
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      ownBrowser = true;
    }

    const page = await browser.newPage();
    
    // Configurar User-Agent real para evitar bloqueos
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });
    
    // Abrir URL con timeout razonable
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    
    const content = await page.content();
    const title = await page.title();
    
    // Capturar screenshot para el dashboard
    const screenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 50 });

    await page.close();
    return { content, title, screenshotUrl: `data:image/jpeg;base64,${screenshot}` };
  } catch (err: any) {
    daemonLog('warning', `[Puppeteer] Fallo en ${url}: ${err.message || err}. Fallback a fetch.`);
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 3600 } } as any);
      const content = await response.text();
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : url;
      return { content, title, screenshotUrl: null };
    } catch (fetchErr) {
      return null;
    }
  } finally {
    if (ownBrowser && browser) await browser.close();
  }
}

export async function discoverDataFromUrl(url: string | null, browser?: Browser | null): Promise<any> {
  if (!url || !url.startsWith('http')) return { emails: [], socials: {}, tech: [], seo: {}, whatsapp: null };

  const emails = new Set<string>();
  const socials: any = {};
  const tech: string[] = [];
  const seo: any = {};
  let whatsapp: string | null = null;
  
  const result = await scrapeWithPuppeteer(url, browser);
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
    if (!whatsapp) {
      const telMatch = text.match(/tel:(\+?\d{9,15})/i);
      if (telMatch && telMatch[1]) {
        whatsapp = telMatch[1].replace(/\s/g, '');
      }
    }
  }

  extractEmails(html);
  extractWhatsApp(html);

  // Deep Link Discovery
  if (emails.size === 0) {
    const contactLinks = html.match(/href="([^"]*(?:contacto|contact|legal|about|quienes|nosotros|aviso|privacidad|cookies)[^"]*)"/gi);
    if (contactLinks && contactLinks.length > 0) {
        const uniqueLinks = Array.from(new Set(contactLinks)).slice(0, 1);
        for (const link of uniqueLinks) {
          const contactUrlMatch = link.match(/href="([^"]*)"/i);
          let contactUrl = contactUrlMatch ? contactUrlMatch[1] : null;
          if (contactUrl) {
              if (!contactUrl.startsWith('http')) {
                  const base = new URL(url).origin;
                  contactUrl = new URL(contactUrl, base).href;
              }
              const contactResult = await scrapeWithPuppeteer(contactUrl, browser);
              if (contactResult) {
                  extractEmails(contactResult.content);
                  if (!whatsapp) extractWhatsApp(contactResult.content);
              }
          }
        }
    }
  }

  Object.entries(SOCIAL_PATTERNS).forEach(([platform, regex]) => {
    const match = html.match(regex);
    if (match) socials[platform] = match[0];
  });

  Object.entries(TECH_PATTERNS).forEach(([name, regex]) => {
    if (regex.test(html)) tech.push(name);
  });

  return { emails: Array.from(emails), socials, tech, seo, screenshotUrl, whatsapp };
}

export async function enrichLeadsWithDeepDiscovery(leads: any[]): Promise<any[]> {
  daemonLog('info', `🔍 Iniciando High-Fidelity Discovery para ${leads.length} objetivos...`);
  
  const enrichedLeads: any[] = [];
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Procesar en lotes de 2 para balancear velocidad y estabilidad
    const batchSize = 2;
    for (let i = 0; i < leads.length; i += batchSize) {
        const batch = leads.slice(i, i + batchSize);
        daemonLog('info', `[Discovery] Procesando lote ${Math.floor(i/batchSize) + 1} de ${Math.ceil(leads.length/batchSize)}...`);
        
        const results = await Promise.all(batch.map(async (lead) => {
            if (!lead.website || lead.website.includes('pending')) return lead;
            
            try {
                const data = await discoverDataFromUrl(lead.website, browser);
                let finalScreenshotUrl = data.screenshotUrl;

                if (data.screenshotUrl && data.screenshotUrl.startsWith('data:')) {
                    const base64Data = data.screenshotUrl.split(',')[1];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const publicUrl = await uploadScreenshot(buffer, `manual-${lead.id}-${Date.now()}.jpg`);
                    if (publicUrl) finalScreenshotUrl = publicUrl;
                }
                
                return {
                    ...lead,
                    email: lead.email || (data.emails.length > 0 ? data.emails[0] : null),
                    whatsapp: lead.whatsapp || data.whatsapp,
                    all_emails: data.emails,
                    tech_stack: data.tech.join(', '),
                    social_links: data.socials,
                    seo_meta: data.seo,
                    screenshotUrl: finalScreenshotUrl,
                    score: Math.min(100, lead.score + (data.emails.length > 0 ? 10 : 0) + (data.whatsapp ? 15 : 0))
                };
            } catch (e) {
                daemonLog('warning', `Error enriqueciendo ${lead.name}: ${e}`);
                return lead;
            }
        }));
        
        enrichedLeads.push(...results);
    }
  } catch (err) {
    daemonLog('error', `Fallo crítico en el motor de descubrimiento: ${err}`);
    return leads;
  } finally {
    if (browser) await browser.close();
  }

  daemonLog('success', `Descubrimiento finalizado. ${enrichedLeads.filter(l => l.email).length} prospectos con contacto directo.`);
  return enrichedLeads;
}
