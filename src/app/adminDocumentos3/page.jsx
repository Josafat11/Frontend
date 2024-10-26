"use client"; // Indica que es un componente del lado del cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config';

function DeslindeLegalPage() {
  const { user, isAuthenticated } = useAuth();
  const [deslindeLegal, setDeslindeLegal] = useState(null); // Almacena el deslinde legal actual
  const [loading, setLoading] = useState(true);
  const [newDeslinde, setNewDeslinde] = useState({ title: '', content: '', effectiveDate: '' }); // Para el nuevo deslinde legal
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/'); // Redirige a la página principal si no es admin o no está autenticado
    } else {
      fetchDeslindeLegal(); // Cargar el deslinde legal si es admin
    }
  }, [isAuthenticated, user]);

  const fetchDeslindeLegal = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token JWT desde el almacenamiento local
      const response = await fetch(`${CONFIGURACIONES.BASEURL3}/docs/deslinde-legal/current`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado de autorización
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setDeslindeLegal(data); // Establece el deslinde legal actual
      } else if (response.status === 401) {
        console.error('Token expirado o inválido');
        router.push('/login'); // Redirige al inicio de sesión si el token es inválido
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar el deslinde legal:', error);
      setLoading(false);
    }
  };

  const handleCreateDeslinde = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token JWT desde el almacenamiento local
      const response = await fetch(`${CONFIGURACIONES.BASEURL3}/docs/deslinde-legal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado de autorización
        },
        credentials: 'include',
        body: JSON.stringify(newDeslinde),
      });

      if (response.ok) {
        fetchDeslindeLegal(); // Actualiza el deslinde legal actual
        setNewDeslinde({ title: '', content: '', effectiveDate: '' }); // Resetea el formulario
      } else if (response.status === 401) {
        console.error('Token expirado o inválido');
        router.push('/login'); // Redirige al inicio de sesión si el token es inválido
      }
    } catch (error) {
      console.error('Error al crear el deslinde legal:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Cargando deslinde legal...</p>;
  }

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8">Gestión de Deslinde Legal</h1>

      {/* Formulario para crear un nuevo deslinde legal */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Crear Nuevo Deslinde Legal</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            value={newDeslinde.title}
            onChange={(e) => setNewDeslinde({ ...newDeslinde, title: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contenido</label>
          <textarea
            value={newDeslinde.content}
            onChange={(e) => setNewDeslinde({ ...newDeslinde, content: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
            rows="6"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Fecha de Vigencia</label>
          <input
            type="date"
            value={newDeslinde.effectiveDate}
            onChange={(e) => setNewDeslinde({ ...newDeslinde, effectiveDate: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleCreateDeslinde}
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Crear Deslinde
        </button>
      </div>

      {/* Visualización del deslinde legal actual */}
      {deslindeLegal && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-2xl font-bold mb-4">Deslinde Legal Actual</h2>

          <h3 className="text-xl font-semibold mb-2">{deslindeLegal.title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Fecha de entrada en vigor: {new Date(deslindeLegal.effectiveDate).toLocaleDateString()}
          </p>

          <div className="text-gray-700 text-justify whitespace-pre-line leading-relaxed">
            {deslindeLegal.content}
          </div>

          <p className="text-xs text-gray-400 mt-8">
            Creado el: {new Date(deslindeLegal.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeslindeLegalPage;
