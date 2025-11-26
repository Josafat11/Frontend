"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import { AuthProvider } from "../context/authContext";
import { LogoProvider } from "../context/LogoContext";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Guard from "../components/Guard";
import { useEffect } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {

  // ---------------------------------------
  // 🔔 Notificación cuando se queda SIN INTERNET
  // ---------------------------------------
  useEffect(() => {
    const handleOffline = () => {
      if (Notification.permission === "granted") {
        new Notification("Sin conexión", {
          body: "Ahora estás sin internet. Algunas funciones pueden no estar disponibles.",
          icon: "..//../public/icon-192x192.png",
        });
      } else {
        alert("Ahora estás sin conexión a internet");
      }
    };

    const handleOnline = () => {
      if (Notification.permission === "granted") {
        new Notification("Conexión restaurada", {
          body: "Tu conexión a internet ha vuelto.",
          icon: "..//../public/icon-192x192.png",
        });
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
  // ---------------------------------------

  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#317EFB" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta
          name="description"
          content="Aplicación PWA creada con Next.js para el curso de Aplicaciones Web Progresivas."
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Guard>
          <AuthProvider>
            <LogoProvider>
              <CartProvider>
                <FavoritesProvider>
                  <SplashScreen>
                    <Navbar />
                    {children}
                    <Footer />
                    <ToastContainer position="top-center" autoClose={3000} />
                  </SplashScreen>
                </FavoritesProvider>
              </CartProvider>
            </LogoProvider>
          </AuthProvider>
        </Guard>

        {/* Registro del Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", () => {
                  navigator.serviceWorker.register("/sw.js")
                    .then(reg => console.log("SW registrado:", reg))
                    .catch(err => console.error("SW error:", err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
