"use client";
import Image from "next/image";

function BrakePadView() {
  return (
    <div className="container mx-auto p-6">
      {/* Contenedor principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gradient-to-r from-green-50 via-white to-white shadow-xl rounded-lg overflow-hidden">
        {/* Imagen del producto */}
        <div className="relative group">
          <div className="h-80 lg:h-auto overflow-hidden rounded-lg transition-all duration-300 transform group-hover:scale-105">
            <Image
              src="/assets/motor.jpg" // Ruta correcta
              alt="Motor"
              width={500}
              height={500}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>

        {/* Contenido del producto */}
        <div className="p-6 flex flex-col justify-between">
          {/* Título y código QR */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 tracking-wide">Producto</h1>
            <div className="text-center">
              <p className="text-sm text-gray-600">Escanea para ver en 3D</p>
              <Image
                src="/assets/qr.jpg" // Ruta correcta
                alt="Código QR"
                width={120}
                height={120}
                className="mt-3 rounded-md shadow-md"
              />
            </div>
          </div>

          {/* Precio */}
          <div className="text-4xl font-semibold text-green-600 mb-6">
            $350.00
          </div>

          {/* Cantidad */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
              defaultValue={1}
              min={1}
            />
          </div>

          {/* Botón */}
          <button className="bg-green-600 text-white py-4 rounded-lg font-semibold shadow-xl hover:bg-green-700 transition-all duration-300 w-full">
            Añadir al Carrito
          </button>

          {/* Descripción */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
            <p className="text-gray-600 leading-relaxed">
              Este producto es ideal para tus necesidades. Aquí puedes incluir una breve descripción,
              detalles técnicos, o responder preguntas frecuentes para ayudar al cliente a tomar una
              decisión informada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrakePadView;
