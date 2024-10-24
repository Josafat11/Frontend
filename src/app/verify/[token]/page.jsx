"use client"; // Indicar que es un Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Cambio aquí
import Swal from 'sweetalert2';

export default function VerifyPage() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState(null);

  // Verifica si hay un token en la URL
  useEffect(() => {
    const token = window.location.pathname.split('/').pop(); // Obtener el token de la URL
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/verify/${token}`, {
        method: 'GET',
      });
      
      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        Swal.fire({
          icon: 'success',
          title: 'Cuenta verificada',
          text: 'Tu cuenta ha sido verificada con éxito.',
        });
        router.push('/login'); // Redirigir al login si es necesario
      } else {
        setVerificationStatus('error');
        Swal.fire({
          icon: 'error',
          title: 'Error en la verificación',
          text: data.message || 'El enlace de verificación ha expirado o es inválido.',
        });
      }
    } catch (error) {
      setVerificationStatus('error');
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Hubo un problema verificando tu cuenta.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {verificationStatus === null ? (
        <p>Verificando tu cuenta...</p>
      ) : verificationStatus === 'success' ? (
        <p>¡Cuenta verificada exitosamente! Redirigiendo...</p>
      ) : (
        <p>Error en la verificación. Por favor, intenta nuevamente.</p>
      )}
    </div>
  );
}
