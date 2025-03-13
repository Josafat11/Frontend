"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DeslindePage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [deslindes, setDeslindes] = useState([]);
  const [currentDeslinde, setCurrentDeslinde] = useState(null);
  const [newDeslinde, setNewDeslinde] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const [editingDeslinde, setEditingDeslinde] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Obtener todos los deslindes
  const fetchDeslindes = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde`, {
        method: "GET",
        credentials: "include", // Enviar cookie con el token
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setDeslindes(data);
      } else {
        setDeslindes([]);
        console.error("La respuesta no es un array:", data);
      }
    } catch (error) {
      console.error("Error al obtener los deslindes:", error);
    }
  };

  // Obtener el deslinde actual
  const fetchCurrentDeslinde = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/deslinde/current`,
        {
          method: "GET",
          credentials: "include", // Cookie
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentDeslinde(data);
      } else {
        console.error("Error al obtener el deslinde actual");
      }
    } catch (error) {
      console.error("Error al obtener el deslinde actual:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchDeslindes();
      fetchCurrentDeslinde();
    }
  }, [isAuthenticated, user]);

  // Crear un nuevo deslinde
  const handleCreateDeslinde = async () => {
    if (
      !newDeslinde.title ||
      !newDeslinde.content ||
      !newDeslinde.effectiveDate
    ) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      });
      return;
    }

    if (new Date(newDeslinde.effectiveDate) < new Date()) {
      toast.error(
        "La fecha de vigencia no puede ser anterior a la fecha actual.",
        { position: "top-center" }
      );
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde`, {
        method: "POST",
        credentials: "include", // Cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeslinde),
      });

      if (response.ok) {
        toast.success("Deslinde creado exitosamente.", {
          position: "top-center",
        });
        fetchDeslindes();
        fetchCurrentDeslinde();
        setNewDeslinde({ title: "", content: "", effectiveDate: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Error en el servidor.", { position: "top-center" });
    }
  };

  // Actualizar un deslinde existente
  const handleUpdateDeslinde = async () => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/deslinde/${editingDeslinde.id}`,
        {
          method: "PUT",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingDeslinde),
        }
      );
      if (response.ok) {
        setEditingDeslinde(null);
        fetchDeslindes();
        fetchCurrentDeslinde();
      }
    } catch (error) {
      console.error("Error al actualizar el deslinde:", error);
    }
  };

  // Eliminar un deslinde
  const handleDeleteDeslinde = async (id) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/deslinde/${id}`,
        {
          method: "DELETE",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchDeslindes();
        fetchCurrentDeslinde();
      }
    } catch (error) {
      console.error("Error al eliminar el deslinde:", error);
    }
  };

  // Establecer un deslinde como actual
  const handleSetCurrentDeslinde = async (id) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/deslinde/${id}/set-current`,
        {
          method: "PUT",
          credentials: "include", // Cookie
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        fetchDeslindes();
        fetchCurrentDeslinde();
      }
    } catch (error) {
      console.error("Error al establecer el deslinde como actual:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 pt-36">
      <h1 className="text-3xl font-bold mb-8 text-center pt-10">
        Gestión de Deslinde de Responsabilidad
      </h1>

      {/* Formulario para crear nuevo deslinde */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear Nuevo Deslinde</h2>
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Título"
          value={newDeslinde.title}
          onChange={(e) =>
            setNewDeslinde({ ...newDeslinde, title: e.target.value })
          }
        />
        <textarea
          className="border p-2 mb-2 w-full"
          placeholder="Contenido"
          value={newDeslinde.content}
          onChange={(e) =>
            setNewDeslinde({ ...newDeslinde, content: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2 mb-2 w-full"
          value={newDeslinde.effectiveDate}
          onChange={(e) =>
            setNewDeslinde({ ...newDeslinde, effectiveDate: e.target.value })
          }
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleCreateDeslinde}
        >
          Crear
        </button>
      </div>

      {/* Listado de deslindes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Deslindes</h2>
        {deslindes.length > 0 ? (
          deslindes.map((des) => (
            <div key={des.id} className="border p-4 mb-2">
              {editingDeslinde && editingDeslinde.id === des.id ? (
                <>
                  <input
                    type="text"
                    className="border p-2 mb-2 w-full"
                    value={editingDeslinde.title}
                    onChange={(e) =>
                      setEditingDeslinde({
                        ...editingDeslinde,
                        title: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="border p-2 mb-2 w-full"
                    value={editingDeslinde.content}
                    onChange={(e) =>
                      setEditingDeslinde({
                        ...editingDeslinde,
                        content: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    className="border p-2 mb-2 w-full"
                    value={editingDeslinde.effectiveDate?.split("T")[0] || ""}
                    onChange={(e) =>
                      setEditingDeslinde({
                        ...editingDeslinde,
                        effectiveDate: e.target.value,
                      })
                    }
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleUpdateDeslinde}
                  >
                    Guardar
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => setEditingDeslinde(null)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{des.title}</h3>
                  <p>{des.content}</p>
                  <p>
                    <strong>Vigencia:</strong>{" "}
                    {new Date(des.effectiveDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Actual:</strong> {des.isCurrent ? "Sí" : "No"}
                  </p>
                  <div className="mt-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => setEditingDeslinde(des)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleDeleteDeslinde(des.id)}
                    >
                      Eliminar
                    </button>
                    {!des.isCurrent && (
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => handleSetCurrentDeslinde(des.id)}
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
          <p>No hay deslindes disponibles</p>
        )}
      </div>

      {/* Deslinde actual */}
      {currentDeslinde && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Deslinde Actual
          </h2>
          <div className="border p-4">
            <h3 className="font-bold text-lg">{currentDeslinde.title}</h3>
            <p>{currentDeslinde.content}</p>
            <p>
              <strong>Vigencia:</strong>{" "}
              {new Date(currentDeslinde.effectiveDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeslindePage;
