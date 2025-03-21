"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";

function AdminProductsPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const router = useRouter();

  // Verificar autenticación y rol de administrador
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
    }
  }, [isAuthenticated, user]);

  // Estado para la pestaña activa: "create" para crear o editar, "list" para listar
  const [activeTab, setActiveTab] = useState("create");

  // Estados para el formulario (usado tanto en creación como en edición)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    partNumber: "",
    category: "",
    brand: "",
    discount: "",
    makes: [], // Array de marcas compatibles
    models: [], // Array de modelos compatibles
    years: [], // Array de años compatibles
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el listado de productos
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Para saber si estamos editando y cuál producto
  const [editingProductId, setEditingProductId] = useState(null);

  // Manejar la selección de archivos para imágenes (múltiples)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const invalid = files.find((file) => !allowedTypes.includes(file.type));
    if (invalid) {
      setImages([]);
      setMessage("Formato de imagen no permitido. Usa JPG, PNG o GIF.");
      return;
    }
    setImages(files);
    setMessage("");
  };

  // Actualizar el estado del formulario según cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en los arrays de compatibilidad
  const handleCompatibilityChange = (e, index) => {
    const { name, value } = e.target;
    const updatedArray = [...form[name]];
    updatedArray[index] = value;
    setForm((prev) => ({ ...prev, [name]: updatedArray }));
  };

  // Agregar una nueva fila de compatibilidad
  const addCompatibilityRow = () => {
    setForm((prev) => ({
      ...prev,
      makes: [...prev.makes, ""],
      models: [...prev.models, ""],
      years: [...prev.years, ""],
    }));
  };

  // Eliminar una fila de compatibilidad
  const removeCompatibilityRow = (index) => {
    setForm((prev) => ({
      ...prev,
      makes: prev.makes.filter((_, i) => i !== index),
      models: prev.models.filter((_, i) => i !== index),
      years: prev.years.filter((_, i) => i !== index),
    }));
  };

  // Limpiar el formulario
  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      partNumber: "",
      category: "",
      brand: "",
      discount: "",
      makes: [],
      models: [],
      years: [],
    });
    setImages([]);
  };

