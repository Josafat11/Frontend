"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importar desde 'next/navigation'
import { useEffect } from 'react';
import { CONFIGURACIONES } from '../config/config';
function ResetPasswordPage({ params }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordReset, setPasswordReset] = useState(false);
  const router = useRouter();
  
  const token = params?.token; // Aquí usamos params que Next.js envía automáticamente

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL}/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setPasswordReset(true);
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (error) {
      setError('Error restableciendo la contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Restablecer Contraseña</h2>
          {passwordReset ? (
            <p className="text-green-700 text-sm text-center mt-6">
              Tu contraseña ha sido restablecida con éxito. Ahora puedes iniciar sesión.
            </p>
          ) : (
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label className="block text-gray-700 pb-5">Nueva contraseña</label>
                <input
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 pb-5">Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Restablecer Contraseña
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
