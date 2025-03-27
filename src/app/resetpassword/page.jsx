'use client';
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FiMail, FiKey, FiUser, FiPhone, FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { CONFIGURACIONES } from '../config/config';
import { useAuth } from '../../context/authContext';

function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [preguntaSecreta, setPreguntaSecreta] = useState('');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [method, setMethod] = useState('email'); // 'email' o 'secretQuestion'
  const [loading, setLoading] = useState(false);
  const { theme } = useAuth();
  const router = useRouter();

  // Estilos basados en el tema
  const inputStyle = theme === 'dark' 
    ? 'bg-gray-700 border-gray-600 text-white' 
    : 'bg-white border-gray-300 text-gray-900';
  const cardStyle = theme === 'dark' 
    ? 'bg-gray-800 text-gray-100' 
    : 'bg-white text-gray-900';
  const buttonStyle = theme === 'dark'
    ? 'bg-green-600 hover:bg-green-500 text-white'
    : 'bg-green-600 hover:bg-green-700 text-white';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (method === 'email') {
        response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/send-reset-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
      } else {
        response = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/verify-secret-question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email,
            respuestaSecreta,
            telefono
          })
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (method === 'email') {
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
            confirmButtonColor: '#10B981'
          });
        } else {
          // Redirigir a la página de restablecimiento con el token
          router.push(`/restorepassword/${data.token}`);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Ocurrió un error al procesar tu solicitud',
          confirmButtonColor: '#EF4444'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden ${cardStyle}`}>
        {/* Encabezado */}
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-600'} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <FiKey className="mr-2" /> Recuperar Contraseña
              </h1>
              <p className="mt-1">Elige cómo quieres recuperar tu acceso</p>
            </div>
            <Link href="/login" className="text-white hover:text-gray-200">
              <FiArrowLeft size={24} />
            </Link>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Selector de método */}
          <div className="flex mb-6 rounded-lg overflow-hidden border">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-center font-medium ${method === 'email' ? 
                (theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-600 text-white') : 
                (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
            >
              <FiMail className="inline mr-2" /> Por correo
            </button>
            <button
              type="button"
              onClick={() => setMethod('secretQuestion')}
              className={`flex-1 py-2 text-center font-medium ${method === 'secretQuestion' ? 
                (theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-600 text-white') : 
                (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
            >
              <FiUser className="inline mr-2" /> Por pregunta secreta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de email (siempre visible) */}
            <div>
              <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Correo electrónico
              </label>
              <div className={`flex items-center border rounded-lg ${inputStyle}`}>
                <FiMail className="ml-3 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 p-2 outline-none ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Campos específicos para pregunta secreta */}
            {method === 'secretQuestion' && (
              <>
                <div>
                  <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Teléfono registrado
                  </label>
                  <div className={`flex items-center border rounded-lg ${inputStyle}`}>
                    <FiPhone className="ml-3 text-gray-500" />
                    <input
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className={`flex-1 p-2 outline-none ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                      placeholder="10 dígitos"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Pregunta secreta
                  </label>
                  <select
                    value={preguntaSecreta}
                    onChange={(e) => setPreguntaSecreta(e.target.value)}
                    className={`w-full p-2 border rounded-lg ${inputStyle}`}
                    required
                  >
                    <option value="" disabled>Selecciona tu pregunta secreta</option>
                    <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
                    <option value="¿Cuál es tu película favorita?">¿Cuál es tu película favorita?</option>
                    <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Respuesta secreta
                  </label>
                  <div className={`flex items-center border rounded-lg ${inputStyle}`}>
                    <FiKey className="ml-3 text-gray-500" />
                    <input
                      type="text"
                      value={respuestaSecreta}
                      onChange={(e) => setRespuestaSecreta(e.target.value)}
                      className={`flex-1 p-2 outline-none ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                      placeholder="Tu respuesta"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${buttonStyle} ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                method === 'email' ? 'Enviar enlace al correo' : 'Verificar respuesta'
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-start">
              <FiAlertCircle className={`mt-1 mr-2 flex-shrink-0 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div>
                <p className="font-medium mb-1">Importante:</p>
                <p className="text-sm">
                  {method === 'email' 
                    ? 'El enlace para restablecer tu contraseña expirará en 15 minutos.'
                    : 'Debes proporcionar exactamente la misma respuesta que registraste inicialmente.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestPasswordResetPage;