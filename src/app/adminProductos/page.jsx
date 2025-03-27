"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import { FiPackage,FiPlusCircle,FiList ,FiTag ,FiHash ,FiDollarSign, FiBox , FiAward ,FiPercent ,FiLayers ,FiAlignLeft ,FiTool ,FiPlus ,FiImage , FiLoader,FiEdit, FiTrash2, FiX, FiSave } from "react-icons/fi";
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
      years: product.compatibilities.map((c) => c.year?.toString() || ""), // Manejo más seguro
    });
    setImages([]);
    setActiveTab("edit");
  };

  // Actualizar el producto
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProductId) return;
    
    // Validación básica
    if (!form.name || !form.partNumber) {
      setMessage("Faltan campos obligatorios: name, partNumber.");
      return;
    }
  
    setIsLoading(true);
    const formData = new FormData();
  
    // Agregar campos simples
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("partNumber", form.partNumber);
    formData.append("category", form.category);
    formData.append("brand", form.brand);
    formData.append("discount", form.discount);
  
    // Agregar compatibilidades como JSON
    const compatibilities = form.makes.map((make, index) => ({
      make,
      model: form.models[index],
      year: parseInt(form.years[index]) || 0,
    }));
    
    formData.append("compatibilities", JSON.stringify(compatibilities));
  
    // Agregar imágenes
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
    <div className={`min-h-screen py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className={`p-6 rounded-xl shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="text-3xl font-bold text-center mb-2 flex items-center justify-center">
            <FiPackage className="mr-3" /> Administración de Productos
          </h1>
          <p className="text-center text-gray-500">
            Gestiona el inventario de productos de tu tienda
          </p>
        </div>
  
        {/* Pestañas */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex rounded-lg p-1 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
            <button
              onClick={() => {
                clearForm();
                setEditingProductId(null);
                setActiveTab("create");
              }}
              className={`flex items-center px-6 py-3 rounded-md transition-all ${
                activeTab === "create"
                  ? theme === "dark"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-500 text-white shadow-md"
                  : theme === "dark"
                  ? "text-gray-300 hover:bg-gray-600"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FiPlusCircle className="mr-2" /> Crear Producto
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center px-6 py-3 rounded-md transition-all ${
                activeTab === "list"
                  ? theme === "dark"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-green-500 text-white shadow-md"
                  : theme === "dark"
                  ? "text-gray-300 hover:bg-gray-600"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FiList className="mr-2" /> Listar Productos
            </button>
          </div>
        </div>
  
        {/* Formulario para crear/editar producto */}
        {(activeTab === "create" || activeTab === "edit") && (
          <div className={`rounded-xl shadow-lg overflow-hidden mb-8 max-w-4xl mx-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            {/* Encabezado del formulario */}
            <div className={`p-4 ${theme === "dark" ? "bg-gray-700" : "bg-green-600"} text-white`}>
              <h2 className="text-xl font-bold flex items-center">
                {editingProductId ? (
                  <>
                    <FiEdit className="mr-2" /> Editar Producto
                  </>
                ) : (
                  <>
                    <FiPlusCircle className="mr-2" /> Crear Nuevo Producto
                  </>
                )}
              </h2>
            </div>
            
            <form
              onSubmit={editingProductId ? handleUpdateProduct : handleCreateProduct}
              className="p-6 space-y-6"
            >
              {/* Campos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "name", label: "Nombre", type: "text", required: true, icon: FiTag },
                  { name: "partNumber", label: "Part Number", type: "text", required: true, icon: FiHash },
                  { name: "price", label: "Precio", type: "number", step: "0.01", icon: FiDollarSign },
                  { name: "stock", label: "Stock", type: "number", icon: FiBox },
                  { name: "brand", label: "Marca", type: "text", icon: FiAward },
                  { name: "discount", label: "Descuento (%)", type: "number", step: "0.01", icon: FiPercent },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block mb-2 font-medium flex items-center">
                      <field.icon className="mr-2 text-gray-500" /> {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleInputChange}
                      step={field.step}
                      required={field.required}
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 placeholder-gray-400" 
                          : "border-gray-300 placeholder-gray-500"
                      }`}
                    />
                  </div>
                ))}
                
                {/* Categoría */}
                <div>
                  <label className="block mb-2 font-medium flex items-center">
                    <FiLayers className="mr-2 text-gray-500" /> Categoría
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      theme === "dark" 
                        ? "bg-gray-700 border-gray-600" 
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Aceites y Lubricantes">Aceites y Lubricantes</option>
                    <option value="Afinaciones">Afinaciones</option>
                    <option value="Reparaciones de Motor">Reparaciones de Motor</option>
                    <option value="Suspensión y Dirección">Suspensión y Dirección</option>
                    <option value="Accesorios y Partes de Colisión">Accesorios y Partes de Colisión</option>
                    <option value="Partes Eléctricas">Partes Eléctricas</option>
                  </select>
                </div>
                
                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium flex items-center">
                    <FiAlignLeft className="mr-2 text-gray-500" /> Descripción
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      theme === "dark" 
                        ? "bg-gray-700 border-gray-600" 
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
  
              {/* Compatibilidades */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FiTool className="mr-2" /> Compatibilidades
                </h3>
                {form.makes.map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Marca</label>
                      <input
                        type="text"
                        name="makes"
                        value={form.makes[index]}
                        onChange={(e) => handleCompatibilityChange(e, index)}
                        placeholder="Ej. Toyota"
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600" 
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Modelo</label>
                      <input
                        type="text"
                        name="models"
                        value={form.models[index]}
                        onChange={(e) => handleCompatibilityChange(e, index)}
                        placeholder="Ej. Corolla"
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600" 
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Año</label>
                      <input
                        type="number"
                        name="years"
                        value={form.years[index]}
                        onChange={(e) => handleCompatibilityChange(e, index)}
                        placeholder="Ej. 2020"
                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600" 
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeCompatibilityRow(index)}
                        className={`w-full py-2 px-4 rounded-lg flex items-center justify-center ${
                          theme === "dark"
                            ? "bg-red-700 hover:bg-red-600"
                            : "bg-red-600 hover:bg-red-500"
                        } text-white transition-all`}
                      >
                        <FiTrash2 className="mr-2" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCompatibilityRow}
                  className={`py-2 px-4 rounded-lg flex items-center ${
                    theme === "dark"
                      ? "bg-blue-700 hover:bg-blue-600"
                      : "bg-blue-600 hover:bg-blue-500"
                  } text-white transition-all`}
                >
                  <FiPlus className="mr-2" /> Agregar Compatibilidad
                </button>
              </div>
  
              {/* Imágenes */}
              <div className="border-t pt-6">
                <label className="block mb-2 font-medium flex items-center">
                  <FiImage className="mr-2 text-gray-500" /> 
                  {editingProductId ? "Agregar más imágenes" : "Imágenes del producto"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    theme === "dark" 
                      ? "bg-gray-700 border-gray-600" 
                      : "border-gray-300"
                  }`}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Puedes seleccionar múltiples imágenes (máx. 5MB cada una)
                </p>
              </div>
  
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                {editingProductId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className={`py-3 px-6 rounded-lg flex items-center justify-center ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-500"
                        : "bg-gray-300 hover:bg-gray-400"
                    } transition-all`}
                  >
                    <FiX className="mr-2" /> Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`py-3 px-6 rounded-lg flex items-center justify-center ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : theme === "dark"
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-green-500 hover:bg-green-400"
                  } text-white transition-all`}
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      {editingProductId ? "Actualizando..." : "Creando..."}
                    </>
                  ) : editingProductId ? (
                    <>
                      <FiSave className="mr-2" /> Actualizar Producto
                    </>
                  ) : (
                    <>
                      <FiPlusCircle className="mr-2" /> Crear Producto
                    </>
                  )}
                </button>
              </div>
  
              {/* Mensajes de estado */}
              {message && (
                <div className={`mt-4 p-3 rounded-lg text-center ${
                  message.includes("Error") 
                    ? theme === "dark"
                      ? "bg-red-900/50 text-red-300"
                      : "bg-red-100 text-red-800"
                    : theme === "dark"
                    ? "bg-green-900/50 text-green-300"
                    : "bg-green-100 text-green-800"
                }`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        )}
  
        {/* Listado de productos */}
        {activeTab === "list" && (
          <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            {/* Encabezado de la lista */}
            <div className={`p-4 ${theme === "dark" ? "bg-gray-700" : "bg-green-600"} text-white`}>
              <h2 className="text-xl font-bold flex items-center">
                <FiList className="mr-2" /> Listado de Productos
              </h2>
            </div>
            
            <div className="p-6">
              {isLoadingProducts ? (
                <div className="flex justify-center items-center py-12">
                  <FiLoader className="animate-spin text-4xl text-green-500" />
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
                        theme === "dark" ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      {/* Imagen del producto */}
                      <div className="relative h-48 bg-gray-100">
                        {prod.images.length > 0 ? (
                          <img
                            src={prod.images[0].url}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                          }`}>
                            <FiImage className="text-3xl text-gray-500" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            prod.stock > 0
                              ? theme === "dark"
                                ? "bg-green-800 text-green-300"
                                : "bg-green-100 text-green-800"
                              : theme === "dark"
                              ? "bg-red-800 text-red-300"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {prod.stock > 0 ? `Stock: ${prod.stock}` : "Agotado"}
                          </span>
                        </div>
                      </div>
  
                      {/* Contenido de la tarjeta */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 line-clamp-1">{prod.name}</h3>
                        <p className={`text-sm mb-3 line-clamp-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {prod.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xl font-bold">${prod.price}</p>
                            {prod.discount > 0 && (
                              <p className={`text-xs ${
                                theme === "dark" ? "text-gray-500" : "text-gray-400"
                              }`}>
                                <span className="line-through">${(prod.price / (1 - prod.discount/100)).toFixed(2)}</span> ({prod.discount}% OFF)
                              </p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                          }`}>
                            {prod.category}
                          </span>
                        </div>
  
                        {/* Acciones */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                              theme === "dark"
                                ? "bg-blue-700 hover:bg-blue-600"
                                : "bg-blue-600 hover:bg-blue-500"
                            } text-white transition-all`}
                          >
                            <FiEdit className="mr-2" /> Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                              theme === "dark"
                                ? "bg-red-700 hover:bg-red-600"
                                : "bg-red-600 hover:bg-red-500"
                            } text-white transition-all`}
                          >
                            <FiTrash2 className="mr-2" /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiPackage className="mx-auto text-4xl text-gray-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No se encontraron productos</h3>
                  <p className={`mb-6 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    No hay productos registrados en el sistema
                  </p>
                  <button
                    onClick={() => {
                      clearForm();
                      setEditingProductId(null);
                      setActiveTab("create");
                    }}
                    className={`py-2 px-6 rounded-lg flex items-center mx-auto ${
                      theme === "dark"
                        ? "bg-green-600 hover:bg-green-500"
                        : "bg-green-500 hover:bg-green-400"
                    } text-white transition-all`}
                  >
                    <FiPlusCircle className="mr-2" /> Crear Primer Producto
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductsPage;
