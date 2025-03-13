"use client";

import { useEffect, useState } from "react";
import { CONFIGURACIONES } from "../config/config"; // Ajusta la ruta según tu estructura

function TermsAndDeslindePage() {
  // Estados para manejar datos, carga y errores
  const [terms, setTerms] = useState(null);
  const [deslinde, setDeslinde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Llamada a la API para Términos
  const fetchCurrentTerms = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms/current`,
        {
          method: "GET",
          credentials: "include", // Enviar cookies si tu backend lo requiere
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al obtener los términos");
      }
      const data = await response.json();
      setTerms(data);
    } catch (err) {
      throw err; // Propagar el error para manejarlo en la función principal
    }
  };

  // Llamada a la API para Deslinde
  const fetchCurrentDeslinde = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/deslinde/current`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al obtener el deslinde");
      }
      const data = await response.json();
      setDeslinde(data);
    } catch (err) {
      throw err;
    }
  };

  // useEffect principal para cargar ambos
  useEffect(() => {
    const loadData = async () => {
      try {
        // Podemos cargar ambos en paralelo
        await Promise.all([fetchCurrentTerms(), fetchCurrentDeslinde()]);
      } catch (err) {
        console.error("Error al cargar Términos/Deslinde:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Cargando datos...</p>
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

  // Si no hay error ni loading, pero tampoco datos
  if (!terms && !deslinde) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">
          No se encontraron Términos/Deslinde actuales.
        </p>
      </div>
    );
  }

  // Render principal
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      {/* Contenedor de Términos */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full mb-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          {terms ? terms.title : "Términos y Condiciones"}
        </h1>
        {terms ? (
          <>
            <p className="text-sm text-gray-500 text-center mb-4">
              <span className="font-semibold">Vigencia:</span>{" "}
              {new Date(terms.effectiveDate).toLocaleDateString()}
            </p>
            <hr className="border-gray-300 mb-6" />
            <div className="text-gray-700 text-justify whitespace-pre-line leading-relaxed">
              {terms.content}
            </div>
            <p className="text-xs text-gray-400 mt-8 text-center">
              <span className="font-semibold">Creado el:</span>{" "}
              {new Date(terms.createdAt).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-center text-gray-700">
            No se encontraron términos actuales
          </p>
        )}
      </div>

      {/* Contenedor de Deslinde */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          {deslinde ? deslinde.title : "Deslinde de Responsabilidad"}
        </h1>
        {deslinde ? (
          <>
            <p className="text-sm text-gray-500 text-center mb-4">
              <span className="font-semibold">Vigencia:</span>{" "}
              {new Date(deslinde.effectiveDate).toLocaleDateString()}
            </p>
            <hr className="border-gray-300 mb-6" />
            <div className="text-gray-700 text-justify whitespace-pre-line leading-relaxed">
              {deslinde.content}
            </div>
            <p className="text-xs text-gray-400 mt-8 text-center">
              <span className="font-semibold">Creado el:</span>{" "}
              {new Date(deslinde.createdAt).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-center text-gray-700">
            No se encontró un deslinde actual
          </p>
        )}
      </div>
    </div>
  );
}

export default TermsAndDeslindePage;
