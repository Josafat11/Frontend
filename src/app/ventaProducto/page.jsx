"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";

function ProductosPage() {
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
  const [error, setError] = useState("");
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    totalProductos: 0,
  });

  // Captura los parámetros de búsqueda de la URL
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");

  useEffect(() => {
    if (searchTerm) {
      setBusquedaGeneral(searchTerm);
    }
  }, [searchTerm]);

  // Obtener productos al cargar la página o cambiar filtros
  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${CONFIGURACIONES.BASEURL2}/productos?search=${busquedaGeneral}&categoria=${filtroCategoria}&minPrecio=${filtroRangoPrecio[0]}&maxPrecio=${filtroRangoPrecio[1]}&page=${paginacion.paginaActual}&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProductos(data.productos);
          setPaginacion({
            paginaActual: data.paginacion.paginaActual,
            totalPaginas: data.paginacion.totalPaginas,
            totalProductos: data.paginacion.totalProductos,
          });
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

    fetchProductos();
  }, [busquedaGeneral, filtroCategoria, filtroRangoPrecio, paginacion.paginaActual]);

  // Cambiar de página
  const cambiarPagina = (pagina) => {
    setPaginacion((prev) => ({ ...prev, paginaActual: pagina }));
  };

  // Definir las migas de pan
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Productos", path: "/ventaProducto" },
  ];

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Migajas de pan */}
      <Breadcrumbs pages={breadcrumbsPages} />

      <h1 className="text-3xl font-bold text-center mb-8">Productos</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros en la izquierda */}
        <div className="w-full md:w-1/4">
          <div
            className={`shadow-md rounded-lg overflow-hidden p-6 mb-8 ${
              theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Filtrar Productos</h2>

            {/* Buscador general */}
            <div className="mb-6">
              <label className="block mb-2">Buscar</label>
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
            </div>

            {/* Filtro por categoría */}
            <div className="mb-6">
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
                  <option value="">Selecciona una categoría</option>
                  <option value="Aceites y Lubricantes">
                    Aceites y Lubricantes
                  </option>
                  <option value="Afinaciones">Afinaciones</option>
                  <option value="Reparaciones de Motor">
                    Reparaciones de Motor
                  </option>
                  <option value="Suspensión y Dirección">
                    Suspensión y Dirección
                  </option>
                  <option value="Accesorios y Partes de Colisión">
                    Accesorios y Partes de Colisión
                  </option>
                  <option value="Partes Eléctricas">Partes Eléctricas</option>
              </select>
            </div>

            {/* Filtro por rango de precio */}
            <div className="mb-6">
              <label className="block mb-2">Rango de Precio</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filtroRangoPrecio[0]}
                  onChange={(e) =>
                    setFiltroRangoPrecio([e.target.value, filtroRangoPrecio[1]])
                  }
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "border-gray-300"
                  }`}
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filtroRangoPrecio[1]}
                  onChange={(e) =>
                    setFiltroRangoPrecio([filtroRangoPrecio[0], e.target.value])
                  }
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Filtro por marca */}
            <div className="mb-6">
              <label className="block mb-2">Marca</label>
              <input
                type="text"
                placeholder="Marca"
                value={filtroMarca}
                onChange={(e) => setFiltroMarca(e.target.value)}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Filtro por modelo */}
            <div className="mb-6">
              <label className="block mb-2">Modelo</label>
              <input
                type="text"
                placeholder="Modelo"
                value={filtroModelo}
                onChange={(e) => setFiltroModelo(e.target.value)}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Filtro por año */}
            <div className="mb-6">
              <label className="block mb-2">Año</label>
              <input
                type="number"
                placeholder="Año"
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(e.target.value)}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "border-gray-300"
                }`}
              />
            </div>

            {/* Filtro por stock */}
            <div className="mb-6">
              <label className="block mb-2">Stock Mínimo</label>
              <input
                type="number"
                placeholder="Stock mínimo"
                value={filtroStock}
                onChange={(e) => setFiltroStock(e.target.value)}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Lista de productos en la derecha */}
        <div className="w-full md:w-3/4">
          {isLoading ? (
            <p className="text-center">Cargando productos...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    className={`shadow-md rounded-lg overflow-hidden ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-100"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    {producto.images.length > 0 ? (
                      <img
                        src={producto.images[0].url}
                        alt={producto.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Sin imagen</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-xl font-bold mb-2">{producto.name}</h2>
                      <p className="text-sm mb-2">{producto.description}</p>
                      <p className="text-lg font-bold">${producto.price}</p>
                      <p className="text-sm">Categoría: {producto.category}</p>
                      <p className="text-sm">Stock: {producto.stock}</p>
                      <p className="text-sm">Marca: {producto.brand}</p>
                      <p className="text-sm">Compatibilidad:</p>
                      <ul className="text-sm">
                        {producto.compatibilities.map((comp, index) => (
                          <li key={index}>
                            {comp.make} {comp.model} ({comp.year})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              <div className="flex justify-center mt-8">
                {Array.from({ length: paginacion.totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => cambiarPagina(i + 1)}
                    className={`mx-1 px-4 py-2 rounded ${
                      paginacion.paginaActual === i + 1
                        ? "bg-green-600 text-white"
                        : theme === "dark"
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;