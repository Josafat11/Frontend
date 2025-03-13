"use client"; // Aseguramos que este es un Client Component

import { useEffect, useState } from "react";
import { CONFIGURACIONES } from "../config/config"; // Ajusta la ruta según tu proyecto

function PoliticasPage() {
  const [politica, setPolitica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Llamada a la API para obtener la política de privacidad actual
    const fetchPolitica = async () => {
      try {
        const response = await fetch(
          `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/current`,
          {
            method: "GET",
            credentials: "include", // Enviar cookies si tu backend las requiere
          }
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Error al obtener la política");
        }
        const data = await response.json();
        setPolitica(data);
      } catch (error) {
        console.error("Error al cargar la política:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolitica();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Cargando política de privacidad...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Si no hay error ni loading, pero tampoco política
  if (!politica) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">No se encontró una política de privacidad actual.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
        {/* Título de la política */}
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          {politica.title}
        </h1>

        {/* Fecha de entrada en vigor */}
        <p className="text-sm text-gray-500 text-center mb-4">
          <span className="font-semibold">Vigencia:</span>{" "}
          {new Date(politica.effectiveDate).toLocaleDateString()}
        </p>

        {/* Separador decorativo */}
        <hr className="border-gray-300 mb-6" />

        {/* Contenido */}
        <div className="text-gray-700 text-justify whitespace-pre-line leading-relaxed">
          {politica.content}
        </div>

        {/* Fecha de creación */}
        <p className="text-xs text-gray-400 mt-8 text-center">
          <span className="font-semibold">Creado el:</span>{" "}
          {new Date(politica.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default PoliticasPage;
