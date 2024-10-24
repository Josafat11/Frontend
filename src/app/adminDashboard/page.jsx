"use client";  // Asegura que este es un Client Component

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    // Verificar si el usuario es admin, si no redirigir manualmente
    if (!isAuthenticated || user?.role !== 'admin') {
      window.location.href = '/login';  // Redirige manualmente
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      // Obtener usuarios recientes
      const fetchRecentUsers = async () => {
        const response = await fetch('http://localhost:4000/api/auth/admin/recent-users', {
          credentials: 'include',  // Asegura que las cookies se envíen
        });
        const data = await response.json();
        setRecentUsers(data);
      };

      // Obtener usuarios bloqueados
      const fetchBlockedUsers = async () => {
        const response = await fetch('http://localhost:4000/api/auth/admin/recent-blocked', {
          credentials: 'include',  // Asegura que las cookies se envíen
        });
        const data = await response.json();
        setBlockedUsers(data);
      };

      fetchRecentUsers();
      fetchBlockedUsers();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="container mx-auto py-8 pt-32">
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Usuarios Recientes */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Usuarios Recientes</h2>
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div key={user._id} className="bg-green-200 rounded-lg p-4 mb-4 shadow">
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Correo:</strong> {user.email}</p>
                <p><strong>Fecha de Creación:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No hay usuarios recientes</p>
          )}
        </div>

        {/* Usuarios Bloqueados */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Usuarios Bloqueados Recientemente</h2>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user) => (
              <div key={user._id} className="bg-red-200 rounded-lg p-4 mb-4 shadow">
                <p><strong>Nombre:</strong> {user.name}</p>
                <p><strong>Correo:</strong> {user.email}</p>
                <p><strong>Fecha de Bloqueo:</strong> {new Date(user.lockedUntil).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No hay usuarios bloqueados</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
