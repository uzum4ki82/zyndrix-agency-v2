import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/api/'] },
    sitemap: 'https://zyndrix.dev/sitemap.xml',
    host: 'https://zyndrix.dev',
  };
}
