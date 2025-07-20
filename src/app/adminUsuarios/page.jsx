"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import {
  FiTrash2, FiEdit, FiSearch, FiUser, FiMail, FiShield, FiLock, FiUnlock,
  FiCheckCircle, FiXCircle, FiPlus, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import Swal from 'sweetalert2';

function AdminPage() {
const { user, isAuthenticated, isAuthLoading, theme } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const router = useRouter();

  // Verificar permisos de admin
useEffect(() => {
  if (!isAuthLoading && (!isAuthenticated || user?.role !== "admin")) {
    router.push("/login");
  }
}, [isAuthenticated, isAuthLoading, user, router]);

  // Cargar usuarios
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      showError("Error al cargar usuarios");
    }
  };

  // Filtrar usuarios
  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Ordenar usuarios
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  // Eliminar usuario con confirmación
  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/users/${userId}`, {
          method: "DELETE",
          credentials: "include",
        });
        
        if (response.ok) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          Swal.fire(
            '¡Eliminado!',
            'El usuario ha sido eliminado.',
            'success'
          );
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        showError("Error al eliminar usuario");
      }
    }
  };

  // Iniciar edición
  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditFormData({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      telefono: user.telefono,
      role: user.role,
      blocked: user.blocked,
      verified: user.verified
    });
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Guardar cambios
  const saveEdit = async (userId) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        setEditingUserId(null);
        Swal.fire(
          '¡Actualizado!',
          'El usuario ha sido actualizado.',
          'success'
        );
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      showError("Error al actualizar usuario");
    }
  };

  const showError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  };

  // Mostrar icono de ordenación
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <FiChevronDown className="opacity-0" />;
    return sortConfig.direction === 'ascending' ? 
      <FiChevronDown className="inline ml-1" /> : 
      <FiChevronUp className="inline ml-1" />;
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
                  <FiShield className="mr-2" /> Panel de Administración
                </h1>
                <p className="mt-1">Gestiona todos los usuarios del sistema</p>
              </div>
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg ${theme === 'dark' ? 'bg-gray-600 text-white placeholder-gray-300' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                />
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-6 overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg">No se encontraron usuarios</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center">
                        <FiUser className="mr-2" /> Nombre
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center">
                        <FiMail className="mr-2" /> Email
                        <SortIcon column="email" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('role')}
                    >
                      <div className="flex items-center">
                        <FiShield className="mr-2" /> Rol
                        <SortIcon column="role" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      {editingUserId === user.id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              name="name"
                              value={editFormData.name}
                              onChange={handleEditChange}
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              name="email"
                              value={editFormData.email}
                              onChange={handleEditChange}
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="role"
                              value={editFormData.role}
                              onChange={handleEditChange}
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                            >
                              <option value="normal">Normal</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="verified"
                                  checked={editFormData.verified}
                                  onChange={handleEditChange}
                                  className="mr-2"
                                />
                                Verificado
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="blocked"
                                  checked={editFormData.blocked}
                                  onChange={handleEditChange}
                                  className="mr-2"
                                />
                                Bloqueado
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => saveEdit(user.id)}
                              className={`mr-2 p-2 rounded-full ${theme === 'dark' ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-400'}`}
                              title="Guardar"
                            >
                              <FiCheckCircle className="text-white" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-400'}`}
                              title="Cancelar"
                            >
                              <FiXCircle className="text-white" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <FiUser size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium">
                                  {user.name} {user.lastname}
                                </div>
                                <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {user.telefono || 'Sin teléfono'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <span className={`flex items-center text-sm ${
                                user.verified 
                                  ? 'text-green-500' 
                                  : 'text-yellow-500'
                              }`}>
                                {user.verified ? <FiCheckCircle className="mr-1" /> : <FiXCircle className="mr-1" />}
                                {user.verified ? 'Verificado' : 'No verificado'}
                              </span>
                              <span className={`flex items-center text-sm ${
                                user.blocked 
                                  ? 'text-red-500' 
                                  : 'text-green-500'
                              }`}>
                                {user.blocked ? <FiLock className="mr-1" /> : <FiUnlock className="mr-1" />}
                                {user.blocked ? 'Bloqueado' : 'Activo'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => startEdit(user)}
                              className={`mr-2 p-2 rounded-full ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-400'}`}
                              title="Editar"
                            >
                              <FiEdit className="text-white" />
                            </button>
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleDelete(user.id)}
                                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-400'}`}
                                title="Eliminar"
                              >
                                <FiTrash2 className="text-white" />
                              </button>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pie de tabla */}
          <div className={`px-6 py-4 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
              Mostrando <span className="font-medium">{filteredUsers.length}</span> de <span className="font-medium">{users.length}</span> usuarios
            </div>
            <button
              className={`flex items-center px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-400'} text-white`}
              onClick={() => {
                // Aquí puedes implementar la lógica para añadir un nuevo usuario
                Swal.fire(
                  'Función no implementada',
                  'La creación de nuevos usuarios sería manejada aquí',
                  'info'
                );
              }}
            >
              <FiPlus className="mr-2" /> Nuevo Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;