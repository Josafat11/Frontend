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
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (Array.isArray(data)) {
      setDeslindes(data);
    } else {
      setDeslindes([]);
      console.error("La respuesta no es un array:", data);
    }
  };

  // Obtener el deslinde actual
  const fetchCurrentDeslinde = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${CONFIGURACIONES.BASEURL2}/docs/deslinde/current`,
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
      setCurrentDeslinde(data);
    } else {
      console.error("Error al obtener el deslinde actual");
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
    if (!newDeslinde.title || !newDeslinde.content || !newDeslinde.effectiveDate) {
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
      const token = localStorage.getItem("token");
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/deslinde/${editingDeslinde._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/deslinde/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
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
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/docs/deslinde/${id}/set-current`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
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
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        Gestión de Deslinde de Responsabilidad
      </h1>

      {/* Crear o editar deslinde */}
      <div className="shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {editingDeslinde ? "Editar Deslinde" : "Crear Nuevo Deslinde"}
        </h2>
        <div className="mb-4">
          <label className="block mb-2">Título</label>
          <input
            type="text"
            value={editingDeslinde ? editingDeslinde.title : newDeslinde.title}
            onChange={(e) =>
              editingDeslinde
                ? setEditingDeslinde({
                    ...editingDeslinde,
                    title: e.target.value,
                  })
                : setNewDeslinde({ ...newDeslinde, title: e.target.value })
            }
            className="w-full border p-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Contenido</label>
          <textarea
            value={
              editingDeslinde ? editingDeslinde.content : newDeslinde.content
            }
            onChange={(e) =>
              editingDeslinde
                ? setEditingDeslinde({
                    ...editingDeslinde,
                    content: e.target.value,
                  })
                : setNewDeslinde({ ...newDeslinde, content: e.target.value })
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
              editingDeslinde
                ? editingDeslinde.effectiveDate
                : newDeslinde.effectiveDate
            }
            onChange={(e) =>
              editingDeslinde
                ? setEditingDeslinde({
                    ...editingDeslinde,
                    effectiveDate: e.target.value,
                  })
                : setNewDeslinde({ ...newDeslinde, effectiveDate: e.target.value })
            }
            className="w-full border p-2 rounded-lg"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <button
          onClick={editingDeslinde ? handleUpdateDeslinde : handleCreateDeslinde}
          className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {editingDeslinde ? "Guardar Cambios" : "Crear Deslinde"}
        </button>
      </div>

      {/* Mostrar el deslinde actual */}
      {currentDeslinde && (
        <div className="mb-8 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Deslinde Actual</h2>
          <p>
            <strong>Título:</strong> {currentDeslinde.title}
          </p>
          <p>
            <strong>Contenido:</strong> {currentDeslinde.content}
          </p>
          <p>
            <strong>Fecha de Creación:</strong>{" "}
            {new Date(currentDeslinde.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Fecha de Vigencia:</strong>{" "}
            {new Date(currentDeslinde.effectiveDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Listar deslindes */}
      <div className="shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold mb-4">Listado de Deslindes</h2>
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
            {Array.isArray(deslindes) &&
              deslindes.map((deslinde) => (
                <tr key={deslinde._id}>
                  <td className="px-4 py-2">{deslinde.title}</td>
                  <td className="px-4 py-2">
                    {new Date(deslinde.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(deslinde.effectiveDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      onClick={() => setEditingDeslinde(deslinde)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                      onClick={() => handleSetCurrentDeslinde(deslinde._id)}
                    >
                      Establecer como Actual
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeleteDeslinde(deslinde._id)}
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

export default DeslindePage;
