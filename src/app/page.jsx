"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../context/authContext";
import { CONFIGURACIONES } from "../app/config/config";
import {
  FiChevronLeft,
  FiPhone,
  FiArrowRight,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiChevronRight,
} from "react-icons/fi";

function HomePage() {
  const { theme } = useAuth();
  const [productosAleatorios, setProductosAleatorios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Categorías populares
  const categoriasPopulares = [
    "Frenos",
    "Suspensión",
    "Motor",
    "Transmisión",
    "Eléctrico",
    "Filtros",
    "Aceites",
    "Carrocería",
  ];

  // Obtener productos aleatorios
  useEffect(() => {
    const fetchProductosAleatorios = async () => {
      try {
        const response = await fetch(
          `${CONFIGURACIONES.BASEURL2}/productos/productos/aleatorios?cantidad=8`,
          {
            method: "GET",
            credentials: "include",
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

  // Manejar el carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === productosAleatorios.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? productosAleatorios.length - 1 : prev - 1
    );
  };

  return (
      <div
        className={`min-h-screen container mx-auto py-8 pt-36 ${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
      
      {/* Banner Promocional Mejorado */}
      <div
        className={`relative rounded-2xl overflow-hidden mb-12 h-96 pt-72 pb-72 md:h-80 lg:h-96 shadow-xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
            : "bg-gradient-to-br from-green-700 via-green-600 to-green-700"
        }`}
      >
        {/* Efecto de partículas sutiles */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMSIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTAiIHI9IjEuNSIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjM1IiBjeT0iNSIgcj0iMSIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iMzAiIHI9IjEiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIi8+PC9zdmc+')]"></div>

        {/* Imagen de fondo de auto/refacción (opcional) */}
        <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full opacity-20 md:opacity-100 bg-[url('/images/car-parts-banner.png')] bg-contain bg-no-repeat bg-right"></div>

        {/* Contenido del banner */}
        <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-left md:p-12 lg:p-16">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold mb-4 ${
              theme === "dark"
                ? "bg-yellow-500 text-gray-900"
                : "bg-yellow-400 text-gray-900"
            }`}
          >
            PROMOCIÓN DE TEMPORADA
          </span>

          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight ${
              theme === "dark" ? "text-white" : "text-white"
            }`}
          >
            Gran <span className="text-yellow-400">Descuento</span> en
            Refacciones
          </h2>

          <p
            className={`text-xl md:text-2xl mb-8 max-w-lg ${
              theme === "dark" ? "text-gray-300" : "text-gray-100"
            }`}
          >
            Hasta <span className="font-bold text-yellow-400">40% OFF</span> en
            piezas seleccionadas para tu vehículo
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                theme === "dark"
                  ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:shadow-lg"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:shadow-lg"
              }`}
            >
              Ver Ofertas
            </button>
          </div>

          {/* Contador de tiempo (opcional) */}
          <div
            className={`mt-8 flex gap-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-200"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-green-800"
                }`}
              >
                03
              </div>
              <span className="mt-1 text-sm">Días</span>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-green-800"
                }`}
              >
                12
              </div>
              <span className="mt-1 text-sm">Horas</span>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-green-800"
                }`}
              >
                45
              </div>
              <span className="mt-1 text-sm">Min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categorías Destacadas */}
      <section className={`px-4 mb-16 rounded-2xl pt-10 pb-14 ${theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
        }`}>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Explora Nuestras Categorías
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Encuentra las mejores piezas para tu vehículo en nuestras categorías
            especializadas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
          {[
            { name: "Motor", icon: "⚙️" },
            { name: "Frenos", icon: "🛑" },
            { name: "Suspensión", icon: "🔄" },
            { name: "Eléctrico", icon: "🔌" },
            { name: "Transmisión", icon: "⏩" },
            { name: "Accesorios", icon: "✨" },
          ].map((categoria, index) => (
            <div
              key={index}
              className={`group p-6 rounded-xl text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50 shadow-md"
              }`}
            >
              <div
                className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 ${
                  theme === "dark"
                    ? "bg-gray-700 group-hover:bg-gray-600"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}
              >
                {categoria.icon}
              </div>
              <h3 className="text-lg font-bold">{categoria.name}</h3>
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                +120 productos
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className={`px-4 mb-16 rounded-2xl pt-10 pb-10 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}>
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <p
              className={`mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Las piezas más vendidas esta semana
            </p>
          </div>
          <button
            className={`mt-4 md:mt-0 px-6 py-3 rounded-full font-medium transition-colors ${
              theme === "dark"
                ? "bg-gray-800 transition-colors hover:bg-yellow-500 hover:font-bold hover:text-gray-800"
                : "bg-white hover:bg-yellow-500 hover:font-bold shadow-sm"
            }`}
          >
            Ver todos los productos <FiArrowRight className="inline ml-2" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productosAleatorios.slice(0, 4).map((producto) => (
                <div
                  key={producto.id}
                  className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    theme === "dark" ? "bg-gray-800" : "bg-white shadow-md"
                  }`}
                >
                  <div className="relative h-60">
                    {producto.images.length > 0 ? (
                      <Image
                        src={producto.images[0].url}
                        alt={producto.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <span
                          className={`${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          Sin imagen
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <button
                        className={`p-2 rounded-full ${
                          theme === "dark"
                            ? "bg-gray-900/80 hover:bg-gray-800"
                            : "bg-white/90 hover:bg-white"
                        }`}
                      >
                        <FiHeart
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold line-clamp-2">
                        {producto.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          theme === "dark"
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        En stock
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {producto.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">${producto.price}</p>
                        {producto.originalPrice && (
                          <p
                            className={`text-sm line-through ${
                              theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            ${producto.originalPrice}
                          </p>
                        )}
                      </div>
                      <button
                        className={`p-3 rounded-full ${
                          theme === "dark"
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white`}
                      >
                        <FiShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Banner Secundario */}
      <div
        className={`rounded-3xl overflow-hidden mb-16 h-64 md:h-80 ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-800 to-gray-700"
            : "bg-gradient-to-r from-green-800 to-green-700"
        }`}
      >
        <div className="relative flex items-center h-full">
          <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full bg-[url('/images/car-parts-bg.png')] bg-contain bg-no-repeat bg-right opacity-30 md:opacity-100"></div>
          <div className="relative z-10 max-w-2xl p-8 md:p-12">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-white"
              }`}
            >
              ¿Necesitas asesoría especializada?
            </h2>
            <p
              className={`text-lg mb-6 ${
                theme === "dark" ? "text-gray-300" : "text-gray-100"
              }`}
            >
              Nuestros expertos te ayudarán a encontrar la pieza perfecta para
              tu vehículo
            </p>
            <button
              className={`px-8 py-3 rounded-full font-bold flex items-center transition-colors ${
                theme === "dark"
                  ? "bg-yellow-500 text-gray-900 transition-colors hover:bg-yellow-400"
                  : "bg-yellow-400 text-gray-900 transition-colors hover:bg-yellow-500"
              }`}
            >
              <FiPhone className="mr-2" /> Contactar a un asesor
            </button>
          </div>
        </div>
      </div>

      {/* Testimonios */}
      <section className={`px-4 mb-16 pt-10 pb-16 rounded-2xl ${
        theme === "dark"
          ? "bg-gradient-to-tr from-gray-800 to-gray-700 "
          : "bg-gradient-to-tr from-gray-200 text-gray-900"
        }`} >
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Lo que dicen nuestros clientes
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Experiencias reales de quienes confían en nuestros productos y
            servicio
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              name: "Juan Pérez",
              role: "Mecánico profesional",
              comment:
                "La calidad de las refacciones es excepcional, siempre encuentro lo que necesito para mis clientes.",
              rating: 5,
            },
            {
              name: "María González",
              role: "Dueña de taller",
              comment:
                "Excelente servicio al cliente y entrega rápida. Mis clientes quedan satisfechos con las piezas.",
              rating: 4,
            },
            {
              name: "Carlos Rodríguez",
              role: "Aficionado a los autos",
              comment:
                "He comprado varias piezas para restaurar mi auto clásico y todas han sido de primera calidad.",
              rating: 5,
            },
          ].map((testimonio, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow-md"
              }`}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonio.rating
                        ? "text-yellow-400"
                        : theme === "dark"
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                &quot;{testimonio.comment}&quot;
              </p>
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <FiUser
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <h4 className="font-bold">{testimonio.name}</h4>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {testimonio.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
