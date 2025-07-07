/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ Para rutas dinámicas como [token]
  images: {
    domains: ['res.cloudinary.com'],
  },
  poweredByHeader: false,
};

export default nextConfig;
