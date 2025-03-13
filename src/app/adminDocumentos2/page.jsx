"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TermsPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [terms, setTerms] = useState([]);
  const [currentTerms, setCurrentTerms] = useState(null);
  const [newTerms, setNewTerms] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const [editingTerms, setEditingTerms] = useState(null);

  // Verificar si el usuario es admin; si no, redirigir
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Obtener todos los términos
  const fetchTerms = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms`, {
        method: "GET",
        credentials: "include", // Enviar cookie con el token
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setTerms(data);
      } else {
        setTerms([]);
        console.error("La respuesta no es un array:", data);
      }
    } catch (error) {
      console.error("Error al obtener términos:", error);
    }
  };

  // Obtener los términos actuales
  const fetchCurrentTerms = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms/current`,
        {
          method: "GET",
          credentials: "include", // Enviar cookie con el token
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentTerms(data);
      } else {
        console.error("Error al obtener los términos actuales");
      }
    } catch (error) {
      console.error("Error al obtener términos actuales:", error);
    }
  };

  // Cargar datos iniciales si es admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchTerms();
      fetchCurrentTerms();
    }
  }, [isAuthenticated, user]);

  // Crear nuevos términos
  const handleCreateTerms = async () => {
    if (!newTerms.title || !newTerms.content || !newTerms.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      });
      return;
    }

    if (new Date(newTerms.effectiveDate) < new Date()) {
      toast.error(
        "La fecha de vigencia no puede ser anterior a la fecha actual.",
        { position: "top-center" }
      );
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms`, {
        method: "POST",
        credentials: "include", // Cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTerms),
      });

      if (response.ok) {
        toast.success("Términos creados exitosamente.", {
          position: "top-center",
        });
        fetchTerms();
        fetchCurrentTerms();
        setNewTerms({ title: "", content: "", effectiveDate: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Error en el servidor.", { position: "top-center" });
    }
  };

  // Actualizar términos existentes
  const handleUpdateTerms = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms/${editingTerms.id}`,
        {
          method: "PUT",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingTerms),
        }
      );
      if (response.ok) {
        setEditingTerms(null);
        fetchTerms();
        fetchCurrentTerms();
      } else {
        console.error("Error al actualizar los términos");
      }
    } catch (error) {
      console.error("Error al actualizar los términos:", error);
    }
  };

  // Eliminar términos
  const handleDeleteTerms = async (id) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms/${id}`,
        {
          method: "DELETE",
          credentials: "include", // Cookie
        }
      );
      if (response.ok) {
        fetchTerms();
        fetchCurrentTerms();
      }
    } catch (error) {
      console.error("Error al eliminar los términos:", error);
    }
  };

  // Establecer términos como actuales
  const handleSetCurrentTerms = async (id) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/terms/${id}/set-current`,
        {
          method: "PUT",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchTerms();
        fetchCurrentTerms();
      }
    } catch (error) {
      console.error("Error al establecer los términos como actuales:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold mb-8 text-center pt-10">
        Gestión de Términos y Condiciones
      </h1>

      {/* Formulario para crear nuevos términos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear Nuevos Términos</h2>
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Título"
          value={newTerms.title}
          onChange={(e) => setNewTerms({ ...newTerms, title: e.target.value })}
        />
        <textarea
          className="border p-2 mb-2 w-full"
          placeholder="Contenido"
          value={newTerms.content}
          onChange={(e) =>
            setNewTerms({ ...newTerms, content: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2 mb-2 w-full"
          value={newTerms.effectiveDate}
          onChange={(e) =>
            setNewTerms({ ...newTerms, effectiveDate: e.target.value })
          }
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleCreateTerms}
        >
          Crear
        </button>
      </div>

      {/* Listado de términos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Términos</h2>
        {terms.length > 0 ? (
          terms.map((term) => (
            <div key={term.id} className="border p-4 mb-2">
              {editingTerms && editingTerms.id === term.id ? (
                <>
                  <input
                    type="text"
                    className="border p-2 mb-2 w-full"
                    value={editingTerms.title}
                    onChange={(e) =>
                      setEditingTerms({
                        ...editingTerms,
                        title: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="border p-2 mb-2 w-full"
                    value={editingTerms.content}
                    onChange={(e) =>
                      setEditingTerms({
                        ...editingTerms,
                        content: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    className="border p-2 mb-2 w-full"
                    value={editingTerms.effectiveDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditingTerms({
                        ...editingTerms,
                        effectiveDate: e.target.value,
                      })
                    }
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleUpdateTerms}
                  >
                    Guardar
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => setEditingTerms(null)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{term.title}</h3>
                  <p>{term.content}</p>
                  <p>
                    <strong>Vigencia:</strong>{" "}
                    {new Date(term.effectiveDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Actual:</strong>{" "}
                    {term.isCurrent ? "Sí" : "No"}
                  </p>
                  <div className="mt-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => setEditingTerms(term)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleDeleteTerms(term.id)}
                    >
                      Eliminar
                    </button>
                    {!term.isCurrent && (
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => handleSetCurrentTerms(term.id)}
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
          <p>No hay términos disponibles</p>
        )}
      </div>

      {/* Términos actuales */}
      {currentTerms && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Términos Actuales
          </h2>
          <div className="border p-4">
            <h3 className="font-bold text-lg">{currentTerms.title}</h3>
            <p>{currentTerms.content}</p>
            <p>
              <strong>Vigencia:</strong>{" "}
              {new Date(currentTerms.effectiveDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TermsPage;
