importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

// =====================================
// PRECACHE
// =====================================
workbox.precaching.precacheAndRoute([
  { url: "/offline.html", revision: "1" },

  // =====================================
  // PÁGINAS QUE QUIERES PRECACHEAR
  // =====================================
  { url: "/", revision: null },
  { url: "/ventaProducto", revision: null },
  { url: "/marcas", revision: null },
  { url: "/ofertas", revision: null },
  { url: "/nosotros", revision: null },
  { url: "/contacto", revision: null },
  { url: "/politicas", revision: null },
  { url: "/terms", revision: null },
  { url: "/facturacion", revision: null },
  { url: "/ubicacion", revision: null },
]);

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
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// =====================================
// NEXT STATIC (_next/static/)
// =====================================
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/_next/static/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "next-static",
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
    url.href.startsWith("http://localhost:4000/api/productos"),
  new workbox.strategies.NetworkFirst({
    cacheName: "api-productos",
    networkTimeoutSeconds: 4,
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// =====================================
// GLOBAL CATCH HANDLER (a prueba de fallos)
// =====================================
workbox.routing.setCatchHandler(async ({ event, request }) => {
  // Fallback solo para navegación
  if (request && request.destination === "document") {
    try {
      const cache = await caches.open(workbox.core.cacheNames.precache);
      const cachedOffline = await cache.match("/offline.html");

      if (cachedOffline) {
        return cachedOffline;
      }
    } catch (e) {
      // ignorar errores
    }

    // Fallback final (si offline.html NO existe)
    return new Response(
      `<h1>Sin conexión</h1><p>No se pudo cargar esta página.</p>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // Para images, scripts, APIs → respuesta de error genérica
  return Response.error();
});
