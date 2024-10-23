"use client"; // Indica que es un componente del lado del cliente

import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

// Función para manejar el login
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:4000/api/auth/login', {
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
      setUser(data.user); // Aquí se establece la información del usuario
      return { success: true };
    } else {
      // Devolver el mensaje de error del backend
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error en la solicitud de login:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
};

  // Función para verificar la sesión
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/auth/check-session', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok && data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser({
            ...data.user,
            role: data.user.role, // Incluir el rol del usuario en la sesión
          });
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verificando la sesión:', error);
      }
    };

    checkSession();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
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
