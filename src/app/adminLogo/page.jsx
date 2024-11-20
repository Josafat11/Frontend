"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useLogo } from "../../context/LogoContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";

function AdminLogoPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const { fetchLogo } = useLogo();
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirigir a login si no está autenticado o no es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Validar tipo de archivo en el frontend
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLogo(file);
      setMessage("");
    } else {
      setLogo(null);
      setMessage("Por favor, selecciona un archivo de imagen válido (JPG, PNG, etc.).");
    }
  };

  // Subir el archivo al backend
  const handleUploadLogo = async () => {
    if (!logo) {
      setMessage("Selecciona un archivo antes de subir.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", logo);
    formData.append("autor", user.name);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/logo/subir`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Logo subido correctamente.");
        setLogo(null);
        await fetchLogo(); // Refresca el logo en el frontend
      } else {
        const error = await response.json();
        setMessage(error.message || "Error al subir el logo.");
      }
    } catch (error) {
      console.error("Error al subir el logo:", error);
      setMessage("Error al subir el logo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        Administración de Logo
      </h1>

      <div
        className={`shadow-md rounded-lg overflow-hidden p-6 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Subir Nuevo Logo</h2>

        {/* Input para subir imágenes */}
        <div className="mb-4">
          <label
            className={`block mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Selecciona un logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full border p-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "border-gray-300"
            }`}
          />
        </div>

        {/* Botón para subir */}
        <button
          onClick={handleUploadLogo}
          disabled={isLoading}
          className={`py-2 px-4 rounded ${
            isLoading
              ? "bg-gray-400"
              : theme === "dark"
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          {isLoading ? "Subiendo..." : "Subir Logo"}
        </button>

        {/* Mostrar mensajes */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminLogoPage;