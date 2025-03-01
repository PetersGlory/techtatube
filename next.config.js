/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
