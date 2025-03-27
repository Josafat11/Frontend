"use client"; // Indicar que es un Client Component

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "../context/authContext";
import { LogoProvider } from "../context/LogoContext"; // Importa LogoProvider
import { CartProvider } from '../context/CartContext';
import { ToastContainer } from "react-toastify"; // Importa ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importa los estilos

// Definir los fonts como localFont
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LogoProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <ToastContainer position="top-center" autoClose={3000} /> {/* Aquí */}
            </CartProvider>
          </LogoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
