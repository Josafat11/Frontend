"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation"; // Import correcto
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiTag,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiShoppingCart,
  FiStar,
  FiPlus,
} from "react-icons/fi";
import { FaCar, FaCalendarAlt, FaBoxOpen, FaChevronDown } from "react-icons/fa";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { FaHeart, FaRegHeart } from "react-icons/fa";


function ProductosPage() {
const { refreshCart, setRecomendaciones } = useCart();
  const router = useRouter(); // <-- Inicialización esencial
  const { user, isAuthenticated, theme } = useAuth();
  const [productos, setProductos] = useState([]);
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroRangoPrecio, setFiltroRangoPrecio] = useState(["", ""]);
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroStock, setFiltroStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    totalProductos: 0,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { favoritesCount, refreshFavorites } = useFavorites();
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  // Captura los parámetros de búsqueda de la URL
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const categoriaParam = searchParams.get("categoria");

  useEffect(() => {
    if (searchTerm) {
      setBusquedaGeneral(searchTerm);
    }
    if (categoriaParam) {
      setFiltroCategoria(categoriaParam); // Establece la categoría desde la URL
    }
  }, [searchTerm, categoriaParam]); // Añade categoriaParam a las dependencias

  // Obtener productos al cargar la página o cambiar filtros
  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          search: busquedaGeneral,
          categoria: filtroCategoria,
          minPrecio: filtroRangoPrecio[0] || '',
          maxPrecio: filtroRangoPrecio[1] || '',
          marca: filtroMarca,
          modelo: filtroModelo,
          anio: filtroAnio,
          stock: filtroStock,
          page: paginacion.paginaActual,
          pageSize: 12,
          includeFavorites: isAuthenticated ? 'true' : 'false',
          timestamp: Date.now()
        });

        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos?${params}`, {
          credentials: "include",
          cache: 'no-store'
        });

        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        const data = await response.json();

        setProductos(data.productos);
        setPaginacion(data.paginacion);
      } catch (error) {
        console.error("Error fetching productos:", error);
        setError("Error al cargar productos");
      } finally {
        setIsLoading(false);
      }
    };

    // Agrega un debounce para evitar llamadas excesivas
    const debounceTimer = setTimeout(fetchProductos, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    isAuthenticated,
    busquedaGeneral,
    filtroCategoria,
    filtroRangoPrecio,
    filtroMarca,
    filtroModelo,
    filtroAnio,
    filtroStock,
    paginacion.paginaActual,
    user
  ]);

  useEffect(() => {
    if (productos.length > 0) {
      const prefetchProductPages = async () => {
        try {
          await Promise.all(
            productos.map(producto =>
              router.prefetch(`/producto/${producto.id}`)
            )
          );
        } catch (error) {
          console.error("Error prefetching product pages:", error);
        }
      };

      prefetchProductPages();
    }
  }, [productos, router]);


  // Cambiar de página
  const cambiarPagina = (pagina) => {
    setPaginacion((prev) => ({ ...prev, paginaActual: pagina }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Definir las migas de pan
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Productos", path: "/ventaProducto" },
  ];

  // Categorías disponibles
  const categorias = [
    "Aceites y Lubricantes",
    "Afinaciones",
    "Reparaciones de Motor",
    "Suspensión y Dirección",
    "Accesorios y Partes de Colisión",
    "Partes Eléctricas",
    "Sistema Propulsion",
    "Sistema Enfriamiento"
  ];

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setBusquedaGeneral("");
    setFiltroCategoria("");
    setFiltroRangoPrecio(["", ""]);
    setFiltroMarca("");
    setFiltroModelo("");
    setFiltroAnio("");
    setFiltroStock("");
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
          // 👇 Aquí agregas el log para ver si llegan los recomendados
    console.log("Respuesta completa (comprarAhora):", data);
    console.log("Recomendados:", data.recomendados || data.recommendations || []);

    if (data.recomendados) {
  setRecomendaciones(data.recomendados); // 👈 Guardar en contexto
}
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

  const agregarAlCarrito = async (productId, e) => {
    e?.stopPropagation(); // Detiene la propagación si el evento existe

    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) router.push("/login");
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
      console.log("Respuesta completa:", data);
      if (data.recomendados) {
  setRecomendaciones(data.recomendados); // 👈 Guardar en contexto
}

      if (!res.ok) throw new Error(data.message || "Error al agregar");
      
      console.log("Respuesta completa:", data);
      console.log(data.recomendations);

      refreshCart();
      Swal.fire("Agregado", "Producto agregado al carrito", "success");
    } catch (err) {
      console.error("Error al agregar:", err);
      Swal.fire("Error", err.message, "error");
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
        background: theme === 'dark' ? '#1f2937' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
      });

      if (isConfirmed) {
        router.push('/login');
      }
      return;
    }

    setIsAddingToFavorites(true);
    try {
      // 1. Actualización optimista del estado local
      setProductos(prev => prev.map(p =>
        p.id === productId ? { ...p, esFavorito: !p.esFavorito } : p
      ));

      // 2. Enviar petición al servidor
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/favoritos/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` // Opcional para mayor seguridad
        },
        credentials: "include",
        body: JSON.stringify({
          productId: Number(productId),
          userId: user.id // Asegurar que el usuario es correcto
        }),
      });

      // 3. Manejar respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la solicitud");
      }

      const { isFavorite } = await response.json();

      // 4. Sincronización final con el servidor
      setProductos(prev => prev.map(p =>
        p.id === productId ? { ...p, esFavorito: isFavorite } : p
      ));

      // 5. Actualizar contador global
      refreshFavorites();

      // 6. Feedback visual contextual
      await Swal.fire({
        position: 'top-end',
        icon: isFavorite ? 'success' : 'info',
        title: isFavorite ? 'Agregado a Favoritos' : 'Eliminado de Favoritos',
        text: isFavorite ? 'El producto está en tus favoritos' : 'Producto removido',
        showConfirmButton: false,
        timer: 2000,
        background: theme === 'dark' ? '#1f2937' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
      });

    } catch (error) {
      console.error("Error en toggleFavorito:", error);

      // Revertir cambios en caso de error
      setProductos(prev => prev.map(p =>
        p.id === productId ? { ...p, esFavorito: !p.esFavorito } : p
      ));

      await Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo actualizar tus favoritos',
        icon: 'error',
        background: theme === 'dark' ? '#1f2937' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
      });
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  return (
    <div
      className={`min-h-screen py-8 pt-20 transition-colors ${theme === "dark"
        ? "bg-gray-900 text-gray-100"
        : "bg-gray-50 text-gray-900"
        }`}
    >
      <div className="container px-4 mx-auto">
        {/* Migajas de pan */}
        <Breadcrumbs pages={breadcrumbsPages} />

        {/* Encabezado */}
        <div
          className={`p-6 rounded-xl shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
          <h1 className="mb-2 text-3xl font-bold text-center">
            Nuestro Catálogo de Productos
          </h1>
          <p className="text-center text-gray-500">
            Encuentra las mejores refacciones para tu vehículo
          </p>
        </div>

        {/* Filtros móviles */}
        <div className="mb-6 md:hidden">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-between ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
          >
            <span className="flex items-center">
              <FiFilter className="mr-2" /> Filtros
            </span>
            {mobileFiltersOpen ? (
              <FaChevronDown className="transform rotate-180" />
            ) : (
              <FaChevronDown />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Filtros en la izquierda */}
          <div
            className={`w-full md:w-1/4 ${mobileFiltersOpen ? "block" : "hidden md:block"
              }`}
          >
            <div
              className={`shadow-lg rounded-lg overflow-hidden p-6 mb-8 ${theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-900"
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center text-xl font-bold">
                  <FiFilter className="mr-2" /> Filtros
                </h2>
                <button
                  onClick={limpiarFiltros}
                  className={`text-sm ${theme === "dark"
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-green-600 hover:text-green-500"
                    }`}
                >
                  Limpiar todo
                </button>
              </div>

              {/* Buscador general */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-medium">
                  <FiSearch className="mr-2" /> Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nombre, descripción..."
                  value={busquedaGeneral}
                  onChange={(e) => setBusquedaGeneral(e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                    : "border-gray-300 placeholder-gray-500"
                    }`}
                />
              </div>

              {/* Filtro por categoría */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-medium">
                  <FiTag className="mr-2" /> Categoría
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "border-gray-300"
                    }`}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por rango de precio */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-medium">
                  <FiDollarSign className="mr-2" /> Rango de Precio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-sm text-gray-500">
                      Mínimo
                    </label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={filtroRangoPrecio[0]}
                      onChange={(e) =>
                        setFiltroRangoPrecio([
                          e.target.value,
                          filtroRangoPrecio[1],
                        ])
                      }
                      className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${theme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "border-gray-300"
                        }`}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-gray-500">
                      Máximo
                    </label>
                    <input
                      type="number"
                      placeholder="$9999"
                      value={filtroRangoPrecio[1]}
                      onChange={(e) =>
                        setFiltroRangoPrecio([
                          filtroRangoPrecio[0],
                          e.target.value,
                        ])
                      }
                      className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${theme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "border-gray-300"
                        }`}
                    />
                  </div>
                </div>
              </div>

              {/* Filtro por marca */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-medium">
                  <FaCar className="mr-2" /> Marca
                </label>
                <input
                  type="text"
                  placeholder="Ej. Toyota"
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "border-gray-300"
                    }`}
                />
              </div>

              {/* Filtro por modelo */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-medium">
                  <FiTruck className="mr-2" /> Modelo
                </label>
                <input
                  type="text"
                  placeholder="Ej. Corolla"
                  value={filtroModelo}
                  onChange={(e) => setFiltroModelo(e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "border-gray-300"
                    }`}
                />
              </div>

              {/* Filtro por año */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-medium">
                  <FaCalendarAlt className="mr-2" /> Año
                </label>
                <input
                  type="number"
                  placeholder="Ej. 2020"
                  value={filtroAnio}
                  onChange={(e) => setFiltroAnio(e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "border-gray-300"
                    }`}
                />
              </div>

              {/* Filtro por stock */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-medium">
                  <FaBoxOpen className="mr-2" /> Stock Mínimo
                </label>
                <input
                  type="number"
                  placeholder="Cantidad mínima"
                  value={filtroStock}
                  onChange={(e) => setFiltroStock(e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "border-gray-300"
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Lista de productos en la derecha */}
          <div className="w-full md:w-3/4">
            {/* Resumen de filtros */}
            <div
              className={`p-4 rounded-lg mb-6 flex flex-wrap items-center gap-2 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
            >
              <span className="text-sm font-medium">Filtros aplicados:</span>

              {busquedaGeneral && (
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-white"
                    }`}
                >
                  <FiSearch className="mr-1" /> &quot;{busquedaGeneral}&quot;
                </span>
              )}

              {filtroCategoria && (
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-white"
                    }`}
                >
                  <FiTag className="mr-1" /> {filtroCategoria}
                </span>
              )}

              {Array.isArray(filtroRangoPrecio) &&
                (filtroRangoPrecio[0] || filtroRangoPrecio[1]) && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-white"
                      }`}
                  >
                    <FiDollarSign className="mr-1" />
                    {filtroRangoPrecio[0] ? `$${filtroRangoPrecio[0]}` : "$0"} -{" "}
                    {filtroRangoPrecio[1] ? `$${filtroRangoPrecio[1]}` : "∞"}
                  </span>
                )}


              {filtroMarca && (
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-white"
                    }`}
                >
                  <FaCar className="mr-1" /> {filtroMarca}
                </span>
              )}

              {filtroStock && (
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-white"
                    }`}
                >
                  <FaBoxOpen className="mr-1" /> Mín. {filtroStock}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div
                className={`p-4 rounded-lg text-center ${theme === "dark"
                  ? "bg-red-900/50 text-red-300"
                  : "bg-red-100 text-red-800"
                  }`}
              >
                {error}
              </div>
            ) : productos.length === 0 ? (
              <div
                className={`p-8 rounded-lg text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
              >
                <div className="mb-4 text-5xl">🔍</div>
                <h3 className="mb-2 text-xl font-bold">
                  No se encontraron productos
                </h3>
                <p
                  className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  No hay productos que coincidan con tus criterios de búsqueda
                </p>
                <button
                  onClick={limpiarFiltros}
                  className={`px-6 py-2 rounded-lg ${theme === "dark"
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-green-500 hover:bg-green-400"
                    } text-white`}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {productos.map((producto) => (
                    <div
                      key={producto.id}
                      className={`relative rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
                    >
                      {/* Contenido principal clickeable */}
                      <div
                        className="cursor-pointer"
                        onClick={() => router.push(`/producto/${producto.id}`)}
                        role="button"
                        tabIndex="0"
                        aria-label={`Ver detalles de ${producto.name}`}
                        onKeyDown={(e) => e.key === 'Enter' && router.push(`/producto/${producto.id}`)}
                      >
                        {/* Imagen del producto */}
                        <div className="relative bg-gray-100 h-60">
                          {producto.images.length > 0 ? (
                            <Image
                              src={producto.images[0].url}
                              alt={producto.name}
                              fill
                              className="object-cover"
                              unoptimized={true}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                              <span className={`text-lg ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                Sin imagen
                              </span>
                            </div>
                          )}
                          {/* Badge de stock */}
                          <div className="absolute top-2 right-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${producto.stock > 0
                                ? theme === "dark"
                                  ? "bg-green-800 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : theme === "dark"
                                  ? "bg-red-800 text-red-300"
                                  : "bg-red-100 text-red-800"
                                }`}
                            >
                              {producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado"}
                            </span>
                          </div>
                        </div>

                        {/* Contenido de la tarjeta */}
                        <div className="p-4">
                          <h2 className="mb-1 text-lg font-bold line-clamp-1">
                            {producto.name}
                          </h2>
                          <p className={`text-sm mb-3 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {producto.description}
                          </p>

                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-xl font-bold">
                                ${(producto.price * (1 - producto.discount / 100)).toFixed(2)}
                              </p>
                              {producto.discount > 0 && (
                                <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                                  <span className="line-through">
                                    ${producto.price.toFixed(2)}
                                  </span>{" "}
                                  ({producto.discount}% OFF)
                                </p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                              {producto.category}
                            </span>
                          </div>

                          {/* Compatibilidades */}
                          <div className="mb-4">
                            <p className="mb-1 text-sm font-medium">Compatibilidad:</p>
                            <div className="flex flex-wrap gap-1">
                              {producto.compatibilities.slice(0, 3).map((comp, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 rounded-full text-xs ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                                >
                                  {comp.make} {comp.model}
                                </span>
                              ))}
                              {producto.compatibilities.length > 3 && (
                                <span className={`px-2 py-1 rounded-full text-xs ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                                  +{producto.compatibilities.length - 3} más
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción - DEBEN estar FUERA del div clickeable */}
                      <div className="px-4 pb-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              comprarAhora(producto.id, e);
                            }}
                            disabled={isAddingToCart || producto.stock <= 0}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${producto.stock <= 0
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
                              agregarAlCarrito(producto.id, e);
                            }}
                            disabled={isAddingToCart || producto.stock <= 0}
                            className={`p-2 rounded-lg flex items-center justify-center ${producto.stock <= 0
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorito(producto.id, e);
                            }}
                            disabled={isAddingToFavorites}
                            className={`
                                p-2 rounded-lg flex items-center justify-center
                                transition-colors duration-200
                                ${producto.esFavorito
                                  ? "text-red-500 hover:text-red-600"
                                  : theme === "dark"
                                  ? "text-gray-300 hover:text-red-400"
                                  : "text-gray-500 hover:text-red-500"
                              }
                              ${isAddingToFavorites ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            `}
                            title={producto.esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
                            aria-label={producto.esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
                          >
                            {isAddingToFavorites ? (
                              <svg
                                className="w-5 h-5 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FaHeart
                                className={`
                                  ${producto.esFavorito ? "fill-red-500" : "fill-transparent"}
                                  stroke-current
                                  stroke-[3px]
                                  ${theme === "dark" ? "text-gray-300" : "text-gray-500"}
                                  transition-all duration-200
                                group-hover:text-red-500
                                  ${producto.esFavorito ? "scale-110" : "scale-100"}
                                  `}
                                size={20}
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación mejorada */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() =>
                      cambiarPagina(Math.max(1, paginacion.paginaActual - 1))
                    }
                    disabled={paginacion.paginaActual === 1}
                    className={`flex items-center px-4 py-2 rounded-lg ${paginacion.paginaActual === 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      } ${theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    <IoMdArrowRoundBack className="mr-2" /> Anterior
                  </button>

                  <div className="flex items-center">
                    <span className="mx-4">
                      Página {paginacion.paginaActual} de{" "}
                      {paginacion.totalPaginas}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      cambiarPagina(
                        Math.min(
                          paginacion.totalPaginas,
                          paginacion.paginaActual + 1
                        )
                      )
                    }
                    disabled={
                      paginacion.paginaActual === paginacion.totalPaginas
                    }
                    className={`flex items-center px-4 py-2 rounded-lg ${paginacion.paginaActual === paginacion.totalPaginas
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      } ${theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    Siguiente <IoMdArrowRoundForward className="ml-2" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;
