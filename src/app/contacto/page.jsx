"use client"; // Indicar que es un Client Component

import { useState } from "react";
import { useAuth } from "../../context/authContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import Image from "next/image";

function ContactoPage() {
  const { theme } = useAuth(); // Obtén el valor de theme desde el contexto
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert(
      "¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto."
    );
    setFormData({ nombre: "", correo: "", telefono: "", mensaje: "" });
  };

   const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Ofertas", path: "/ofertas" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors pb-20 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className="container min-h-screen pt-20 mx-auto">
        <Breadcrumbs pages={breadcrumbsPages} />
        <h1 className="mb-8 text-3xl font-bold text-center">Contacto</h1>

        {/* Sección de información y formulario */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Información de contacto */}
          <div
            className={`p-6 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h2 className="mb-4 text-2xl font-bold">Información de Contacto</h2>
            <p className="mb-4">
              Estamos aquí para ayudarte. <br></br> Si tienes alguna pregunta o
              necesitas asistencia, no dudes en contactarnos por nuestros medios
              oficiales o visitarnos en nuestra dirección.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p>43000, La Lomita, Huejutla de Reyes, Hgo.</p>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p>789 896 1084</p>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p>munozautopartes@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div
            className={`p-6 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h2 className="mb-4 text-2xl font-bold">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingresa tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-600 border-gray-500 text-gray-200"
                      : "border-gray-300"
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  placeholder="Ingresa tu correo eléctronico"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-600 border-gray-500 text-gray-200"
                      : "border-gray-300"
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Teléfono</label>
                <input
                  type="tel"
                  placeholder="Ingresa tu número de teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-600 border-gray-500 text-gray-200"
                      : "border-gray-300"
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Mensaje</label>
                <textarea
                  name="mensaje"
                  placeholder="¿Cuáles son tus dudas?"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-600 border-gray-500 text-gray-200"
                      : "border-gray-300"
                  }`}
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg ${
                  theme === "dark"
                    ? "bg-green-700 text-white hover:bg-green-500"
                    : "bg-green-600 text-white hover:bg-green-700"
                } transition duration-300`}
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>

        {/* Sección de redes sociales */}
        <div className="mt-8 text-center">
          <h2 className="pt-16 mb-4 text-2xl font-bold">
            Contáctanos en Nuestras Redes Sociales
          </h2>
          <div className="flex justify-center space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-900"
              } hover:bg-yellow-500 hover:text-white transition duration-300`}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-900"
              } hover:bg-yellow-500 hover:text-white transition duration-300`}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-900"
              } hover:bg-yellow-500 hover:text-white transition duration-300`}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 2c-3.259 0-3.667.014-4.947.072-2.905.132-4.164 1.457-4.296 4.296-.058 1.281-.072 1.689-.072 4.947 0 3.259.014 3.668.072 4.947.132 2.905 1.457 4.164 4.296 4.296 1.281.058 1.689.072 4.947.072 3.259 0 3.668-.014 4.947-.072 2.905-.132 4.164-1.457 4.296-4.296.058-1.28.072-1.689.072-4.947 0-3.259-.014-3.667-.072-4.947-.132-2.905-1.457-4.164-4.296-4.296C15.667 4.014 15.259 4 12 4zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactoPage;
