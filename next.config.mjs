/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 👈 Habilita la exportación estática (Next.js 13+)
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true,  // 👈 Desactiva la optimización de imágenes (necesario para `next export`)
  },
  poweredByHeader: false,
  // Elimina `async headers()` porque no funciona en export estático
  // (las cabeceras HTTP se deben configurar en el servidor, ej. via .htaccess en Hostinger)
};

export default nextConfig;