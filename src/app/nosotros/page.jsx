"use client"; // Indicar que es un Client Component

import { useAuth } from "../../context/authContext";
import Image from "next/image";
import Breadcrumbs from "../../components/Breadcrumbs";

function QuienesSomosPage() {
  const { theme } = useAuth(); // Obtén el valor de theme desde el contexto

  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Nosotros", path: "/nosotros" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container min-h-screen py-8 pt-20 mx-auto">
        <Breadcrumbs pages={breadcrumbsPages} />
        <h1 className="mb-8 text-3xl font-bold text-center">Quiénes Somos</h1>

        {/* Sección de historia */}
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
          {/* Imagen de la refaccionaria */}
          <div className="relative overflow-hidden rounded-lg shadow-lg h-96">
            <Image
              src="/assets/historia.jpg" // Ruta de la imagen
              alt="Historia de Refaccionaria Muñoz"
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Descripción de la historia */}
          <div
            className={`p-6 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h2 className="mb-4 text-2xl font-bold">Nuestra Historia</h2>
            <p className="mb-4">
              Refaccionaria Muñoz nació en 2003 con el objetivo de ofrecer
              refacciones y accesorios de alta calidad para vehículos en la
              región de Huautla, Hidalgo. Desde entonces, nos hemos convertido
              en un referente confiable para nuestros clientes, gracias a
              nuestro compromiso con la excelencia y el servicio personalizado.
            </p>
            <p>
              A lo largo de más de 20 años, hemos crecido junto a nuestra
              comunidad, adaptándonos a las necesidades de nuestros clientes y
              manteniendo siempre los más altos estándares de calidad.
            </p>
          </div>
        </div>

        {/* Sección de misión y visión */}
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
          {/* Misión */}
          <div
            className={`p-6 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h2 className="mb-4 text-2xl font-bold">Misión</h2>
            <p>
              Nuestra misión es proporcionar a nuestros clientes las mejores
              refacciones y accesorios para sus vehículos, asegurando calidad,
              durabilidad y un servicio excepcional que supere sus expectativas.
            </p>
          </div>

          {/* Visión */}
          <div
            className={`p-6 rounded-lg shadow-lg ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h2 className="mb-4 text-2xl font-bold">Visión</h2>
            <p>
              Ser la refaccionaria líder en la región, reconocida por nuestra
              calidad, innovación y compromiso con la satisfacción total de
              nuestros clientes.
            </p>
          </div>
        </div>

        {/* Sección de valores */}
        <div
          className={`p-6 rounded-lg shadow-lg mb-8 ${
            theme === "dark"
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <h2 className="mb-4 text-2xl font-bold">Nuestros Valores</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>Calidad:</strong> Ofrecemos productos de la más alta
              calidad.
            </li>
            <li>
              <strong>Honestidad:</strong> Transparencia y confianza en cada
              transacción.
            </li>
            <li>
              <strong>Compromiso:</strong> Nos esforzamos por superar las
              expectativas de nuestros clientes.
            </li>
            <li>
              <strong>Innovación:</strong> Siempre buscamos mejorar y adaptarnos
              a las necesidades del mercado.
            </li>
          </ul>
        </div>

        {/* Sección de imágenes (puedes agregar las imágenes que desees) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* Imagen 1 */}
          <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/assets/equipo1.jpg" // Ruta de la imagen
              alt="Equipo de Refaccionaria Muñoz"
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Imagen 2 */}
          <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/assets/equipo2.jpg" // Ruta de la imagen
              alt="Instalaciones de Refaccionaria Muñoz"
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Imagen 3 */}
          <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/assets/equipo3.jpg" // Ruta de la imagen
              alt="Atención al cliente en Refaccionaria Muñoz"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuienesSomosPage;
