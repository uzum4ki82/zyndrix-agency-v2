import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/dashboard',
        destination: '/dashboard/index.html',
      },
    ];
  },
};

export default nextConfig;
