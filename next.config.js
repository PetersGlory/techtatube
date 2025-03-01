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
  swcMinify: false, // Disable SWC minification
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        encoding: false
      };
    }
    
    // Disable minification to help with debugging
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimize = false;
    }
    
    return config;
  },
};

module.exports = nextConfig;