// context/FavoritesContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { CONFIGURACIONES } from '../app/config/config';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);

const fetchFavoritesCount = async () => {
  if (!isAuthenticated) {
    setFavoritesCount(0);
    return;
  }

  try {
    const response = await fetch(`${CONFIGURACIONES.BASEURL2}/favoritos/count`, { // Cambiado a BASEURL2
      credentials: "include" // Esto enviará las cookies automáticamente
    });
    
    if (!response.ok) throw new Error('Error al obtener conteo de favoritos');
    
    const data = await response.json();
    setFavoritesCount(data.count);
  } catch (error) {
    console.error("Error fetching favorites count:", error);
    setFavoritesCount(0);
  }
};

  // Actualizar el contador cuando cambie la autenticación
  useEffect(() => {
    fetchFavoritesCount();
  }, [isAuthenticated]);

  return (
    <FavoritesContext.Provider value={{ favoritesCount, refreshFavorites: fetchFavoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);