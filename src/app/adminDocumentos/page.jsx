"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function PrivacyPolicyPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const [editingPolicy, setEditingPolicy] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Obtener todas las políticas
  const fetchPolicies = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    // Verifica si data es un array, si no, lo transformas
    if (Array.isArray(data)) {
      setPolicies(data);
    } else {
      setPolicies([]);
      console.error("La respuesta no es un array:", data);
    }
  };

  // Obtener la política actual
  const fetchCurrentPolicy = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/current`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setCurrentPolicy(data); // Actualiza el estado de la política actual
    } else {
      console.error("Error al obtener la política actual");
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchPolicies();
      fetchCurrentPolicy();
    }
  }, [isAuthenticated, user]);

  // Crear una nueva política
  const handleCreatePolicy = async () => {
    if (!newPolicy.title || !newPolicy.content || !newPolicy.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      });
      return;
    }

    if (new Date(newPolicy.effectiveDate) < new Date()) {
      toast.error(
        "La fecha de vigencia no puede ser anterior a la fecha actual.",
        { position: "top-center" }
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`,
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
        toast.success("Política creada exitosamente.", {
          position: "top-center",
        });
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
        setNewPolicy({ title: "", content: "", effectiveDate: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Error en el servidor.", { position: "top-center" });
    }
  };

  // Actualizar una política existente
  const handleUpdatePolicy = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${editingPolicy._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingPolicy),
        }
      );
      if (response.ok) {
        setEditingPolicy(null);
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al actualizar la política:", error);
    }
  };

  // Eliminar una política
  const handleDeletePolicy = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al eliminar la política:", error);
    }
  };

  // Establecer una política como actual
  const handleSetCurrentPolicy = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}/set-current`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchPolicies();
        fetchCurrentPolicy(); // Refresca la política actual
      }
    } catch (error) {
      console.error("Error al establecer la política como actual:", error);
    }
  };

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        Gestión de Política de Privacidad
      </h1>

      {/* Crear o editar política */}
      <div className="shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {editingPolicy ? "Editar Política" : "Crear Nueva Política"}
        </h2>
        <div className="mb-4">
          <label className="block mb-2">Título</label>
          <input
            type="text"
            value={editingPolicy ? editingPolicy.title : newPolicy.title}
            onChange={(e) =>
              editingPolicy
                ? setEditingPolicy({ ...editingPolicy, title: e.target.value })
                : setNewPolicy({ ...newPolicy, title: e.target.value })
            }
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Contenido</label>
          <textarea
            value={editingPolicy ? editingPolicy.content : newPolicy.content}
            onChange={(e) =>
              editingPolicy
                ? setEditingPolicy({
                    ...editingPolicy,
                    content: e.target.value,
                  })
                : setNewPolicy({ ...newPolicy, content: e.target.value })
            }
            className="w-full border p-2 rounded-lg"
            rows="6"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Fecha de Vigencia</label>
          <input
            type="date"
            value={
              editingPolicy
                ? editingPolicy.effectiveDate
                : newPolicy.effectiveDate
            }
            onChange={(e) =>
              editingPolicy
                ? setEditingPolicy({
                    ...editingPolicy,
                    effectiveDate: e.target.value,
                  })
                : setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })
            }
            className="w-full border p-2 rounded-lg"
            min={new Date().toISOString().split("T")[0]} // Fecha actual como mínimo
          />
        </div>
        <button
          onClick={editingPolicy ? handleUpdatePolicy : handleCreatePolicy}
          className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {editingPolicy ? "Guardar Cambios" : "Crear Política"}
        </button>
      </div>

      {/* Mostrar la política actual */}
      {currentPolicy && (
        <div className="mb-8 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Política Actual</h2>
          <p>
            <strong>Título:</strong> {currentPolicy.title}
          </p>
          <p>
            <strong>Contenido:</strong> {currentPolicy.content}
          </p>
          <p>
            <strong>Fecha de Creación:</strong>{" "}
            {new Date(currentPolicy.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Fecha de Vigencia:</strong>{" "}
            {new Date(currentPolicy.effectiveDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Listar políticas */}
      <div className="shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold mb-4">Listado de Políticas</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Fecha de Creación</th>
              <th className="px-4 py-2">Fecha de Vigencia</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(policies) &&
              policies.map((policy) => (
                <tr
                  key={policy._id}
                  className={policy.isCurrent ? "bg-green-100" : ""} // Fondo verde claro si es actual
                >
                  {/* Título con etiqueta "Actual" si aplica */}
                  <td className="px-4 py-2">
                    {policy.title}{" "}
                    {policy.isCurrent && (
                      <span className="text-green-500 font-semibold">
                        (Actual)
                      </span>
                    )}
                  </td>

                  {/* Fecha de creación */}
                  <td className="px-4 py-2">
                    {new Date(policy.createdAt).toLocaleDateString()}
                  </td>

                  {/* Fecha de vigencia */}
                  <td className="px-4 py-2">
                    {new Date(policy.effectiveDate).toLocaleDateString()}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-2">
                    {/* Botón Editar */}
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      onClick={() => setEditingPolicy(policy)}
                    >
                      Editar
                    </button>

                    {/* Botón Establecer como Actual o deshabilitado si ya es actual */}
                    {policy.isCurrent ? (
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded mr-2 cursor-not-allowed"
                        disabled
                      >
                        Actual
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                        onClick={() => handleSetCurrentPolicy(policy._id)}
                      >
                        Establecer como Actual
                      </button>
                    )}

                    {/* Botón Eliminar */}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeletePolicy(policy._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
