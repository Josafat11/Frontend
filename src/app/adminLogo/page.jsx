"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useLogo } from "../../context/LogoContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import { FiUpload, FiImage, FiUser, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Swal from 'sweetalert2';

function AdminLogoPage() {
const { user, isAuthenticated, isAuthLoading, theme } = useAuth();
  const { fetchLogo } = useLogo();
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Verificar permisos de admin
useEffect(() => {
  if (!isAuthLoading && (!isAuthenticated || user?.role !== "admin")) {
    router.push("/login");
  }
}, [isAuthenticated, isAuthLoading, user, router]);

  // Generar vista previa cuando se selecciona un archivo
  useEffect(() => {
    if (!logo) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(logo);
  }, [logo]);

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setLogo(null);
        setPreview(null);
        showError("Formato no soportado. Usa JPG, PNG, SVG o WebP.");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setLogo(null);
        setPreview(null);
        showError("El archivo es demasiado grande (máx. 2MB)");
        return;
      }
      
      setLogo(file);
      setMessage("");
    }
  };

  // Subir el logo al servidor
  const handleUploadLogo = async () => {
    if (!logo) {
      showError("Selecciona un archivo antes de subir");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", logo);
    formData.append("autor", user.name);

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/logo/subir`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        showSuccess("Logo actualizado correctamente");
        setLogo(null);
        setPreview(null);
        await fetchLogo();
      } else {
        const error = await response.json();
        showError(error.message || "Error al subir el logo");
      }
    } catch (error) {
      console.error("Error al subir el logo:", error);
      showError("Error de conexión al servidor");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar mensaje de éxito
  const showSuccess = (msg) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: msg,
      confirmButtonColor: '#10B981',
    });
  };

  // Mostrar mensaje de error
  const showError = (msg) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg,
      confirmButtonColor: '#EF4444',
    });
  };

    if (isAuthLoading || !isAuthenticated || user?.role !== "admin") {
  return (
    <div className="container mx-auto py-8 pt-36 text-center">
      <p>Verificando acceso...</p>
    </div>
  );
}
  return (
    <div className={`min-h-screen pt-36 pb-12 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Encabezado */}
          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-600'} text-white`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <FiImage className="mr-2" /> Administración de Logo
                </h1>
                <p className="mt-1">Actualiza el logo de tu aplicación</p>
              </div>
              <div className="flex items-center">
                <FiUser className="mr-2" />
                <span>{user.name} (Admin)</span>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              {/* Área de arrastrar y soltar */}
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer transition-colors ${
                  theme === 'dark' 
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FiUpload className="mx-auto text-4xl mb-4 text-green-500" />
                <p className="mb-2 font-medium">Haz clic para seleccionar o arrastra tu logo aquí</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Formatos soportados: JPG, PNG, SVG, WebP (máx. 2MB)
                </p>
              </div>

              {/* Vista previa */}
              {preview && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FiImage className="mr-2" /> Vista previa del nuevo logo
                  </h3>
                  <div className="flex flex-col items-center">
                    <img 
                      src={preview} 
                      alt="Vista previa del logo" 
                      className="max-h-48 max-w-full object-contain border rounded-lg"
                    />
                    <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Tamaño: {(logo.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}

              {/* Botón de acción */}
              <div className="flex justify-center">
                <button
                  onClick={handleUploadLogo}
                  disabled={!logo || isLoading}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                    !logo || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : theme === 'dark'
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-2" />
                      {logo ? 'Subir nuevo logo' : 'Selecciona un logo primero'}
                    </>
                  )}
                </button>
              </div>

              {/* Consejos */}
              <div className={`mt-8 p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
              }`}>
                <h4 className="font-semibold mb-2 flex items-center">
                  <FiCheckCircle className="mr-2 text-green-500" /> Recomendaciones
                </h4>
                <ul className={`text-sm space-y-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <li>• Usa imágenes con fondo transparente (PNG) para mejores resultados</li>
                  <li>• El tamaño ideal es entre 200x200px y 500x500px</li>
                  <li>• Evita logos con muchos detalles pequeños</li>
                  <li>• El formato SVG ofrece la mejor calidad</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogoPage;