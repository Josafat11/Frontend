// app/not-found.jsx
'use client'; // Indicar que es un Client Component para usar hooks

import { useAuth } from '../context/authContext'; // Importar el contexto de autenticación
import Link from 'next/link';
import Image from 'next/image'; // Importar el componente Image de Next.js

const NotFoundPage = () => {
  const { theme } = useAuth(); // Obtener el tema actual (claro/oscuro)

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Imagen del coche */}
      <Image
        src={theme === 'dark' ? '/assets/cocheB.jpg' : '/assets/cocheN.jpg'} // Cambiar la imagen según el tema
        alt="Coche"
        unoptimized 
        width={256} // Ancho de la imagen
        height={256} // Alto de la imagen
        className="w-64 h-64 mb-8"
      />

      {/* Mensaje de error */}
      <h1 className="text-4xl font-bold mb-4">Error - 404</h1>
      <p className="text-xl text-center mb-8">
        Ups... parece que el motor no arranca para esta página.
      </p>

      {/* Botón para regresar al inicio */}
      <Link href="/">
        <button
          className={`px-6 py-2 rounded-lg font-semibold ${
            theme === 'dark'
              ? 'bg-green-600 text-white hover:bg-green-500'
              : 'bg-green-700 text-white hover:bg-green-600'
          }`}
        >
          Regresar
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;