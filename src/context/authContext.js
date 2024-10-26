"use client"; // Indica que es un componente del lado del cliente

import { createContext, useContext, useState, useEffect } from 'react';
import { CONFIGURACIONES } from '../app/config/config'; // Importar las configuraciones
// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

// Función para manejar el login en AuthProvider
const login = async (email, password) => {
  try {
    const response = await fetch(`${CONFIGURACIONES.BASEURL3}/auth/login`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', 
    });

    const data = await response.json();
    console.log(data); // Verifica el objeto recibido en la consola

    if (response.ok) {
      setIsAuthenticated(true);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token); // Guarda el token en localStorage
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error en la solicitud de login:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
};

  // Función para verificar la sesión cuando la página se recarga
  const checkSession = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
  
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL3}/auth/check-session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}` // Envía el token JWT en el header
        },
      });
      
      const data = await response.json();
      if (response.ok && data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        logout(); // Cierra sesión si el token no es válido
      }
    } catch (error) {
      console.error('Error verificando la sesión:', error);
      logout();
    }
  };

  
  // Verificar la sesión al cargar la aplicación o al recargar la página
  useEffect(() => {
    checkSession();
  }, []);

  // Función para cerrar sesión
// Función para cerrar sesión
const logout = () => {
  setIsAuthenticated(false);
  setUser(null);
  localStorage.removeItem('user'); // Borra el usuario almacenado
  localStorage.removeItem('token'); // Borra el token almacenado
  console.log('Sesión cerrada con éxito');
};


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
