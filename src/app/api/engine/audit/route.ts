import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { url, id } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL missing for audit" }, { status: 400 });
    }

    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 ZyndrixBot/1.0');

      const startTime = Date.now();
      let navigationSuccess = false;
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        navigationSuccess = true;
      } catch (navError) {
        console.warn(`Navigation to ${url} failed, proceeding with fallback analysis.`);
      }
      const loadTime = navigationSuccess ? Date.now() - startTime : 0;

      // 1. Screenshot & Upload to Supabase
      const screenshotBuffer = await page.screenshot({ type: 'png' });
      const screenshotName = `audit-${id || Date.now()}.png`;
      
      let remoteScreenshotUrl = null;
      try {
        const { uploadScreenshot } = await import('@/lib/supabase');
        remoteScreenshotUrl = await uploadScreenshot(Buffer.from(screenshotBuffer), screenshotName);
      } catch (uploadErr) {
        console.error("Migration Error: Failed to upload to Supabase Storage:", uploadErr);
      }

      // 2. Data Extraction
      const pageData = await page.evaluate(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || "";
        const h1 = document.querySelector('h1')?.innerText || "";
        
        // Advanced Extraction for Mockups & Imagery
        const favicon = document.querySelector('link[rel*="icon"]')?.getAttribute('href') || "/favicon.ico";
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || "";
        
        // Extract all images and filter for quality
        const images = Array.from(document.querySelectorAll('img'))
          .map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.naturalWidth,
            height: img.naturalHeight,
            area: img.naturalWidth * img.naturalHeight
          }))
          .filter(img => img.src.startsWith('http') && img.area > 20000) // Filter small icons/trackers
          .sort((a, b) => b.area - a.area)
          .slice(0, 5)
          .map(img => img.src);

        const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src);
        const hasJQuery = !!(window as unknown as { jQuery?: unknown }).jQuery;
        const hasReact = !!document.querySelector('[data-reactroot], #__next');
        const hasWP = document.querySelector('meta[name="generator"]')?.getAttribute('content')?.includes('WordPress') || document.body.classList.contains('wp-embedded-content');
        
        // Detect Social Proof Signals
        const hasInstagram = !!document.querySelector('a[href*="instagram.com"]');
        const hasFacebook = !!document.querySelector('a[href*="facebook.com"]');
        const hasWhatsapp = !!document.querySelector('a[href*="wa.me"], a[href*="whatsapp.com"]');

        return { title, metaDesc, h1, hasJQuery, hasReact, hasWP, scripts, favicon, ogImage, images, hasInstagram, hasFacebook, hasWhatsapp };
      });

      const content = await page.content();
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const foundEmails = Array.from(new Set(content.match(emailRegex) || []));

      // Resolve absolute URLs for assets
      let absFavicon = pageData.favicon;
      let absOgImage = pageData.ogImage;

      try {
        const baseUrl = new URL(url);
        absFavicon = pageData.favicon.startsWith('http') ? pageData.favicon : new URL(pageData.favicon, baseUrl).href;
        absOgImage = pageData.ogImage && !pageData.ogImage.startsWith('http') ? new URL(pageData.ogImage, baseUrl).href : pageData.ogImage;
      } catch (urlErr) {
        console.warn("Invalid URL for base calculation:", url);
      }

      // 3. Deeper Tech Stack Detection
      const techStack = [];
      if (pageData.hasWP) techStack.push("WordPress Core");
      if (pageData.hasReact) techStack.push("React/Next.js");
      if (pageData.hasJQuery) techStack.push("Legacy jQuery");
      if (content.includes('elementor')) techStack.push("Elementor Builder");
      if (content.includes('wp-content/themes/')) techStack.push("Custom WP Theme");
      if (content.includes('gtm.js') || content.includes('analytics.js')) techStack.push("Google Analytics/GTM");

      // 4. Professional Analysis (Beast Brain Style)
      const findings = [];
      if (!pageData.metaDesc) findings.push("🔴 SEO Crítico: Ausencia de Meta-Description. El negocio es invisible para búsquedas específicas.");
      if (loadTime > 2500) findings.push(`🟠 Latencia Inaceptable: Tiempo de respuesta de ${(loadTime/1000).toFixed(1)}s detectado. Riesgo de rebote > 40%.`);
      if (foundEmails.length === 0) findings.push("🔴 Fuga de Leads: No se detectan canales de contacto directo (emails) mapeados por bots.");
      if (pageData.hasWP && !content.includes('wp-content/plugins/')) findings.push("🟡 Estructura WP Vulnerable: Sin capas de seguridad visibles en el escaneo superficial.");
      if (!pageData.hasInstagram && !pageData.hasFacebook) findings.push("🔴 Desconexión Social: No se detectan perfiles sociales vinculados. Pérdida de autoridad de marca.");
      if (!pageData.hasWhatsapp) findings.push("🟠 Fricción en Citas: Ausencia de canal directo por WhatsApp.");

      return NextResponse.json({
        success: true,
        screenshotUrl: remoteScreenshotUrl || `/screenshots/${screenshotName}`,
        foundEmails,
        techStack,
        loadTime,
        favicon: absFavicon,
        ogImage: absOgImage,
        extractedImages: pageData.images,
        signals: {
          instagram: pageData.hasInstagram,
          facebook: pageData.hasFacebook,
          whatsapp: pageData.hasWhatsapp
        },
        seo: {
          title: pageData.title,
          description: pageData.metaDesc,
          h1: pageData.h1
        },
        findings: findings.length > 0 ? findings : ["🟢 Optimización técnica base detectada. El foco debe ser escalabilidad y conversión."]
      });
    } finally {
      await browser.close();
    }

  } catch (error: unknown) {
    const errorWithMessage = error as { message?: string };
    console.error("Audit Engine Error:", error);
    return NextResponse.json({ error: errorWithMessage.message || "Unknown error" }, { status: 500 });
  }
}
