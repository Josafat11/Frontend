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
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Importante para que la cookie se reciba
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        // El token se almacena en la cookie (httpOnly), no en localStorage
        setIsAuthenticated(true);
        setUser(data.user);
  
        // Opcional: guardar datos del usuario en localStorage (no el token)
        localStorage.setItem('user', JSON.stringify(data.user));
  
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
  try {
    const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/check-session`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();

    // Revisamos si la respuesta fue 2xx y data.isAuthenticated === true
    if (response.ok && data.isAuthenticated) {
      setIsAuthenticated(true);
      setUser(data.user);
      // Opcional: localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      // Cualquier otra cosa se considera sin sesión
      setIsAuthenticated(false);
      setUser(null);
      // Opcional: localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error verificando la sesión:', error);
    logout(); // O solo setIsAuthenticated(false); setUser(null);
  }
};

  

  // Verificar la sesión al cargar la aplicación o al recargar la página
  useEffect(() => {
    checkSession();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    await fetch(`${CONFIGURACIONES.BASEURL2}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
