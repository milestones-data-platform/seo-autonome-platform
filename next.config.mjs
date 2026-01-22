/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker/Cloud Run deployment
  // This creates a minimal production build with all dependencies bundled
  output: 'standalone',
  
  // Optimize images for production
  images: {
    // Allow images from any domain (configure as needed for production)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Use sharp for image optimization in production
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
