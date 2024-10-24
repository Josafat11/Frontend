"use client";  // Indicamos que es un Client Component

import { useState, useEffect } from "react";
import axios from "axios";  // Para hacer las solicitudes HTTP
import { useAuth } from '../../context/authContext'; // Usamos el contexto para obtener el ID del usuario o la sesión

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Obtenemos el usuario autenticado (solo el nombre y su ID)

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    async function fetchUserData() {
      if (user) {  // Asegurarse de que el usuario esté autenticado y haya un ID
        try {
          const response = await axios.get(`http://localhost:4000/api/auth/users/${user.userId}`, {
            withCredentials: true, // Incluir las cookies (credenciales) en la solicitud
          });
          setUserData(response.data);
          setLoading(false);
        } catch (error) {
          setError('Error al obtener la información del usuario');
          setLoading(false);
        }
      }
    }
    fetchUserData();
  }, [user]);  // Se ejecuta cada vez que el `user` cambie

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-8">
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
            <p className="text-lg text-gray-800">{new Date(userData.fechadenacimiento).toLocaleDateString()}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Pregunta Secreta:</label>
            <p className="text-lg text-gray-800">{userData.preguntaSecreta}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Respuesta Secreta:</label>
            <p className="text-lg text-gray-800">{userData.respuestaSecreta}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
