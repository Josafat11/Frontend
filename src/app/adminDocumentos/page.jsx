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

  // Verificar si el usuario es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Obtener todas las políticas
  const fetchPolicies = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`,
        {
          method: "GET",
          credentials: "include", // Enviar cookie con el token
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setPolicies(data);
      } else {
        setPolicies([]);
        console.error("La respuesta no es un array:", data);
      }
    } catch (error) {
      console.error("Error al obtener las políticas:", error);
    }
  };

  // Obtener la política actual
  const fetchCurrentPolicy = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/current`,
        {
          method: "GET",
          credentials: "include", // Cookie
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentPolicy(data);
      } else {
        console.error("Error al obtener la política actual");
      }
    } catch (error) {
      console.error("Error al obtener la política actual:", error);
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
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`,
        {
          method: "POST",
          credentials: "include", // Cookie
          headers: {
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
        fetchCurrentPolicy();
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
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${editingPolicy.id}`,
        {
          method: "PUT",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingPolicy),
        }
      );
      if (response.ok) {
        setEditingPolicy(null);
        fetchPolicies();
        fetchCurrentPolicy();
      }
    } catch (error) {
      console.error("Error al actualizar la política:", error);
    }
  };

  // Eliminar una política
  const handleDeletePolicy = async (id) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}`,
        {
          method: "DELETE",
          credentials: "include", // Cookie
        }
      );
      if (response.ok) {
        fetchPolicies();
        fetchCurrentPolicy();
      }
    } catch (error) {
      console.error("Error al eliminar la política:", error);
    }
  };

  // Establecer una política como actual
  const handleSetCurrentPolicy = async (id) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}/set-current`,
        {
          method: "PUT",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchPolicies();
        fetchCurrentPolicy();
      }
    } catch (error) {
      console.error("Error al establecer la política como actual:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold mb-8 text-center pt-10">
        Gestión de Políticas de Privacidad
      </h1>

      {/* Formulario para crear nueva política */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Política</h2>
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Título"
          value={newPolicy.title}
          onChange={(e) =>
            setNewPolicy({ ...newPolicy, title: e.target.value })
          }
        />
        <textarea
          className="border p-2 mb-2 w-full"
          placeholder="Contenido"
          value={newPolicy.content}
          onChange={(e) =>
            setNewPolicy({ ...newPolicy, content: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2 mb-2 w-full"
          value={newPolicy.effectiveDate}
          onChange={(e) =>
            setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })
          }
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleCreatePolicy}
        >
          Crear
        </button>
      </div>

      {/* Listado de políticas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Políticas</h2>
        {policies.length > 0 ? (
          policies.map((policy) => (
            <div key={policy.id} className="border p-4 mb-2">
              {editingPolicy && editingPolicy.id === policy.id ? (
                <>
                  <input
                    type="text"
                    className="border p-2 mb-2 w-full"
                    value={editingPolicy.title}
                    onChange={(e) =>
                      setEditingPolicy({ ...editingPolicy, title: e.target.value })
                    }
                  />
                  <textarea
                    className="border p-2 mb-2 w-full"
                    value={editingPolicy.content}
                    onChange={(e) =>
                      setEditingPolicy({ ...editingPolicy, content: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="border p-2 mb-2 w-full"
                    value={editingPolicy.effectiveDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditingPolicy({
                        ...editingPolicy,
                        effectiveDate: e.target.value,
                      })
                    }
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleUpdatePolicy}
                  >
                    Guardar
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => setEditingPolicy(null)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{policy.title}</h3>
                  <p>{policy.content}</p>
                  <p>
                    <strong>Vigencia:</strong>{" "}
                    {new Date(policy.effectiveDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Actual:</strong> {policy.isCurrent ? "Sí" : "No"}
                  </p>
                  <div className="mt-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => setEditingPolicy(policy)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleDeletePolicy(policy.id)}
                    >
                      Eliminar
                    </button>
                    {!policy.isCurrent && (
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => handleSetCurrentPolicy(policy.id)}
                      >
                        Establecer como Actual
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No hay políticas disponibles</p>
        )}
      </div>

      {/* Política actual */}
      {currentPolicy && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Política Actual</h2>
          <div className="border p-4">
            <h3 className="font-bold text-lg">{currentPolicy.title}</h3>
            <p>{currentPolicy.content}</p>
            <p>
              <strong>Vigencia:</strong>{" "}
              {new Date(currentPolicy.effectiveDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrivacyPolicyPage;
