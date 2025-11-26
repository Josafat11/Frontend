"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../config/config";
import Image from "next/image";
import { 
  FiBox, 
  FiTruck, 
  FiCalendar, 
  FiShoppingCart,
  FiMapPin,
  FiUser,
  FiChevronRight,
  FiLoader,
  FiAlertCircle
} from "react-icons/fi";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function MisPedidosPage() {
  const { user, isAuthenticated, isAuthLoading, theme } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const router = useRouter();

  const breadcrumbsPages = [
    { name: "Inicio", path: "/" },
    { name: "Mis Pedidos", path: "/misPedidos" },
  ];

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login?redirect=/misPedidos");
      return;
    }
  }, [isAuthenticated, isAuthLoading]);

  const fetchPedidos = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");
      
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/pedidos?page=${page}&limit=${pagination.limit}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Error al obtener pedidos");

      const data = await res.json();

      setPedidos(data.pedidos || []);
      setPagination({
        page: data.pagination?.page || 1,
        limit: data.pagination?.limit || 10,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1
      });
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPedidos();
    }
  }, [isAuthenticated]);

  const getEstadoStyles = (estado) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium";
    
    switch(estado) {
      case "EN_PROCESO":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "EN_CAMINO":
        return `${base} bg-blue-100 text-blue-800`;
      case "ENTREGADO":
        return `${base} bg-green-100 text-green-800`;
      case "CANCELADO":
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 pt-32 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <Breadcrumbs pages={breadcrumbsPages} />

        <div className={`p-6 rounded-xl shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Mis Pedidos</h1>
              <p className="text-gray-500">Revisa el historial y estado de tus compras</p>
            </div>
            {pagination.total > 0 && (
              <div className={`px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <span className="font-medium">
                  Mostrando {(pagination.page - 1) * pagination.limit + 1}-
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} pedidos
                </span>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
              >
                <Skeleton height={30} width={200} className="mb-4" />
                <Skeleton count={3} height={80} className="mb-2" />
                <Skeleton height={20} width={150} className="ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={`p-6 rounded-lg text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <FiAlertCircle className="mx-auto text-4xl text-red-500 mb-3" />
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={() => fetchPedidos()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Reintentar
            </button>
          </div>
        ) : pedidos.length === 0 ? (
          <div className={`p-8 text-center rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <FiBox className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No tienes pedidos aún</h3>
            <p className="text-gray-500 mb-6">Cuando realices un pedido, aparecerá aquí</p>
            <Link 
              href="/ventaProducto" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className={`p-6 rounded-lg shadow-md border transition-all hover:shadow-lg ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <FiShoppingCart className="text-blue-500 text-xl" />
                        <h2 className="font-semibold text-lg">
                          Pedido #{pedido.id}
                        </h2>
                        <span className={getEstadoStyles(pedido.estado)}>
                          {pedido.estado.replace("_", " ")}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mt-2">
                        <span className="text-gray-500 flex items-center gap-1">
                          <FiCalendar /> 
                          {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        
                        {pedido.direccion && (
                          <span className="text-gray-500 flex items-center gap-1">
                            <FiMapPin /> 
                            {pedido.direccion.ciudad}, {pedido.direccion.estado}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Link 
                      href={`/mispedidos/${pedido.id}`}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition"
                    >
                      Ver detalles <FiChevronRight className="ml-1" />
                    </Link>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <FiBox /> Productos ({pedido.items?.length || 0})
                    </h3>
                    
                    <ul className="divide-y">
                      {pedido.items?.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="py-3 flex items-start gap-4">
                          {item.producto?.images?.[0]?.url && (
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={item.producto.images[0].url}
                                alt={item.producto.name}
                                fill
                                  unoptimized 
                                className="rounded-lg object-cover"
                                sizes="64px"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium">{item.producto?.name}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-1">
                              <p className="text-gray-500">
                                <span className="font-medium">Cantidad:</span> {item.cantidad}
                              </p>
                              <p className="text-gray-500">
                                <span className="font-medium">Precio:</span> ${item.precioUnitario?.toFixed(2)}
                              </p>
                              <p className="text-gray-500 md:col-span-1">
                                <span className="font-medium">Subtotal:</span> ${item.subtotal?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {pedido.items?.length > 2 && (
                      <div className="text-center mt-3 text-sm text-gray-500">
                        +{pedido.items.length - 2} productos más...
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {pedido.cliente && (
                        <p className="flex items-center gap-1">
                          <FiUser /> {pedido.cliente.name} {pedido.cliente.lastname}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold">
                        Total: ${pedido.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => fetchPedidos(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchPedidos(pageNum)}
                      className={`px-4 py-2 rounded ${pagination.page === pageNum ? 'bg-blue-600 text-white' : 'border'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => fetchPedidos(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MisPedidosPage;