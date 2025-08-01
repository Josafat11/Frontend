"use client";

import { useState } from "react";
import Link from "next/link";
import CryptoJS from "crypto-js";
import ReCAPTCHA from "react-google-recaptcha";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import { useAuth } from "../../context/authContext";

function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [birthDate, setBirthDate] = useState("");
  const [birthDateValid, setBirthDateValid] = useState(true);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);
  const { Login, theme } = useAuth();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [preguntaSecreta, setPreguntaSecreta] = useState("default");
  const [respuestaSecreta, setRespuestaSecreta] = useState("");

  // ✅ Control de acceso y autenticación segura (ISO/IEC 27001:2013 - Control A.9.4)
  // Se usa ReCAPTCHA para evitar ataques automatizados en el formulario de registro.
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Almacena el token generado por el CAPTCHA
  };

  // ✅ Gestión segura de credenciales (ISO/IEC 27001:2013 - Control A.9.2)
  // Esta función evalúa la fortaleza de la contraseña, asegurando que cumpla con requisitos mínimos.
  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8 && password.length <= 30) strength++;
    if (/\d/.test(password)) strength++;
    if (/[a-zA-Z]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);
  };

  const [passwordWarning, setPasswordWarning] = useState(""); // Nuevo estado para el mensaje de advertencia

  // ✅ Protección contra contraseñas vulnerables (ISO/IEC 27001:2013 - Control A.12.6)
  // Se validan patrones inseguros y se verifica si la contraseña ha sido filtrada en bases de datos públicas.
  const handlePasswordChange = async (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);

    // Verificar si la contraseña contiene patrones prohibidos
    const containsForbiddenPattern = forbiddenPatterns.some((pattern) =>
      newPassword.toLowerCase().includes(pattern)
    );

    if (containsForbiddenPattern) {
      setPasswordWarning(
        "Tu contraseña contiene patrones comunes o inseguros."
      );
    } else {
      setPasswordWarning("");
    }

    // ✅ Protección contra exposición de credenciales (ISO/IEC 27001:2013 - Control A.12.6.1)
    // Verificar si la contraseña ha sido filtrada en bases de datos públicas comprometidas.
    const isPwned = await checkPasswordInPwned(newPassword);
    if (isPwned) {
      setPasswordWarning(
        "Tu contraseña ha sido filtrada en una base de datos pública. Por favor, elige otra."
      );
    } else {
      setPasswordWarning("");
    }

    checkPasswordMatch(newPassword, confirmPassword); // Verificar coincidencia de contraseñas
  };

  // ✅ Protección contra ataques de fuerza bruta (ISO/IEC 27001:2013 - Control A.9.4.3)
  // Asegura que las contraseñas ingresadas coincidan antes de permitir el registro.
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    checkPasswordMatch(password, newConfirmPassword);
  };

  // ✅ Verificación de integridad de datos (ISO/IEC 27001:2013 - Control A.14.2.5)
  // Se verifica que la contraseña confirmada coincida con la original.
  const checkPasswordMatch = (password, confirmPassword) => {
    if (password && confirmPassword && password !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  // ✅ Validación de entrada para prevenir ataques (ISO/IEC 27001:2013 - Control A.14.2.5)
  // Se valida la fecha de nacimiento para evitar valores inválidos o malintencionados.
  const handleBirthDateChange = (e) => {
    const selectedDate = e.target.value;
    setBirthDate(selectedDate);

    const minDate = new Date("1960-01-01");
    const maxDate = new Date("2006-12-31");
    const userDate = new Date(selectedDate);

    if (userDate >= minDate && userDate <= maxDate) {
      setBirthDateValid(true);
    } else {
      setBirthDateValid(false);
    }
  };

  // Color de la barra según la fortaleza
  const getStrengthBarColor = () => {
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    if (passwordStrength === 4) return "bg-green-500";
    return "bg-gray-300";
  };

  // Texto de fortaleza según el nivel
  const getStrengthText = () => {
    if (passwordStrength === 1) return "Débil";
    if (passwordStrength === 2) return "Media";
    if (passwordStrength === 3) return "Fuerte";
    if (passwordStrength === 4) return "Muy fuerte";
    return "";
  };

  // Color del texto según la fortaleza
  const getStrengthTextColor = () => {
    if (passwordStrength === 1) return "text-red-500";
    if (passwordStrength === 2) return "text-yellow-500";
    if (passwordStrength === 3) return "text-blue-500";
    if (passwordStrength === 4) return "text-green-500";
    return "text-gray-500";
  };

  // Añade un estado para controlar la visibilidad de la contraseña
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Añade un estado para controlar la visibilidad de la confirmación de la contraseña
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Función para alternar la visibilidad de la confirmación de la contraseña
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  //Funcion para patrones prohibidos
  const forbiddenPatterns = ["12345", "password", "admin", "qwerty", "abc123"];

  const checkPasswordInPwned = async (password) => {
    // 1. Hashear la contraseña usando SHA-1
    const sha1Hash = CryptoJS.SHA1(password).toString().toUpperCase();

    // 2. Tomar los primeros 5 caracteres del hash
    const hashPrefix = sha1Hash.substring(0, 5);
    const hashSuffix = sha1Hash.substring(5);

    try {
      // 3. Consultar la API de Have I Been Pwned
      const response = await fetch(
        `https://api.pwnedpasswords.com/range/${hashPrefix}`
      );
      const data = await response.text();

      // 4. Buscar si el sufijo completo está en la lista de hashes devueltos
      const isPwned = data.split("\n").some((line) => {
        const [hash, count] = line.split(":");
        return hash === hashSuffix;
      });

      return isPwned;
    } catch (error) {
      console.error("Error checking password with HIBP:", error);
      return false;
    }
  };

  const validarNombreApellido = (valor) => {
    const regex = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/; // Expresión regular para solo letras y espacios
    return valor.length > 3 && regex.test(valor);
  };

  // Función para manejar el envío del formulario al backend
  const router = useRouter(); // Inicializa el hook de enrutamiento

  // Función para manejar el envío del formulario al backend
  const onSubmit = async (event) => {
    event.preventDefault();

    // Validar nombre y apellido
    if (!validarNombreApellido(nombre)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El nombre debe tener más de 3 caracteres y solo contener letras.",
      });
      return;
    }

    if (!validarNombreApellido(apellido)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El apellido debe tener más de 3 caracteres y solo contener letras.",
      });
      return;
    }

    setOnSubmitLoading(true); // Mostrar loading al enviar

    if (preguntaSecreta === "default") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor selecciona una pregunta secreta válida.",
      });
      setOnSubmitLoading(false); // Detener loading
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          lastname: apellido,
          email,
          password,
          fechadenacimiento: birthDate,
          user: nombre,
          telefono,
          preguntaSecreta,
          respuestaSecreta,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "¡Te has registrado con éxito!",
        }).then(() => {
          // Redireccionar al login después de que el usuario haga clic en "OK"
          router.push("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: "Ocurrió un error interno.",
      });
    } finally {
      setOnSubmitLoading(false); // Dejar de mostrar loading
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sección izquierda: Formulario */}
      <div
        className={`w-full md:w-1/2 flex flex-col justify-center items-center transition-colors py-20 ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-white text-gray-900"
        }`}
      >
        <div className="w-full max-w-lg px-6">
          <Link href="/">
            <p className="block mb-6 font-bold text-green-700">&larr; Atrás</p>
          </Link>
          {/* Logo */}
          <div className="mb-6 text-center"></div>
          <h2
            className={`mb-6 text-2xl font-bold text-center ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Crea tu cuenta
          </h2>
          {/* El formulario ahora ejecuta la función onSubmit */}
          <form onSubmit={onSubmit}>
            {/* Nombre */}
            <div className="mb-4">
              {/* Nombre y Apellido en una fila */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className={`block mb-1 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    required
                    onChange={(e) => setNombre(e.target.value)}
                    className={`w-full p-2 text-sm font-semibold border rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-slate-300 border-gray-300 text-gray-900"
                    }`}
                  />
                  {nombre && !validarNombreApellido(nombre) && (
                    <p className="mt-1 text-xs text-red-500">
                      El nombre debe tener más de 3 caracteres y solo contener
                      letras.
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block mb-1 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={apellido}
                    required
                    onChange={(e) => setApellido(e.target.value)}
                    className={`w-full p-2 text-sm font-semibold border rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-slate-300 border-gray-300 text-gray-900"
                    }`}
                  />
                  {apellido && !validarNombreApellido(apellido) && (
                    <p className="mt-1 text-xs text-red-500">
                      El apellido debe tener más de 3 caracteres y solo contener
                      letras.
                    </p>
                  )}
                </div>
              </div>
              {/* Email y Teléfono en una fila */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className={`block mb-1 text-sm font-medium my-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2 text-sm font-semibold border rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-slate-300 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block mb-1 text-sm font-medium my-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className={`w-full p-2 text-sm font-semibold border rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-slate-300 border-gray-300 text-gray-900"
                    }`}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Reemplaza cualquier caracter que no sea un número
                    }}
                    required
                  />
                  <p
                    className={`mt-1 text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    *Ingresa un número válido (10 dígitos).
                  </p>
                </div>
              </div>
              {/* Fecha de Nacimiento */}
              <div>
                <label
                  className={`block mb-1 text-sm font-medium my-4 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  required
                  className={`w-full p-2 text-sm font-semibold border rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-slate-300 border-gray-300 text-gray-900"
                  }`}
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  min="1960-01-01"
                  max="2006-12-31"
                />
                {!birthDateValid && (
                  <p className="mt-1 text-xs text-red-500">
                    Su edad está fuera del rango permitido.
                  </p>
                )}
              </div>
              {/* Pregunta y Respuesta Secreta */}
              <div className="space-y-3">
                <div>
                  <label
                    className={`block mb-1 text-sm font-medium my-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Pregunta Secreta
                  </label>
                  <select
                    value={preguntaSecreta}
                    onChange={(e) => setPreguntaSecreta(e.target.value)}
                    className={`w-full p-2 text-sm font-semibold border rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-slate-300 border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="default" disabled>
                      Selecciona una pregunta secreta
                    </option>
                    <option value="¿Cuál es el nombre de tu primera mascota?">
                      ¿Cuál es el nombre de tu primera mascota?
                    </option>
                    <option value="¿Cuál es tu película favorita?">
                      ¿Cuál es tu película favorita?
                    </option>
                    <option value="¿En qué ciudad naciste?">
                      ¿En qué ciudad naciste?
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    className={`block mb-1 text-sm font-medium my-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Respuesta Secreta
                  </label>
                  <input
                    type="text"
                    placeholder="Respuesta Secreta"
                    value={respuestaSecreta}
                    required
                    onChange={(e) => setRespuestaSecreta(e.target.value)}
                    className={`w-full p-2 text-sm font-semibold border rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-slate-300 border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
              {/* Contraseñas */}
              <div className="my-4 space-y-3">
                <div className="relative">
                  <label
                    className={`block mb-1 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Contraseña
                  </label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    required
                    onChange={handlePasswordChange}
                    className={`w-full p-2 pr-20 text-sm font-semibold border rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-slate-300 border-gray-300 text-gray-900"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={`absolute text-xs right-3 top-8 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {passwordVisible ? "Ocultar" : "Mostrar"}
                  </button>
                  {passwordWarning && (
                    <p className="mt-1 text-xs text-red-500">
                      {passwordWarning}
                    </p>
                  )}
                </div>
                {/* Barra de fortaleza */}
                <div className="my-4">
                  <div
                    className={`h-2 rounded-lg ${getStrengthBarColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                  <p className={`mt-1 text-xs ${getStrengthTextColor()}`}>
                    {getStrengthText()}
                  </p>
                </div>
                <div className="relative">
                  <label
                    className={`block mb-1 text-sm font-medium my-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Confirmar Contraseña
                  </label>
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    required
                    onChange={handleConfirmPasswordChange}
                    className={`w-full border p-2 rounded-lg font-semibold text-sm pr-20 ${
                      passwordMatch
                        ? theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                          : "bg-slate-300 border-gray-300 text-gray-900"
                        : "border-red-900 bg-red-300 text-gray-900"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className={`absolute text-xs right-3 top-8 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {confirmPasswordVisible ? "Ocultar" : "Mostrar"}
                  </button>
                  {!passwordMatch && (
                    <p className="mt-1 text-xs text-red-500">
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              </div>
              {/* Requisitos de contraseña en formato compacto */}
              <div
                className={`p-3 rounded-lg my-4 ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <p
                  className={`mb-2 text-xs font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  Tu contraseña debe tener:
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div
                    className={
                      password.length >= 8 && password.length <= 30
                        ? "text-green-600"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }
                  >
                    • De 8 a 30 caracteres
                  </div>
                  <div
                    className={
                      /\d/.test(password)
                        ? "text-green-600"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }
                  >
                    • Al menos 1 número
                  </div>
                  <div
                    className={
                      /[a-zA-Z]/.test(password)
                        ? "text-green-600"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }
                  >
                    • Al menos 1 letra
                  </div>
                  <div
                    className={
                      /[^A-Za-z0-9]/.test(password)
                        ? "text-green-600"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }
                  >
                    • Un símbolo especial
                  </div>
                </div>
              </div>
              {/* ReCAPTCHA Placeholder */}
              <div className="flex justify-center my-6">
                <div className="mb-4">
              <ReCAPTCHA
                sitekey="6LdpXWgqAAAAAOWwGI-kkrTyOLqKggmeO4D4RxY8"
                onChange={handleRecaptchaChange}
              />
            </div>
              </div>
              {/* Botón de Crear Cuenta */}
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-semibold ${
                  passwordMatch && recaptchaToken && !onSubmitLoading
                    ? "bg-green-700 hover:bg-green-600"
                    : "bg-gray-400"
                } text-white transition-colors`}
                disabled={!passwordMatch || !recaptchaToken || onSubmitLoading}
              >
                {onSubmitLoading ? "Cargando..." : "Crear Cuenta"}
              </button>
              {/* Términos y Condiciones */}
              <div className="text-center">
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Al dar clic en Crear Cuenta aceptas nuestros{" "}
                  <Link href="/terminos">
                    <span className="text-green-700 hover:underline">
                      Términos y Condiciones
                    </span>
                  </Link>{" "}
                  y nuestra{" "}
                  <Link href="/privacidad">
                    <span className="text-green-700 hover:underline">
                      Política de Privacidad
                    </span>
                  </Link>
                  .
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Sección derecha: Beneficios */}
      <div
        className="hidden bg-center bg-cover md:block md:w-1/2"
        style={{
          backgroundImage: "url('/assets/negocio.png')",
        }}
      >
        <div className="flex flex-col justify-center h-full p-8 text-white bg-green-700 bg-opacity-80">
          <h2 className="mb-6 text-3xl font-bold">
            Beneficios de ser Usuario:
          </h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
              <span>Recibe las mejores promociones</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
              <span>Ubicanos cerca de tu domicilio</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
              <span>
                Encuentra todos los productos que le quedan a tu vehículo
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
              <span>Atención personalizada</span>
            </li>
          </ul>
          <div className="mt-8">
            <span className="text-lg">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login">
                <span className="text-xl font-semibold text-yellow-200 underline hover:text-amber-300">
                  Ingresa Aquí
                </span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
