"use client"; // Indica que es un componente del lado del cliente

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";

function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);

  // Verificar si el usuario es admin; si no, redirigir manualmente
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Cargar la lista de usuarios si es admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users`, {
            method: "GET",
            credentials: "include", // Enviar la cookie con el token
          });
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
        }
      };
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  // Eliminar usuario
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users/${userId}`, {
        method: "DELETE",
        credentials: "include", // Enviar la cookie
      });
      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        console.error("Error al eliminar el usuario:", await response.text());
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8">
        Panel de Administración
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Rol</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border capitalize">{user.role}</td>
                  <td className="px-4 py-2 border">
                    {user.role !== "admin" && (
                      <button
                        className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 mr-2"
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </button>
                    )}
                    <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
