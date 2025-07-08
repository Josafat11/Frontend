"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../config/config";

function MisPedidosPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Mis Pedidos", path: "/misPedidos" },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchPedidos = async () => {
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/${user.id}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Error al obtener pedidos");

        const data = await response.json();
        console.log("DATA RECIBIDA:", data);

        // Ajuste para un solo pedido o lista de pedidos
        if (Array.isArray(data)) {
          setPedidos(data);
        } else if (Array.isArray(data.pedidos)) {
          setPedidos(data.pedidos);
        } else if (data.pedido) {
          setPedidos([data.pedido]); // convertir único pedido a array
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
    <div className={`min-h-screen py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4">
        <Breadcrumbs pages={breadcrumbsPages} />

        <div className={`p-6 rounded-xl shadow-lg mb-8 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="text-3xl font-bold text-center mb-2">Mis Pedidos</h1>
          <p className="text-center text-gray-500">Consulta el estado de tus órdenes recientes</p>
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
                className={`p-5 rounded-lg shadow ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
              >
                <h2 className="text-lg font-semibold mb-2">Pedido #{pedido.id}</h2>
                <p className="text-sm text-gray-500 mb-1">Fecha: {new Date(pedido.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500 mb-1">Estado: <strong>{pedido.estado}</strong></p>

                <ul className="list-disc list-inside text-sm pl-2">
                  {pedido.items?.map((item, idx) => (
                    <li key={idx}>
                      {item.producto?.name} x {item.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisPedidosPage;
