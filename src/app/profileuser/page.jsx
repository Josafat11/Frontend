"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import { useAuth } from '../../context/authContext';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiKey, FiShield, FiClock, FiEdit, FiSave, FiX
} from "react-icons/fi";

function UserProfile() {
  const { theme, toggleTheme } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setUserData(data);
          setFormData({
            name: data.name,
            lastname: data.lastname,
            telefono: data.telefono,
            fechadenacimiento: data.fechadenacimiento
          });
          setError("");
        } else {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setEditMode(false);
      } else {
        setError(data.message || "Error al actualizar el perfil");
      }
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError("Error interno del servidor");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
        <div className="max-w-md px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
        <p>No hay datos de usuario</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="flex items-center text-3xl font-bold">
            <FiUser className="mr-2" /> Mi Perfil
          </h1>
        </div>

        <div className={`rounded-lg shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-600'} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  {userData.name} {userData.lastname}
                </h2>
                <p className="flex items-center mt-1">
                  <FiMail className="mr-2" /> {userData.email}
                </p>
              </div>
              <div className="flex space-x-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-green-700 hover:bg-blue-400'}`}
                    title="Editar perfil"
                  >
                    <FiEdit />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSubmit}
                      className="p-2 bg-green-500 rounded-full hover:bg-green-400"
                      title="Guardar cambios"
                    >
                      <FiSave />
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-400"
                      title="Cancelar edición"
                    >
                      <FiX />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="flex items-center mb-1 text-sm font-medium">
                    <FiUser className="mr-2" /> Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="flex items-center mb-1 text-sm font-medium">
                    <FiUser className="mr-2" /> Apellido
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="flex items-center mb-1 text-sm font-medium">
                    <FiPhone className="mr-2" /> Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="flex items-center mb-1 text-sm font-medium">
                    <FiCalendar className="mr-2" /> Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechadenacimiento"
                    value={formData.fechadenacimiento ? new Date(formData.fechadenacimiento).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="flex items-center mb-4 text-lg font-semibold">
                      <FiUser className="mr-2" /> Información Personal
                    </h3>
                    <div className="space-y-3">
                      <p>
                        <span className="font-medium">Nombre:</span> {userData.name}
                      </p>
                      <p>
                        <span className="font-medium">Apellido:</span> {userData.lastname}
                      </p>
                      <p>
                        <span className="font-medium">Teléfono:</span> {userData.telefono || 'No especificado'}
                      </p>
                      <p>
                        <span className="font-medium">Fecha Nacimiento:</span>{" "}
                        {new Date(userData.fechadenacimiento).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center mb-4 text-lg font-semibold">
                      <FiShield className="mr-2" /> Seguridad
                    </h3>
                    <div className="space-y-3">
                      <p>
                        <span className="font-medium">Pregunta Secreta:</span> {userData.preguntaSecreta}
                      </p>
                      <p>
                        <span className="font-medium">Rol:</span>{" "}
                        <span className={`px-2 py-1 rounded text-xs ${
                          userData.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {userData.role}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="flex items-center mb-4 text-lg font-semibold">
                      <FiClock className="mr-2" /> Actividad
                    </h3>
                    <div className="space-y-3">
                      <p>
                        <span className="font-medium">Último inicio:</span>{" "}
                        {userData.lastLogin
                          ? new Date(userData.lastLogin).toLocaleString()
                          : "Nunca"}
                      </p>
                      <p>
                        <span className="font-medium">Cuenta creada:</span>{" "}
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Última actualización:</span>{" "}
                        {new Date(userData.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center mb-4 text-lg font-semibold">
                      <FiKey className="mr-2" /> Estado de la Cuenta
                    </h3>
                    <div className="space-y-3">
                      <p>
                        <span className="font-medium">Verificada:</span>{" "}
                        <span className={`px-2 py-1 rounded text-xs ${
                          userData.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {userData.verified ? "Sí" : "No"}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Bloqueada:</span>{" "}
                        <span className={`px-2 py-1 rounded text-xs ${
                          userData.blocked 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {userData.blocked ? "Sí" : "No"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;