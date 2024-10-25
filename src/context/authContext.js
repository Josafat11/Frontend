"use client"; // Indica que es un componente del lado del cliente

import { createContext, useContext, useState, useEffect } from 'react';
import { CONFIGURACIONES } from '../app/config/config'; // Importar las configuraciones
// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

// Función para manejar el login
const login = async (email, password) => {
  try {
    const response = await fetch(`${CONFIGURACIONES.BASEURL}/auth/login`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', 
    });

    const data = await response.json();

    if (response.ok) {
      setIsAuthenticated(true);
      setUser(data.user); // Aquí se establece la información del usuario (nombre, email, role, etc.)
      localStorage.setItem('user', JSON.stringify(data.user)); // Guarda la información del usuario en localStorage
      return { success: true };
    } else {
      return { success: false, message: data.message }; // Manejo de errores
    }
  } catch (error) {
    console.error('Error en la solicitud de login:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
};

  // Función para verificar la sesión cuando la página se recarga
// Función para verificar la sesión cuando la página se recarga
const checkSession = async () => {
  try {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      // Si el usuario ya está guardado en localStorage, cargarlo directamente
      setUser(JSON.parse(localUser));
      setIsAuthenticated(true);
      return;
    }

    const response = await fetch(`${CONFIGURACIONES.BASEURL}/auth/check-session`, {
      method: 'GET',
      credentials: 'include', // Para mantener la cookie de la sesión
    });
    const data = await response.json();

    if (response.ok && data.isAuthenticated) {
      setIsAuthenticated(true);
      setUser(data.user); // Recupera el usuario desde el backend, incluido su rol
      localStorage.setItem('user', JSON.stringify(data.user)); // Guarda al usuario en localStorage
    } else {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user'); // Limpia el localStorage si no hay sesión activa
    }
  } catch (error) {
    console.error('Error verificando la sesión:', error);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user'); // Limpia el localStorage en caso de error
  }
};

  // Verificar la sesión al cargar la aplicación o al recargar la página
  useEffect(() => {
    checkSession();
  }, []);

  // Función para cerrar sesión
// Función para cerrar sesión
const logout = async () => {
  try {
    const response = await fetch(`${CONFIGURACIONES.BASEURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Importante para cerrar la sesión correctamente en el servidor
    });

    if (response.ok) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user'); // Limpia el localStorage al cerrar sesión
    } else {
      console.error('Error al cerrar sesión');
    }
  } catch (error) {
    console.error('Error en la solicitud de logout:', error);
  }
};


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
