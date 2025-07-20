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
  FiMapPin
} from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import Script from "next/script";
import { useRef } from "react";

function CarritoPage() {
  const { refreshCart } = useCart();
  const { user, isAuthenticated, theme, isAuthLoading } = useAuth();
  const [carrito, setCarrito] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [paypalInitialized, setPaypalInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [direcciones, setDirecciones] = useState([]);
  const [selectedDireccionId, setSelectedDireccionId] = useState(null);
  const [showDireccionForm, setShowDireccionForm] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState({
    calle: "",
    numero: "",
    ciudad: "",
    estado: "",
    cp: "",
    pais: "México",
    referencias: ""
  });
  const paypalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Obtener el carrito del usuario
useEffect(() => {
  if (!isAuthLoading && !isAuthenticated) {
    router.push("/login");
  }

    const obtenerCarrito = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito`, {
          credentials: "include",
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

const obtenerDirecciones = async () => {
  try {
    const res = await fetch(`${CONFIGURACIONES.BASEURL2}/direccion/direcciones`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error('Error al obtener direcciones');
    }

    const response = await res.json();
    
    // Ahora la respuesta viene en response.data
    const direccionesArray = Array.isArray(response.data) ? response.data : [];

    if (direccionesArray.length === 0) {
      setShowDireccionForm(true);
    } else {
      setDirecciones(direccionesArray);
      setSelectedDireccionId(direccionesArray[0]?.id || null);
    }
  } catch (error) {
    console.error("Error al obtener direcciones:", error);
    setDirecciones([]);
    setShowDireccionForm(true);
  }
};

    refreshCart();
    obtenerCarrito();
    obtenerDirecciones();
  }, [isAuthLoading,isAuthenticated, router]);

  // PayPal Effect
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !carrito ||
      !carrito.items ||
      carrito.items.length === 0 ||
      paypalRef.current === null
    ) return;

    let isCancelled = false;

    paypalRef.current.innerHTML = "";

    const renderPaypalButton = async () => {
      try {
        await window.paypal.Buttons({
          createOrder: async () => {
            if (!selectedDireccionId) {
              Swal.fire({
                title: "Dirección requerida",
                text: "Debes seleccionar o registrar una dirección de envío",
                icon: "warning"
              });
              throw new Error("No address selected");
            }

            const res = await fetch(`${CONFIGURACIONES.BASEURL2}/paypal/create-order`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: carrito.items.map(item => {
                  const discount = item.product.discount || 0;
                  const priceWithDiscount = item.product.price * (1 - discount / 100);

                  return {
                    id: item.product.id,
                    name: item.product.name,
                    price: parseFloat(priceWithDiscount.toFixed(2)),
                    quantity: item.quantity
                  };
                }),
                total: calcularTotales().total,
                direccionId: selectedDireccionId
              })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al crear orden");
            return data.orderId;
          },
          onApprove: async (data) => {
            const res = await fetch(`${CONFIGURACIONES.BASEURL2}/paypal/capture-order`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: data.orderID,
                direccionId: selectedDireccionId
              }),
            });
            const result = await res.json();

            if (res.ok && !isCancelled) {
              Swal.fire("¡Pago exitoso!", "Gracias por tu compra", "success");
              refreshCart();
              router.push("/gracias");
            } else if (!isCancelled) {
              Swal.fire("Error", result.message || "Error al capturar el pago", "error");
            }
          },
          onError: (err) => {
            if (!isCancelled) {
              console.error("PayPal error:", err);
              Swal.fire("Error", "Hubo un error con PayPal", "error");
            }
          },
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 55
          }
        }).render(paypalRef.current);
      } catch (err) {
        if (!isCancelled) {
          console.error("Error al renderizar botón PayPal:", err);
        }
      }
    };

    if (window.paypal) {
      renderPaypalButton();
    } else {
      const interval = setInterval(() => {
        if (window.paypal) {
          clearInterval(interval);
          renderPaypalButton();
        }
      }, 200);
      return () => clearInterval(interval);
    }

    return () => {
      isCancelled = true;
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
    };
  }, [carrito, selectedDireccionId]);

  const handleDireccionChange = (e) => {
    setSelectedDireccionId(e.target.value);
  };

  const handleNuevaDireccionChange = (e) => {
    const { name, value } = e.target;
    setNuevaDireccion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarDireccion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/direccion/nueva`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaDireccion)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al agregar dirección");

      setDirecciones([...direcciones, data]);
      setSelectedDireccionId(data.id);
      setShowDireccionForm(false);
      setNuevaDireccion({
        calle: "",
        numero: "",
        ciudad: "",
        estado: "",
        cp: "",
        pais: "México",
        referencias: ""
      });

      Swal.fire("¡Éxito!", "Dirección agregada correctamente", "success");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", error.message || "Error al guardar la dirección", "error");
    }
  };

  const selectedDireccion = direcciones?.find(d => d.id === selectedDireccionId) || null;

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


  const calcularTotales = () => {
    if (!carrito || !carrito.items) return { subtotal: 0, envio: 0, total: 0 };

    const subtotal = carrito.items.reduce((sum, item) => {
      const priceWithDiscount =
        item.product.price * (1 - (item.product.discount || 0) / 100);
      return sum + priceWithDiscount * item.quantity;
    }, 0);

    const envio = subtotal > 500 ? 0 : 99;
    const total = subtotal + envio;

    return { subtotal, envio, total };
  };

  const { subtotal, envio, total } = calcularTotales();

  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Carrito", path: "/carrito" },
  ];

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen py-8 pt-36 flex justify-center items-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 pt-20 transition-colors ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${CONFIGURACIONES.PAYPAL_CLIENT_ID}&currency=USD`}
        strategy="afterInteractive"
      />

      <div className="container px-4 mx-auto">
        <Breadcrumbs pages={breadcrumbsPages} />

        <div className={`p-6 rounded-xl shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="flex items-center mb-2 text-3xl font-bold">
            <FiShoppingCart className="mr-3" /> Mi Carrito de Compras
          </h1>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Revisa y gestiona los productos en tu carrito
          </p>
        </div>

        {!carrito || carrito.items.length === 0 ? (
          <div className={`p-8 rounded-xl shadow-lg text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <FiShoppingCart className="mx-auto mb-4 text-5xl text-gray-500" />
            <h2 className="mb-2 text-2xl font-bold">Tu carrito está vacío</h2>
            <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Aún no has agregado productos a tu carrito
            </p>
            <button
              onClick={() => router.push("/ventaProducto")}
              className={`px-6 py-3 rounded-lg font-medium ${theme === "dark" ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400"} text-white`}
            >
              Ir al catálogo de productos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-2/3">
              <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <div className={`hidden md:grid grid-cols-12 p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="col-span-6 font-medium">Producto</div>
                  <div className="col-span-2 font-medium text-center">Precio</div>
                  <div className="col-span-2 font-medium text-center">Cantidad</div>
                  <div className="col-span-2 font-medium text-center">Total</div>
                </div>

                {carrito.items.map((item) => (
                  <div key={item.id} className={`p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="grid items-center grid-cols-12 gap-4">
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
                            <div className={`w-full h-full flex items-center justify-center rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                              <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Sin imagen</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {item.product.brand} - {item.product.category}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-4 text-center md:col-span-2">
                        <span className="mr-2 font-medium md:hidden">Precio:</span>
                        {(() => {
                          const discount = item.product.discount || 0;
                          const priceWithDiscount = item.product.price * (1 - discount / 100);
                          return (
                            <>
                              ${priceWithDiscount.toFixed(2)}
                              {discount > 0 && (
                                <span className="text-xs text-gray-400 line-through ml-1">
                                  ${item.product.price.toFixed(2)}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      <div className="flex items-center justify-center col-span-4 md:col-span-2">
                        <div className="flex items-center overflow-hidden border rounded-lg">
                          <button
                            className="pl-2 hover:text-yellow-500"
                            onClick={() => actualizarCantidad(item.product.id, item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span className="px-5 py-2">{item.quantity}</span>
                          <button
                            className="pr-2 hover:text-yellow-500"
                            onClick={() => actualizarCantidad(item.product.id, item.quantity + 1)}
                            disabled={isUpdating}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-center col-span-4 md:col-span-2">
                        <div className="text-center">
                          <p className="pb-2 font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            className="flex items-center p-2 font-semibold text-red-500 border border-red-500 rounded-lg font hover:text-red-500 hover:font-bold"
                            onClick={() => eliminarProducto(item.product.id)}
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

            <div className="w-full lg:w-1/3">
              <div className={`rounded-xl shadow-lg overflow-hidden sticky top-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <div className={`p-6 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                  <h2 className="mb-4 text-xl font-bold">Resumen del Pedido</h2>
                </div>

                <div className="p-6">
                  {/* Sección de dirección de envío */}
                  <div className="mb-6">
                    <h3 className="flex items-center mb-3 text-lg font-semibold">
                      <FiMapPin className="mr-2" /> Dirección de envío
                    </h3>

                    {showDireccionForm ? (
                      <form onSubmit={agregarDireccion} className="space-y-3">
                        <div>
                          <label className="block mb-1 text-sm">Calle</label>
                          <input
                            type="text"
                            name="calle"
                            value={nuevaDireccion.calle}
                            onChange={handleNuevaDireccionChange}
                            className={`w-full p-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm">Número</label>
                          <input
                            type="text"
                            name="numero"
                            value={nuevaDireccion.numero}
                            onChange={handleNuevaDireccionChange}
                            className={`w-full p-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 text-sm">Ciudad</label>
                            <input
                              type="text"
                              name="ciudad"
                              value={nuevaDireccion.ciudad}
                              onChange={handleNuevaDireccionChange}
                              className={`w-full p-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm">Estado</label>
                            <input
                              type="text"
                              name="estado"
                              value={nuevaDireccion.estado}
                              onChange={handleNuevaDireccionChange}
                              className={`w-full p-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm">Código Postal</label>
                          <input
                            type="text"
                            name="cp"
                            value={nuevaDireccion.cp}
                            onChange={handleNuevaDireccionChange}
                            className={`w-full p-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm">Referencias</label>
                          <textarea
                            name="referencias"
                            value={nuevaDireccion.referencias}
                            onChange={handleNuevaDireccionChange}
                            className={`w-full p-2 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            rows="2"
                          />
                        </div>
                        <button
                          type="submit"
                          className={`w-full py-2 px-4 rounded font-medium ${theme === "dark" ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400"} text-white`}
                        >
                          Guardar Dirección
                        </button>
                      </form>
                    ) : (
                      <>
                        {direcciones.length > 0 && (
                          <select
                            value={selectedDireccionId || ""}
                            onChange={handleDireccionChange}
                            className={`w-full p-2 mb-3 border rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                          >
                            {direcciones.map(direccion => (
                              <option key={direccion.id} value={direccion.id}>
                                {direccion.calle} {direccion.numero}, {direccion.ciudad}
                              </option>
                            ))}
                          </select>
                        )}

                        {selectedDireccion && (
                          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                            <p className="font-medium">{selectedDireccion.calle} {selectedDireccion.numero}</p>
                            <p>{selectedDireccion.ciudad}, {selectedDireccion.estado}</p>
                            <p>CP: {selectedDireccion.cp}</p>
                            {selectedDireccion.referencias && (
                              <p className="mt-1 text-sm">Referencias: {selectedDireccion.referencias}</p>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => setShowDireccionForm(true)}
                          className={`w-full mt-3 py-2 px-4 rounded font-medium ${theme === "dark" ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400"} text-white`}
                        >
                          Agregar Nueva Dirección
                        </button>
                      </>
                    )}
                  </div>

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

                    <div ref={paypalRef} id="paypal-button-container" className="mt-6"></div>

                    {subtotal < 500 && (
                      <div className={`mt-4 p-3 rounded-lg text-center text-sm ${theme === "dark" ? "bg-gray-700 text-yellow-400" : "bg-yellow-100 text-yellow-800"}`}>
                        <FaShippingFast className="inline mr-2" />
                        ¡Faltan ${(500 - subtotal).toFixed(2)} para envío gratis!
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