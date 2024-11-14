"use client"; // Indica que es un componente del lado del cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config';

function DeslindeLegalPage() {
  const { user, isAuthenticated, theme } = useAuth(); // Añadimos theme desde el contexto
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
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde-legal/current`, {
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
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde-legal`, {
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
    return (
      <p className={`text-center mt-20 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        Cargando deslinde legal...
      </p>
    );
  }

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h1 className="text-3xl font-bold text-center mb-8">Gestión de Deslinde Legal</h1>

      {/* Formulario para crear un nuevo deslinde legal */}
      <div className={`shadow-md rounded-lg overflow-hidden p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">Crear Nuevo Deslinde Legal</h2>

        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Título</label>
          <input
            type="text"
            value={newDeslinde.title}
            onChange={(e) => setNewDeslinde({ ...newDeslinde, title: e.target.value })}
            className={`w-full border p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}
          />
        </div>

        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Contenido</label>
          <textarea
            value={newDeslinde.content}
            onChange={(e) => setNewDeslinde({ ...newDeslinde, content: e.target.value })}
            className={`w-full border p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}
            rows="6"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Fecha de Vigencia</label>
          <input
            type="date"
            value={newDeslinde.effectiveDate}
            onChange={(e) => setNewDeslinde({ ...newDeslinde, effectiveDate: e.target.value })}
            className={`w-full border p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}
          />
        </div>

        <button
          onClick={handleCreateDeslinde}
          className={`py-2 px-4 rounded hover:bg-green-600 ${theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-700 text-white'}`}
        >
          Crear Deslinde
        </button>
      </div>

      {/* Visualización del deslinde legal actual */}
      {deslindeLegal && (
        <div className={`shadow-md rounded-lg overflow-hidden p-6 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
          <h2 className="text-2xl font-bold mb-4">Deslinde Legal Actual</h2>

          <h3 className="text-xl font-semibold mb-2">{deslindeLegal.title}</h3>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Fecha de entrada en vigor: {new Date(deslindeLegal.effectiveDate).toLocaleDateString()}
          </p>

          <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-justify whitespace-pre-line leading-relaxed`}>
            {deslindeLegal.content}
          </div>

          <p className={`text-xs mt-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Creado el: {new Date(deslindeLegal.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeslindeLegalPage;
