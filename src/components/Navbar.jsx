"use client"; // Indicar que es un Client Component

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
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import logo from "../assets/munoz-logo.png";
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación
import { useRouter } from "next/navigation"; // Importa el hook de useRouter para la redirección

function Navbar() {
  const { isAuthenticated, user, logout, theme, toggleTheme } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [documentAdminMenuOpen, setDocumentAdminMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const toggleDocumentAdminMenu = () =>
    setDocumentAdminMenuOpen(!documentAdminMenuOpen);

  // Este useEffect asegura que el componente se renderice solo después de que esté montado en el cliente
  useEffect(() => {
    setIsMounted(true);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setAdminMenuOpen(false);
        setDocumentAdminMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Barra superior con mensaje desplazable */}
      <div
        className={`text-sm py-2 overflow-hidden ${
          theme === "dark"
            ? "bg-gray-800 text-gray-200"
            : "bg-yellow-500 text-white"
        }`}
      >
        <div className="whitespace-nowrap animate-marquee">
          <span className="mx-4">La pieza exacta para cada necesidad</span>
          <span className="mx-4">
            Grandes descuentos y promociones de temporada aquí
          </span>
          <span className="mx-4">La pieza exacta para cada necesidad</span>
          <span className="mx-4">
            Grandes descuentos y promociones de temporada aquí
          </span>
        </div>
      </div>

      {/* Navbar principal */}
      <nav
        className={`sticky top-0 w-full z-50 shadow-md ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700 text-gray-200"
            : "bg-white border-gray-200 text-gray-700"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4">
          {/* Logo y Menú de Categorías */}
          <div className="flex items-center space-x-4">
            <Link href={"/"} className="flex items-center">
              <Image
                src={logo}
                alt="Muñoz Logo"
                width={100}
                height={40}
                className="object-contain"
              />
            </Link>
            <button
              className={`flex items-center font-bold ${
                theme === "dark"
                  ? "text-gray-200 hover:text-yellow-400"
                  : "text-black hover:text-yellow-600"
              }`}
            >
              <FaBars className="mr-2" />
              Menú de Categorías
            </button>
          </div>

          {/* Campo de Búsqueda */}
          <div className="flex items-center w-1/2">
            <input
              type="text"
              placeholder="Buscar productos por número de parte"
              className={`w-full px-4 py-2 rounded-l-lg focus:outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "border-gray-300"
              }`}
            />
            <button
              className={`px-4 py-2 rounded-r-lg ${
                theme === "dark"
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              <FiSearch className="w-5 h-5" />
            </button>
          </div>

          {/* Íconos de Usuario, Cotizador, Carrito y Menú */}
          <div className="flex items-center space-x-6">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className={`flex flex-col items-center ${
                  theme === "dark"
                    ? "text-gray-200 hover:text-yellow-400"
                    : "text-gray-700 hover:text-yellow-600"
                }`}
              >
                <FaUser className="w-6 h-6" />
                <span className="text-sm">
                  {isAuthenticated ? user?.name : "Iniciar Sesión"}
                </span>
              </button>

              {/* Dropdown de usuario */}
              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg py-4 z-50 ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-200"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {!isAuthenticated ? (
                    <div className="flex justify-around items-center pb-4 border-b border-gray-300">
                      <Link href="/login">
                        <p
                          className={`px-4 py-2 rounded-lg ${
                            theme === "dark"
                              ? "border border-gray-500 text-gray-300 hover:bg-gray-700"
                              : "bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-100 hover:text-green-700"
                          }`}
                        >
                          Ingresar
                        </p>
                      </Link>
                      <Link href="/register">
                        <p className="bg-green-700 text-white hover:bg-green-600 px-4 py-2 rounded-lg">
                          Crear Cuenta
                        </p>
                      </Link>
                    </div>
                  ) : (
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold">
                        ¡Hola, {user?.name}!
                      </p>
                      <Link href="/profileuser">
                        <p
                          className={`mt-2 font-semibold ${
                            theme === "dark"
                              ? "hover:text-yellow-400"
                              : "hover:text-green-700"
                          }`}
                        >
                          Ver perfil
                        </p>
                      </Link>
                      {user?.role === "admin" && (
                        <div className="mt-4">
                          <button
                            onClick={toggleAdminMenu}
                            className={`w-full text-left font-semibold ${
                              theme === "dark"
                                ? "hover:text-yellow-400"
                                : "hover:text-green-700"
                            }`}
                          >
                            Opciones de Administrador
                          </button>
                          {adminMenuOpen && (
                            <div
                              className={`mt-2 border-t ${
                                theme === "dark"
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <Link href="/adminDashboard">
                                <p
                                  className={`mt-2 ${
                                    theme === "dark"
                                      ? "hover:text-yellow-400"
                                      : "hover:text-green-700"
                                  }`}
                                >
                                  Dashboard Admin
                                </p>
                              </Link>
                              <Link href="/adminUsuarios">
                                <p
                                  className={`mt-2 ${
                                    theme === "dark"
                                      ? "hover:text-yellow-400"
                                      : "hover:text-green-700"
                                  }`}
                                >
                                  Administrar Usuarios
                                </p>
                              </Link>
                            </div>
                          )}
                          {user?.role === "admin" && (
                            <div className="mt-4">
                              <button
                                onClick={toggleAdminMenu}
                                className={`w-full text-left font-semibold ${
                                  theme === "dark"
                                    ? "hover:text-yellow-400"
                                    : "hover:text-green-700"
                                }`}
                              >
                                Gestión de Documentos
                              </button>
                              {documentAdminMenuOpen && (
                                <div
                                  className={`mt-2 border-t ${
                                    theme === "dark"
                                      ? "bg-gray-800 border-gray-700"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <Link href="/adminDocumentos">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          ? "hover:text-yellow-400"
                                          : "hover:text-green-700"
                                      }`}
                                    >
                                      Administrar Pepe
                                    </p>
                                  </Link>
                                  <Link href="/adminDocumentos2">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          ? "hover:text-yellow-400"
                                          : "hover:text-green-700"
                                      }`}
                                    >
                                      Administrar Terminos
                                    </p>
                                  </Link>
                                  <Link href="/adminDocumentos3">
                                    <p
                                      className={`mt-2 ${
                                        theme === "dark"
                                          ? "hover:text-yellow-400"
                                          : "hover:text-green-700"
                                      }`}
                                    >
                                      Administrar Deslinde
                                    </p>
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={handleLogout}
                        className="mt-2 text-red-500 hover:text-red-400"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/cotizador"
              className={`flex flex-col items-center ${
                theme === "dark"
                  ? "text-gray-200 hover:text-yellow-400"
                  : "text-gray-700 hover:text-yellow-600"
              }`}
            >
              <FaFileInvoice className="w-6 h-6" />
              <span className="text-sm">Cotizador</span>
            </Link>

            <Link
              href="/cart"
              className={`flex flex-col items-center ${
                theme === "dark"
                  ? "text-gray-200 hover:text-yellow-400"
                  : "text-gray-700 hover:text-yellow-600"
              }`}
            >
              <FaShoppingCart className="w-6 h-6" />
              <span className="text-sm">Mi Carrito</span>
            </Link>

            {/* Botón de alternancia de tema con iconos de sol/luna */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center ${
                theme === "dark"
                  ? "text-yellow-400"
                  : "text-gray-700 hover:text-yellow-600"
              }`}
            >
              {theme === "light" ? (
                <FaMoon className="w-6 h-6" title="Modo Oscuro" />
              ) : (
                <FaSun className="w-6 h-6" title="Modo Claro" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
