"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import {
  FiArrowLeft,
  FiMail,
  FiLock,
  FiTool,
  FiShield,
  FiTag,
} from "react-icons/fi";
import Image from "next/image";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, theme } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/");
      } else {
        setMessage(result.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setMessage("Error al conectar con el servidor");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Sección izquierda - Imagen y beneficios */}
      <div className="relative w-full transition-colors md:w-1/2">
        <Image
          src="/assets/login.jpg"
          alt="Imagen de fondo"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          priority
        />
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gray-900 bg-opacity-70"
              : "bg-green-800 bg-opacity-80"
          }`}
        />
        <div className="relative flex flex-col justify-center h-full p-8 text-white">
          <h2 className="mb-6 text-3xl font-bold">
            Bienvenido a{" "}
            <span className="text-yellow-400">Muñoz AutoPartes</span>
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FiTool
                className="flex-shrink-0 mt-1 text-yellow-400"
                size={20}
              />
              <span>Acceso a más de 10,000 refacciones para tu vehículo</span>
            </li>
            <li className="flex items-start gap-3">
              <FiTag className="flex-shrink-0 mt-1 text-yellow-400" size={20} />
              <span>Ofertas exclusivas para clientes registrados</span>
            </li>
            <li className="flex items-start gap-3">
              <FiShield
                className="flex-shrink-0 mt-1 text-yellow-400"
                size={20}
              />
              <span>Garantía en todas nuestras piezas automotrices</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div
        className={`w-full md:w-1/2 flex items-center justify-center p-8 transition-colors ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-1 mb-6">
            <FiArrowLeft
              className={`${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            />
            <span
              className={`font-medium ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              Volver al inicio
            </span>
          </Link>

          <div className="mb-8">
            <h1
              className={`mb-2 text-3xl font-bold ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Iniciar Sesión
            </h1>
            <p
              className={`${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Accede a tu cuenta para gestionar tus pedidos de refacciones
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg mb-4 ${
                theme === "dark"
                  ? "bg-red-900 text-red-200"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block mb-2 font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Correo electrónico
              </label>
              <div
                className={`flex items-center border rounded-lg overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="px-3 py-2">
                  <FiMail
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className={`flex-1 p-2 outline-none ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className={`block mb-2 font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Contraseña
              </label>
              <div
                className={`flex items-center border rounded-lg overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="px-3 py-2">
                  <FiLock
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`flex-1 p-2 outline-none ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center justify-center w-full gap-2 px-4 py-3 font-bold text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700"
              >
                Iniciar Sesión
              </button>
            </div>

            <div className="flex justify-between pt-2">
              <Link
                href="/register"
                className={`text-sm ${
                  theme === "dark"
                    ? "text-green-400 hover:text-green-300"
                    : "text-green-600 hover:text-green-800"
                } font-medium`}
              >
                Crear una cuenta
              </Link>
              <Link
                href="/resetpassword"
                className={`text-sm ${
                  theme === "dark"
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-yellow-600 hover:text-yellow-800"
                } font-medium`}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>

          <div
            className={`mt-8 p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              ¿Alguna duda? Contactanos{" "}
              <Link
                href="/contacto"
                className={`font-medium ${
                  theme === "dark"
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-yellow-600 hover:text-yellow-800"
                }`}
              >
                Click Aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
