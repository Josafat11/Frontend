"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs

function ProductosPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [productos, setProductos] = useState([]);
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroRangoPrecio, setFiltroRangoPrecio] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroStock, setFiltroStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Captura el parámetro de búsqueda de la URL
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");

  useEffect(() => {
    if (searchTerm) {
      setBusquedaGeneral(searchTerm);
    }
  }, [searchTerm]);

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

    fetchProductos();
  }, []);

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const coincideConBusquedaGeneral =
      busquedaGeneral === "" ||
      producto.name.toLowerCase().includes(busquedaGeneral.toLowerCase()) ||
      producto.description.toLowerCase().includes(busquedaGeneral.toLowerCase()) ||
      producto.category.toLowerCase().includes(busquedaGeneral.toLowerCase());

    const coincideConCategoria =
      filtroCategoria === "" || producto.category === filtroCategoria;

    const coincideConRangoPrecio =
      filtroRangoPrecio === "" ||
      (filtroRangoPrecio === "hasta400" && producto.price <= 400) ||
      (filtroRangoPrecio === "400a1000" && producto.price > 400 && producto.price <= 1000) ||
      (filtroRangoPrecio === "mas1000" && producto.price > 1000);

    const coincideConMarca =
      filtroMarca === "" ||
      producto.compatibility.some((comp) => comp.make.toLowerCase().includes(filtroMarca.toLowerCase()));

    const coincideConModelo =
      filtroModelo === "" ||
      producto.compatibility.some((comp) => comp.model.toLowerCase().includes(filtroModelo.toLowerCase()));

    const coincideConAnio =
      filtroAnio === "" ||
      producto.compatibility.some((comp) => comp.year === parseInt(filtroAnio));

    const coincideConStock =
      filtroStock === "" || producto.stock >= parseInt(filtroStock);

    return (
      coincideConBusquedaGeneral &&
      coincideConCategoria &&
      coincideConRangoPrecio &&
      coincideConMarca &&
      coincideConModelo &&
      coincideConAnio &&
      coincideConStock
    );
  });

  // Definir las migajas de pan
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Productos", path: null }, // Sin enlace porque es la página actual
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
                <option value="">Todas</option>
                <option value="Motor">Motor</option>
                <option value="Frenos">Frenos</option>
                <option value="Suspensión">Suspensión</option>
                <option value="Transmisión">Transmisión</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Lubricantes">Lubricantes</option>
                <option value="Filtros">Filtros</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Filtro por rango de precio */}
            <div className="mb-6">
              <label className="block mb-2">Rango de Precio</label>
              <select
                value={filtroRangoPrecio}
                onChange={(e) => setFiltroRangoPrecio(e.target.value)}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "border-gray-300"
                }`}
              >
                <option value="">Todos</option>
                <option value="hasta400">Hasta $400</option>
                <option value="400a1000">$400 a $1,000</option>
                <option value="mas1000">Más de $1,000</option>
              </select>
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
                    <p className="text-sm">Marca: {producto.brand}</p>
                    <p className="text-sm">Compatibilidad:</p>
                    <ul className="text-sm">
                      {producto.compatibility.map((comp, index) => (
                        <li key={index}>
                          {comp.make} {comp.model} ({comp.year})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;