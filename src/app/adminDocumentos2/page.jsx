'use client'; // Indica que es un componente del lado del cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';

function TermsConditionsPage() {
  const { user, isAuthenticated } = useAuth();
  const [termsConditions, setTermsConditions] = useState(null); // Almacena los términos actuales
  const [loading, setLoading] = useState(true);
  const [newTerms, setNewTerms] = useState({ title: '', content: '', effectiveDate: '' }); // Para los nuevos términos
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/'); // Redirige a la página principal si no es admin o no está autenticado
    } else {
      fetchTermsConditions(); // Cargar los términos y condiciones si es admin
    }
  }, [isAuthenticated, user]);

  const fetchTermsConditions = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/docs/terms-conditions/current', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data) {
        setTermsConditions(data); // Establece los términos y condiciones actuales
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los términos y condiciones:', error);
      setLoading(false);
    }
  };

  const handleCreateTerms = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/docs/terms-conditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTerms),
      });

      if (response.ok) {
        fetchTermsConditions(); // Actualiza los términos y condiciones actuales
        setNewTerms({ title: '', content: '', effectiveDate: '' }); // Resetea el formulario
      }
    } catch (error) {
      console.error('Error al crear los términos y condiciones:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Cargando términos y condiciones...</p>;
  }

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8">Gestión de Términos y Condiciones</h1>

      {/* Formulario para crear nuevos términos y condiciones */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Crear Nuevos Términos y Condiciones</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            value={newTerms.title}
            onChange={(e) => setNewTerms({ ...newTerms, title: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contenido</label>
          <textarea
            value={newTerms.content}
            onChange={(e) => setNewTerms({ ...newTerms, content: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
            rows="6"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Fecha de Vigencia</label>
          <input
            type="date"
            value={newTerms.effectiveDate}
            onChange={(e) => setNewTerms({ ...newTerms, effectiveDate: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleCreateTerms}
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Crear Términos
        </button>
      </div>

      {/* Visualización de los términos y condiciones actuales */}
      {termsConditions && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-2xl font-bold mb-4">Términos y Condiciones Actuales</h2>

          <h3 className="text-xl font-semibold mb-2">{termsConditions.title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Fecha de entrada en vigor: {new Date(termsConditions.effectiveDate).toLocaleDateString()}
          </p>

          <div className="text-gray-700 text-justify whitespace-pre-line leading-relaxed">
            {termsConditions.content}
          </div>

          <p className="text-xs text-gray-400 mt-8">
            Creado el: {new Date(termsConditions.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default TermsConditionsPage;
