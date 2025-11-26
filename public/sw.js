importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

// =====================================
// ACTIVACIÓN INMEDIATA
// =====================================
self.skipWaiting();
self.clients.claim();

// =====================================
// PRECACHE COMPLETO - TODO SE GUARDA AL INSTALAR
// =====================================
workbox.precaching.precacheAndRoute([
  { url: "/offline.html", revision: "1" },

  // Páginas principales
  { url: "/", revision: "1" },
  { url: "/mispedidos", revision: "1" },
  { url: "/ventaProducto", revision: "1" },
  { url: "/marcas", revision: "1" },
  { url: "/ofertas", revision: "1" },
  { url: "/nosotros", revision: "1" },
  { url: "/contacto", revision: "1" },
  { url: "/politicas", revision: "1" },
  { url: "/terms", revision: "1" },
  { url: "/facturacion", revision: "1" },
  { url: "/ubicacion", revision: "1" },

  // TODAS LAS IMÁGENES LOCALES
  { url: "/assets/123.jpg", revision: "1" },
  { url: "/assets/a.jpg", revision: "1" },
  { url: "/assets/audi-logo.png", revision: "1" },
  { url: "/assets/b.jpg", revision: "1" },
  { url: "/assets/bmw-logo.png", revision: "1" },
  { url: "/assets/chevrolet-logo.png", revision: "1" },
  { url: "/assets/cocheB.jpg", revision: "1" },
  { url: "/assets/cocheN.jpg", revision: "1" },
  { url: "/assets/contactos.jpeg", revision: "1" },
  { url: "/assets/facturacion.jpg", revision: "1" },
  { url: "/assets/ford-logo.png", revision: "1" },
  { url: "/assets/honda-logo.png", revision: "1" },
  { url: "/assets/hyundai-logo.png", revision: "1" },
  { url: "/assets/kia-logo.png", revision: "1" },
  { url: "/assets/login.jpg", revision: "1" },
  { url: "/assets/mazda-logo.png", revision: "1" },
  { url: "/assets/mercado-pago.png", revision: "1" },
  { url: "/assets/mercedes-logo.png", revision: "1" },
  { url: "/assets/motor.jpg", revision: "1" },
  { url: "/assets/munoz-logo-alt.png", revision: "1" },
  { url: "/assets/munoz-logo.png", revision: "1" },
  { url: "/assets/negocio.png", revision: "1" },
  { url: "/assets/negocio2.jpg", revision: "1" },
  { url: "/assets/nissan-logo.png", revision: "1" },
  { url: "/assets/paypal-logo.png", revision: "1" },
  { url: "/assets/qr.jpg", revision: "1" },
  { url: "/assets/quienes.png", revision: "1" },
  { url: "/assets/toyota-logo.png", revision: "1" },
  { url: "/assets/volkswagen-logo.png", revision: "1" },
]);

// =====================================
// CACHE DE RESPALDO PARA /assets/
// =====================================
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/assets/"),
  new workbox.strategies.CacheFirst({
    cacheName: "local-images",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 días
      }),
    ],
  })
);

// =====================================
// NEXT STATIC
// =====================================
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/_next/static/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "next-static",
  })
);

// =====================================
// STATIC FILES (Scripts, CSS)
// =====================================
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

// =====================================
// CLOUDINARY IMAGES
// =====================================
workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://res.cloudinary.com",
  new workbox.strategies.CacheFirst({
    cacheName: "cloudinary-images",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  })
);

// =====================================
// NAVIGATION (HTML PAGES)
// =====================================
workbox.routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new workbox.strategies.NetworkFirst({
    cacheName: "html-pages",
    networkTimeoutSeconds: 4,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
      }),
    ],
  })
);

// =====================================
// API PRODUCTOS
// =====================================
workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === "https://backmunoz.onrender.com" &&
    url.pathname.startsWith("/productos"),
  new workbox.strategies.NetworkFirst({
    cacheName: "api-productos",
    networkTimeoutSeconds: 4,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 día
      }),
    ],
  })
);

// =====================================
// API OFERTAS
// =====================================
workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === "https://backmunoz.onrender.com" &&
    url.pathname.startsWith("/productos/ofertas"),
  new workbox.strategies.NetworkFirst({
    cacheName: "api-ofertas",
    networkTimeoutSeconds: 4,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 día
      }),
    ],
  })
);

// =====================================
// FALLBACK GLOBAL
// =====================================
workbox.routing.setCatchHandler(async ({ request }) => {
  if (request.destination === "document") {
    const cache = await caches.open(workbox.core.cacheNames.precache);
    return (await cache.match("/offline.html")) || Response.error();
  }
  return Response.error();
});