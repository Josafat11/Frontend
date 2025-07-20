"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TermsPage() {
const { user, isAuthenticated, isAuthLoading, theme } = useAuth();
  const router = useRouter();
  const [terms, setTerms] = useState([]);
  const [currentTerms, setCurrentTerms] = useState(null);
  const [newTerms, setNewTerms] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  });
  const [editingTerms, setEditingTerms] = useState(null);

  const FileTextIcon = () => (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const EditIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  const CheckCircleIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  const TrashIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );


  // Verificar si el usuario es admin
useEffect(() => {
  if (!isAuthLoading && (!isAuthenticated || user?.role !== "admin")) {
    router.push("/login");
  }
}, [isAuthenticated, isAuthLoading, user, router]);

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


  
    if (isAuthLoading || !isAuthenticated || user?.role !== "admin") {
  return (
    <div className="container mx-auto py-8 pt-36 text-center">
      <p>Verificando acceso...</p>
    </div>
  );
}


  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark"
          ? "bg-gray-900 text-gray-600"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container max-w-6xl px-4 py-12 pt-16 mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`mt-10 mr-2 ${
                theme === "dark" ? " text-gray-300" : "text-slate-600"
              }`}
            >
              <FileTextIcon />
            </div>
            <h1
              className={`pt-10 text-4xl font-bold ${
                theme === "dark" ? "text-gray-200" : "text-slate-900"
              }`}
            >
              Gestión de Términos y Condiciones
            </h1>
          </div>
          <p
            className={`max-w-2xl mx-auto text-lg ${
              theme === "dark" ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Administre y mantenga actualizados los términos y condiciones de la
            empresa
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Formulario de creación */}
          <div className="mb-8 lg:col-span-2">
            <div className="overflow-hidden bg-white rounded-lg shadow-xl">
              <div
                className={`p-6 text-white rounded-t-lg ${
                  theme === "dark" 
                    ? "bg-gray-700" 
                    : "bg-green-600"
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="mr-2">
                    <EditIcon />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Crear Nuevos Términos y Condiciones
                  </h2>
                </div>
                <p className="text-sm">
                  Complete los campos para crear nuevos términos y condiciones
                </p>
              </div>

              <div
                className={`p-6 space-y-6 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-200"
                    : "bg-gray-50 text-gray-900"
                }`}
              >
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium"> 
                    Título
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Agrega un Título al Término"
                    value={newTerms.title}
                    onChange={(e) =>
                      setNewTerms({ ...newTerms, title: e.target.value })
                    }
                    className={` w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-400"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium"
                  >
                    Contenido
                  </label>
                  <textarea
                    id="content"
                    placeholder="Agrega el Contenido del Término"
                    value={newTerms.content}
                    onChange={(e) =>
                      setNewTerms({ ...newTerms, content: e.target.value })
                    }
                    className={` w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-400"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label 
                  htmlFor="effectiveDate"
                  className="block text-sm font-medium"
                  >
                    Fecha de Vigencia
                  </label>
                  <input 
                    id="effectiveDate"
                    type="date"
                    value={newTerms.effectiveDate}
                    onChange={(e) =>
                      setNewTerms({
                        ...newTerms,
                        effectiveDate: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-400"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>

                <button
                  onClick={handleCreateTerms}
                  className="w-full px-4 py-3 font-medium text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-500"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>

          {/* Terminos actual - Sidebar */}
          <div className="space-y-6">
            {currentTerms && (
              <div
                className={`mb-8 border rounded-lg shadow-sm 
                  ${
                  theme === "dark" 
                  ? "bg-gray-700 border-gray-700 text-white" 
                  : "bg-green-100 border-green-200 text-slate-900"
                  }`}
              >
                
                <div className="p-4 pb-3">
                  <div className="flex items-center mb-3">
                    <div className="mr-2 text-emerald-600">
                      <CheckCircleIcon />
                    </div>
                    <h2 className="text-lg font-semibold">Términos Actuales</h2>
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <h3 className="mb-2 font-semibold">
                      {currentTerms.title}
                    </h3>
                    <p className="text-sm leading-relaxed line-clamp-3">
                      {currentTerms.content}
                    </p>
                  </div>
                  <div className="flex items-center text-sm ">
                    <div className="mr-1">
                      <CalendarIcon />
                    </div>
                    <span>
                      <strong>Vigencia:</strong>{" "}
                      {new Date(
                        currentTerms.effectiveDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border-green-600 text-xs font-medium bg-emerald-100 text-emerald-800">
                    Activa
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Separador */}
        <div className="my-12 border-t border-slate-200"></div>

        {/* Listado de términos */}
        <div className="mb-8 space-y-6">
          <div className="flex items-center">
            <h2
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {" "}
              Lista de Términos {" "}
            </h2>
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-emerald-800 border border-green-600">
              {terms.length}{" "}
              {terms.length === 1
                ? "Término Registrado"
                : "Términos Registradas"}
            </span>
          </div>

          {terms.length > 0 ? (
            <div className="grid gap-4">
              {terms.map((term) => (
                <div
                  key={term.id}
                  className={`transition-shadow duration-200 border rounded-lg shadow-sm  hover:shadow-md ${
                  theme === "dark" 
                  ? "bg-gray-700 border-gray-700 text-white" 
                  : "bg-green-100 border-slate-200 text-slate-900"
                  }`}
                >
                  {editingTerms && editingTerms.id === term.id ? (
                    <div className="p-6 space-y-4">
                      <p className="font-semibold">Titulo</p>
                      <input
                        type="text"
                        value={editingTerms.title}
                        onChange={(e) =>
                          setEditingTerms({
                            ...editingTerms,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-gray-900 border rounded-md shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-slate-500"
                      />
                      <p className="font-semibold">Contenido</p>
                      <textarea
                        value={editingTerms.content}
                        onChange={(e) =>
                          setEditingTerms({
                            ...editingTerms,
                            content: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-gray-900 border rounded-md shadow-sm border-slate-300 min-h-[100px] resize-vertical focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <p className="font-semibold">Fecha de Vigencia</p>
                      <input
                        type="date"
                        value={editingTerms.effectiveDate?.split("T")[0] || ""}
                        onChange={(e) =>
                          setEditingTerms({
                            ...editingTerms,
                            effectiveDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-gray-900 border rounded-md shadow-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-slate-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateTerms}
                          className="px-4 py-2 font-medium text-white transition-colors duration-200 bg-green-800 rounded-md hover:bg-green-600"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingTerms(null)}
                          className="px-4 py-2 font-medium text-white transition-colors duration-200 bg-red-700 rounded-md border-slate-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="mb-4 text-lg font-semibold">
                            {term.title}
                          </h3>
                          <p className="leading-relaxed mb-7 line-clamp-4">
                            {term.content}
                          </p>
                          <div className="flex items-center gap-4 mb-4 text-sm">
                            <div className="flex items-center">
                              <div className="mr-1">
                                <CalendarIcon />
                              </div>
                              <span>
                                <strong>Vigencia:</strong>{" "}
                                {new Date(
                                  term.effectiveDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              <strong> Actual: </strong>{" "}
                              {term.isCurrent ? "Sí" : "No"}
                            </span>
                            {term.isCurrent && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                Actual
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 mt-2 border-t border-slate-100">
                        <button
                          onClick={() => setEditingTerms(term)}
                          className="inline-flex items-center px-3 py-2 font-medium transition-colors duration-200 bg-white border rounded-md hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-300"
                        >
                          <div className="mr-1">
                            <EditIcon />
                          </div>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteTerms(term.id)}
                          className="inline-flex items-center px-3 py-2 font-medium text-white transition-colors duration-200 bg-red-700 rounded-md hover:bg-red-600 border-slate-300"
                        >
                          <div className="mr-1">
                            <TrashIcon />
                          </div>
                          Eliminar
                        </button>
                        {!term.isCurrent && (
                          <button
                            onClick={() => handleSetCurrentTerms(term.id)}
                            className="inline-flex items-center px-3 py-2 ml-auto font-medium text-white transition-colors duration-200 rounded-md bg-emerald-600 hover:bg-emerald-700"
                          >
                            <div className="mr-1">
                              <CheckCircleIcon />
                            </div>
                            Establecer como Actual
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-lg shadow-sm border-slate-200">
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 text-slate-400">
                  <FileTextIcon />
                </div>
                <p className="text-lg text-slate-500">
                  No hay términos disponibles
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Cree su primer término usando el formulario anterior
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
