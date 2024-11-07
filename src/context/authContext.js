"use client"; // Indica que es un componente del lado del cliente

import { createContext, useContext, useState, useEffect } from 'react';
import { CONFIGURACIONES } from '../app/config/config'; // Importar las configuraciones

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Función para obtener el tema inicial
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  };

  // Estado para el tema (claro/oscuro)
  const [theme, setTheme] = useState('light');

  // Función para alternar el tema  // Función para alternar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', newTheme);
    }
  };



// Actualizar el tema en el atributo `data-theme` y el fondo del `body`
useEffect(() => {
  const savedTheme = typeof window !== 'undefined' && window.localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);  // Establecer el tema almacenado en `localStorage`
  }
}, []);

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
}, [theme]);

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
      console.log(data);

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
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
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!storedToken) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL3}/auth/check-session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        },
      });

      const data = await response.json();
      if (response.ok && data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        logout();
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
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    console.log('Sesión cerrada con éxito');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
