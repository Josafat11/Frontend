"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiShoppingCart, FiPlus } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../../../context/authContext";
import { useCart } from "../../../context/CartContext";
import { CONFIGURACIONES } from "../../config/config";
import Swal from "sweetalert2";

export default function ProductoPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();
        setProducto(data);
        setIsFavorito(data.esFavorito || false);
      } catch (err) {
        console.error(err);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducto();
  }, [id, router]);

  const precioFinal = producto
    ? (producto.price * (1 - producto.discount / 100)).toFixed(2)
    : "";

  const handleComprarAhora = async () => {
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para comprar productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: Number(id), quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al comprar");

      refreshCart();
      router.push("/carrito");
    } catch (err) {
      console.error("Error al comprar:", err);
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleAgregarAlCarrito = async () => {
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ir a login",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: Number(id), quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al agregar");

      refreshCart();
      Swal.fire("Agregado", "Producto agregado al carrito", "success");
    } catch (err) {
      console.error("Error al agregar:", err);
      Swal.fire("Error", err.message, "error");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="p-6 text-center text-red-500">Producto no encontrado.</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen principal */}
        <div className="relative w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden">
          {producto.images?.[0]?.url ? (
            <Image
              src={producto.images[0].url}
              alt={producto.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-lg">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Detalles del producto */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{producto.name}</h1>
            <p className="text-gray-600 text-sm mb-4">{producto.description}</p>

            <div className="mb-4">
              <p className="text-2xl font-bold text-green-600">${precioFinal}</p>
              {producto.discount > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  ${producto.price.toFixed(2)} ({producto.discount}% OFF)
                </p>
              )}
            </div>

            <p className="mb-2">
              <span className="font-semibold">Categoría:</span>{" "}
              {producto.category || "Sin categoría"}
            </p>

            <p className="mb-2">
              <span className="font-semibold">Stock:</span>{" "}
              {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
            </p>

            {/* Compatibilidades */}
            <div className="mb-4">
              <p className="font-semibold mb-1">Compatibilidad:</p>
              <div className="flex flex-wrap gap-2">
                {producto.compatibilities.slice(0, 6).map((c, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 px-2 py-1 rounded-full text-xs"
                  >
                    {c.make} {c.model}
                  </span>
                ))}
                {producto.compatibilities.length > 6 && (
                  <span className="bg-gray-300 px-2 py-1 rounded-full text-xs">
                    +{producto.compatibilities.length - 6} más
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-4 mt-6">
            <button
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center
                ${producto.stock <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
                } text-white font-semibold`}
              disabled={producto.stock <= 0}
              onClick={handleComprarAhora}
            >
              <FiShoppingCart className="mr-2" />
              Comprar ahora
            </button>

            <button
              className={`p-3 rounded-lg flex items-center justify-center 
                ${producto.stock <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
                } text-white`}
              disabled={producto.stock <= 0}
              onClick={handleAgregarAlCarrito}
            >
              <FiPlus />
            </button>

            <button
              className={`p-3 rounded-lg flex items-center justify-center transition-all 
                ${isFavorito ? "text-red-500" : "text-gray-400 hover:text-red-500"}
              `}
              onClick={() => setIsFavorito(!isFavorito)}
              aria-label={isFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <FaHeart
                className={`transition-all ${isFavorito ? "fill-red-500 scale-110" : "fill-transparent scale-100"} stroke-[2.5]`}
                size={20}
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
