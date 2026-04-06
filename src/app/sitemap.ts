import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zyndrix.dev';

  const routes = [
    '',
    '/blueprint',
    '/auditoria',
    '/privacy',
    '/security',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly' as any,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
