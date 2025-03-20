"use client"; // Indicar que es un Client Component

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../context/authContext";
import { CONFIGURACIONES } from "../app/config/config";

function HomePage() {
  const { theme } = useAuth(); // Obtén el valor de theme desde el contexto
  const [productosAleatorios, setProductosAleatorios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener productos aleatorios al cargar la página
  useEffect(() => {
    const fetchProductosAleatorios = async () => {
      try {
        const response = await fetch(
          `${CONFIGURACIONES.BASEURL2}/productos/productos/aleatorios?cantidad=5`,
          {
            method: "GET",
            credentials: "include", // Incluir credenciales si es necesario
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProductosAleatorios(data);
        } else {
          throw new Error("Error al obtener productos aleatorios");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductosAleatorios();
  }, []);

  return (
    <div
      className={`min-h-screen container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Catálogo de Productos</h1>

      {/* Nueva Sección de Selector de Productos */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-900"
        } p-6 rounded-lg mb-8 text-center`}
      >
        <h2 className="text-2xl font-bold mb-4">Encuentra el producto perfecto</h2>
        <p className="mb-4">
          Selecciona las características de tu vehículo para ver opciones específicas.
        </p>
        <button className="bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600 transition duration-300">
          Comienza aquí
        </button>
      </div>

      {/* Catálogo de Productos */}
      {isLoading ? (
        <p className="text-center">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosAleatorios.map((producto) => (
            <div
              key={producto.id}
              className={`${
                theme === "dark" ? "bg-gray-700" : "bg-white"
              } shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300`}
            >
              {producto.images.length > 0 ? (
                <Image
                  src={producto.images[0].url}
                  alt={producto.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{producto.name}</h2>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  } mb-4`}
                >
                  {producto.description}
                </p>
                <p className="text-lg font-bold mb-4">${producto.price}</p>
                <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition duration-300">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;