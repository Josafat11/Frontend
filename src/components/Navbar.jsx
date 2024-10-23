"use client"; // Indicar que es un Client Component

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import logo from "../assets/munoz-logo.jpg";
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth(); // Extraer logout del contexto de autenticación
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-yellow-300 border-b-2 rounded-lg border-gray-200 fixed top-0 w-full z-50 pb-4">
      <div className="container mx-auto flex justify-between items-center py-2">
        <div className="flex items-center">
          <Link href={"/"}>
            <Image src={logo} alt="Muñoz Logo" width={120} height={120} />
          </Link>
          <p className="ml-4 text-base text-gray-900">
            La Pieza Exacta para Cada Necesidad
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-black font-semibold">
            GRANDES DESCUENTOS Y PROMOCIONES DE TEMPORADA AQUÍ
          </p>
        </div>

        {/* Usuario, Carrito y menú hamburguesa a la derecha */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-gray-700 hover:text-green-700"
            >
              <FaUser className="w-6 h-6" />
              <span>
                {isAuthenticated ? user?.name : "Usuario"} {/* Muestra el nombre si está autenticado */}
              </span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-4 z-50">
                {!isAuthenticated ? (
                  <div className="flex justify-around items-center pb-4 border-b">
                    <Link href="/login">
                      <p className="bg-transparent border border-gray-500 text-gray-500 hover:bg-gray-100 hover:text-green-700 px-4 py-2 rounded-lg">
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
                    <p className="text-sm">¡Hola, {user?.name}!</p>
                    <Link href="/profile">
                      <p className="mt-2 text-green-700 hover:text-green-500">
                        Ver perfil
                      </p>
                    </Link>
                    <button
                      onClick={logout} // Llamar a la función logout
                      className="mt-2 text-red-500 hover:text-red-400"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 text-gray-800 hover:text-green-700">
            <Link href="/cart" className="flex items-center space-x-2">
              <FaShoppingCart className="w-6 h-6 cursor-pointer" />
              <span>Carrito</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-gray-800 hover:text-green-700">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-green-700 flex items-center space-x-2"
            >
              <span>Menú</span>
              <FaBars className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
