'use client'; // Indica que es un componente del lado del cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import Image from 'next/image';

function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]); // Inicializar como un arreglo vacío
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/'); // Redirige a la página principal si no es admin o no está autenticado
    } else {
      fetchUsers(); // Cargar los usuarios si el usuario autenticado es admin
    }
  }, [isAuthenticated, user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/users', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data); // Asegúrate de que data sea un arreglo
      } else {
        setUsers([]); // Si no es un arreglo, asegúrate de no romper la UI
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId)); // Elimina el usuario de la lista
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Cargando usuarios...</p>;
  }

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8">Panel de Administración</h1>

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
                <tr key={user._id}>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border capitalize">{user.role}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 mr-2"
                      onClick={() => handleDelete(user._id)}
                    >
                      Eliminar
                    </button>
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
