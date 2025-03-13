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

  // Verificar si el usuario es admin; si no, redirigir
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
    }
  }, [isAuthenticated, user]);

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        setLogo(null);
        setMessage("Formato de imagen no permitido. Usa JPG, PNG o GIF.");
        return;
      }
      setLogo(file);
      setMessage("");
    }
  };

  // Subir el logo a tu servidor
  const handleUploadLogo = async () => {
    if (!logo) {
      setMessage("Selecciona un archivo antes de subir.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", logo);
    formData.append("autor", user.name);

    try {
      // Enviamos la cookie automáticamente con credentials: 'include'
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/logo/subir`, {
        method: "POST",
        credentials: "include", // <-- Enviar cookie con el token
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Logo subido correctamente.");
        setLogo(null);
        // Refresca el logo en el front
        await fetchLogo();
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
