"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";

function ProductosPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [productos, setProductos] = useState([]);
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [filtroRating, setFiltroRating] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener todos los productos al cargar la página
  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/productos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        } else {
          throw new Error("Error al obtener los productos");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar los productos");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProductos();
    }
  }, [isAuthenticated]);

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const coincideConBusquedaGeneral =
      busquedaGeneral === "" ||
      producto.name.toLowerCase().includes(busquedaGeneral.toLowerCase()) ||
      producto.description.toLowerCase().includes(busquedaGeneral.toLowerCase()) ||
      producto.category.toLowerCase().includes(busquedaGeneral.toLowerCase());

    return (
      coincideConBusquedaGeneral &&
      (filtroCategoria === "" || producto.category === filtroCategoria) &&
      (filtroPrecioMin === "" || producto.price >= parseFloat(filtroPrecioMin)) &&
      (filtroPrecioMax === "" || producto.price <= parseFloat(filtroPrecioMax)) &&
      (filtroRating === "" || producto.rating >= parseFloat(filtroRating))
    );
  });

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Productos</h1>

      {/* Buscador general */}
      <div
        className={`shadow-md rounded-lg overflow-hidden p-6 mb-8 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Buscar Productos</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busquedaGeneral}
            onChange={(e) => setBusquedaGeneral(e.target.value)}
            className={`w-full border p-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "border-gray-300"
            }`}
          />
          <button
            className={`ml-2 p-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div
        className={`shadow-md rounded-lg overflow-hidden p-6 mb-8 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Filtrar Productos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por categoría */}
          <div>
            <label className="block mb-2">Categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className={`w-full border p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "border-gray-300"
              }`}
            >
              <option value="">Todas</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Ropa">Ropa</option>
              <option value="Hogar">Hogar</option>
              <option value="Juguetes">Juguetes</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          {/* Filtro por precio mínimo */}
          <div>
            <label className="block mb-2">Precio Mínimo</label>
            <input
              type="number"
              placeholder="Mínimo"
              value={filtroPrecioMin}
              onChange={(e) => setFiltroPrecioMin(e.target.value)}
              className={`w-full border p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "border-gray-300"
              }`}
            />
          </div>

          {/* Filtro por precio máximo */}
          <div>
            <label className="block mb-2">Precio Máximo</label>
            <input
              type="number"
              placeholder="Máximo"
              value={filtroPrecioMax}
              onChange={(e) => setFiltroPrecioMax(e.target.value)}
              className={`w-full border p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "border-gray-300"
              }`}
            />
          </div>

          {/* Filtro por rating */}
          <div>
            <label className="block mb-2">Rating Mínimo</label>
            <input
              type="number"
              placeholder="Rating mínimo"
              value={filtroRating}
              onChange={(e) => setFiltroRating(e.target.value)}
              className={`w-full border p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "border-gray-300"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      {isLoading ? (
        <p className="text-center">Cargando productos...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((producto) => (
            <div
              key={producto._id}
              className={`shadow-md rounded-lg overflow-hidden ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-900"
              }`}
            >
              <img
                src={producto.image}
                alt={producto.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{producto.name}</h2>
                <p className="text-sm mb-2">{producto.description}</p>
                <p className="text-lg font-bold">${producto.price}</p>
                <p className="text-sm">Categoría: {producto.category}</p>
                <p className="text-sm">Stock: {producto.stock}</p>
                <p className="text-sm">Rating: {producto.rating}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductosPage;