/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@shared'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'game-plug.rbw.ovh' },
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net', pathname: '/**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://game-plug-backend:4000/api/:path*',
      },
      {
        source: '/game-ws/:path*',
        destination: 'http://game-plug-backend:4000/game-ws/:path*',
      },
    ];
  },
  experimental: {
    // Enable Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};
module.exports = nextConfig;
