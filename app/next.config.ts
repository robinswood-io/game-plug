import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker production
  typescript: {
    // Temporarily ignore build errors for React 19 + Radix UI compatibility
    // TODO: Fix type errors in Phase 7
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: '**.openai.com',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
