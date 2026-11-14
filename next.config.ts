import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Host único: www y el dominio de Vercel redirigen 301 al dominio canónico (evita duplicados en Google).
      { source: '/:path*', has: [{ type: 'host', value: 'www.zyndrix.dev' }], destination: 'https://zyndrix.dev/:path*', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'zyndrix-agency-v2.vercel.app' }], destination: 'https://zyndrix.dev/:path*', permanent: true },
      // Rutas antiguas → páginas nuevas. 301 para las que estaban enlazadas desde la web en producción.
      { source: '/privacy', destination: '/privacidad', permanent: true },
      { source: '/terms', destination: '/aviso-legal', permanent: true },
      { source: '/security', destination: '/privacidad', permanent: true },
      { source: '/terminos', destination: '/aviso-legal', permanent: true },
      { source: '/seguridad', destination: '/privacidad', permanent: true },
      // Contenido de la oferta anterior (auditorías enterprise, blueprint): se reorienta al contacto.
      { source: '/auditoria', destination: '/#contacto', permanent: false },
      { source: '/blueprint', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
