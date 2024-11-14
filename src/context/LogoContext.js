// context/LogoContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { CONFIGURACIONES } from '../app/config/config'; // Importar las configuraciones
const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logoUrl, setLogoUrl] = useState(null);

  const fetchLogo = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/logo/ultimo`);
      if (response.ok) {
        const data = await response.json();
        setLogoUrl(`${data.url}?timestamp=${new Date().getTime()}`);
      }
    } catch (error) {
      console.error("Error al obtener el logo:", error);
    }
  };

  useEffect(() => {
    fetchLogo(); // Cargar logo al iniciar la app
  }, []);

  return (
    <LogoContext.Provider value={{ logoUrl, fetchLogo }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  return useContext(LogoContext);
}
