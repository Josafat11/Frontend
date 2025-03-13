// context/LogoContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { CONFIGURACIONES } from '../app/config/config'; 

const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logoUrl, setLogoUrl] = useState(null);

  const fetchLogo = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/logo/ultimo`);
      if (response.ok) {
        const data = await response.json();
        // Aseguramos que el navegador no use caché, añadiendo un timestamp
        setLogoUrl(`${data.url}?timestamp=${new Date().getTime()}`);
      }
    } catch (error) {
      console.error("Error al obtener el logo:", error);
    }
  };

  // Cargar logo al montar el contexto
  useEffect(() => {
    fetchLogo();
  }, []);

  return (
    <LogoContext.Provider value={{ logoUrl, setLogoUrl, fetchLogo }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  return useContext(LogoContext);
}
