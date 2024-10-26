'use client';  // Indicamos que es un Client Component para poder usar hooks

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  // Importamos useRouter para redirigir
import { useAuth } from '../../context/authContext'; // Importamos el contexto de autenticación

const LoginPage = () => {
  // Definimos los estados del formulario y los mensajes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth(); // Obtenemos la función login desde el contexto de autenticación
  const router = useRouter();  // Usamos useRouter para manejar las redirecciones

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenimos que la página se recargue

    try {
      // Llamamos a la función login del contexto de autenticación
      const result = await login(email, password);

      if (result.success) {
        // Si el login es exitoso, mostramos un mensaje y redirigimos al inicio
        setMessage('Inicio de sesión exitoso');
        console.log("sesion iniciada");
        
        router.push('/');  // Redirigimos a la página de inicio
      } else {
        // Si hay un error en las credenciales, mostramos el mensaje de error
        setMessage(result.message);
      }
    } catch (error) {
      // Si ocurre un error inesperado (como problemas de servidor)
      console.error('Error en el inicio de sesión:', error);
      setMessage('Error interno del servidor');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-28">
      {/* Sección izquierda: Imagen y beneficios */}
      <div
        className="w-full md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/beneficios-login.jpg')" }}
      >
        <div className="flex flex-col justify-center h-full text-white p-8 bg-green-700 bg-opacity-80">
          <h2 className="text-3xl font-bold mb-4">Beneficios:</h2>
          <ul className="space-y-4">
            {/* Listado de beneficios que se muestran en la sección izquierda */}
            <li className="flex items-center space-x-2">
              <span>Recibe las mejores promociones</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>Mejor calidad de servicio</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>Encuentra miles de productos que le quedan a tu vehículo</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sección derecha: Formulario de login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <Link href="/">
            <p className="text-green-700 font-bold mb-6 flex hover:text-green-600">&larr; Atrás</p>
          </Link>

          <h2 className="text-2xl font-bold mb-4">Inicia Sesión</h2>
          
          {/* Mostrar mensajes de error o éxito */}
          {message && <p className="text-center text-red-500 mb-4">{message}</p>}

          <form onSubmit={handleSubmit}>
            {/* Correo Electrónico */}
            <div className="mb-4">
              <label className="block text-gray-700">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualizar el estado del email
                placeholder="Correo electrónico"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            {/* Contraseña */}
            <div className="mb-4">
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Actualizar el estado de la contraseña
                placeholder="Contraseña"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            {/* Botón de Iniciar Sesión */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Iniciar Sesión
            </button>

            {/* Enlace para crear una nueva cuenta */}
            <p className="text-sm text-gray-500 mt-4 text-center">
              ¿No tienes una cuenta?{" "}
              <Link href="/register">
                <span className="text-green-700 font-semibold">Crear una cuenta</span>
              </Link>
            </p>

            {/* Enlace para restablecer la contraseña */}
            <p className="text-sm text-gray-500 mt-4 text-center">
              ¿Olvidaste tu contraseña?{" "}
              <Link href="/resetpassword">
                <span className="text-green-700 font-semibold">Restablecer contraseña</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
