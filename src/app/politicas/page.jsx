"use client"; // Aseguramos que este es un Client Component

import { useEffect, useState } from "react";
import { CONFIGURACIONES } from "../config/config"; // Ajusta la ruta según tu proyecto
import { useAuth } from "../../context/authContext";

function PoliticasPage() {
  const { theme } = useAuth();
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
        <p className="text-gray-700">
          No se encontró una política de privacidad actual.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 transition-colors ${
        theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-7xl p-8 rounded-lg shadow-lg mt-16 mb-16 ${
          theme === "dark"
            ? "bg-gray-700 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* Título de la política */}
        <h1 className="mb-6 text-3xl font-bold text-center">
          {politica.title}
        </h1>

        {/* Fecha de entrada en vigor */}
        <p className="mb-4 text-sm text-center">
          <span className="font-semibold">Vigencia:</span>{" "}
          {new Date(politica.effectiveDate).toLocaleDateString()}
        </p>

        {/* Separador decorativo */}
        <hr className="mb-6 border-gray-300" />

        {/* Contenido */}
        <div className="leading-relaxed text-justify whitespace-pre-line">
          {politica.content}
        </div>

        {/* Fecha de creación */}
        <p className="mt-8 text-xs text-center">
          <span className="font-semibold">Creado el:</span>{" "}
          {new Date(politica.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default PoliticasPage;
