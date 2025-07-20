"use client"; // Esto es esencial para usar hooks y componentes del cliente

import { useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function GraciasPage() {
  const { isAuthenticated, theme } = useAuth();
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className={`min-h-screen pt-36 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Head>
        <title>¡Gracias por tu compra!</title>
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-8 rounded-lg text-center">
          <svg 
            className="w-20 h-20 mx-auto mb-4 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          
          <h1 className="text-3xl font-bold mb-4">¡Pago completado con éxito!</h1>
          <p className="text-lg mb-6">Gracias por tu compra. Hemos recibido tu pago y estamos procesando tu pedido.</p>
          
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-2">¿Qué sigue?</h2>
            <ul className="text-left space-y-2">
              <li>• Recibirás un correo electrónico con los detalles de tu compra</li>
              <li>• Tu pedido será enviado en un plazo de 1-2 días hábiles</li>
              <li>• Puedes ver el estado de tu pedido en tu perfil</li>
            </ul>
          </div>

          <button
            onClick={() => router.push("/")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}