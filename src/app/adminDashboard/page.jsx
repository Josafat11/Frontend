"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { FiUser, FiLock, FiUnlock, FiAlertCircle, FiClock, FiLogIn, FiX, FiCheck } from "react-icons/fi";
import Swal from 'sweetalert2';

function AdminDashboard() {
  const { user, isAuthenticated, theme } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ email: "", duration: "" });
  const [loading, setLoading] = useState(true);

  // Estilos basados en el tema
  const cardStyle = theme === 'dark' 
    ? 'bg-gray-800 text-gray-100 border-gray-700' 
    : 'bg-white text-gray-900 border-gray-200';
  
  const headerStyle = theme === 'dark' 
    ? 'bg-gray-700 text-white' 
    : 'bg-green-600 text-white';

  const openModal = (email) => {
    setModalData({ email, duration: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({ email: null, duration: "" });
  };

  // Cargar datos si el usuario es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    } else {
      setLoading(false);
    }

    if (isAuthenticated && user?.role === "admin") {
      const fetchData = async () => {
        try {
          // Usuarios recientes
          const recentUsersResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-users`,
            { method: "GET", credentials: "include" }
          );
          setRecentUsers(await recentUsersResponse.json());

          // Usuarios bloqueados
          await fetchBlockedUsers();

          // Intentos fallidos
          const failedAttemptsResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/failed-login-attempts`,
            { method: "GET", credentials: "include" }
          );
          setFailedAttempts(await failedAttemptsResponse.json());

          // Inicios de sesión
          await fetchRecentLogins();
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      };

      fetchData();
      const intervalId = setInterval(fetchData, 30_000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, user]);

  // Funciones de manejo de usuarios
  const blockUserTemporarily = async ({ email, duration }) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user-temporarily`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, lockDuration: duration }),
        }
      );
      if (response.ok) {
        showSuccess("Usuario bloqueado temporalmente");
        closeModal();
        fetchBlockedUsers();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      showError("Error al bloquear temporalmente");
    }
  };

  const blockUser = async (userId) => {
    const result = await Swal.fire({
      title: '¿Bloquear usuario?',
      text: "¿Estás seguro de bloquear permanentemente este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }
        );
        if (response.ok) {
          showSuccess("Usuario bloqueado permanentemente");
          fetchBlockedUsers();
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        showError("Error al bloquear usuario");
      }
    }
  };

  const unblockUser = async (userId) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/unblock-user`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      if (response.ok) {
        showSuccess("Usuario desbloqueado");
        fetchBlockedUsers();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      showError("Error al desbloquear usuario");
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-blocked`,
        { method: "GET", credentials: "include" }
      );
      setBlockedUsers(await response.json());
    } catch (error) {
      console.error("Error al obtener usuarios bloqueados:", error);
    }
  };

  const fetchRecentLogins = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-logins`,
        { method: "GET", credentials: "include" }
      );
      setRecentLogins(await response.json());
    } catch (error) {
      console.error("Error al obtener inicios de sesión:", error);
    }
  };

  // Helpers para mostrar mensajes
  const showSuccess = (message) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#10B981',
    });
  };

  const showError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#EF4444',
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-36 pb-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Panel de Administración
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Usuarios Recientes */}
          <div className={`rounded-xl shadow-lg border ${cardStyle}`}>
            <div className={`rounded-t-xl p-4 flex items-center ${headerStyle}`}>
              <FiUser className="mr-2" />
              <h2 className="text-xl font-semibold">Usuarios Recientes</h2>
            </div>
            <div className="p-4 space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-green-100'}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-green-100'} mr-3`}>
                        <FiUser className={`${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm opacity-80">{user.email}</p>
                        <p className="text-xs mt-1">
                          Registrado: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No hay usuarios recientes</p>
              )}
            </div>
          </div>

          {/* Usuarios Bloqueados */}
          <div className={`rounded-xl shadow-lg border ${cardStyle}`}>
            <div className={`rounded-t-xl p-4 flex items-center ${headerStyle}`}>
              <FiLock className="mr-2" />
              <h2 className="text-xl font-semibold">Usuarios Bloqueados</h2>
            </div>
            <div className="p-4 space-y-4">
              {blockedUsers.length > 0 ? (
                blockedUsers.map((user) => (
                  <div key={user.id} className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-yellow-100'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm opacity-80">{user.email}</p>
                        <p className="text-xs mt-1">
                          {user.blockedType === "Temporary" ? (
                            <>Bloqueado hasta: {new Date(user.lockedUntil).toLocaleString()}</>
                          ) : (
                            "Bloqueado permanentemente"
                          )}
                        </p>
                      </div>
                      {user.currentlyBlocked && (
                        <button
                          onClick={() => unblockUser(user.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <FiUnlock className="mr-1" /> Desbloquear
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No hay usuarios bloqueados</p>
              )}
            </div>
          </div>

          {/* Intentos Fallidos */}
          <div className={`rounded-xl shadow-lg border ${cardStyle}`}>
            <div className={`rounded-t-xl p-4 flex items-center ${headerStyle}`}>
              <FiAlertCircle className="mr-2" />
              <h2 className="text-xl font-semibold">Intentos Fallidos</h2>
            </div>
            <div className="p-4 space-y-4">
              {failedAttempts.length > 0 ? (
                failedAttempts.map((user) => (
                  <div key={user.id} className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-yellow-100'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm opacity-80">{user.email}</p>
                        <p className="text-xs mt-1">
                          Intentos fallidos: <span className="font-bold">{user.failedLoginAttempts}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => blockUser(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <FiLock className="mr-1" /> Bloquear
                        </button>
                        <button
                          onClick={() => openModal(user.email)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <FiClock className="mr-1" /> Temporal
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No hay intentos fallidos</p>
              )}
            </div>
          </div>

          {/* Inicios de Sesión Recientes */}
          <div className={`rounded-xl shadow-lg border ${cardStyle}`}>
            <div className={`rounded-t-xl p-4 flex items-center ${headerStyle}`}>
              <FiLogIn className="mr-2" />
              <h2 className="text-xl font-semibold">Inicios de Sesión</h2>
            </div>
            <div className="p-4 space-y-4">
              {recentLogins.length > 0 ? (
                recentLogins.map((login) => (
                  <div key={login.id} className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'} border ${theme === 'dark' ? 'border-gray-600' : 'border-green-100'}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-green-100'} mr-3`}>
                        <FiUser className={`${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{login.name}</p>
                        <p className="text-sm opacity-80">{login.email}</p>
                        <p className="text-xs mt-1">
                          Último acceso: {new Date(login.lastLogin).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No hay inicios de sesión</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para bloqueo temporal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`rounded-xl shadow-xl w-full max-w-md mx-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`rounded-t-xl p-4 flex justify-between items-center ${headerStyle}`}>
              <h2 className="text-xl font-semibold flex items-center">
                <FiClock className="mr-2" /> Bloqueo Temporal
              </h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4">
                Bloquear al usuario: <span className="font-bold">{modalData.email}</span>
              </p>
              <div className="mb-4">
                <label className="block mb-2">Duración (horas)</label>
                <input
                  type="number"
                  min="1"
                  className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                  placeholder="Ej: 24"
                  value={modalData.duration}
                  onChange={(e) => setModalData({ ...modalData, duration: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => blockUserTemporarily(modalData)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FiCheck className="mr-2" /> Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;