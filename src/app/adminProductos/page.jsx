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
    supplierId: "",
    compatibilities: "",
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
      supplierId: "",
      compatibilities: "",
    });
    setImages([]);
  };

  // Función para crear un nuevo producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.partNumber || !form.supplierId) {
      setMessage("Faltan campos obligatorios: name, partNumber, supplierId.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
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
        // Si estamos en la pestaña de listado, refrescamos los productos
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
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
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
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
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
      supplierId: product.supplierId,
      compatibilities: JSON.stringify(product.compatibilities) || "",
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
      formData.append(key, form[key]);
    }
    // Si deseas remover las imágenes antiguas, puedes enviar una bandera
    // formData.append("removeOldImages", "true");
    images.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${editingProductId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
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
    <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <h1 className="text-3xl font-bold text-center mb-8">Administración de Productos</h1>
      
      {/* Pestañas para cambiar entre crear y listar */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => {
            clearForm();
            setEditingProductId(null);
            setActiveTab("create");
          }}
          className={`px-4 py-2 rounded ${activeTab === "create" ? "bg-green-700 text-white" : "bg-gray-300 text-gray-700"}`}
        >
          Crear Producto
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded ${activeTab === "list" ? "bg-green-700 text-white" : "bg-gray-300 text-gray-700"}`}
        >
          Listar Productos
        </button>
      </div>
      
      {/* Formulario para crear o editar producto */}
      {(activeTab === "create" || activeTab === "edit") && (
        <div
          className={`shadow-md rounded-lg overflow-hidden p-6 ${
            theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            {editingProductId ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>
          <form
            onSubmit={editingProductId ? handleUpdateProduct : handleCreateProduct}
            className="space-y-4"
          >
            <div>
              <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                }`}
                required
              />
            </div>
            <div>
              <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                }`}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                  }`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Part Number
                </label>
                <input
                  type="text"
                  name="partNumber"
                  value={form.partNumber}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Categoría
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                  }`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Marca
                </label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Descuento
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="discount"
                  value={form.discount}
                  onChange={handleInputChange}
                  className={`w-full border p-2 rounded-lg ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                  }`}
                />
              </div>
            </div>
            <div>
              <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                ID del Proveedor
              </label>
              <input
                type="number"
                name="supplierId"
                value={form.supplierId}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                }`}
                required
              />
            </div>
            <div>
              <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Compatibilidades (JSON)
              </label>
              <textarea
                name="compatibilities"
                value={form.compatibilities}
                onChange={handleInputChange}
                placeholder='Ej: [{"make": "Toyota", "model": "Corolla", "year": 2020}]'
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                }`}
              ></textarea>
            </div>
            <div>
              <label className={`block mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Imágenes {editingProductId ? "(Nuevas)" : "(puedes seleccionar varias)"}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className={`w-full border p-2 rounded-lg ${
                  theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"
                }`}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-4 rounded ${
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
          className={`shadow-md rounded-lg overflow-hidden p-6 ${
            theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Listado de Productos</h2>
          {isLoadingProducts ? (
            <p>Cargando productos...</p>
          ) : products.length > 0 ? (
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Precio</th>
                  <th className="px-4 py-2 border">Stock</th>
                  <th className="px-4 py-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td className="px-4 py-2 border">{prod.id}</td>
                    <td className="px-4 py-2 border">{prod.name}</td>
                    <td className="px-4 py-2 border">{prod.price}</td>
                    <td className="px-4 py-2 border">{prod.stock}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEditProduct(prod)}
                        className="mr-2 py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="py-1 px-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
