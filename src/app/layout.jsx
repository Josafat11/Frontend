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

// ✅ Importar el Guard
import Guard from "../components/Guard";

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

        {/* 🚨 Envolvemos TODO en Guard */}
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

        {/* SW manual */}
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
