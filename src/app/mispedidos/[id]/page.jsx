"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiBox, FiCalendar, FiMapPin, FiTruck, FiUser, FiCreditCard, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { CONFIGURACIONES } from "@/app/config/config";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

function DetallePedidoPage({ params }) {
  const { id } = params;
  const { user, isAuthenticated, isAuthLoading, theme } = useAuth();
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const breadcrumbsPages = [
    { name: "Inicio", path: "/" },
    { name: "Mis Pedidos", path: "/misPedidos" },
    { name: `Pedido #${id}`, path: `/misPedidos/${id}` },
  ];

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?redirect=/misPedidos");
      return;
    }
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPedido = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/${id}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Pedido no encontrado");
          } else {
            throw new Error("Error al cargar el pedido");
          }
        }

        const data = await res.json();
        setPedido(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedido();
  }, [id, isAuthenticated]);

  const getEstadoStyles = (estado) => {
    const base = "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2";
    
    switch(estado) {
      case "EN_PROCESO":
        return `${base} bg-yellow-100 text-yellow-800 ${theme === 'dark' ? 'dark:bg-yellow-900 dark:text-yellow-200' : ''}`;
      case "EN_CAMINO":
        return `${base} bg-blue-100 text-blue-800 ${theme === 'dark' ? 'dark:bg-blue-900 dark:text-blue-200' : ''}`;
      case "ENTREGADO":
        return `${base} bg-green-100 text-green-800 ${theme === 'dark' ? 'dark:bg-green-900 dark:text-green-200' : ''}`;
      case "CANCELADO":
        return `${base} bg-red-100 text-red-800 ${theme === 'dark' ? 'dark:bg-red-900 dark:text-red-200' : ''}`;
      default:
        return `${base} bg-gray-100 text-gray-800 ${theme === 'dark' ? 'dark:bg-gray-700 dark:text-gray-200' : ''}`;
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case "EN_PROCESO":
        return <FiAlertCircle className="text-lg" />;
      case "EN_CAMINO":
        return <FiTruck className="text-lg" />;
      case "ENTREGADO":
        return <FiCheckCircle className="text-lg" />;
      case "CANCELADO":
        return <FiAlertCircle className="text-lg" />;
      default:
        return <FiBox className="text-lg" />;
    }
  };

  if (isAuthLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen py-8 pt-32 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl w-24 h-24"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen py-8 pt-32 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs pages={breadcrumbsPages} />
          
          <div className={`p-8 rounded-xl text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <FiAlertCircle className="mx-auto text-5xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error al cargar el pedido</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => router.back()}
                className="px-6 py-2 border rounded-lg flex items-center gap-2"
              >
                <FiArrowLeft /> Volver atrás
              </button>
              <Link 
                href="/misPedidos" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                Ver mis pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return null;
  }

  return (
    <div className={`min-h-screen py-8 pt-32 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <Breadcrumbs pages={breadcrumbsPages} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Detalle del Pedido #{pedido.id}</h1>
            <div className="flex items-center gap-3">
              <span className={getEstadoStyles(pedido.estado)}>
                {getEstadoIcon(pedido.estado)}
                {pedido.estado.replace("_", " ")}
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <FiCalendar /> 
                {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <Link 
            href="/mispedidos" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <FiArrowLeft className="mr-1" /> Volver a mis pedidos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Productos y Resumen */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiBox /> Productos ({pedido.items?.length || 0})
              </h2>
              
              <div className="divide-y">
                {pedido.items?.map((item, idx) => (
                  <div key={idx} className="py-5 flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
                      {item.producto?.images?.[0]?.url ? (
                        <Image
                          src={item.producto.images[0].url}
                          alt={item.producto.name}
                          fill
                          className="rounded-lg object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-400">
                          <FiBox className="text-2xl" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.producto?.name}</h3>
                      <p className="text-gray-500 mb-2">{item.producto?.partNumber}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Precio unitario</p>
                          <p className="font-medium">${item.precioUnitario?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Cantidad</p>
                          <p className="font-medium">{item.cantidad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="font-medium">${item.subtotal?.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4 text-right">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${pedido.items?.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium">$0.00</span> {/* Asumiendo envío gratuito */}
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t">
                  <span>Total:</span>
                  <span>${pedido.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Información de envío y cliente */}
          <div className="space-y-6">
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiMapPin /> Dirección de envío
              </h2>
              
              {pedido.direccion ? (
                <div>
                  <p className="font-medium">{pedido.direccion.calle} {pedido.direccion.numero}</p>
                  <p>{pedido.direccion.ciudad}, {pedido.direccion.estado}</p>
                  <p>{pedido.direccion.pais}, CP {pedido.direccion.cp}</p>
                </div>
              ) : (
                <p className="text-gray-500">No se encontró dirección de envío</p>
              )}
            </div>
            
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiUser /> Información del cliente
              </h2>
              
              {pedido.cliente ? (
                <div>
                  <p className="font-medium">{pedido.cliente.name} {pedido.cliente.lastname}</p>
                  <p>Email: {pedido.cliente.email}</p>
                  <p>Teléfono: {pedido.cliente.telefono}</p>
                </div>
              ) : (
                <p className="text-gray-500">No se encontró información del cliente</p>
              )}
            </div>
            
            <div className={`p-6 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiCreditCard /> Método de pago
              </h2>
              
              <div>
                <p className="font-medium">Tarjeta de crédito/débito</p>
                <p className="text-gray-500">Terminada en **** 4242</p>
                <p className="text-gray-500">Total pagado: ${pedido.total?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallePedidoPage;