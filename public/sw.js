importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js");

// Fuerza instalación inmediata
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

// =====================================================
// PRECACHE MASIVO
// =====================================================
const PRECACHE = [
  "/offline.html",

  // Páginas estáticas
  "/",
  "/mispedidos",
  "/ventaProducto",
  "/marcas",
  "/ofertas",
  "/nosotros",
  "/contacto",
  "/politicas",
  "/terms",
  "/facturacion",
  "/ubicacion",

  // Todas tus imágenes
  "/assets/123.jpg",
  "/assets/a.jpg",
  "/assets/audi-logo.png",
  "/assets/b.jpg",
  "/assets/bmw-logo.png",
  "/assets/chevrolet-logo.png",
  "/assets/cocheB.jpg",
  "/assets/cocheN.jpg",
  "/assets/contactos.jpeg",
  "/assets/facturacion.jpg",
  "/assets/ford-logo.png",
  "/assets/honda-logo.png",
  "/assets/hyundai-logo.png",
  "/assets/kia-logo.png",
  "/assets/login.jpg",
  "/assets/mazda-logo.png",
  "/assets/mercado-pago.png",
  "/assets/mercedes-logo.png",
  "/assets/motor.jpg",
  "/assets/munoz-logo-alt.png",
  "/assets/munoz-logo.png",
  "/assets/negocio.png",
  "/assets/negocio2.jpg",
  "/assets/nissan-logo.png",
  "/assets/paypal-logo.png",
  "/assets/qr.jpg",
  "/assets/quienes.png",
  "/assets/toyota-logo.png",
  "/assets/volkswagen-logo.png",
];

const VERSION = Date.now().toString();

workbox.precaching.precacheAndRoute(
  PRECACHE.map((url) => ({ url, revision: VERSION }))
);

// =====================================================
// IMÁGENES LOCALES
// =====================================================
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

// =====================================================
// NEXT STATIC
// =====================================================
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/_next/static/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "next-static",
  })
);

// =====================================================
// API CACHE
// =====================================================
const BACK_URL = "https://backmunoz.onrender.com";

// Ofertas
workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === BACK_URL &&
    url.pathname.startsWith("/productos/ofertas"),
  new workbox.strategies.CacheFirst({
    cacheName: "api-ofertas",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

// Productos
workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === BACK_URL &&
    url.pathname.startsWith("/productos"),
  new workbox.strategies.CacheFirst({
    cacheName: "api-productos",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

// =====================================================
// FALLBACK
// =====================================================
workbox.routing.setCatchHandler(async ({ request }) => {
  if (request.destination === "document") {
    return caches.match("/offline.html");
  }
  return Response.error();
});
