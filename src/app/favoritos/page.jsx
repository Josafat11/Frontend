"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation"; // Import correcto
import Swal from "sweetalert2";
import { FaTrash, FaHeartBroken } from "react-icons/fa";
import { FiShoppingCart, FiPlus } from "react-icons/fi";

const FavoritosPage = () => {
  const { refreshCart } = useCart();
  const router = useRouter(); // <-- Inicialización esencial
  const { isAuthenticated, theme } = useAuth();
  const { refreshFavorites } = useFavorites();
  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/favoritos`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al cargar favoritos");

        const data = await res.json();
        setFavoritos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchFavoritos();
  }, [isAuthenticated]);

  const eliminarFavorito = async (productId) => {
    const result = await Swal.fire({
      title: "¿Eliminar de favoritos?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `${CONFIGURACIONES.BASEURL2}/favoritos/eliminar/${productId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (res.ok) {
          setFavoritos((prev) => prev.filter((f) => f.productId !== productId));
          refreshFavorites();
          Swal.fire(
            "Eliminado",
            "El producto ha sido eliminado de favoritos",
            "success"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudo eliminar el producto de favoritos",
          "error"
        );
      }
    }
  };

  const comprarAhora = async (productId, e) => {
    e?.stopPropagation(); // Detiene la propagación si el evento existe

    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para comprar productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        router.push("/login");
      }
      return;
    }

    setIsAddingToCart(true);
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: Number(productId), quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al comprar");

      refreshCart();
      router.push("/carrito");
    } catch (err) {
      console.error("Error al comprar:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const agregarAlCarrito = async (productId) => {
    const result = await Swal.fire({
      title: "¿Agregar al carrito?",
      text: "Puedes finalizar tu compra en la página del carrito",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, agregar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setIsAddingToCart(true);
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: Number(productId), quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al agregar al carrito");

      refreshCart();
      Swal.fire("Agregado", "El producto se agregó al carrito", "success").then(
        () => {
          router.push("/carrito");
        }
      );
    } catch (err) {
      console.error("Error al comprar:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`py-12 text-center ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <FaHeartBroken className="mx-auto mb-4 text-5xl text-gray-400" />
        <h2 className="text-xl font-semibold">Debes iniciar sesión</h2>
        <p className="mt-2">Inicia sesión para ver tus productos favoritos</p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 mt-4 text-white bg-yellow-500 rounded hover:bg-yellow-400"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 border-yellow-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  if (favoritos.length === 0)
    return (
      <div
        className={`py-12 text-center ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        <FaHeartBroken className="mx-auto mb-4 text-5xl text-gray-400" />
        <h2 className="text-xl font-semibold">No tienes productos favoritos</h2>
        <p className="mt-2">Agrega productos a favoritos para verlos aquí</p>
        <Link
          href="/ventaProducto"
          className={`inline-block px-4 py-2 mt-4 bg-yellow-500 rounded hover:bg-yellow-400 ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100 font-semibold"
              : "bg-gray-50 text-gray-900 font-semibold"
          }`}
        >
          Explorar productos
        </Link>
      </div>
    );

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container px-4 py-8 mx-auto transition-colors ">
        <h1 className="mb-6 text-3xl font-bold">
          Mis Favoritos ({favoritos.length})
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoritos.map(({ product }) => (
            <div
              key={product.id}
              className={`relative rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Contenido principal clickeable */}
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/producto/${product.id}`)}
                role="button"
                tabIndex="0"
                aria-label={`Ver detalles de ${product.name}`}
                onKeyDown={(e) =>
                  e.key === "Enter" && router.push(`/producto/${product.id}`)
                }
              >
                {/* Imagen del producto */}
                <div className="relative bg-gray-100 h-60">
                  {Array.isArray(product.images) &&
                  product.images.length > 0 ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`text-lg ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Sin imagen
                      </span>
                    </div>
                  )}
                  {/* Badge de stock */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.stock > 0
                          ? theme === "dark"
                            ? "bg-green-800 text-green-300"
                            : "bg-green-100 text-green-800"
                          : theme === "dark"
                          ? "bg-red-800 text-red-300"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0
                        ? `Stock: ${product.stock}`
                        : "Agotado"}
                    </span>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-4">
                  <h2 className="mb-1 text-lg font-bold line-clamp-1">
                    {product.name}
                  </h2>
                  <p
                    className={`text-sm mb-3 line-clamp-2 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xl font-bold">
                        $
                        {(product.price * (1 - product.discount / 100)).toFixed(
                          2
                        )}
                      </p>
                      {product.discount > 0 && (
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          <span className="line-through">
                            ${product.price.toFixed(2)}
                          </span>{" "}
                          ({product.discount}% OFF)
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción - DEBEN estar FUERA del div clickeable */}
              <div className="px-4 pb-4">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      comprarAhora(product.id, e);
                    }}
                    disabled={isAddingToCart || product.stock <= 0}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                      product.stock <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-green-500 hover:bg-green-400"
                    } text-white`}
                  >
                    {isAddingToCart ? (
                      <svg
                        className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FiShoppingCart className="mr-2" />
                    )}
                    Comprar ahora
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      agregarAlCarrito(product.id, e);
                    }}
                    disabled={isAddingToCart || product.stock <= 0}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      product.stock <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-500"
                        : "bg-blue-500 hover:bg-blue-400"
                    } text-white`}
                    title="Añadir al carrito"
                  >
                    {isAddingToCart ? (
                      <svg
                        className="w-4 h-4 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FiPlus />
                    )}
                  </button>

                  <button
                    onClick={() => eliminarFavorito(product.id)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                      product.stock <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-red-600 hover:bg-red-500"
                    } text-white`}
                    aria-label={`Eliminar ${product.name} de favoritos`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritosPage;
