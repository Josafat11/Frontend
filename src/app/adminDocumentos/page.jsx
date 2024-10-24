'use client'; // Indica que es un componente del lado del cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import { CONFIGURACIONES } from '../config/config'; // Importar las configuraciones
function PrivacyPolicyPage() {
  const { user, isAuthenticated } = useAuth();
  const [policies, setPolicies] = useState([]); // Inicializar como un arreglo vacío para las políticas
  const [loading, setLoading] = useState(true);
  const [newPolicy, setNewPolicy] = useState({ title: '', content: '', effectiveDate: '' }); // Para la nueva política
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/'); // Redirige a la página principal si no es admin o no está autenticado
    } else {
      fetchPolicies(); // Cargar las políticas de privacidad si es admin
    }
  }, [isAuthenticated, user]);

  const fetchPolicies = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL}/docs/privacy-policy/current`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        // Si es un arreglo, directamente lo usamos
        setPolicies(data);
      } else if (data) {
        // Si es un solo objeto, lo convertimos en un arreglo para poder mapearlo
        setPolicies([data]);
      } else {
        setPolicies([]); // Si no hay datos, aseguramos que policies esté vacío
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar las políticas:', error);
      setLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL}/docs/privacy-policy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPolicy),
      });

      if (response.ok) {
        fetchPolicies(); // Actualiza la lista de políticas
        setNewPolicy({ title: '', content: '', effectiveDate: '' }); // Resetea el formulario
      }
    } catch (error) {
      console.error('Error al crear la política de privacidad:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Cargando políticas de privacidad...</p>;
  }

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8">Gestión de Política de Privacidad</h1>

      {/* Formulario para crear una nueva política de privacidad */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Crear Nueva Política de Privacidad</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            value={newPolicy.title}
            onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contenido</label>
          <textarea
            value={newPolicy.content}
            onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
            rows="6"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Fecha de Vigencia</label>
          <input
            type="date"
            value={newPolicy.effectiveDate}
            onChange={(e) => setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleCreatePolicy}
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Crear Política
        </button>
      </div>

      {/* Tabla de versiones de la política de privacidad */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold mb-4">Versiones de la Política de Privacidad</h2>

        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Título</th>
              <th className="px-4 py-2 border">Fecha de Creación</th>
              <th className="px-4 py-2 border">Fecha de Vigencia</th>
            </tr>
          </thead>
          <tbody>
            {policies.length > 0 ? (
              policies.map((policy) => (
                <tr key={policy._id}>
                  <td className="px-4 py-2 border">{policy.title}</td>
                  <td className="px-4 py-2 border">{new Date(policy.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{new Date(policy.effectiveDate).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No hay políticas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
