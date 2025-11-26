"use client"; 

import { useAuth } from "../../context/authContext";

export default function PoliticasPage() {
  const { theme } = useAuth();

  // Datos fijos OFFLINE
  const politica = {
    title: "Política de Privacidad Web Muñoz Autopartes 2025",
    effectiveDate: "2025-12-30",
    createdAt: "2025-07-07",
    content: `
En Muñoz Autopartes, respetamos y protegemos la privacidad de nuestros clientes y usuarios. Esta política de privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información personal que compartes con nosotros a través de nuestro sitio web.

1. Información que Recopilamos
Recopilamos información personal que nos proporcionas al crear una cuenta, realizar una compra o registrarte para recibir comunicaciones. La información que podemos solicitar incluye:
- Nombre y apellidos
- Dirección de correo electrónico
- Número de teléfono
- Dirección de envío y facturación
- Información de pago (procesada de manera segura por terceros)

2. Uso de la Información
Utilizamos tu información personal para:
- Procesar y gestionar tus pedidos
- Enviar confirmaciones, actualizaciones y notificaciones sobre tus compras
- Personalizar la experiencia en nuestro sitio web, proporcionando recomendaciones de productos y ofertas especiales
- Cumplir con nuestras obligaciones legales y regulatorias

3. Protección y Seguridad de Datos
Implementamos medidas de seguridad apropiadas para proteger tu información personal contra accesos no autorizados, alteraciones, divulgaciones o destrucción. Utilizamos cifrado y otros mecanismos de seguridad en nuestros sistemas de almacenamiento de datos, especialmente en las transacciones en línea.

4. Divulgación de Información a Terceros
No compartimos, vendemos ni alquilamos tu información personal a terceros sin tu consentimiento, salvo en los siguientes casos:
- Para completar transacciones y envíos, compartimos la información necesaria con nuestros socios logísticos y proveedores de servicios de pago.
- Cuando sea requerido por ley o en respuesta a solicitudes legales por parte de autoridades gubernamentales.

5. Cookies y Tecnologías de Seguimiento
Utilizamos cookies y tecnologías de seguimiento para mejorar la funcionalidad del sitio, analizar el comportamiento del usuario y ofrecer una experiencia personalizada. Puedes ajustar la configuración de tu navegador para rechazar cookies, aunque esto podría afectar el funcionamiento del sitio.

6. Tus Derechos y Opciones
Tienes derecho a acceder, rectificar o eliminar tu información personal en cualquier momento. También puedes optar por no recibir comunicaciones de marketing o retirar tu consentimiento para el procesamiento de tus datos personales contactándonos a través del correo oficial.

7. Actualizaciones a la Política de Privacidad
Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Te notificaremos de los cambios a través de nuestro sitio web, y la fecha de la última actualización se reflejará en la parte inferior de esta política.

8. Contacto
Si tienes preguntas o inquietudes sobre esta política de privacidad o sobre el manejo de tus datos personales, no dudes en contactarnos a través de [correo electrónico de contacto] o en nuestra dirección física.
`
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 transition-colors ${
        theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-7xl p-8 rounded-lg shadow-lg mt-16 mb-16 ${
          theme === "dark"
            ? "bg-gray-700 text-gray-100"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* Título */}
        <h1 className="mb-6 text-3xl font-bold text-center">
          {politica.title}
        </h1>

        {/* Vigencia */}
        <p className="mb-4 text-sm text-center">
          <span className="font-semibold">Vigencia:</span>{" "}
          {new Date(politica.effectiveDate).toLocaleDateString()}
        </p>

        <hr className="mb-6 border-gray-300" />

        {/* Contenido */}
        <div className="leading-relaxed text-justify whitespace-pre-line">
          {politica.content}
        </div>

        {/* Creado el */}
        <p className="mt-8 text-xs text-center">
          <span className="font-semibold">Creado el:</span>{" "}
          {new Date(politica.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
