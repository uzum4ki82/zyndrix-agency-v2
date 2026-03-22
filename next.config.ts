import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/landing.html',
      },
      {
        source: '/privacidad',
        destination: '/privacy',
      },
      {
        source: '/terminos',
        destination: '/terms',
      },
      {
        source: '/seguridad',
        destination: '/security',
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
