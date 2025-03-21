"use client";

import { useState } from "react";

function FacturacionPage() {
  // Estados para los datos del cliente
  const [nombreCliente, setNombreCliente] = useState("");
  const [rfcCliente, setRfcCliente] = useState("");
  const [direccionCliente, setDireccionCliente] = useState("");

  // Estados para los productos
  const [productos, setProductos] = useState([
    { nombre: "", cantidad: 1, precio: 0, total: 0 },
  ]);

  // Estado para el total de la factura
  const [totalFactura, setTotalFactura] = useState(0);

  // Función para agregar un nuevo producto
  const agregarProducto = () => {
    setProductos([...productos, { nombre: "", cantidad: 1, precio: 0, total: 0 }]);
  };

  // Función para eliminar un producto
  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    calcularTotal(nuevosProductos);
  };

  // Función para actualizar los datos de un producto
  const actualizarProducto = (index, campo, valor) => {
    const nuevosProductos = [...productos];
    nuevosProductos[index][campo] = valor;

    // Calcular el total del producto
    nuevosProductos[index].total =
      nuevosProductos[index].cantidad * nuevosProductos[index].precio;

    setProductos(nuevosProductos);
    calcularTotal(nuevosProductos);
  };

  // Función para calcular el total de la factura
  const calcularTotal = (productos) => {
    const total = productos.reduce((sum, producto) => sum + producto.total, 0);
    setTotalFactura(total);
  };

  // Función para simular la generación de la factura
  const generarFactura = () => {
    alert("Factura generada correctamente (simulación).");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8">Simulación de Facturación</h1>

        {/* Datos del Cliente */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Datos del Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">RFC</label>
              <input
                type="text"
                value={rfcCliente}
                onChange={(e) => setRfcCliente(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="RFC del cliente"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                value={direccionCliente}
                onChange={(e) => setDireccionCliente(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Dirección del cliente"
              />
            </div>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          {productos.map((producto, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={producto.nombre}
                  onChange={(e) =>
                    actualizarProducto(index, "nombre", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) =>
                    actualizarProducto(index, "cantidad", parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
                <input
                  type="number"
                  value={producto.precio}
                  onChange={(e) =>
                    actualizarProducto(index, "precio", parseFloat(e.target.value))
                  }
                  className="w-full p-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <input
                  type="text"
                  value={`$${producto.total.toFixed(2)}`}
                  className="w-full p-2 border rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={() => eliminarProducto(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={agregarProducto}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Agregar Producto
          </button>
        </div>

        {/* Total de la Factura */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Total de la Factura</h2>
          <div className="text-right">
            <span className="text-2xl font-bold">${totalFactura.toFixed(2)}</span>
          </div>
        </div>

        {/* Botón de Generar Factura */}
        <div className="text-center">
          <button
            onClick={generarFactura}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
          >
            Generar Factura
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacturacionPage;