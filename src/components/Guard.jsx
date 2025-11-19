"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Guard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const handleError = () => {
      console.warn("⚠️ Error detectado → redirigiendo a /offline");
      router.push("/offline");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  return children;
}
