// app/404/page.jsx

import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Página no encontrada</p>
      <Link href="/">
        <a className="text-blue-500 hover:text-blue-700 text-lg font-semibold">
          Volver al inicio
        </a>
      </Link>
    </div>
  );
}
