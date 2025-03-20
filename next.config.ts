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
        hostname: 'bbsserver.zapto.org',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '46.202.164.243',
        port: '4000',
        pathname: '/uploads/**',
      }
    ],
  },
};

export default nextConfig;
