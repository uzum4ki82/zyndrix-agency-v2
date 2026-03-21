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
        source: '/terminos',
        destination: '/terminos.html',
      },
    ];
  },
};

export default nextConfig;
