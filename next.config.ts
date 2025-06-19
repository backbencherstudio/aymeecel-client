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
        hostname: 'aymeecel-backend.signalsmind.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.4.3',
        port: '4000',
        pathname: '/uploads/**',
      },

      {
        protocol: 'https',
        hostname: 'estate-refrigerator-ancient-careful.trycloudflare.com',
        pathname: '/uploads/**',
      },



    ],
  },
};

export default nextConfig;
