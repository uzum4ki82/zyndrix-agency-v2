import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/privacidad',
        destination: '/privacidad.html',
      },
      {
        source: '/privacy',
        destination: '/privacidad.html',
      },
      {
        source: '/terminos',
        destination: '/terminos.html',
      },
      {
        source: '/terms',
        destination: '/terminos.html',
      },
      {
        source: '/seguridad',
        destination: '/seguridad.html',
      },
      {
        source: '/security',
        destination: '/seguridad.html',
      },
      {
        source: '/dashboard',
        destination: '/',
      },
      {
        source: '/dashboards',
        destination: '/',
      },
      {
        source: '/login',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
