"use client"; // Indicar que es un Client Component

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Uso del router para redirección
import { CONFIGURACIONES } from '../../config/config'; // Importar configuración

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Obtener los parámetros de la URL
  const [verificationStatus, setVerificationStatus] = useState(null); // Estado para el estado de verificación
  const [loading, setLoading] = useState(true); // Estado para mostrar el proceso de carga

  // Verifica si hay un token en la URL y llama a la función de verificación
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = searchParams.get('token'); // Obtener el token de los parámetros de búsqueda
      if (token) {
        verifyToken(token); // Llamar a la función para verificar el token
      } else {
        setLoading(false); // Detener la carga si no hay token
      }
    }
  }, [searchParams]);

  // Función para verificar el token con el backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL3}/auth/verify/${token}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success'); // Estado de éxito
        setTimeout(() => {
          router.push('/login'); // Redirigir al login después de unos segundos
        }, 2000);
      } else {
        setVerificationStatus('error'); // Estado de error
      }
    } catch (error) {
      setVerificationStatus('error'); // Estado de error en caso de excepción
    } finally {
      setLoading(false); // Detener la carga una vez que se obtenga la respuesta
    }
  };

  // Contenido que se mostrará en la página según el estado de verificación
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {loading ? (
        <p>Verificando tu cuenta...</p>
      ) : verificationStatus === 'success' ? (
        <p>¡Cuenta verificada exitosamente! Redirigiendo al login...</p>
      ) : (
        <p>Error en la verificación. Por favor, intenta nuevamente.</p>
      )}
    </div>
  );
}
