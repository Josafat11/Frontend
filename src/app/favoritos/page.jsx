"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../context/authContext";
import { useFavorites } from "../../context/FavoritesContext";
import { CONFIGURACIONES } from "../config/config";
import Swal from "sweetalert2";
import { FaTrash, FaHeartBroken } from "react-icons/fa";

const FavoritosPage = () => {
  const { isAuthenticated, theme } = useAuth();
  const { refreshFavorites } = useFavorites();
  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/favoritos`, {
          credentials: "include"
        });
        
        if (!res.ok) throw new Error('Error al cargar favoritos');
        
        const data = await res.json();
        setFavoritos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchFavoritos();
  }, [isAuthenticated]);

  const eliminarFavorito = async (productId) => {
    const result = await Swal.fire({
      title: '¿Eliminar de favoritos?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/favoritos/eliminar/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          setFavoritos(prev => prev.filter(f => f.productId !== productId));
          refreshFavorites();
          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado de favoritos',
            'success'
          );
        }
      } catch (error) {
        Swal.fire(
          'Error',
          'No se pudo eliminar el producto de favoritos',
          'error'
        );
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <FaHeartBroken className="mx-auto text-5xl text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold">Debes iniciar sesión</h2>
        <p className="mt-2">Inicia sesión para ver tus productos favoritos</p>
        <Link href="/login" className="mt-4 inline-block px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      Error: {error}
    </div>
  );

  if (favoritos.length === 0) return (
    <div className="text-center py-12">
      <FaHeartBroken className="mx-auto text-5xl text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold">No tienes productos favoritos</h2>
      <p className="mt-2">Agrega productos a favoritos para verlos aquí</p>
      <Link href="/ventaProducto" className="mt-4 inline-block px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded">
        Explorar productos
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Favoritos ({favoritos.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoritos.map(({ product }) => (
          <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
            <Link href={`/producto/${product.id}`} className="block">
              <Image
                src={product.images?.[0]?.url || "/placeholder.jpg"}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover mb-2 rounded"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            </Link>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              <button
                onClick={() => eliminarFavorito(product.id)}
                className="p-2 text-red-500 hover:text-red-700"
                aria-label={`Eliminar ${product.name} de favoritos`}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritosPage;