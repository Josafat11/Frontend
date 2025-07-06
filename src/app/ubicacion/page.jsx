"use client"; // Indicar que es un Client Component

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import Image from "next/image";

function UbicacionPage() {
  const { theme } = useAuth(); // Obtén el valor de theme desde el contexto
  const [mapLoaded, setMapLoaded] = useState(false);

  // Coordenadas de la refaccionaria
  const ubicacion = { lat: 21.130903, lng: -98.418015 };

  // Cargar el mapa de Google Maps
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_aSYelcveUjS0UWN6aE6k-ALmN1u9qmY&callback=initMap&libraries=marker`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = () => {
        setMapLoaded(true);
      };

      script.onerror = () => {
        console.error("Error loading Google Maps script");
      };

      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        const map = new window.google.maps.Map(mapElement, {
          center: ubicacion,
          zoom: 15,
        });

        // Usar AdvancedMarkerElement
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: ubicacion,
          map: map,
          title: "Refaccionaria Muñoz",
        });
      }
    }
  }, [mapLoaded]);

  return (
    <div
      className={`min-h-screen container mx-auto py-8 pt-16 pb-28 ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold text-center">Ubicación</h1>

      {/* Sección de información */}
      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
        {/* Mapa */}
        <div className="overflow-hidden rounded-lg shadow-lg h-96">
          <div id="map" className="w-full h-full"></div>
        </div>

        {/* Detalles de la refaccionaria */}
        <div
          className={`p-6 rounded-lg shadow-lg ${
            theme === "dark"
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <h2 className="mb-4 text-2xl font-bold">Refaccionaria Muñoz</h2>
          <p className="mb-4">
            En Refaccionaria Muñoz, nos enorgullece ofrecer las mejores
            refacciones y accesorios para tu vehículo. Con más de 20 años de
            experiencia, somos tu aliado confiable para mantener tu auto en
            perfecto estado.
          </p>
          <p className="mb-4">
            Visítanos en nuestra ubicación principal y descubre por qué somos la
            refaccionaria preferida de la región.
          </p>
          <p className="font-bold">Dirección:</p>
          <p className="mb-4">
            43000, La Lomita, Huejutla de Reyes, Hgo.
          </p>
          <p className="font-bold">Horarios:</p>
          <p>Lunes a Viernes: 8:00 A.M. - 6:30 P.M.</p>
          <p>Sábado y Domingo: 8:00 A.M. - 5:00 PM</p>
        </div>
      </div>

      {/* Sección de imágenes (puedes agregar las imágenes que desees) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {/* Imagen 1 */}
        <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/assets/negocio.png" // Ruta de la imagen
            alt="Refaccionaria Muñoz" // Texto alternativo para accesibilidad
            layout="fill" // Hace que la imagen llene el contenedor
            objectFit="cover" // Ajusta la imagen para cubrir el contenedor manteniendo la relación de aspecto
          />
        </div>

        {/* Imagen 2 */}
        <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/assets/contactos.jpeg" // Ruta de la imagen
            alt="Refaccionaria Muñoz" // Texto alternativo para accesibilidad
            layout="fill" // Hace que la imagen llene el contenedor
            objectFit="cover" // Ajusta la imagen para cubrir el contenedor manteniendo la relación de aspecto
          />
        </div>

        {/* Imagen 3 */}
        <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/assets/negocio2.jpg" // Ruta de la imagen
            alt="Refaccionaria Muñoz" // Texto alternativo para accesibilidad
            layout="fill" // Hace que la imagen llene el contenedor
            objectFit="cover" // Ajusta la imagen para cubrir el contenedor manteniendo la relación de aspecto
          />
        </div>
      </div>
    </div>
  );
}

export default UbicacionPage;
