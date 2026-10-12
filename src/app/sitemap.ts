import type { MetadataRoute } from 'next';

const BASE = 'https://zyndrix.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/agente-whatsapp', priority: 0.9 },
    { path: '/agente-voz', priority: 0.9 },
    { path: '/aviso-legal', priority: 0.2 },
    { path: '/privacidad', priority: 0.2 },
    { path: '/cookies', priority: 0.2 },
  ];
  return routes.map((r) => ({ url: `${BASE}${r.path}`, changeFrequency: 'monthly', priority: r.priority }));
}