// Frontend: handleCreateProduct function
const handleCreateProduct = async (e) => {
  e.preventDefault();

  // Validar campos obligatorios (sin supplierId)
  if (!form.name || !form.partNumber) {
    setMessage("Faltan campos obligatorios: name, partNumber.");
    return;
  }

  // Convertir years a números solo si hay compatibilidad
  const yearsAsNumbers = form.years.map((year) => parseInt(year, 10));

  setIsLoading(true);
  const formData = new FormData();

  // Agregar campos del formulario al FormData (sin supplierId)
  for (const key in form) {
    if (key !== "makes" && key !== "models" && key !== "years") {
      formData.append(key, form[key]);
    }
  }

  // Siempre agregar compatibilidades, incluso si están vacías
  formData.append("makes", JSON.stringify(form.makes || []));
  formData.append("models", JSON.stringify(form.models || []));
  formData.append("years", JSON.stringify(yearsAsNumbers || []));

  // Agregar imágenes al FormData
  images.forEach((file) => formData.append("images", file));

  try {
    const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/crear`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setMessage("Producto creado exitosamente.");
      clearForm();
      if (activeTab === "list") fetchProducts();
    } else {
      const errorData = await response.json();
      setMessage(errorData.message || "Error al crear el producto.");
    }
  } catch (error) {
    console.error("Error al crear producto:", error);
    setMessage("Error al crear el producto.");
  } finally {
    setIsLoading(false);
  }
};
    
  // Función para obtener la lista de productos
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/`, {
        credentials: "include",
      });
      console.log("Response status:", response.status); // Log the status
      if (response.ok) {
        const data = await response.json();
        console.log("Products data:", data); // Log the data
        setProducts(data.productos); // Set the productos array
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData); // Log the error
        setMessage("Error al obtener productos.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Error al obtener productos.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/productos/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setMessage("Producto eliminado exitosamente.");
        fetchProducts();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al eliminar el producto.");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMessage("Error al eliminar el producto.");
    }
  };

  // Preparar la edición del producto: se rellenan los campos del formulario
  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      partNumber: product.partNumber,
      category: product.category,
      brand: product.brand,
      discount: product.discount,
      makes: product.compatibilities.map((c) => c.make),
      models: product.compatibilities.map((c) => c.model),
      years: product.compatibilities.map((c) => c.year.toString()),
    });
    // Si se van a subir nuevas imágenes, se resetea el array
    setImages([]);
    // Se activa la vista de edición
    setActiveTab("edit");
  };

  // Actualizar el producto
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProductId) return;
    setIsLoading(true);
    const formData = new FormData();
    for (const key in form) {
      if (Array.isArray(form[key])) {
        form[key].forEach((value) => formData.append(key, value));
      } else {
        formData.append(key, form[key]);
      }
    }
    images.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/productos/${editingProductId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessage("Producto actualizado exitosamente.");
        clearForm();
        setEditingProductId(null);
        setActiveTab("list");
        fetchProducts();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al actualizar el producto.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setMessage("Error al actualizar el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar edición y volver a la pestaña de listado
  const cancelEdit = () => {
    setEditingProductId(null);
    clearForm();
    setActiveTab("list");
  };

  // Actualizar el listado de productos al cambiar a la pestaña "list"
  useEffect(() => {
    if (activeTab === "list") {
      fetchProducts();
    }
  }, [activeTab]);

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">
        Administración de Productos
      </h1>

      {/* Pestañas para cambiar entre crear y listar */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => {
            clearForm();
            setEditingProductId(null);
            setActiveTab("create");
          }}
          className={`px-4 py-2 rounded transition-all ${
            activeTab === "create"
              ? "bg-green-700 text-white hover:bg-green-800"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          Crear Producto
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded transition-all ${
            activeTab === "list"
              ? "bg-green-700 text-white hover:bg-green-800"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          Listar Productos
        </button>
      </div>

      {/* Formulario para crear o editar producto */}
      {(activeTab === "create" || activeTab === "edit") && (
        <div
          className={`shadow-lg rounded-lg overflow-hidden p-6 max-w-2xl mx-auto ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100"
              : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">
            {editingProductId ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>
          <form
            onSubmit={
              editingProductId ? handleUpdateProduct : handleCreateProduct
            }
            className="space-y-6"
          >
            {/* Campos básicos del producto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                ></textarea>
              </div>
              <div>
                <label className="block mb-2 font-medium">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleInputChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Part Number</label>
                <input
                  type="text"
                  name="partNumber"
                  value={form.partNumber}
                  onChange={handleInputChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Categoría</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Aceites y Lubricantes">
                    Aceites y Lubricantes
                  </option>
                  <option value="Afinaciones">Afinaciones</option>
                  <option value="Reparaciones de Motor">
                    Reparaciones de Motor
                  </option>
                  <option value="Suspensión y Dirección">
                    Suspensión y Dirección
                  </option>
                  <option value="Accesorios y Partes de Colisión">
                    Accesorios y Partes de Colisión
                  </option>
                  <option value="Partes Eléctricas">Partes Eléctricas</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Marca</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleInputChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Descuento</label>
                <input
                  type="number"
                  step="0.01"
                  name="discount"
                  value={form.discount}
                  onChange={handleInputChange}
                  className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                      : "border-gray-300 focus:ring-green-500"
                  }`}
                />
              </div>
            </div>

            {/* Sección de compatibilidades */}
            <div>
              <h3 className="text-xl font-bold mb-4">Compatibilidades</h3>
              {form.makes.map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                >
                  <input
                    type="text"
                    name="makes"
                    value={form.makes[index]}
                    onChange={(e) => handleCompatibilityChange(e, index)}
                    placeholder="Marca"
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  <input
                    type="text"
                    name="models"
                    value={form.models[index]}
                    onChange={(e) => handleCompatibilityChange(e, index)}
                    placeholder="Modelo"
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  <input
                    type="number"
                    name="years"
                    value={form.years[index]}
                    onChange={(e) => handleCompatibilityChange(e, index)}
                    placeholder="Año"
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                        : "border-gray-300 focus:ring-green-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => removeCompatibilityRow(index)}
                    className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCompatibilityRow}
                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Agregar Compatibilidad
              </button>
            </div>

            {/* Subida de imágenes */}
            <div>
              <label className="block mb-2 font-medium">
                Imágenes{" "}
                {editingProductId ? "(Nuevas)" : "(puedes seleccionar varias)"}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:ring-green-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-4 rounded transition-all ${
                  isLoading
                    ? "bg-gray-400"
                    : theme === "dark"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-700 text-white hover:bg-green-800"
                }`}
              >
                {isLoading
                  ? editingProductId
                    ? "Actualizando producto..."
                    : "Creando producto..."
                  : editingProductId
                  ? "Actualizar Producto"
                  : "Crear Producto"}
              </button>
              {editingProductId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Cancelar
                </button>
              )}
            </div>

            {/* Mensajes de éxito o error */}
            {message && (
              <p
                className={`mt-4 text-center ${
                  message.includes("Error") ? "text-red-500" : "text-green-500"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Listado de productos */}
      {activeTab === "list" && (
  <div
    className={`shadow-lg rounded-lg overflow-hidden p-6 max-w-7xl mx-auto ${
      theme === "dark"
        ? "bg-gray-800 text-gray-100"
        : "bg-white text-gray-900"
    }`}
  >
    <h2 className="text-2xl font-bold mb-6">Listado de Productos</h2>
    {isLoadingProducts ? (
      <p>Cargando productos...</p>
    ) : products.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className={`border rounded-lg overflow-hidden shadow-lg ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Imagen del producto */}
            {prod.images.length > 0 && (
              <img
                src={prod.images[0].url}
                alt={prod.name}
                className="w-full h-48 object-cover"
              />
            )}

            {/* Contenido de la tarjeta */}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{prod.name}</h3>
              <p className="text-gray-500 mb-2">{prod.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">${prod.price}</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    prod.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {prod.stock > 0 ? `Stock: ${prod.stock}` : "Agotado"}
                </span>
              </div>

              {/* Acciones (editar/eliminar) */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProduct(prod)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(prod.id)}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No se encontraron productos.</p>
    )}
  </div>
)}
    </div>
  );
}

export default AdminProductsPage;
