"use client"; // Asegura que este es un Client Component

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config"; // Importar las configuraciones

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);

  useEffect(() => {
    // Verificar si el usuario es admin, si no redirigir manualmente
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"; // Redirige manualmente
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      // Función para obtener datos del backend
      const fetchData = async () => {
        const token = localStorage.getItem("token");

        try {
          // Usuarios recientes
          const recentUsersResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-users`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const recentUsersData = await recentUsersResponse.json();
          setRecentUsers(recentUsersData);

          // Usuarios bloqueados
          await fetchBlockedUsers();

          // Intentos fallidos
          const failedAttemptsResponse = await fetch(
            `${CONFIGURACIONES.BASEURL2}/auth/admin/failed-login-attempts`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const failedAttemptsData = await failedAttemptsResponse.json();
          setFailedAttempts(failedAttemptsData);
          await fetchRecentLogins();
        } catch (error) {
          console.error("Error al obtener datos del backend:", error);
        }
      };

      // Ejecutar la función por primera vez y luego cada 30 segundos
      fetchData();
      const intervalId = setInterval(fetchData, 1000); // 30 segundos

      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, user]);

  const blockUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/block-user`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        console.log("Usuario bloqueado exitosamente");
      } else {
        const data = await response.json();
        console.error("Error al bloquear usuario:", data.message);
      }
    } catch (error) {
      console.error("Error al bloquear usuario:", error);
    }
  };

  const fetchBlockedUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-blocked`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setBlockedUsers(data); // Actualiza el estado de usuarios bloqueados
    } catch (error) {
      console.error("Error al obtener usuarios bloqueados:", error);
    }
  };

  const fetchRecentLogins = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/recent-logins`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setRecentLogins(data); // Actualiza el estado con los inicios de sesión recientes
    } catch (error) {
      console.error("Error al obtener los inicios de sesión recientes:", error);
    }
  };

  const unblockUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/admin/unblock-user`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        console.log("Usuario desbloqueado exitosamente");
        fetchBlockedUsers(); // Actualizar la lista de usuarios bloqueados
      } else {
        const data = await response.json();
        console.error("Error al desbloquear usuario:", data.message);
      }
    } catch (error) {
      console.error("Error al desbloquear usuario:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold mb-8 text-center pt-10">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Usuarios Recientes */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Usuarios Recientes</h2>
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div
                key={user._id}
                className="bg-green-200 rounded-lg p-4 mb-4 shadow"
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Fecha de Creación:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No hay usuarios recientes</p>
          )}
        </div>

        {/* Usuarios Bloqueados */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            Usuarios Bloqueados Recientemente
          </h2>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user) => (
              <div
                key={user.id}
                className={`rounded-lg p-4 mb-4 shadow ${
                  user.currentlyBlocked ? "bg-red-200" : "bg-yellow-200"
                }`}
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Tipo de Bloqueo:</strong> {user.blockedType}
                </p>
                {user.blockedType === "Temporary" && (
                  <p>
                    <strong>Bloqueado Hasta:</strong>{" "}
                    {new Date(user.lockedUntil).toLocaleString()}
                  </p>
                )}
                <p>
                  <strong>Actualmente Bloqueado:</strong>{" "}
                  {user.currentlyBlocked
                    ? "Sí"
                    : "No (Desbloqueado Recientemente)"}
                </p>
                <p>
                  <strong>Última Actualización:</strong>{" "}
                  {new Date(user.lastUpdated).toLocaleString()}
                </p>
                {user.currentlyBlocked && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    onClick={() => unblockUser(user.id)}
                  >
                    Desbloquear
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No hay usuarios bloqueados</p>
          )}
        </div>
        {/* Intentos Fallidos */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            Recientes Intentos Fallidos
          </h2>
          {failedAttempts.length > 0 ? (
            failedAttempts.map((user) => (
              <div
                key={user.id}
                className="bg-yellow-200 rounded-lg p-4 mb-4 shadow"
              >
                <p>
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Intentos Fallidos:</strong> {user.failedLoginAttempts}
                </p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => blockUser(user.id)} // Aquí usamos el ID correcto
                >
                  Bloquear
                </button>
              </div>
            ))
          ) : (
            <p>No hay intentos fallidos recientes</p>
          )}
        </div>

        {/* Inicios de Sesión Recientes */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            Inicios de Sesión Recientes
          </h2>
          {recentLogins.length > 0 ? (
            recentLogins.map((login) => (
              <div
                key={login._id}
                className="bg-blue-200 rounded-lg p-4 mb-4 shadow"
              >
                <p>
                  <strong>Nombre:</strong> {login.name}
                </p>
                <p>
                  <strong>Correo:</strong> {login.email}
                </p>
                <p>
                  <strong>Último Inicio de Sesión:</strong>{" "}
                  {new Date(login.lastLogin).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No hay inicios de sesión recientes</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
