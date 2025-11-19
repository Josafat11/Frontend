"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula un tiempo de carga (2 segundos)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#317EFB",
          color: "white",
          fontSize: "2rem",
          flexDirection: "column",
        }}
      >
        <img
          src="/icon-192x192.png"
          alt="App Logo"
          style={{ width: 120, height: 120, marginBottom: 20 }}
        />
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  return children;
}
