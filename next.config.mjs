/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // middlewareType: 'proxy' // Removed: invalid in Next.js 16.2.1
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
