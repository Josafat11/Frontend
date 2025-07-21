// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { CONFIGURACIONES } from "../app/config/config"; // Importar las configuraciones

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);

  const fetchCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.carrito?.items) {
        setCartCount(
          data.carrito.items.reduce((sum, item) => sum + item.quantity, 0)
        );
        setCarrito(data.carrito.items);
      } else {
        setCartCount(0);
        setCarrito([]);
      }

      if (data.recomendados) {
        setRecomendaciones(data.recomendados);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartCount(0);
      setCarrito([]);
      setRecomendaciones([]);
    }
  };

  // Actualizar el contador cuando cambie la autenticación
  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        carrito,
        recomendaciones,
        setRecomendaciones,
        setCarrito,
        refreshCart: fetchCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
