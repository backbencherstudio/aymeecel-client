import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'bbsserver.zapto.org',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'slovakia-he-iii-communities.trycloudflare.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.4.3',
        port: '4000',
        pathname: '/uploads/**',
      }

    ],
  },
};

export default nextConfig;
