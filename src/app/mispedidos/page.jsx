"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../config/config";
import Image from "next/image";
import { FiBox, FiTruck, FiCalendar, FiShoppingCart } from "react-icons/fi";

function MisPedidosPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const breadcrumbsPages = [
    { name: "Inicio", path: "/" },
    { name: "Mis Pedidos", path: "/misPedidos" },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchPedidos = async () => {
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/${user.id}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al obtener pedidos");

        const data = await res.json();

        if (Array.isArray(data)) {
          setPedidos(data);
        } else if (Array.isArray(data.pedidos)) {
          setPedidos(data.pedidos);
        } else if (data.pedido) {
          setPedidos([data.pedido]);
        } else {
          setPedidos([]);
        }

      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus pedidos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [user, isAuthenticated]);

  return (
    <div className={`min-h-screen py-8 pt-32 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4">
        <Breadcrumbs pages={breadcrumbsPages} />

        <div className={`p-6 rounded-xl shadow-lg mb-8 text-center ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="text-3xl font-bold mb-2">Mis Pedidos</h1>
          <p className="text-gray-500">Consulta el estado y detalle de tus órdenes</p>
        </div>

        {isLoading ? (
          <p className="text-center">Cargando pedidos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-gray-500">No tienes pedidos aún.</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className={`p-6 rounded-lg shadow-md border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <div className="mb-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <FiShoppingCart className="text-green-500" />
                      <h2 className="font-semibold text-lg">Pedido #{pedido.id}</h2>
                    </div>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <FiCalendar /> {new Date(pedido.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm mt-1 text-gray-500 flex items-center gap-1">
                    <FiTruck />
                    Estado: <strong className="ml-1">{pedido.estado}</strong>
                  </div>
                </div>

                <ul className="divide-y">
                  {pedido.items?.map((item, idx) => (
                    <li key={idx} className="py-4 flex items-start gap-4">
                      {item.producto?.images?.[0]?.url && (
                        <Image
                          src={item.producto.images[0].url}
                          alt={item.producto.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-md">{item.producto?.name}</h3>
                        <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                        <p className="text-sm text-gray-500">Precio unitario: ${item.precioUnitario?.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Subtotal: ${item.subtotal?.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="text-right mt-4">
                  <span className="text-lg font-semibold">
                    Total: ${pedido.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisPedidosPage;
