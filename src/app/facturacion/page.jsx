"use client"; // Indicar que es un Client Component

import { useAuth } from "../../context/authContext";
import Image from "next/image";

function FacturaPage() {
  const { theme } = useAuth(); // Obtén el valor de theme desde el contexto

  return (
    <div
      className={`min-h-screen transition-colors container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold text-center">Factura Electrónica</h1>

      {/* Sección de información */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Imagen ilustrativa */}
        <div className="relative overflow-hidden rounded-lg shadow-lg h-96">
          <Image
          
            src="/assets/facturacion.jpg" // Ruta de la imagen
            alt="Factura Electrónica"
            layout="fill"
              unoptimized 
            objectFit="cover"
          />
        </div>

        {/* Detalles sobre la factura electrónica */}
        <div
          className={`p-6 rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-900"
          }`}
        >
          <h2 className="mb-4 text-2xl font-bold">¿Cómo funciona la factura electrónica?</h2>
          <p className="mb-4">
            En Refaccionaria Muñoz, nos adaptamos a las necesidades modernas de nuestros
            clientes. Por eso, ofrecemos el servicio de facturación electrónica, que te
            permite obtener tus comprobantes fiscales de manera rápida, segura y amigable
            con el medio ambiente.
          </p>
          <h3 className="mb-2 text-xl font-bold">Beneficios de la factura electrónica:</h3>
          <ul className="mb-4 list-disc list-inside">
            <li>Recibe tus facturas directamente en tu correo electrónico.</li>
            <li>Acceso inmediato a tus comprobantes fiscales.</li>
            <li>Reduce el uso de papel y contribuye al cuidado del medio ambiente.</li>
            <li>Almacena tus facturas de manera segura en la nube.</li>
          </ul>
          <h3 className="mb-2 text-xl font-bold">¿Cómo solicitar tu factura electrónica?</h3>
          <ol className="mb-4 list-decimal list-inside">
            <li>Realiza tu compra en cualquiera de nuestras sucursales o en línea.</li>
            <li>
              Proporciona tus datos fiscales (RFC, dirección, correo electrónico) al
              momento de la compra.
            </li>
            <li>
              Recibe tu factura electrónica en tu correo en un plazo máximo de 24 horas.
            </li>
          </ol>
          <p className="mb-4">
            Si tienes alguna duda o necesitas ayuda con tu factura electrónica, no dudes
            en contactarnos.
          </p>
          <button
            className={`py-2 px-4 rounded-lg ${
              theme === "dark"
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-green-600 text-white hover:bg-green-700"
            } transition duration-300`}
          >
            Contactar Soporte
          </button>
        </div>
      </div>

      {/* Sección de preguntas frecuentes */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Preguntas Frecuentes</h2>
        <div
          className={`p-6 rounded-lg shadow-lg ${
            theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-900"
          }`}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold">¿Qué datos necesito para solicitar una factura?</h3>
              <p>
                Necesitas proporcionar tu RFC, dirección fiscal y correo electrónico.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">¿Cuánto tiempo tarda en llegar mi factura?</h3>
              <p>
                Las facturas electrónicas se envían en un plazo máximo de 24 horas después
                de realizada la compra.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">¿Puedo corregir una factura emitida?</h3>
              <p>
                Sí, si detectas algún error en tu factura, contáctanos y te ayudaremos a
                corregirlo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacturaPage;