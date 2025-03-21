/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, private',
          },
          {
            key: 'Content-Security-Policy',
            value:
              process.env.NODE_ENV === 'development'
                ? "default-src 'self'; " +
                  "connect-src 'self' http://localhost:4000 https://maps.googleapis.com https://maps.gstatic.com; " +
                  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://maps.googleapis.com; " +
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                  "img-src 'self' data: https://res.cloudinary.com https://maps.gstatic.com https://maps.googleapis.com https://*.google.com; " +
                  "font-src 'self' https://fonts.gstatic.com; " +
                  "frame-src 'self' https://www.google.com;"
                : "default-src 'self'; " +
                  "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com; " +
                  "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://maps.googleapis.com; " +
                  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                  "img-src 'self' data: https://res.cloudinary.com https://maps.gstatic.com https://maps.googleapis.com https://*.google.com; " +
                  "font-src 'self' https://fonts.gstatic.com; " +
                  "frame-src 'self' https://www.google.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;