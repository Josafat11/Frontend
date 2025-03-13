"use client"; // Indicar que es un Client Component para Next.js

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
// Si en tu proyecto tienes un contexto de Auth con el tema, puedes importarlo así:
// import { useAuth } from "../context/authContext";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const { theme } = useAuth(); // Si tu contexto maneja un "theme"
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/profile`, {
          method: 'GET',
          credentials: 'include', // Para enviar la cookie JWT al backend
        });
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
          setError("");
        } else {
          // Si la respuesta no es OK, mostramos el mensaje de error devuelto por el backend
          setError(data.message || "Error al obtener el perfil");
        }
      } catch (err) {
        console.error("Error en fetchProfile:", err);
        setError("Error interno del servidor");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Manejo de estados de carga y error
  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!userData) {
    return <p>No hay datos de usuario</p>;
  }

  // Renderizado del perfil
  return (
    <div
      // Si quieres aplicar un tema, podrías hacer algo como:
      // className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
      className="min-h-screen p-8 bg-white text-gray-900"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Perfil del Usuario</h1>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="grid grid-cols-1 gap-6">

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Nombre:</label>
            <p className="text-lg text-gray-800">{userData.name}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Apellido:</label>
            <p className="text-lg text-gray-800">{userData.lastname}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email:</label>
            <p className="text-lg text-gray-800">{userData.email}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Teléfono:</label>
            <p className="text-lg text-gray-800">{userData.telefono}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Fecha de Nacimiento:</label>
            <p className="text-lg text-gray-800">
              {new Date(userData.fechadenacimiento).toLocaleDateString()}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Pregunta Secreta:</label>
            <p className="text-lg text-gray-800">{userData.preguntaSecreta}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Respuesta Secreta:</label>
            <p className="text-lg text-gray-800">{userData.respuestaSecreta}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Rol:</label>
            <p className="text-lg text-gray-800">{userData.role}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Último Inicio de Sesión:</label>
            <p className="text-lg text-gray-800">
              {userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : "N/A"}
            </p>
          </div>

          {/* Puedes agregar más campos si los tienes en tu modelo */}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
