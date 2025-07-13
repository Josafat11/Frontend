"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/CartContext";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
} from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";

function CarritoPage() {
  const { refreshCart } = useCart();
  const { user, isAuthenticated, theme } = useAuth();
  const [carrito, setCarrito] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // Obtener el carrito del usuario
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const obtenerCarrito = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito`, {
          credentials: "include", // Enviar cookies automáticamente
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al obtener el carrito");
        }

        setCarrito(data.carrito);
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "Error al cargar el carrito",
          icon: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    refreshCart();
    obtenerCarrito();
  }, [isAuthenticated, router]);

  const actualizarCantidad = async (productId, nuevaCantidad) => {
    // Cambiar parámetro a productId
    if (nuevaCantidad < 1) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/carrito/actualizar/${productId}`,
        {
          // Usar productId
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            quantity: nuevaCantidad,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el carrito");
      }
      refreshCart();

      // Actualizar el carrito localmente
      setCarrito((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: nuevaCantidad }
            : item
        ),
      }));
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Error al actualizar la cantidad",
        icon: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Eliminar producto del carrito
  const eliminarProducto = async (productId) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "¿Estás seguro de que quieres eliminar este producto del carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/carrito/eliminar/${productId}`,
        {
          // Usar productId
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Error al eliminar del carrito");
      refreshCart();
      // Actualizar el carrito localmente
      setCarrito((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.product.id !== productId),
      }));

      Swal.fire(
        "¡Eliminado!",
        "El producto ha sido removido del carrito.",
        "success"
      );
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Error al eliminar el producto",
        icon: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Calcular totales
  const calcularTotales = () => {
    if (!carrito || !carrito.items) return { subtotal: 0, envio: 0, total: 0 };

    const subtotal = carrito.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const envio = subtotal > 500 ? 0 : 99; // Envío gratis para compras mayores a $500
    const total = subtotal + envio;

    return { subtotal, envio, total };
  };

  const { subtotal, envio, total } = calcularTotales();

  // Definir las migas de pan
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Carrito", path: "/carrito" },
  ];

  if (!isAuthenticated) {
    return null; // Redirección manejada en el useEffect
  }

  if (isLoading) {
    return (
      <div
        className={`min-h-screen py-8 pt-36 flex justify-center items-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const abrirVentanaDePago = () => {
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const ventanaPago = window.open(
      `${CONFIGURACIONES.BASEURL2}/paypal/checkout`, // Ruta a tu backend que inicia el flujo PayPal
      "PagoPayPal",
      `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=yes`
    );

    if (
      !ventanaPago ||
      ventanaPago.closed ||
      typeof ventanaPago.closed === "undefined"
    ) {
      alert("Por favor, habilita las ventanas emergentes en tu navegador.");
    }
  };

  return (
    <div
      className={`min-h-screen py-8 pt-20 transition-colors ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container px-4 mx-auto">
        {/* Migajas de pan */}
        <Breadcrumbs pages={breadcrumbsPages} />

        {/* Encabezado */}
        <div
          className={`p-6 rounded-xl shadow-lg mb-8 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h1 className="flex items-center mb-2 text-3xl font-bold">
            <FiShoppingCart className="mr-3" /> Mi Carrito de Compras
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Revisa y gestiona los productos en tu carrito
          </p>
        </div>

        {!carrito || carrito.items.length === 0 ? (
          <div
            className={`p-8 rounded-xl shadow-lg text-center ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <FiShoppingCart className="mx-auto mb-4 text-5xl text-gray-500" />
            <h2 className="mb-2 text-2xl font-bold">Tu carrito está vacío</h2>
            <p
              className={`mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Aún no has agregado productos a tu carrito
            </p>
            <button
              onClick={() => router.push("/ventaProducto")}
              className={`px-6 py-3 rounded-lg font-medium ${
                theme === "dark"
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-green-500 hover:bg-green-400"
              } text-white`}
            >
              Ir al catálogo de productos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Lista de productos */}
            <div className="w-full lg:w-2/3">
              <div
                className={`rounded-xl shadow-lg overflow-hidden ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Encabezado de la tabla */}
                <div
                  className={`hidden md:grid grid-cols-12 p-4 border-b ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="col-span-6 font-medium">Producto</div>
                  <div className="col-span-2 font-medium text-center">
                    Precio
                  </div>
                  <div className="col-span-2 font-medium text-center">
                    Cantidad
                  </div>
                  <div className="col-span-2 font-medium text-center">
                    Total
                  </div>
                </div>

                {/* Productos */}
                {carrito.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border-b ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="grid items-center grid-cols-12 gap-4">
                      {/* Imagen y nombre */}
                      <div className="flex items-center col-span-12 md:col-span-6">
                        <div className="relative flex-shrink-0 w-16 h-16 mr-4">
                          {item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center rounded-lg ${
                                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`text-xs ${
                                  theme === "dark"
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                Sin imagen
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {item.product.brand} - {item.product.category}
                          </p>
                        </div>
                      </div>

                      {/* Precio unitario */}
                      <div className="col-span-4 text-center md:col-span-2">
                        <span className="mr-2 font-medium md:hidden">
                          Precio:
                        </span>
                        ${item.product.price}
                      </div>

                      {/* Cantidad */}
                      <div className="flex items-center justify-center col-span-4 md:col-span-2">
                        <div className="flex items-center overflow-hidden border rounded-lg">
                          <button
                            className="pl-2 hover:text-yellow-500"
                            onClick={() =>
                              actualizarCantidad(
                                item.product.id,
                                item.quantity - 1
                              )
                            } // Pasar item.product.id
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <FiMinus />
                          </button>

                          <span className="px-5 py-2">{item.quantity}</span>
                          <button
                            className="pr-2 hover:text-yellow-500"
                            onClick={() =>
                              actualizarCantidad(
                                item.product.id,
                                item.quantity + 1
                              )
                            } // Pasar item.product.id
                            disabled={isUpdating}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>

                      {/* Total y acciones */}
                      <div className="flex items-center justify-center col-span-4 md:col-span-2">
                        <div className="text-center">
                          <p className="pb-2 font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            className="flex items-center p-2 font-semibold text-red-500 border border-red-500 rounded-lg font hover:text-red-500 hover:font-bold"
                            onClick={() => eliminarProducto(item.product.id)} // Pasar item.product.id
                            disabled={isUpdating}
                          >
                            <FiTrash2 className="mr-1" />
                            <p>Eliminar</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="w-full lg:w-1/3">
              <div
                className={`rounded-xl shadow-lg overflow-hidden sticky top-4 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div
                  className={`p-6 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <h2 className="mb-4 text-xl font-bold">Resumen del Pedido</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span>
                        {envio === 0 ? (
                          <span className="flex items-center text-green-500">
                            <FaShippingFast className="mr-1" /> Gratis
                          </span>
                        ) : (
                          `$${envio.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-4 mt-4 text-lg font-bold border-t">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center w-full h-16 justify-evenly spa">
                      <Image
                        src="/assets/mercado-pago.png"
                        alt="Pago con Mercado Pago"
                        width={120}
                        height={80}
                        className="object-contain"
                      />
                      <Image
                        src="/assets/paypal-logo.png"
                        alt="Pago con Paypal"
                        width={120}
                        height={80}
                        className="object-contain"
                      />
                    </div>

                    <button
                      onClick={abrirVentanaDePago}
                      className={`w-full py-3 mt-6 rounded-lg font-bold flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-green-500 hover:bg-green-400"
                      } text-white`}
                    >
                      Proceder al pago <FiArrowRight className="ml-2" />
                    </button>

                    {subtotal < 500 && (
                      <div
                        className={`mt-4 p-3 rounded-lg text-center text-sm ${
                          theme === "dark"
                            ? "bg-gray-700 text-yellow-400"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <FaShippingFast className="inline mr-2" />
                        ¡Faltan ${(500 - subtotal).toFixed(2)} para envío
                        gratis!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarritoPage;
