"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaShoppingCart,
  FaBars,
  FaFileInvoice,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaBoxes,
  FaTags,
  FaInfoCircle,
  FaPhone,
  FaTruck,
  FaSignInAlt,
  FaUserPlus,
  FaHeart,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useLogo } from "../context/LogoContext";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../app/config/config";
import { useCart } from "../context/CartContext";
import { useFavorites } from '../context/FavoritesContext';

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentsMenuOpen, setDocumentsMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { logoUrl } = useLogo();
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false);
        setDocumentsMenuOpen(false);
        setProductsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      router.push(`/ventaProducto?search=${encodeURIComponent(searchQuery)}`);
      // Resetear el estado de búsqueda después de un pequeño delay
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  // Navegación principal con íconos
  const mainNavItems = [
    { name: "Inicio", path: "/", icon: FaHome },
    { name: "Catálogo", path: "/ventaProducto", icon: FaBoxes },
    { name: "Marcas", path: "/marcas", icon: FaTags },
    { name: "Ofertas", path: "/ofertas", icon: FaTags },
    { name: "Sobre Nosotros", path: "/nosotros", icon: FaInfoCircle },
    { name: "Contacto", path: "/contacto", icon: FaPhone },
    { name: "Seguimiento", path: "/seguimiento", icon: FaTruck },
  ];

  return (
    <>
      {/* Barra superior promocional mejorada */}
      <div
        className={`w-full py-3 overflow-hidden relative ${theme === "dark"
          ? "bg-gray-800"
          : "bg-gradient-to-r from-green-600 to-green-700"
          }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 opacity-10 ${theme === "dark"
              ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTAgMEwxMDAgMTAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]"
              : "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZD0iTTAgMEwxMDAgMTAwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]"
              }`}
          ></div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden">
          <div className="flex items-center space-x-16 whitespace-nowrap animate-marquee min-w-max w-fit">
            {/* Mensajes promocionales con íconos */}
            {[
              { icon: "check", text: "ENVÍO GRATIS EN COMPRAS MAYORES A $500" },
              {
                icon: "fire",
                text: "PROMOCIONES ESPECIALES EN REFACCIONES ORIGINALES",
              },
              {
                icon: "shield",
                text: "GARANTÍA EN TODAS NUESTRAS PIEZAS AUTOMOTRICES",
              },
              { icon: "check", text: "ENVÍO GRATIS EN COMPRAS MAYORES A $500" },
              {
                icon: "fire",
                text: "PROMOCIONES ESPECIALES EN REFACCIONES ORIGINALES",
              },
              {
                icon: "shield",
                text: "GARANTÍA EN TODAS NUESTRAS PIEZAS AUTOMOTRICES",
              },
              { icon: "check", text: "ENVÍO GRATIS EN COMPRAS MAYORES A $500" },
              {
                icon: "fire",
                text: "PROMOCIONES ESPECIALES EN REFACCIONES ORIGINALES",
              },
              {
                icon: "shield",
                text: "GARANTÍA EN TODAS NUESTRAS PIEZAS AUTOMOTRICES",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                {item.icon === "check" && (
                  <svg
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {item.icon === "fire" && (
                  <svg
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {item.icon === "shield" && (
                  <svg
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                      clipRule="evenodd"
                    />
                    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                  </svg>
                )}
                <span className="text-sm font-semibold tracking-wide text-white">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          background: #f5f5f5;
          padding: 10px 0;
        }

        .marquee-track {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        .marquee-text {
          padding-right: 2rem;
          font-size: 1.2rem;
          white-space: nowrap;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-55%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Navbar principal */}
      <nav
        className={`sticky top-0 w-full z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md`}
      >
        <div className="container px-4 mx-auto">
          {/* Primera fila - Logo, búsqueda y acciones */}
          <div className="flex items-center justify-between py-3">
            {/* Logo y menú hamburguesa móvil */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className={`mr-4 p-2 rounded-full md:hidden ${theme === "dark"
                  ? "text-gray-200 hover:bg-gray-700 hover:text-yellow-400"
                  : "text-gray-700 hover:bg-gray-100 hover:text-yellow-600"
                  }`}
              >
                <FaBars className="w-5 h-5" />
              </button>

              <Link href="/" className="flex items-center">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo de la tienda"
                    width={120}
                    height={50}
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-[120px] h-[50px] bg-gray-300 animate-pulse" />
                )}
              </Link>
            </div>

            {/* Búsqueda - Solo en desktop */}
            <div className="items-center flex-1 hidden max-w-2xl mx-6 md:flex">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar producto, marca, categoría..."
                  className={`w-full px-4 py-2 rounded-l-lg border ${theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400"
                    : "border-gray-300 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className={`px-4 py-2 rounded-r-lg flex items-center ${theme === "dark"
                    ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                    } ${isSearching ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {isSearching ? (
                    <svg
                      className="w-5 h-5 mr-2 -ml-1 text-gray-900 animate-spin"
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
                    <FiSearch className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-4">
              {/* Botón de tema */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full hidden sm:inline-flex ${theme === "dark"
                  ? "text-yellow-400 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
                aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"
                  }`}
              >
                {theme === "light" ? (
                  <FaMoon className="w-5 h-5" />
                ) : (
                  <FaSun className="w-5 h-5" />
                )}
              </button>


              {/* Favoritos con indicador */}
              <Link
                href="/favoritos"
                className={`p-2 rounded-full relative ${theme === "dark"
                    ? "text-gray-200 hover:bg-gray-700 hover:text-yellow-400"
                    : "text-gray-700 hover:bg-gray-100 hover:text-yellow-600"
                  }`}
                aria-label={`Favoritos (${favoritesCount} items)`}
              >
                <FaHeart
                  className="w-5 h-5"
                  style={{
                    fill: favoritesCount > 0 ? (theme === "dark" ? "#fbbf24" : "#d97706") : 'none',
                    stroke: 'currentColor',
                    strokeWidth: '30px'
                  }}
                />
                {favoritesCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ${theme === "dark"
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-yellow-600 text-white"
                      }`}
                  >
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Carrito con indicador */}
              <Link
                href="/carrito"
                className={`p-2 rounded-full relative ${theme === "dark"
                  ? "text-gray-200 hover:bg-gray-700 hover:text-yellow-400"
                  : "text-gray-700 hover:bg-gray-100 hover:text-yellow-600"
                  }`}
                aria-label="Carrito de compras"
              >
                <FaShoppingCart className="w-5 h-5" />
                {/* Indicador de items en carrito - ahora con el contador real */}
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ${theme === "dark"
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-yellow-600 text-white"
                      }`}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Facturación (solo visible para usuarios autenticados) */}
              {(isAuthenticated || user?.role === "admin") && (
                <Link
                  href="/cotizador"
                  className={`p-2 rounded-full ${theme === "dark"
                    ? "text-gray-200 hover:bg-gray-700 hover:text-yellow-400"
                    : "text-gray-700 hover:bg-gray-100 hover:text-yellow-600"
                    }`}
                  aria-label="Facturación"
                >
                  <FaFileInvoice className="w-5 h-5" />
                </Link>
              )}

              {/* Usuario con tooltip */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className={`p-2 rounded-full group relative ${theme === "dark"
                    ? "text-gray-200 hover:bg-gray-700 hover:text-yellow-400"
                    : "text-gray-700 hover:bg-gray-100 hover:text-yellow-600"
                    }`}
                  aria-label="Menú de usuario"
                >
                  <FaUser className="w-5 h-5" />
                  {/* Tooltip para indicar que es clickeable */}
                  <span
                    className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded ${theme === "dark"
                      ? "bg-gray-700 text-yellow-400"
                      : "bg-gray-200 text-gray-700"
                      } opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                  >
                    Mi cuenta
                  </span>
                </button>

                {/* Dropdown de usuario */}
                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg py-2 z-50 ${theme === "dark"
                      ? "bg-gray-800 text-gray-200 border border-gray-700"
                      : "bg-white text-gray-700 border border-gray-200"
                      }`}
                  >
                    {!isAuthenticated ? (
                      <div className="p-4">
                        <p className="mb-3 text-sm">Accede a tu cuenta</p>
                        <div className="flex flex-col space-y-2">
                          <Link href="/login">
                            <button
                              className={`w-full py-2 rounded-lg text-sm flex items-center justify-center ${theme === "dark"
                                ? "border border-gray-600 hover:bg-gray-700"
                                : "border border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                              <FaSignInAlt className="mr-2" /> Iniciar Sesión
                            </button>
                          </Link>
                          <Link href="/register">
                            <button className="flex items-center justify-center w-full py-2 text-sm text-gray-900 bg-yellow-500 rounded-lg hover:bg-yellow-600">
                              <FaUserPlus className="mr-2" /> Crear Cuenta
                            </button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center mb-3 space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                              }`}
                          >
                            <FaUser className="text-lg" />
                          </div>
                          <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-xs opacity-75">{user?.email}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link href="/profileuser">
                            <p
                              className={`flex items-center py-2 px-3 rounded ${theme === "dark"
                                ? "hover:bg-gray-700 hover:text-yellow-400"
                                : "hover:bg-gray-100 hover:text-yellow-600"
                                }`}
                            >
                              <FaUser className="mr-2 text-sm" /> Mi perfil
                            </p>
                          </Link>

                          {user?.role === "admin" && (
                            <>
                              {/* Menú de Administrador */}
                              <div
                                className={`py-2 px-3 rounded cursor-pointer ${theme === "dark"
                                  ? "hover:bg-gray-700 hover:text-yellow-400"
                                  : "hover:bg-gray-100 hover:text-yellow-600"
                                  }`}
                                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <FaUser className="mr-2 text-sm" />{" "}
                                    Administración
                                  </span>
                                  {adminMenuOpen ? (
                                    <FaChevronUp size={12} />
                                  ) : (
                                    <FaChevronDown size={12} />
                                  )}
                                </div>
                                {adminMenuOpen && (
                                  <div className="mt-2 ml-4 space-y-2">
                                    <Link href="/adminDashboard">
                                      <p
                                        className={`py-1 px-2 rounded flex items-center ${theme === "dark"
                                          ? "hover:bg-gray-700 hover:text-yellow-400"
                                          : "hover:bg-gray-100 hover:text-yellow-600"
                                          }`}
                                      >
                                        <span className="ml-4">Dashboard</span>
                                      </p>
                                    </Link>
                                    <Link href="/adminUsuarios">
                                      <p
                                        className={`py-1 px-2 rounded flex items-center ${theme === "dark"
                                          ? "hover:bg-gray-700 hover:text-yellow-400"
                                          : "hover:bg-gray-100 hover:text-yellow-600"
                                          }`}
                                      >
                                        <span className="ml-4">Usuarios</span>
                                      </p>
                                    </Link>
                                  </div>
                                )}
                              </div>

                              {/* Menú de Documentos */}
                              <div
                                className={`py-2 px-3 rounded cursor-pointer ${theme === "dark"
                                  ? "hover:bg-gray-700 hover:text-yellow-400"
                                  : "hover:bg-gray-100 hover:text-yellow-600"
                                  }`}
                                onClick={() =>
                                  setDocumentsMenuOpen(!documentsMenuOpen)
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <FaFileInvoice className="mr-2 text-sm" />{" "}
                                    Documentos
                                  </span>
                                  {documentsMenuOpen ? (
                                    <FaChevronUp size={12} />
                                  ) : (
                                    <FaChevronDown size={12} />
                                  )}
                                </div>
                                {documentsMenuOpen && (
                                  <div className="mt-2 ml-4 space-y-2">
                                    {[
                                      {
                                        path: "/adminDocumentos",
                                        name: "Políticas",
                                      },
                                      {
                                        path: "/adminDocumentos2",
                                        name: "Términos",
                                      },
                                      {
                                        path: "/adminDocumentos3",
                                        name: "Deslinde",
                                      },
                                      { path: "/adminLogo", name: "Logo" },
                                    ].map((doc, i) => (
                                      <Link key={i} href={doc.path}>
                                        <p
                                          className={`py-1 px-2 rounded flex items-center ${theme === "dark"
                                            ? "hover:bg-gray-700 hover:text-yellow-400"
                                            : "hover:bg-gray-100 hover:text-yellow-600"
                                            }`}
                                        >
                                          <span className="ml-4">
                                            {doc.name}
                                          </span>
                                        </p>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Menú de Productos */}
                              <div
                                className={`py-2 px-3 rounded cursor-pointer ${theme === "dark"
                                  ? "hover:bg-gray-700 hover:text-yellow-400"
                                  : "hover:bg-gray-100 hover:text-yellow-600"
                                  }`}
                                onClick={() =>
                                  setProductsMenuOpen(!productsMenuOpen)
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <FaBoxes className="mr-2 text-sm" />{" "}
                                    Productos
                                  </span>
                                  {productsMenuOpen ? (
                                    <FaChevronUp size={12} />
                                  ) : (
                                    <FaChevronDown size={12} />
                                  )}
                                </div>
                                {productsMenuOpen && (
                                  <div className="mt-2 ml-4 space-y-2">
                                    <Link href="/adminProductos">
                                      <p
                                        className={`py-1 px-2 rounded flex items-center ${theme === "dark"
                                          ? "hover:bg-gray-700 hover:text-yellow-400"
                                          : "hover:bg-gray-100 hover:text-yellow-600"
                                          }`}
                                      >
                                        <span className="ml-4">
                                          Todos los Productos
                                        </span>
                                      </p>
                                    </Link>
                                    <Link href="/adminDashboardProductos">
                                      <p
                                        className={`py-1 px-2 rounded flex items-center ${theme === "dark"
                                          ? "hover:bg-gray-700 hover:text-yellow-400"
                                          : "hover:bg-gray-100 hover:text-yellow-600"
                                          }`}
                                      >
                                        <span className="ml-4">
                                          Estadísticas
                                        </span>
                                      </p>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </>
                          )}

                          <button
                            onClick={handleLogout}
                            className={`w-full text-left py-2 px-3 rounded flex items-center ${theme === "dark"
                              ? "hover:bg-gray-700 text-red-400 hover:text-red-300"
                              : "hover:bg-gray-100 text-red-600 hover:text-red-500"
                              }`}
                          >
                            <FaSignInAlt className="mr-2 transform rotate-180" />{" "}
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Segunda fila - Navegación principal */}
          <div
            className={`hidden md:flex items-center justify-center py-2 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <div className="flex space-x-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`py-2 px-1 text-sm font-medium flex items-center ${theme === "dark"
                    ? "text-gray-300 hover:text-yellow-400"
                    : "text-gray-700 hover:text-yellow-600"
                    }`}
                >
                  <item.icon className="mr-2 text-sm" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden py-4 fixed inset-0 bg-black bg-opacity-50 z-40 ${theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}
              onClick={toggleMobileMenu}
            >
              <div
                className={`w-4/5 h-full overflow-y-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4">
                  {/* Búsqueda en móvil */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex w-full">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar producto..."
                        className={`w-full px-4 py-2 rounded-l-lg border ${theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                          : "border-gray-300 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                      />
                      <button
                        type="submit"
                        disabled={isSearching}
                        className={`px-4 py-2 rounded-r-lg ${theme === "dark"
                          ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                          } ${isSearching ? "opacity-75 cursor-not-allowed" : ""
                          }`}
                      >
                        <FiSearch className="w-5 h-5" />
                      </button>
                    </div>
                  </form>

                  {/* Navegación en móvil */}
                  <div className="space-y-1">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`py-3 px-4 rounded flex items-center ${theme === "dark"
                          ? "hover:bg-gray-700 hover:text-yellow-400"
                          : "hover:bg-gray-100 hover:text-yellow-600"
                          }`}
                        onClick={toggleMobileMenu}
                      >
                        <item.icon className="mr-3" />
                        {item.name}
                      </Link>
                    ))}

                    {/* Opciones de cuenta */}
                    <div className="pt-4 mt-4 border-t">
                      {!isAuthenticated ? (
                        <>
                          <Link href="/login">
                            <div
                              className={`py-3 px-4 rounded flex items-center ${theme === "dark"
                                ? "hover:bg-gray-700 hover:text-yellow-400"
                                : "hover:bg-gray-100 hover:text-yellow-600"
                                }`}
                              onClick={toggleMobileMenu}
                            >
                              <FaSignInAlt className="mr-3" /> Iniciar Sesión
                            </div>
                          </Link>
                          <Link href="/register">
                            <div
                              className={`py-3 px-4 rounded flex items-center ${theme === "dark"
                                ? "hover:bg-gray-700 hover:text-yellow-400"
                                : "hover:bg-gray-100 hover:text-yellow-600"
                                }`}
                              onClick={toggleMobileMenu}
                            >
                              <FaUserPlus className="mr-3" /> Crear Cuenta
                            </div>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/profileuser">
                            <div
                              className={`  py-3 px-4 rounded flex items-center ${theme === "dark"
                                ? "hover:bg-gray-700 hover:text-yellow-400"
                                : "hover:bg-gray-100 hover:text-yellow-600"
                                }`}
                              onClick={toggleMobileMenu}
                            >
                              <FaUser className="mr-3" /> Mi Perfil
                            </div>
                          </Link>
                          {user?.role === "admin" && (
                            <>
                              <div className="flex items-center px-4 py-2 font-medium">
                                <FaUser className="mr-3" /> Administración
                              </div>
                              <div className="ml-6 space-y-1">
                                <Link href="/adminDashboard">
                                  <div
                                    className={`py-2 px-4 rounded flex items-center ${theme === "dark"
                                      ? "hover:bg-gray-700 hover:text-yellow-400"
                                      : "hover:bg-gray-100 hover:text-yellow-600"
                                      }`}
                                    onClick={toggleMobileMenu}
                                  >
                                    Dashboard
                                  </div>
                                </Link>
                                <Link href="/adminUsuarios">
                                  <div
                                    className={`py-2 px-4 rounded flex items-center ${theme === "dark"
                                      ? "hover:bg-gray-700 hover:text-yellow-400"
                                      : "hover:bg-gray-100 hover:text-yellow-600"
                                      }`}
                                    onClick={toggleMobileMenu}
                                  >
                                    Usuarios
                                  </div>
                                </Link>
                              </div>
                            </>
                          )}
                          <button
                            onClick={() => {
                              handleLogout();
                              toggleMobileMenu();
                            }}
                            className={`w-full text-left py-3 px-4 rounded flex items-center ${theme === "dark"
                              ? "hover:bg-gray-700 text-red-400 hover:text-red-300"
                              : "hover:bg-gray-100 text-red-600 hover:text-red-500"
                              }`}
                          >
                            <FaSignInAlt className="mr-3 transform rotate-180" />{" "}
                            Cerrar Sesión
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
