"use client";  // Indicamos que es un Client Component

import { useState, useEffect } from "react";
import axios from "axios";  // Para hacer las solicitudes HTTP

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = '123456'; // Esto debe obtenerse desde la sesión o la autenticación

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`/api/user?userId=${userId}`);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al obtener la información del usuario');
        setLoading(false);
      }
    }
    fetchUserData();
  }, [userId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Perfil del Usuario</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Nombre:</label>
        <p className="text-lg">{userData.name}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Apellido:</label>
        <p className="text-lg">{userData.lastname}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email:</label>
        <p className="text-lg">{userData.email}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Teléfono:</label>
        <p className="text-lg">{userData.telefono}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Fecha de Nacimiento:</label>
        <p className="text-lg">{new Date(userData.fechadenacimiento).toLocaleDateString()}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Pregunta Secreta:</label>
        <p className="text-lg">{userData.preguntaSecreta}</p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Respuesta Secreta:</label>
        <p className="text-lg">{userData.respuestaSecreta}</p>
      </div>
    </div>
  );
}

export default UserProfile;
