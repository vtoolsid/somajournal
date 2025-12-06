/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Server Actions for Clerk authentication
  experimental: {
    serverActions: true,
  },
  // Remove 'export' to enable API routes
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    // Suppress webpack cache warnings in development
    if (dev) {
      config.infrastructureLogging = {
        level: 'error',
      };
      config.stats = {
        warnings: false,
      };
      // Filter out cache-related warnings
      config.ignoreWarnings = [
        /invalid code lengths set/,
        /PackFileCacheStrategy.*Restoring failed/,
        /webpack\.cache\.PackFileCacheStrategy/,
      ];
    }

    // Ignore optional WebSocket dependencies for Vercel deployment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }

    // Suppress WebSocket-related warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
      /Can't resolve 'bufferutil'/,
      /Can't resolve 'utf-8-validate'/,
    ];

    return config;
  },
};

module.exports = nextConfig;
