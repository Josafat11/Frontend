"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/CartContext";
import { CONFIGURACIONES } from "../config/config";
import { useFavorites } from "../../context/FavoritesContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Breadcrumbs from "../../components/Breadcrumbs";
import { FiShoppingCart, FiPlus, FiStar, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function OfertasPage() {
  const { refreshCart } = useCart();
  const { user, isAuthenticated, theme } = useAuth();
  const router = useRouter();

  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const { favoritesCount, refreshFavorites } = useFavorites();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOfertas = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${CONFIGURACIONES.BASEURL2}/productos/ofertas`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Error al cargar productos en oferta");

        const data = await res.json();
        setProductos(data); // Asegúrate que tu controller devuelva un array directo
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos en oferta.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfertas();
  }, []);

  const agregarAlCarrito = async (productId) => {
    if (!isAuthenticated) {
      return Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) router.push("/login");
      });
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
      if (!res.ok) throw new Error(data.message);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto agregado",
        showConfirmButton: false,
        timer: 1500,
      });

      refreshCart();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const comprarAhora = async (productId) => {
    if (!isAuthenticated) {
      return Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para comprar productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) router.push("/login");
      });
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
      if (!res.ok) throw new Error(data.message);

      router.push("/carrito");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleFavorito = async (productId, e) => {
    e?.stopPropagation(); // Detiene la propagación si el evento existe
    e?.preventDefault(); // Previene el comportamiento por defecto si el evento existe
    if (!isAuthenticated) {
      const { isConfirmed } = await Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para guardar productos en favoritos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
        background: theme === "dark" ? "#1f2937" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      });

      if (isConfirmed) {
        router.push("/login");
      }
      return;
    }

    setIsAddingToFavorites(true);
    try {
      // 1. Actualización optimista del estado local
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, esFavorito: !p.esFavorito } : p
        )
      );

      // 2. Enviar petición al servidor
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/favoritos/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Opcional para mayor seguridad
          },
          credentials: "include",
          body: JSON.stringify({
            productId: Number(productId),
            userId: user.id, // Asegurar que el usuario es correcto
          }),
        }
      );

      // 3. Manejar respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la solicitud");
      }

      const { isFavorite } = await response.json();

      // 4. Sincronización final con el servidor
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, esFavorito: isFavorite } : p
        )
      );

      // 5. Actualizar contador global
      refreshFavorites();

      // 6. Feedback visual contextual
      await Swal.fire({
        position: "top-end",
        icon: isFavorite ? "success" : "info",
        title: isFavorite ? "Agregado a Favoritos" : "Eliminado de Favoritos",
        text: isFavorite
          ? "El producto está en tus favoritos"
          : "Producto removido",
        showConfirmButton: false,
        timer: 2000,
        background: theme === "dark" ? "#1f2937" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      });
    } catch (error) {
      console.error("Error en toggleFavorito:", error);

      // Revertir cambios en caso de error
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, esFavorito: !p.esFavorito } : p
        )
      );

      await Swal.fire({
        title: "Error",
        text: error.message || "No se pudo actualizar tus favoritos",
        icon: "error",
        background: theme === "dark" ? "#1f2937" : "#fff",
        color: theme === "dark" ? "#fff" : "#000",
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Ofertas", path: "/ofertas" },
  ];

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;

  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const indexFinal = indexInicio + productosPorPagina;

  const productosPaginados = productos.slice(indexInicio, indexFinal);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container px-4 py-8 mx-auto">
        <Breadcrumbs pages={breadcrumbsPages} />
        <h1 className="mb-6 text-3xl font-bold">Productos en Oferta</h1>

        {isLoading ? (
          <p className="text-center">Cargando productos en oferta...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productosPaginados.map((producto) => (
              <div
                key={producto.id}
                className={`relative rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/producto/${producto.id}`)}
                  role="button"
                  tabIndex="0"
                  aria-label={`Ver detalles de ${producto.name}`}
                  onKeyDown={(e) =>
                    e.key === "Enter" && router.push(`/producto/${producto.id}`)
                  }
                >
                  {/* Imagen del producto */}
                  <div className="relative bg-gray-100 h-60">
                    {Array.isArray(producto.images) &&
                    producto.images.length > 0 ? (
                      <Image
                        src={producto.images[0].url}
                        alt={producto.name}
                        fill
                        unoptimized 
                        className="object-cover"
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
                          producto.stock > 0
                            ? theme === "dark"
                              ? "bg-green-800 text-green-300"
                              : "bg-green-100 text-green-800"
                            : theme === "dark"
                            ? "bg-red-800 text-red-300"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {producto.stock > 0
                          ? `Stock: ${producto.stock}`
                          : "Agotado"}
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la tarjeta Parte de abajo prod*/}
                  <div className="p-4">
                    <h2 className="mb-1 text-lg font-bold line-clamp-1">
                      {producto.name}
                    </h2>
                    <p className="mb-2 text-sm text-gray-500 line-clamp-2">
                      {producto.description}
                    </p>

                    <div className="mb-2">
                      <span className="text-xl font-bold text-green-600">
                        $
                        {producto.discount
                          ? (
                              producto.price *
                              (1 - producto.discount / 100)
                            ).toFixed(2)
                          : producto.price.toFixed(2)}
                      </span>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <span className="line-through">
                          ${producto.price.toFixed(2)}
                        </span>{" "}
                        ({producto.discount}% OFF)
                      </p>
                    </div>
                    {/* Compatibilidades */}
                    <div className="mb-4">
                      <p className="mb-1 text-sm font-medium">
                        Compatibilidad:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {producto.compatibilities
                          .slice(0, 3)
                          .map((comp, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs ${
                                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                              }`}
                            >
                              {comp.make} {comp.model}
                            </span>
                          ))}
                        {producto.compatibilities.length > 3 && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            +{producto.compatibilities.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción - DEBEN estar FUERA del div clickeable */}
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => comprarAhora(producto.id)}
                        disabled={isAddingToCart || producto.stock <= 0}
                        className={`flex-1 py-2 px-4 rounded ${
                          producto.stock <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : theme === "dark"
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-green-500 hover:bg-green-400"
                        } text-white flex items-center justify-center`}
                      >
                        <FiShoppingCart className="mr-2" />
                        Comprar ahora
                      </button>

                      <button
                        onClick={() => agregarAlCarrito(producto.id)}
                        disabled={isAddingToCart || producto.stock <= 0}
                        title="Agregar al Carrito"
                        className={`p-2 rounded transition-colors ${
                          producto.stock <= 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : theme === "dark"
                            ? "bg-yellow-600 hover:bg-yellow-500 hover:text-gray-900"
                            : "bg-yellow-500 hover:bg-yellow-400 hover:text-gray-900"
                        } text-white`}
                      >
                        <FiPlus />
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorito(producto.id, e);
                        }}
                        disabled={isAddingToFavorites}
                        className={`
                                                      p-2 rounded-lg flex items-center justify-center
                                                      transition-colors duration-200
                                                      ${
                                                        producto.esFavorito
                                                          ? "text-red-500 hover:text-red-600"
                                                          : theme === "dark"
                                                          ? "text-gray-300 hover:text-red-400"
                                                          : "text-gray-500 hover:text-red-500"
                                                      }
                                                    ${
                                                      isAddingToFavorites
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "cursor-pointer"
                                                    }
                                                  `}
                        title={
                          producto.esFavorito
                            ? "Quitar de favoritos"
                            : "Añadir a favoritos"
                        }
                        aria-label={
                          producto.esFavorito
                            ? "Quitar de favoritos"
                            : "Añadir a favoritos"
                        }
                      >
                        {isAddingToFavorites ? (
                          <svg
                            className="w-5 h-5 animate-spin"
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
                          <FaHeart
                            className={`
                                                        ${
                                                          producto.esFavorito
                                                            ? "fill-red-500"
                                                            : "fill-transparent"
                                                        }
                                                        stroke-current
                                                        stroke-[3px]
                                                        ${
                                                          theme === "dark"
                                                            ? "text-gray-300"
                                                            : "text-gray-500"
                                                        }
                                                        transition-all duration-200
                                                      group-hover:text-red-500
                                                        ${
                                                          producto.esFavorito
                                                            ? "scale-110"
                                                            : "scale-100"
                                                        }
                                                        `}
                            size={20}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OfertasPage;
