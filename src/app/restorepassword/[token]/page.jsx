"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext"; // Importar el contexto
import { CONFIGURACIONES } from "../../config/config";

function ResetPasswordPage({ params }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordReset, setPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { theme } = useAuth(); // Obtener el tema desde el contexto
  const token = params?.token; // Token desde la URL

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("La contraseña debe incluir al menos una letra mayúscula.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("La contraseña debe incluir al menos una letra minúscula.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("La contraseña debe incluir al menos un número.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("La contraseña debe incluir al menos un carácter especial.");
    }
    return errors;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(""); // Reiniciar errores

    // Validar la contraseña
    const validationErrors = validatePassword(password);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        setPasswordReset(true);
        setTimeout(() => router.push("/login"), 3000); // Redirigir a inicio de sesión después de 3 segundos
      } else {
        const result = await response.json();
        setError(result.message || "Error al restablecer la contraseña.");
      }
    } catch (error) {
      setError("Error restableciendo la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Restablecer Contraseña</h2>
          {passwordReset ? (
            <div className="text-green-600 text-center">
              <p className="mb-4">
                Tu contraseña ha sido restablecida con éxito.
              </p>
              <p>Serás redirigido a la página de inicio de sesión en breve.</p>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label
                  className={`block mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className={`block mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              {/* Requisitos de la contraseña */}
              <div className="mb-4 text-sm text-gray-500">
                <p>La contraseña debe cumplir con:</p>
                <ul className="list-disc list-inside">
                  <li>Mínimo 8 caracteres.</li>
                  <li>Al menos una letra mayúscula.</li>
                  <li>Al menos una letra minúscula.</li>
                  <li>Al menos un número.</li>
                  <li>Al menos un carácter especial.</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Procesando..." : "Restablecer Contraseña"}
              </button>

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;