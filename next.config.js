/** @type {import('next').NextConfig} */
const nextConfig = {
  // Once the custom domain is live, keep old .vercel.app links working
  // by redirecting them here (Vercel project settings also need the
  // domain added under Project > Settings > Domains).
  async redirects() {
    return [
      // Example — replace with your actual old preview URL if needed:
      // { source: '/:path*', has: [{ type: 'host', value: 'zalaltor-old.vercel.app' }], destination: 'https://zalaltor.com/:path*', permanent: true },
    ];
  },
};

module.exports = nextConfig;
