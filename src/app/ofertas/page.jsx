"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../context/CartContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Breadcrumbs from "../../components/Breadcrumbs";
import { FiShoppingCart, FiPlus, FiStar } from "react-icons/fi";

function OfertasPage() {
    const { refreshCart } = useCart();
    const { isAuthenticated, theme } = useAuth();
    const router = useRouter();

    const [productos, setProductos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOfertas = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/ofertas`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Error al cargar productos en oferta");

                const data = await res.json();
                setProductos(data); // Asegúrate que tu controller devuelva un array directo
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los productos en oferta.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOfertas();
    }, []);

    const agregarAlCarrito = async (productId) => {
        if (!isAuthenticated) {
            return Swal.fire({
                title: "Inicia sesión",
                text: "Debes iniciar sesión para agregar productos al carrito",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ir a login",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) router.push("/login");
            });
        }

        setIsAddingToCart(true);
        try {
            const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: Number(productId), quantity: 1 }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Producto agregado",
                showConfirmButton: false,
                timer: 1500,
            });

            refreshCart();
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error",
            });
        } finally {
            setIsAddingToCart(false);
        }
    };

    const comprarAhora = async (productId) => {
        if (!isAuthenticated) {
            return Swal.fire({
                title: "Inicia sesión",
                text: "Debes iniciar sesión para comprar productos",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ir a login",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) router.push("/login");
            });
        }

        setIsAddingToCart(true);
        try {
            const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: Number(productId), quantity: 1 }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            router.push("/carrito");
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error",
            });
        } finally {
            setIsAddingToCart(false);
        }
    };

    const breadcrumbsPages = [
        { name: "Home", path: "/" },
        { name: "Ofertas", path: "/ofertas" },
    ];


    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs pages={breadcrumbsPages} />
            <h1 className="text-3xl font-bold mb-6">Productos en Oferta</h1>

            {isLoading ? (
                <p className="text-center">Cargando productos en oferta...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {productos.map((producto) => (
                        <div
                            key={producto.id}
                            className={`border rounded-lg shadow p-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}
                        >
                            <Image
                                src={producto.images?.[0]?.url || "/placeholder.jpg"}
                                alt={producto.name}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover mb-2 rounded"
                                unoptimized={true}
                            />

                            <h2 className="text-lg font-semibold">{producto.name}</h2>
                            <p className="text-sm text-gray-500 mb-2">{producto.description}</p>

                            <div className="mb-2">
                                <span className="text-xl font-bold text-green-600">
                                    ${producto.discount || producto.price}
                                </span>
                                {producto.price && producto.discount && (
                                    <span className="line-through text-sm text-gray-400 ml-2">${producto.price}</span>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => comprarAhora(producto.id)}
                                    disabled={isAddingToCart || producto.stock <= 0}
                                    className={`flex-1 py-2 px-4 rounded ${producto.stock <= 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : theme === "dark"
                                            ? "bg-green-600 hover:bg-green-500"
                                            : "bg-green-500 hover:bg-green-400"
                                        } text-white flex items-center justify-center`}
                                >
                                    <FiShoppingCart className="mr-2" />
                                    Comprar ahora
                                </button>

                                <button
                                    onClick={() => agregarAlCarrito(producto.id)}
                                    disabled={isAddingToCart || producto.stock <= 0}
                                    className={`p-2 rounded ${producto.stock <= 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : theme === "dark"
                                            ? "bg-blue-600 hover:bg-blue-500"
                                            : "bg-blue-500 hover:bg-blue-400"
                                        } text-white`}
                                >
                                    <FiPlus />
                                </button>

                                <button
                                    className={`p-2 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                                    title="Favoritos (no implementado)"
                                >
                                    <FiStar />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OfertasPage;
