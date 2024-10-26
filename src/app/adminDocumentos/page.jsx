"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";

function PrivacyPolicyPage() {
  const { user, isAuthenticated } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Definir fetchPolicies fuera del useEffect para que esté disponible globalmente
  const fetchCurrentPolicyWithVersions = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL3}/docs/privacy-policy/current-with-versions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setPolicies([data.currentPolicy]); // O puedes manejarlo como prefieras
      setLoading(false); // Cambiar el estado de carga a false aquí
    } else {
      setLoading(false); // También asegurarte de cambiarlo si la respuesta no es OK
      console.error("Error fetching policies:", response.statusText);
    }
  };

  // Llama a esta función en tu useEffect o donde lo necesites
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchCurrentPolicyWithVersions();
    }
  }, [isAuthenticated, user]);

  const handleCreateOrUpdatePolicy = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL3}/docs/privacy-policy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPolicy),
        }
      );

      if (response.ok) {
        await fetchPolicies(); // Actualiza la lista con la política actual
        setNewPolicy({ title: "", content: "", effectiveDate: "" }); // Resetea el formulario
      }
    } catch (error) {
      console.error(
        "Error al crear o actualizar la política de privacidad:",
        error
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20">Cargando políticas de privacidad...</p>
    );
  }

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold text-center mb-8">
        Gestión de Política de Privacidad
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Crear Nueva Política de Privacidad
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            value={newPolicy.title}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, title: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contenido</label>
          <textarea
            value={newPolicy.content}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, content: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-lg"
            rows="6"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Fecha de Vigencia</label>
          <input
            type="date"
            value={newPolicy.effectiveDate}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded-lg"
          />
        </div>
        <button
          onClick={handleCreateOrUpdatePolicy}
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Crear Política
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            <h2 className="text-2xl font-bold mb-4">Política de Privacidad Actual</h2>
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
                        <tr key={policies[0]._id}>
                            <td className="px-4 py-2 border">{policies[0].title}</td>
                            <td className="px-4 py-2 border">{new Date(policies[0].createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2 border">{new Date(policies[0].effectiveDate).toLocaleDateString()}</td>
                        </tr>
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-4">No hay políticas registradas</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default PrivacyPolicyPage;
