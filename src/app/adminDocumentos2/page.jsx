"use client"; // Indica que es un componente del lado del cliente

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";

function TermsConditionsPage() {
  const { user, isAuthenticated, theme } = useAuth(); // Añadimos theme desde el contexto
  const [termsConditions, setTermsConditions] = useState(null); // Almacena los términos actuales
  const [loading, setLoading] = useState(true);
  const [newTerms, setNewTerms] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  }); // Para los nuevos términos
  const router = useRouter();

  // Definición de la función fetchTermsConditions antes de su uso
  const fetchTermsConditions = async () => {
    const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local
    console.log(token);
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/terms-conditions/current`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Envía el token en la cabecera
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar los términos y condiciones");
    }

    const data = await response.json();
    setTermsConditions(data); // Establece los términos y condiciones actuales
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/"); // Redirige a la página principal si no es admin o no está autenticado
    } else {
      fetchTermsConditions(); // Cargar los términos y condiciones si es admin
    }
  }, [isAuthenticated, user]);

  const handleCreateTerms = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms-conditions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Envía el token en la cabecera
          },
          credentials: "include",
          body: JSON.stringify(newTerms),
        }
      );

      if (response.ok) {
        fetchTermsConditions(); // Actualiza los términos y condiciones actuales
        setNewTerms({ title: "", content: "", effectiveDate: "" }); // Resetea el formulario
      } else {
        console.error(
          "Error al crear los términos y condiciones:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al crear los términos y condiciones:", error);
    }
  };

  if (loading) {
    return (
      <p className={`text-center mt-20 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        Cargando términos y condiciones...
      </p>
    );
  }

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-bold text-center mb-8">
        Gestión de Términos y Condiciones
      </h1>

      {/* Formulario para crear nuevos términos y condiciones */}
      <div className={`shadow-md rounded-lg overflow-hidden p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">
          Crear Nuevos Términos y Condiciones
        </h2>

        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Título</label>
          <input
            type="text"
            value={newTerms.title}
            onChange={(e) =>
              setNewTerms({ ...newTerms, title: e.target.value })
            }
            className={`w-full border p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}
          />
        </div>

        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Contenido</label>
          <textarea
            value={newTerms.content}
            onChange={(e) =>
              setNewTerms({ ...newTerms, content: e.target.value })
            }
            className={`w-full border p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}
            rows="6"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fecha de Vigencia</label>
          <input
            type="date"
            value={newTerms.effectiveDate}
            onChange={(e) =>
              setNewTerms({ ...newTerms, effectiveDate: e.target.value })
            }
            className={`w-full border p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}
          />
        </div>

        <button
          onClick={handleCreateTerms}
          className={`py-2 px-4 rounded hover:bg-green-600 ${theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-700 text-white'}`}
        >
          Crear Términos
        </button>
      </div>

      {/* Visualización de los términos y condiciones actuales */}
      {termsConditions && (
        <div className={`shadow-md rounded-lg overflow-hidden p-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
          <h2 className="text-2xl font-bold mb-4">
            Términos y Condiciones Actuales
          </h2>

          <h3 className="text-xl font-semibold mb-2">
            {termsConditions.title}
          </h3>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Fecha de entrada en vigor:{" "}
            {new Date(termsConditions.effectiveDate).toLocaleDateString()}
          </p>

          <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-justify whitespace-pre-line leading-relaxed`}>
            {termsConditions.content}
          </div>

          <p className={`text-xs mt-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Creado el:{" "}
            {new Date(termsConditions.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default TermsConditionsPage;
